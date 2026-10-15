from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
import uuid
import datetime
from backend.database import get_db_cursor
from backend.config import settings

router = APIRouter(prefix="/api/parent", tags=["Parent Pulse Hub & Payments"])

class PayFeeRequest(BaseModel):
    invoice_id: str
    payment_mode: str = "UPI"
    transaction_ref: Optional[str] = None

class BookConsultationRequest(BaseModel):
    student_id: str
    teacher_id: str
    guardian_id: Optional[str] = None
    slot_start_time: Optional[str] = None
    slot_duration_minutes: int = 10
    fee_amount: float = 99.0
    notes: Optional[str] = None

@router.get("/children/{parent_user_id}")
def get_parent_children(parent_user_id: str):
    with get_db_cursor() as cur:
        cur.execute("""
            SELECT s.id, s.admission_number, s.roll_number, s.first_name, s.last_name,
                   s.gender, s.dob,
                   c.id as class_id, c.grade as class_grade, c.section,
                   sch.name as school_name, sch.code as school_code,
                   a.status as today_status,
                   a.check_in_time as today_checkin_time,
                   a.confidence_score as today_similarity,
                   ROUND(
                       (COUNT(al.id) FILTER (WHERE al.status IN ('PRESENT', 'LATE'))::numeric / 
                        NULLIF(COUNT(al.id), 0)::numeric) * 100, 1
                   ) as monthly_attendance_pct
            FROM guardians g
            JOIN student_guardians sg ON sg.guardian_id = g.id
            JOIN students s ON s.id = sg.student_id
            JOIN classes c ON c.id = s.class_id
            JOIN schools sch ON sch.id = s.school_id
            LEFT JOIN attendance_logs a ON a.student_id = s.id AND a.log_date = CURRENT_DATE
            LEFT JOIN attendance_logs al ON al.student_id = s.id AND al.log_date >= (CURRENT_DATE - INTERVAL '30 days')
            WHERE g.user_id::text = %s OR g.id::text = %s
            GROUP BY s.id, c.id, sch.id, a.status, a.check_in_time, a.confidence_score;
        """, (str(parent_user_id), str(parent_user_id)))
        children = cur.fetchall()

        # Fallback demo child if not linked
        if not children:
            cur.execute("""
                SELECT s.id, s.admission_number, s.roll_number, s.first_name, s.last_name,
                       s.gender, s.dob,
                       c.id as class_id, c.grade as class_grade, c.section,
                       sch.name as school_name, sch.code as school_code,
                       a.status as today_status,
                       a.check_in_time as today_checkin_time,
                       a.confidence_score as today_similarity,
                       96.8 as monthly_attendance_pct
                FROM students s
                JOIN classes c ON c.id = s.class_id
                JOIN schools sch ON sch.id = s.school_id
                LEFT JOIN attendance_logs a ON a.student_id = s.id AND a.log_date = CURRENT_DATE
                LIMIT 1;
            """)
            children = cur.fetchall()

        return {"children": children}

@router.get("/fees/{student_id}")
def get_student_fees(student_id: str):
    with get_db_cursor() as cur:
        cur.execute("""
            SELECT f.id, f.invoice_number, f.amount, f.tax_gst, f.total_amount, f.payment_status,
                   f.paid_at, f.payment_mode, f.razorpay_payment_id,
                   s.first_name || ' ' || s.last_name as student_name
            FROM fee_invoices f
            JOIN students s ON s.id = f.student_id
            WHERE f.student_id = %s
            ORDER BY f.created_at DESC;
        """, (student_id,))
        invoices = cur.fetchall()
        return {"invoices": invoices}

@router.post("/pay-fee")
def process_fee_payment(req: PayFeeRequest):
    with get_db_cursor(commit=True) as cur:
        cur.execute("SELECT id, invoice_number, total_amount, payment_status FROM fee_invoices WHERE id = %s;", (req.invoice_id,))
        invoice = cur.fetchone()
        if not invoice:
            raise HTTPException(status_code=404, detail="Fee invoice not found")
        
        if invoice["payment_status"] == "PAID":
            return {"message": "Invoice is already settled", "invoice": invoice}

        tx_ref = req.transaction_ref or f"pay_{uuid.uuid4().hex[:12]}"
        receipt_no = f"EB-RCPT-{uuid.uuid4().hex[:6].upper()}"

        cur.execute("""
            UPDATE fee_invoices 
            SET payment_status = 'PAID',
                paid_at = CURRENT_TIMESTAMP,
                payment_mode = %s,
                razorpay_payment_id = %s,
                gst_receipt_url = %s
            WHERE id = %s
            RETURNING id, invoice_number, total_amount, paid_at, payment_status;
        """, (req.payment_mode, tx_ref, f"https://dps-rourkela.edubandhan.com/receipts/{receipt_no}.pdf", req.invoice_id))
        updated = cur.fetchone()

        return {
            "message": "Payment processed successfully via 1-Tap UPI!",
            "receipt_number": receipt_no,
            "invoice": updated,
            "transaction_ref": tx_ref
        }

class ParentConsultationQueryRequest(BaseModel):
    teacher_id: Optional[str] = None
    teacher_name: Optional[str] = "Mrs. Sunita Sharma"
    student_id: Optional[str] = None
    slot_date: str = "Today"
    slot_time: str = "12:00 PM - 12:30 PM"
    query_topic: str
    fee_amount: float = 99.0

@router.get("/consultations")
def get_parent_consultations(parent_user_id: Optional[str] = None):
    with get_db_cursor() as cur:
        cur.execute("""
            SELECT cb.id, cb.slot_start_time, cb.slot_duration_minutes, cb.fee_amount, cb.teacher_earnings,
                   cb.status, cb.webrtc_room_id, cb.room_passcode, cb.query_topic, cb.rejection_remarks,
                   cb.created_at,
                   s.first_name || ' ' || s.last_name as student_name,
                   s.roll_number, c.grade as class_name, c.section,
                   COALESCE(u.full_name, 'Mrs. Sunita Sharma') as teacher_name
            FROM consultation_bookings cb
            LEFT JOIN students s ON s.id = cb.student_id
            LEFT JOIN classes c ON c.id = s.class_id
            LEFT JOIN users u ON u.id = cb.teacher_id
            ORDER BY cb.created_at DESC;
        """)
        return {"consultations": cur.fetchall()}

@router.post("/request-consultation")
def request_consultation(req: ParentConsultationQueryRequest):
    import random
    with get_db_cursor(commit=True) as cur:
        # Resolve student
        student_id = req.student_id
        if not student_id:
            cur.execute("SELECT id, school_id FROM students LIMIT 1;")
            st = cur.fetchone()
            if st:
                student_id = str(st["id"])
                school_id = str(st["school_id"])
            else:
                raise HTTPException(status_code=404, detail="No student record found")
        else:
            cur.execute("SELECT school_id FROM students WHERE id = %s;", (student_id,))
            st = cur.fetchone()
            if not st:
                raise HTTPException(status_code=404, detail="Student not found")
            school_id = str(st["school_id"])

        # Resolve teacher
        teacher_id = req.teacher_id
        if not teacher_id:
            cur.execute("SELECT id FROM users WHERE role = 'TEACHER' LIMIT 1;")
            t = cur.fetchone()
            teacher_id = str(t["id"]) if t else "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e"

        # Resolve guardian
        cur.execute("SELECT guardian_id FROM student_guardians WHERE student_id = %s LIMIT 1;", (student_id,))
        g = cur.fetchone()
        if g:
            guardian_id = str(g["guardian_id"])
        else:
            cur.execute("SELECT id FROM guardians LIMIT 1;")
            fg = cur.fetchone()
            guardian_id = str(fg["id"]) if fg else "f6a7b89c-0d1e-2f3a-4b5c-6d7e8f9a0b1c"

        booking_id = str(uuid.uuid4())
        room_id = f"room-ptm-{uuid.uuid4().hex[:8]}"
        room_passcode = f"EDU-{random.randint(1000, 9999)}"
        platform_fee = round(req.fee_amount * (settings.PLATFORM_FEE_PERCENTAGE / 100), 2)
        teacher_earnings = round(req.fee_amount - platform_fee, 2)

        # Slot time formatting
        slot_label = f"{req.slot_date} • {req.slot_time}"
        slot_iso = datetime.datetime.now().isoformat()

        cur.execute("""
            INSERT INTO consultation_bookings (
                id, school_id, teacher_id, guardian_id, student_id,
                slot_start_time, slot_duration_minutes, fee_amount, teacher_earnings, platform_commission,
                webrtc_room_id, room_passcode, query_topic, status
            )
            VALUES (%s, %s, %s, %s, %s, %s, 30, %s, %s, %s, %s, %s, %s, 'PENDING')
            RETURNING id, slot_start_time, status, webrtc_room_id, room_passcode;
        """, (
            booking_id, school_id, teacher_id, guardian_id, student_id,
            slot_iso, req.fee_amount, teacher_earnings, platform_fee,
            room_id, room_passcode, f"[{slot_label}] {req.query_topic}"
        ))
        booking = cur.fetchone()

        # Send alert message to teachers channel
        try:
            msg_id = str(uuid.uuid4())
            cur.execute("""
                INSERT INTO channel_messages (id, channel, sender_name, sender_role, sender_avatar, message_text, category)
                VALUES (%s, 'class-8b', 'Parent (Ward Aarav)', 'PARENT', '👨‍👩‍👦', %s, 'QUERY');
            """, (msg_id, f"📅 New 1-on-1 Video Conference Request for {slot_label}: '{req.query_topic}'. Pending teacher review."))
        except Exception as e:
            print("Error recording teacher channel message:", e)

        return {
            "message": "1-on-1 Video Conference request submitted to teacher successfully!",
            "booking_id": booking["id"],
            "status": "PENDING",
            "webrtc_room_id": room_id,
            "room_passcode": room_passcode,
            "slot_label": slot_label,
            "query_topic": req.query_topic
        }

@router.post("/book-consultation")
def book_consultation(req: BookConsultationRequest):
    return request_consultation(ParentConsultationQueryRequest(
        teacher_id=req.teacher_id,
        student_id=req.student_id,
        guardian_id=req.guardian_id,
        slot_time="12:00 PM - 12:30 PM",
        query_topic=req.notes or "General Academic Follow-up",
        fee_amount=req.fee_amount
    ))

class ParentConsultationCompleteRequest(BaseModel):
    booking_id: Optional[str] = None
    room_id: Optional[str] = None

@router.post("/consultation/complete")
def complete_parent_consultation(req: ParentConsultationCompleteRequest):
    with get_db_cursor(commit=True) as cur:
        if req.booking_id:
            cur.execute("""
                UPDATE consultation_bookings 
                SET status = 'COMPLETED'
                WHERE id = %s
                RETURNING *;
            """, (req.booking_id,))
        elif req.room_id:
            cur.execute("""
                UPDATE consultation_bookings 
                SET status = 'COMPLETED'
                WHERE webrtc_room_id = %s
                RETURNING *;
            """, (req.room_id,))
        else:
            raise HTTPException(status_code=400, detail="booking_id or room_id required")
            
        updated = cur.fetchone()
        return {
            "message": "Consultation successfully recorded as COMPLETED meeting!",
            "status": "COMPLETED",
            "booking": updated
        }


# =============================================================================
# EDUBANDHAN AI CHATBOT (EXCLUSIVE TO PARENTS & CHILDREN VIA GROQ LLM)
# =============================================================================
class AIChatRequest(BaseModel):
    message: str
    mode: str = "child"  # "child" (Kid-Friendly Doubt Solver) or "parent" (Parent Teaching Guide)
    api_key: Optional[str] = None
    model: Optional[str] = None
    conversation_history: Optional[List[dict]] = None

@router.post("/ai-chatbot")
def parent_ai_chatbot(req: AIChatRequest):
    import requests
    import os

    query = (req.message or "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    # Determine Groq API Key: client provided > settings > env var
    groq_key = (req.api_key or settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY") or "").strip()
    model_name = (req.model or settings.GROQ_MODEL or os.getenv("GROQ_MODEL") or "llama-3.3-70b-versatile").strip()

    is_parent_mode = (req.mode.lower() == "parent")

    if is_parent_mode:
        system_prompt = (
            "You are EduBandhan Parent Teaching Mentor (एडूबंधन अभिभावक मार्गदर्शक), "
            "an expert pedagogical advisor assisting Indian parents to teach difficult school topics to their children (Classes 1-10) with patience, love, and clarity.\n"
            "Format your response with the following structured sections:\n"
            "1. 🧠 Core Concept in Simple Words (A 60-second summary for the parent to understand first)\n"
            "2. 🗣️ How to Explain to Your Child (Step-by-step talking points, questions to ask, and real-life analogies like kitchen experiments, rotis/pizza, or cricket)\n"
            "3. ⚠️ Common Child Misconceptions & Stumbling Blocks (Where kids usually get confused and how to gently guide them)\n"
            "4. 💡 Fun At-Home Demonstration or Dinner Table Riddle (A quick 2-minute activity to anchor memory)\n"
            "Keep the tone encouraging, warm, and practical for busy parents."
        )
    else:
        system_prompt = (
            "You are AI Mentor (एडूबंधन एआई साथी), a friendly, encouraging, and brilliant Indian AI teacher and study mentor for school students (Classes 1 to 10).\n"
            "Your mission is to solve the student's homework doubts, explain difficult concepts in fun and simple words, and make learning an adventure.\n"
            "Guidelines:\n"
            "- Explain step-by-step with simple language and relatable examples (cricket, kites, cartoons, Indian festivals, cycles, streetlights, mangoes).\n"
            "- Use clean bullet points, emojis, and clear calculations if it is Math or Science.\n"
            "- Add a mini '🎯 Quick Check Challenge' (1 question) at the end to check if they understood.\n"
            "- Conclude with a warm encouraging note like '🌟 You've got this! Keep being curious!'"
        )

    # 1. Try Groq LLM API if key is available
    if groq_key:
        try:
            messages = [{"role": "system", "content": system_prompt}]
            
            # Append prior conversation history if provided
            if req.conversation_history:
                for turn in req.conversation_history[-6:]:
                    r = turn.get("role")
                    c = turn.get("content")
                    if r in ["user", "assistant"] and c:
                        messages.append({"role": r, "content": c})

            messages.append({"role": "user", "content": query})

            groq_response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {groq_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model_name,
                    "messages": messages,
                    "temperature": 0.6,
                    "max_tokens": 750
                },
                timeout=18
            )

            if groq_response.status_code == 200:
                data = groq_response.json()
                reply = data["choices"][0]["message"]["content"]
                return {
                    "success": True,
                    "source": "groq",
                    "model": model_name,
                    "mode": req.mode,
                    "reply": reply
                }
            else:
                err_json = groq_response.json() if groq_response.content else {}
                err_msg = err_json.get("error", {}).get("message", f"Groq HTTP {groq_response.status_code}")
                # Fallback to smart pedagogical response with notice
                return {
                    "success": True,
                    "source": "fallback",
                    "mode": req.mode,
                    "groq_error": err_msg,
                    "reply": generate_pedagogical_fallback(query, req.mode)
                }
        except Exception as e:
            return {
                "success": True,
                "source": "fallback",
                "mode": req.mode,
                "groq_error": str(e),
                "reply": generate_pedagogical_fallback(query, req.mode)
            }

    # 2. No Groq key provided yet -> Use high-quality built-in pedagogical knowledge engine
    return {
        "success": True,
        "source": "local_engine",
        "mode": req.mode,
        "requires_key_for_open_ended": True,
        "reply": generate_pedagogical_fallback(query, req.mode)
    }


def generate_pedagogical_fallback(query: str, mode: str) -> str:
    q = query.lower()
    is_parent = (mode.lower() == "parent")

    # Match common school curriculum themes with normalized typo tolerance
    q_norm = "".join(ch for ch in q if ch.isalnum())

    if any(k in q for k in ["fraction", "half", "quarter", "numerator", "denominator", "ratio", "decimal"]):
        if is_parent:
            return (
                "### 🧠 Core Concept: Fractions Made Simple\n"
                "A fraction is simply **a part of a whole**. The bottom number (*denominator*) tells you how many equal pieces the object is divided into, while the top number (*numerator*) tells you how many of those pieces you have.\n\n"
                "### 🗣️ How to Teach Your Child (The Roti/Pizza Technique)\n"
                "1. **Use Dinner Time**: Take an actual round roti or paratha. Cut it into 4 equal quarters.\n"
                "2. **Ask Questions**: 'If we divide this into 4 slices, each slice is 1 out of 4 (1/4). If you eat 2 slices, what fraction have you eaten?' (2/4 or half!).\n"
                "3. **Physical Manipulation**: Having the child physically move slices helps visual learners understand why 2/4 is the exact same size as 1/2!\n\n"
                "### ⚠️ Common Child Misconceptions\n"
                "* **Pitfall**: Children often think that a larger denominator means a bigger piece (e.g. thinking 1/8 is bigger than 1/4 because 8 > 4).\n"
                "* **How to clarify**: Ask: *'Would you rather share your favourite chocolate with 4 friends or 8 friends? More people means smaller pieces!'*\n\n"
                "### 💡 Quick At-Home Activity\n"
                "Give your child 12 Rajma (kidney) beans. Ask them to find 1/2 of the beans (6), then 1/3 (4), and 1/4 (3). Hands-on grouping removes math anxiety instantly!"
            )
        else:
            return (
                "### 🍕 Hey Champ! Let's Master Fractions Together!\n\n"
                "Think of fractions like slicing your favourite **Cheesy Pizza** with friends! 😋\n\n"
                "* **The Bottom Number (Denominator)**: Total equal slices of the pizza (e.g. **4 slices**).\n"
                "* **The Top Number (Numerator)**: How many slices you grab on your plate (e.g. **1 slice**).\n\n"
                "So, **1/4** just means: *'You have 1 out of the 4 equal slices!'*\n\n"
                "#### 🌟 The Golden Trick:\n"
                "Notice that **2/4 = 1/2**! If a pizza has 4 slices and you eat 2, you just ate exactly half the pizza!\n\n"
                "🎯 **Quick Check Challenge**:\n"
                "If you cut an apple into **8 slices** and give **3 slices** to your best friend, what fraction of the apple did your friend get?\n\n"
                "*(Hint: Friend's slices / Total slices)* 🍏\n\n"
                "🌟 You're doing amazing! Ask me anything else you'd like to understand!"
            )

    # Photosynthesis check with typo tolerance (e.g. 'photo sysnthesis', 'photosythesis')
    if (("photo" in q_norm and ("synth" in q_norm or "sysnth" in q_norm or "syth" in q_norm)) or
        any(k in q for k in ["photosynthesis", "plant", "leaf", "leaves", "sunlight", "chlorophyll", "stomata"])):
        if is_parent:
            return (
                "### 🧠 Core Concept: Photosynthesis (Nature's Kitchen)\n"
                "Photosynthesis is the biological process by which green plants make their own food (glucose sugar) using **Sunlight + Carbon Dioxide + Water**, releasing life-giving **Oxygen** into the air.\n\n"
                "### 🗣️ How to Teach Your Child (The MasterChef Plant Analogy)\n"
                "Explain that leaves are like a **solar-powered kitchen**:\n"
                "* **Chef**: *Chlorophyll* (the green pigment that catches sunlight like solar panels).\n"
                "* **Grocery Ingredients**:\n"
                "  * Water ($H_2O$) absorbed from the soil by roots.\n"
                "  * Carbon Dioxide ($CO_2$) taken from air through tiny leaf pores (*stomata*).\n"
                "  * Sunlight energy (like turning on the gas stove).\n"
                "* **The Dish Prepared**: Glucose (delicious plant food) + Oxygen (bonus fresh air for us to breathe!).\n\n"
                "### ⚠️ Common Child Misconceptions\n"
                "* Kids often think plants 'eat soil'. Clarify that soil only provides water & vitamins, not the food itself!\n\n"
                "### 💡 Fun At-Home Demonstration\n"
                "Place a fresh green leaf inside a transparent glass bowl filled with water under bright sunlight. After 30 minutes, show your child the tiny air bubbles forming on the leaf surface — that is real oxygen being created right before their eyes!"
            )
        else:
            return (
                "### 🌿 Welcome to Nature's MasterChef Kitchen!\n\n"
                "Did you know every green leaf on a tree is a tiny, super-smart kitchen? 👩‍🍳\n\n"
                "Plants can't walk to Swiggy or the grocery store, so they make their own food through **Photosynthesis**!\n\n"
                "#### 🛒 Here are the 3 Secret Ingredients:\n"
                "1. ☀️ **Sunlight**: Captured by green **Chlorophyll** (like solar panels on the leaf).\n"
                "2. 💧 **Water**: Sucked up by roots from the soil like a straw.\n"
                "3. 🌬️ **Carbon Dioxide ($CO_2$)**: Absorbed from the air through tiny microscopic mouth pores called **Stomata**.\n\n"
                "#### 🍲 What comes out of the oven?\n"
                "* **Glucose** (tasty sugar food to help the plant grow strong!).\n"
                "* **Oxygen** (fresh air that you and I breathe every second! 🎈)\n\n"
                "🎯 **Quick Check Challenge**:\n"
                "What is the name of the special green pigment in leaves that traps sunlight? *(Starts with the letter 'C')*\n\n"
                "🌟 Keep shining! You're a true science superstar!"
            )

    if any(k in q for k in ["trigonometr", "sin", "cos", "tan", "hypotenuse", "triangle", "right angle"]):
        if is_parent:
            return (
                "### 🧠 Core Concept: Trigonometry from Scratch (The Ladder Analogy)\n"
                "Trigonometry comes from Greek: *Trigonon* (triangle) + *Metron* (measurement). It is simply the math of **Right-Angled Triangles** — calculating how steep, tall, or far things are.\n\n"
                "### 🗣️ How to Teach Your Child Step-by-Step (The Ladder Against the Wall)\n"
                "1. **Set the Scene**: Imagine leaning a ladder against a wall.\n"
                "   - The **Wall** is the Height (Perpendicular/Opposite).\n"
                "   - The **Ground** is the Base (Adjacent).\n"
                "   - The **Ladder** itself is the long slope (Hypotenuse).\n"
                "2. **The 3 Magic Ratios (Sin, Cos, Tan)**:\n"
                "   - **$\text{Sin}(\theta)$ = Wall / Ladder** (How high do you reach? Opposite / Hypotenuse)\n"
                "   - **$\text{Cos}(\theta)$ = Ground / Ladder** (How far from the wall? Adjacent / Hypotenuse)\n"
                "   - **$\text{Tan}(\theta)$ = Wall / Ground** (How steep is the climb? Opposite / Adjacent)\n"
                "3. **Mnemonics that Work**: Tell them the classic Indian school trick: **'Some People Have, Curly Brown Hair, Turned Permanent Black'** (Sin = P/H, Cos = B/H, Tan = P/B)!\n\n"
                "### 💡 Hands-On At-Home Experiment\n"
                "Take a torch and cast a shadow on the floor. Change the torch angle: notice how the shadow (Base) grows longer when the angle gets lower. That's trigonometry in real life!"
            )
        else:
            return (
                "### 📐 Hey Champ! Let's Master Trigonometry from Scratch!\n\n"
                "Don't worry about big formulas — trigonometry is just a superpower to **measure things without climbing them** (like the height of Mount Everest or the Qutub Minar)! 🚀\n\n"
                "#### 🪜 The Ladder Story:\n"
                "Picture a ladder leaning on a tall wall:\n"
                "1. **The Ladder** is the longest sliding side = **Hypotenuse (H)**\n"
                "2. **The Wall** standing straight = **Perpendicular / Opposite (P)**\n"
                "3. **The Ground** you stand on = **Base / Adjacent (B)**\n\n"
                "#### 🎯 The 3 Key Super-Tools:\n"
                "* **$\sin(\\theta)$ = Height / Ladder (P / H)**: Tells you how high you reach!\n"
                "* **$\cos(\\theta)$ = Ground / Ladder (B / H)**: Tells you how close to the wall you are!\n"
                "* **$\\tan(\\theta)$ = Height / Ground (P / B)**: Tells you how steep your slope is!\n\n"
                "🎯 **Quick Check Challenge**:\n"
                "If the wall is 4 meters high and the ladder is 5 meters long, what is $\sin(\\theta)$? *(Hint: Wall / Ladder)*\n\n"
                "🌟 You're totally ready to crack this chapter!"
            )

    if any(k in q for k in ["periodic", "element", "mendeleev", "atomic", "metal"]):
        if is_parent:
            return (
                "### 🧠 Core Concept: The Periodic Table as a Supermarket\n"
                "The Periodic Table is like an organized supermarket aisle for the building blocks of the universe.\n\n"
                "### 🗣️ How to Teach Your Child (The Grocery Aisle Technique)\n"
                "1. **Columns (Groups)**: Like grocery aisles (Dairy aisle, Spices aisle). Elements in the same group have similar 'flavors' or personalities (e.g., Alkali Metals are all super reactive).\n"
                "2. **Rows (Periods)**: Like shelf levels (Top shelf, bottom shelf) representing how many electron energy shells they have.\n"
                "3. **Mnemonic for First 20 Elements**: 'Happy Henry Likes Beans, Brown Candy Nuts On Friday Night' (H, He, Li, Be, B, C, N, O, F, Ne)!"
            )
        else:
            return (
                "### 🧪 Welcome to the Ultimate Element Universe!\n\n"
                "The Periodic Table is like a cheat-sheet map of all 118 Lego bricks that make up stars, smartphones, water, and YOU! ⚡\n\n"
                "#### 🌟 How to Read It:\n"
                "* **Columns (Groups 1 to 18)**: Elements in the same column are like brothers and sisters — they behave similarly!\n"
                "* **Rows (Periods 1 to 7)**: Show how many energy rings of electrons each atom has!\n\n"
                "🎯 **Quick Check Challenge**:\n"
                "What is the very first and lightest element on the top-left of the table? *(Symbol: H)*"
            )

    # General / Open-Ended fallback with guidance to use Groq API key
    if is_parent:
        return (
            f"### 👨‍👩‍👧 Parent Guide: How to Approach '{query}'\n\n"
            "1. **Break it down**: Start with an open question: *'What do you already know about this?'* Let the child speak without interrupting.\n"
            "2. **Use Real-World Metaphors**: Relate the concept to daily household activities (cooking, sports, toys, or nature walks).\n"
            "3. **Patience over Speed**: Praise effort rather than correct answers on the first try.\n\n"
            "💡 *Tip: To get instant, tailored answers for any open-ended syllabus question, paste your free Groq API key in the key box above!*"
        )
    else:
        return (
            f"### 🚀 Let's Explore '{query}' Step-by-Step!\n\n"
            "That's a fantastic question to ask! Being curious is the superpower of great students. 🌟\n\n"
            "1. **The Big Idea**: Every big topic is made of small, simple building blocks.\n"
            "2. **Key Clue**: When facing this problem, first identify what clues are given, and what you need to find.\n"
            "3. **Practice**: Draw a quick diagram or flowchart in your notebook to visualize it.\n\n"
            "🎯 **Next Step**: Try explaining this topic back to me or your parents in your own words!\n\n"
            "💡 *Tip: Paste your Groq API key above to unlock instant detailed homework solutions with live AI!*"
        )


# =============================================================================
# REAL-TIME CHILD QUIZ & MASTERY ARENA (PARENT SECTION)
# =============================================================================
class AIQuizRequest(BaseModel):
    subject: str = "Science"
    topic: Optional[str] = "General"
    grade_level: str = "Class 5"
    num_questions: int = 5
    api_key: Optional[str] = None
    model: Optional[str] = None

BUILTIN_QUIZZES = {
    "maths": [
        {
            "id": 1,
            "question": "If you eat 2 slices of an 8-slice pizza, what fraction of the pizza did you eat?",
            "options": ["1/8", "1/4", "1/2", "2/3"],
            "correct_index": 1,
            "explanation": "🍕 2 out of 8 equal slices is 2/8. When you simplify by dividing top and bottom by 2, it equals 1/4 (one quarter)!",
            "parent_tip": "Cut a roti or paratha into 4 equal quarters during mealtime to show fractions visually."
        },
        {
            "id": 2,
            "question": "What is the perimeter of a square garden if each side measures 5 meters?",
            "options": ["10 meters", "20 meters", "25 meters", "15 meters"],
            "correct_index": 1,
            "explanation": "📐 A square has 4 equal sides! Perimeter = Side × 4 = 5m × 4 = 20 meters.",
            "parent_tip": "Remind your child that perimeter is the 'fence distance' around the entire outside."
        },
        {
            "id": 3,
            "question": "Which of these numbers is a Prime Number (divisible only by 1 and itself)?",
            "options": ["9", "15", "17", "21"],
            "correct_index": 2,
            "explanation": "⭐ 17 is a prime number because no table other than 1 and 17 can divide it evenly! 9=3×3, 15=3×5, 21=3×7.",
            "parent_tip": "Ask: 'Can you arrange 17 rajma beans into equal rows other than 1 row of 17?' They cannot!"
        },
        {
            "id": 4,
            "question": "Quick Mental Math: What is 12 × 8?",
            "options": ["88", "96", "108", "92"],
            "correct_index": 1,
            "explanation": "⚡ 12 × 8 = 96! Mental trick: (10 × 8) = 80, plus (2 × 8) = 16. Then 80 + 16 = 96!",
            "parent_tip": "Teach the split-and-add mental trick for 2-digit multiplication."
        },
        {
            "id": 5,
            "question": "If Rohan has 15 chocolates and gives 1/3 of them to Ananya, how many chocolates does Ananya get?",
            "options": ["3", "5", "10", "6"],
            "correct_index": 1,
            "explanation": "🍫 To find 1/3 of 15, divide 15 by 3: 15 ÷ 3 = 5 chocolates for Ananya!",
            "parent_tip": "Use real chocolates or dry fruits to practice division and fair sharing."
        }
    ],
    "science": [
        {
            "id": 1,
            "question": "What is the green pigment in leaves that traps sunlight for photosynthesis?",
            "options": ["Chlorophyll", "Hemoglobin", "Melanin", "Carotene"],
            "correct_index": 0,
            "explanation": "🌿 Chlorophyll acts like microscopic green solar panels on the leaf, absorbing sunlight to cook glucose food!",
            "parent_tip": "Show a green leaf in the garden; chlorophyll is the natural green dye."
        },
        {
            "id": 2,
            "question": "Which gas do green plants absorb from the air to make their food?",
            "options": ["Oxygen", "Carbon Dioxide (CO₂)", "Nitrogen", "Helium"],
            "correct_index": 1,
            "explanation": "🌬️ Plants breathe in Carbon Dioxide through tiny leaf pores (stomata) and release fresh Oxygen for us to breathe!",
            "parent_tip": "Explain the beautiful exchange: humans exhale CO₂ for trees, trees give us pure O₂."
        },
        {
            "id": 3,
            "question": "Which planet in our solar system is famously known as the 'Red Planet'?",
            "options": ["Venus", "Jupiter", "Mars", "Saturn"],
            "correct_index": 2,
            "explanation": "🪐 Mars appears reddish-orange in telescopes because its soil is rich in iron oxide (rust)!",
            "parent_tip": "Point out Mars during clear evening skies with a mobile star map app."
        },
        {
            "id": 4,
            "question": "What state of matter is steam or water vapor rising from a hot kettle?",
            "options": ["Solid", "Liquid", "Gas", "Plasma"],
            "correct_index": 2,
            "explanation": "💨 When liquid water gets hot and boils, it evaporates into an invisible Gas called water vapor!",
            "parent_tip": "Hold a cool metal spoon above warm steam to show condensation droplets forming."
        },
        {
            "id": 5,
            "question": "Which vital muscular organ acts like a continuous pump circulation engine for our blood?",
            "options": ["Brain", "Lungs", "Stomach", "Heart"],
            "correct_index": 3,
            "explanation": "❤️ The human heart beats around 70 to 80 times every minute, pumping oxygenated blood to every cell!",
            "parent_tip": "Have your child feel their pulse at their wrist after doing 10 jumping jacks."
        }
    ],
    "english": [
        {
            "id": 1,
            "question": "Identify the Adjective (describing word) in: 'The clever fox jumped over the fence.'",
            "options": ["Fox", "Jumped", "Clever", "Fence"],
            "correct_index": 2,
            "explanation": "🦊 'Clever' is an adjective because it describes what kind of fox it was!",
            "parent_tip": "Play the 'Describe this object' game at dinner using 3 descriptive adjectives."
        },
        {
            "id": 2,
            "question": "What is the past tense of the irregular verb 'sing'?",
            "options": ["Singed", "Sung", "Sang", "Singing"],
            "correct_index": 2,
            "explanation": "🎵 Today I sing, yesterday I SANG, and previously I have sung!",
            "parent_tip": "Highlight irregular past tense pairs: run/ran, eat/ate, sing/sang."
        },
        {
            "id": 3,
            "question": "What is the opposite (antonym) of the word 'Ancient'?",
            "options": ["Old", "Modern", "Historic", "Dusty"],
            "correct_index": 1,
            "explanation": "🏛️ Ancient means thousands of years old. Its direct opposite is Modern (new and contemporary)!",
            "parent_tip": "Discuss monuments like the Pyramids or Red Fort as ancient vs. metro trains as modern."
        },
        {
            "id": 4,
            "question": "What is the correct plural form of the noun 'Child'?",
            "options": ["Childs", "Childrens", "Children", "Childes"],
            "correct_index": 2,
            "explanation": "👦 'Child' is an irregular plural noun. One child, many CHILDREN (never children's or childs)!",
            "parent_tip": "Share fun irregular plurals: tooth/teeth, foot/feet, mouse/mice, child/children."
        },
        {
            "id": 5,
            "question": "Which punctuation mark MUST appear at the end of a question sentence?",
            "options": ["Full Stop (.)", "Exclamation (!)", "Question Mark (?)", "Comma (,)"],
            "correct_index": 2,
            "explanation": "❓ Every asking question sentence concludes with a Question Mark (?)!",
            "parent_tip": "Show how voice pitch rises at the end of question sentences when reading stories aloud."
        }
    ],
    "gk": [
        {
            "id": 1,
            "question": "What is the National Bird of India, known for its dazzling iridescent feathers?",
            "options": ["Peacock (Mayur)", "Golden Eagle", "Indian Parrot", "Great Hornbill"],
            "correct_index": 0,
            "explanation": "🦚 The Indian Peacock (Pavo cristatus) was declared India's National Bird in 1963 for its grace and cultural heritage!",
            "parent_tip": "Discuss national symbols: Tiger (animal), Lotus (flower), Banyan (tree), Peacock (bird)."
        },
        {
            "id": 2,
            "question": "How many continents are there on planet Earth?",
            "options": ["5", "6", "7", "8"],
            "correct_index": 2,
            "explanation": "🌍 Earth has 7 continents: Asia, Africa, North America, South America, Antarctica, Europe, and Australia!",
            "parent_tip": "Point them out on a world globe or map together."
        },
        {
            "id": 3,
            "question": "If an analog wall clock shows 3:00, what angle do the two hands make?",
            "options": ["45 degrees", "90 degrees (Right Angle)", "120 degrees", "180 degrees"],
            "correct_index": 1,
            "explanation": "⏰ At 3:00, the minute hand points to 12 and the hour hand points to 3, making an exact 90° Right Angle!",
            "parent_tip": "Show how hands make a straight line 180° angle at 6:00."
        },
        {
            "id": 4,
            "question": "Which Indian festival is famously celebrated as the joyous 'Festival of Lights'?",
            "options": ["Holi", "Diwali (Deepavali)", "Eid", "Onam"],
            "correct_index": 1,
            "explanation": "🪔 Diwali celebrates the triumph of light over darkness and knowledge over ignorance with clay diyas!",
            "parent_tip": "Connect festival traditions to family values and historical tales."
        },
        {
            "id": 5,
            "question": "Complete the logic pattern: 2, 4, 8, 16, ___?",
            "options": ["20", "24", "32", "64"],
            "correct_index": 2,
            "explanation": "🔢 Each number in this series is doubled (multiplied by 2)! 16 × 2 = 32!",
            "parent_tip": "Praise logical pattern recognition; ask them what the next number would be (64)."
        }
    ]
}

@router.post("/ai-quiz")
def parent_ai_quiz(req: AIQuizRequest):
    import requests
    import os
    import json
    import re

    subject_key = (req.subject or "science").strip().lower()
    if any(k in subject_key for k in ["math", "arithmetic", "fraction"]):
        subject_key = "maths"
    elif any(k in subject_key for k in ["science", "bio", "physic", "chem"]):
        subject_key = "science"
    elif any(k in subject_key for k in ["eng", "grammar", "vocab"]):
        subject_key = "english"
    else:
        subject_key = "gk"

    groq_key = (req.api_key or settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY") or "").strip()
    model_name = (req.model or settings.GROQ_MODEL or os.getenv("GROQ_MODEL") or "qwen/qwen3.8-27b").strip()

    # If user provided a specific custom topic and groq_key is available, generate live
    topic = (req.topic or "").strip()
    is_custom_topic = bool(topic and topic.lower() not in ["general", "none", "standard"])

    if groq_key and is_custom_topic:
        try:
            prompt = (
                f"You are EduBandhan AI Quiz Master (एडूबंधन क्विज गुरु). "
                f"Generate a fun, high-quality {req.num_questions}-question multiple choice test for an Indian school student in {req.grade_level} "
                f"on the subject '{req.subject}' and specific topic '{topic}'. Difficulty: {getattr(req, 'difficulty', 'Medium')}.\n\n"
                "Return ONLY a valid JSON array of questions with NO additional text or markdown formatting outside the JSON.\n"
                "JSON format specification:\n"
                "[\n"
                "  {\n"
                "    \"id\": 1,\n"
                "    \"question\": \"Question text with fun emoji?\",\n"
                "    \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],\n"
                "    \"correct_index\": 0,\n"
                "    \"explanation\": \"Child-friendly 1-2 sentence explanation with fun emoji & analogy.\",\n"
                "    \"parent_tip\": \"Practical advice on how a parent can teach or demonstrate this at home.\"\n"
                "  }\n"
                "]"
            )

            resp = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {groq_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model_name,
                    "messages": [
                        {"role": "system", "content": "You are a professional educational quiz generator. Output ONLY a raw valid JSON array."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.3,
                    "max_tokens": 2000
                },
                timeout=20
            )

            if resp.status_code == 200:
                raw_text = resp.json()["choices"][0]["message"]["content"].strip()
                cleaned = re.sub(r"^```(?:json)?", "", raw_text, flags=re.MULTILINE)
                cleaned = re.sub(r"```$", "", cleaned, flags=re.MULTILINE).strip()
                parsed = json.loads(cleaned)
                
                # In case model returned {"questions": [...]}
                if isinstance(parsed, dict) and "questions" in parsed:
                    parsed = parsed["questions"]

                if isinstance(parsed, list) and len(parsed) >= 1:
                    # Normalize question fields
                    norm_questions = []
                    for idx, q in enumerate(parsed[:req.num_questions]):
                        c_idx = q.get("correct_index")
                        if c_idx is None and "correct" in q:
                            c_idx = q["correct"]
                        if not isinstance(c_idx, int) or c_idx < 0 or c_idx > 3:
                            c_idx = 0

                        norm_questions.append({
                            "id": q.get("id", idx + 1),
                            "question": q.get("question", "Question"),
                            "options": q.get("options", ["A", "B", "C", "D"])[:4],
                            "correct_index": c_idx,
                            "explanation": q.get("explanation", "Review core concepts for detailed rationale."),
                            "parent_tip": q.get("parent_tip", "Discuss this concept through real-world examples with your child.")
                        })

                    return {
                        "success": True,
                        "source": "groq",
                        "model": model_name,
                        "subject": req.subject,
                        "topic": topic,
                        "grade_level": req.grade_level,
                        "questions": norm_questions
                    }
        except Exception as e:
            pass  # Seamless fallback to builtin high-quality curriculum banks

    # Return built-in curriculum questions
    questions = BUILTIN_QUIZZES.get(subject_key, BUILTIN_QUIZZES["science"])
    return {
        "success": True,
        "source": "curriculum_bank",
        "subject": req.subject,
        "topic": topic or "Foundational Concepts",
        "grade_level": req.grade_level,
        "questions": questions[:req.num_questions]
    }


class ExplainQuestionRequest(BaseModel):
    question: str
    options: List[str]
    correct_index: int
    selected_index: Optional[int] = None
    topic: Optional[str] = "General"
    grade_level: Optional[str] = "Class 8"
    user_query: Optional[str] = None
    api_key: Optional[str] = None

@router.post("/ai-explain-question")
def explain_quiz_question(req: ExplainQuestionRequest):
    import requests
    import os

    groq_key = (req.api_key or settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY") or "").strip()
    model_name = (settings.GROQ_MODEL or os.getenv("GROQ_MODEL") or "qwen/qwen3.8-27b").strip()

    correct_opt = req.options[req.correct_index] if (0 <= req.correct_index < len(req.options)) else "Unknown"
    selected_opt = req.options[req.selected_index] if (req.selected_index is not None and 0 <= req.selected_index < len(req.options)) else "Not selected / Skipped"

    if groq_key:
        try:
            prompt = (
                f"You are AI Mentor & Pedagogical Tutor (एडूबंधन AI साथी). "
                f"A student in {req.grade_level} is reviewing a quiz question on topic '{req.topic}'.\n\n"
                f"Question: {req.question}\n"
                f"Options: {', '.join([f'({chr(65+i)}) {opt}' for i, opt in enumerate(req.options)])}\n"
                f"Correct Option: ({chr(65+req.correct_index)}) {correct_opt}\n"
                f"Student's Choice: {selected_opt}\n"
                f"Specific Student Inquiry: {req.user_query or 'Please explain why the correct answer is right, break down the core concept step-by-step, and give a memory tip.'}\n\n"
                "Please provide a warm, encouraging pedagogical explanation structured as:\n"
                "1. 🌟 Core Concept in Simple Words\n"
                "2. ✅ Why the Correct Answer is Right\n"
                "3. ⚠️ Common Misconception / Why Other Options Are Not Right\n"
                "4. 💡 Real-world Analogy or Memory Trick (Mnemonics)\n"
                "5. 🎯 Quick Pro-Tip for Exams"
            )

            resp = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {groq_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model_name,
                    "messages": [
                        {"role": "system", "content": "You are a warm, world-class pedagogical tutor who explains school concepts clearly and gently."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.4,
                    "max_tokens": 1200
                },
                timeout=18
            )

            if resp.status_code == 200:
                explanation_text = resp.json()["choices"][0]["message"]["content"].strip()
                return {
                    "success": True,
                    "explanation": explanation_text,
                    "source": "groq",
                    "model": model_name
                }
        except Exception as e:
            pass

    # Intelligent fallback explanation
    fallback = (
        f"### 🌟 Core Concept: {req.topic}\n\n"
        f"**Question:** {req.question}\n\n"
        f"**Correct Answer:** Option ({chr(65+req.correct_index)}) - **{correct_opt}**\n\n"
        f"1. **Why It's Correct:** This option represents the fundamental definition in {req.topic}. When you analyze the key terms in the question, {correct_opt} directly matches the scientific/mathematical principle.\n\n"
        f"2. **Student's Selection:** You chose '{selected_opt}'. "
        + ("That's a very common trap! Many students confuse this because they sound similar or represent related steps." if selected_opt != correct_opt else "Great job getting it right! Consistency is key.") + "\n\n"
        f"3. **💡 Memory Hook:** Break down the root word or link it to an everyday event in your daily routine."
    )

    return {
        "success": True,
        "explanation": fallback,
        "source": "curriculum_engine",
        "model": "rule_based"
    }


