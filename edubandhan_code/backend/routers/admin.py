from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import date
from backend.database import get_db_cursor
from backend.auth_utils import require_roles, get_current_user

router = APIRouter(prefix="/api/admin", tags=["School & System Administration"])

class BroadcastCreateRequest(BaseModel):
    school_id: str
    class_id: Optional[str] = None
    sender_id: Optional[str] = None
    title: str
    content: str
    category: str = "NOTICE"  # NOTICE, HOMEWORK, EMERGENCY, EXAM
    is_urgent: bool = False

@router.get("/overview")
def get_admin_overview():
    with get_db_cursor() as cur:
        # Total Students
        cur.execute("SELECT count(*) as total FROM students WHERE is_active = TRUE;")
        total_students = cur.fetchone()["total"]

        # Total Classes
        cur.execute("SELECT count(*) as total FROM classes;")
        total_classes = cur.fetchone()["total"]

        # Total Schools
        cur.execute("SELECT count(*) as total FROM schools;")
        total_schools = cur.fetchone()["total"]

        # Total Teachers
        cur.execute("SELECT count(*) as total FROM users WHERE role = 'TEACHER';")
        total_teachers = cur.fetchone()["total"]

        # Today's Attendance Counts
        cur.execute("""
            SELECT 
                COUNT(*) FILTER (WHERE status = 'PRESENT') as present_count,
                COUNT(*) FILTER (WHERE status = 'LATE') as late_count,
                COUNT(*) FILTER (WHERE status = 'ABSENT') as absent_count
            FROM attendance_logs 
            WHERE log_date = CURRENT_DATE;
        """)
        att_stats = cur.fetchone()
        present = att_stats["present_count"] or 0
        late = att_stats["late_count"] or 0
        absent = att_stats["absent_count"] or 0
        attendance_rate = round(((present + late) / max(total_students, 1)) * 100, 1)

        # Fee Collection summary
        cur.execute("""
            SELECT 
                COALESCE(SUM(total_amount), 0) as total_billed,
                COALESCE(SUM(CASE WHEN payment_status = 'PAID' THEN total_amount ELSE 0 END), 0) as total_collected,
                COUNT(*) FILTER (WHERE payment_status = 'PAID') as paid_count,
                COUNT(*) FILTER (WHERE payment_status = 'PENDING') as pending_count
            FROM fee_invoices;
        """)
        fee_stats = cur.fetchone()

        # Recent Check-ins
        cur.execute("""
            SELECT a.id, a.check_in_time, a.status, a.confidence_score,
                   s.first_name || ' ' || s.last_name as student_name,
                   s.roll_number, c.grade as class_grade, c.section
            FROM attendance_logs a
            JOIN students s ON s.id = a.student_id
            JOIN classes c ON c.id = s.class_id
            WHERE a.log_date = CURRENT_DATE
            ORDER BY a.check_in_time DESC
            LIMIT 10;
        """)
        recent_checkins = cur.fetchall()

        return {
            "summary": {
                "total_students": total_students,
                "total_classes": total_classes,
                "total_schools": total_schools,
                "total_teachers": total_teachers,
                "present_today": present,
                "late_today": late,
                "absent_today": absent,
                "attendance_rate": attendance_rate,
                "fee_billed": float(fee_stats["total_billed"]),
                "fee_collected": float(fee_stats["total_collected"]),
                "fee_pending_invoices": fee_stats["pending_count"]
            },
            "recent_checkins": recent_checkins
        }

@router.get("/students")
def get_all_students(class_id: Optional[str] = None):
    with get_db_cursor() as cur:
        query = """
            SELECT s.id, s.admission_number, s.roll_number, s.first_name, s.last_name, 
                   s.gender, s.is_active, s.created_at,
                   c.id as class_id, c.grade as class_grade, c.section,
                   sch.name as school_name,
                   EXISTS(SELECT 1 FROM face_embeddings f WHERE f.student_id = s.id) as has_face_enrolled,
                   (
                       SELECT json_agg(json_build_object(
                           'guardian_name', u.full_name,
                           'relationship', g.relationship,
                           'phone', u.phone,
                           'email', u.email
                       ))
                       FROM student_guardians sg
                       JOIN guardians g ON g.id = sg.guardian_id
                       JOIN users u ON u.id = g.user_id
                       WHERE sg.student_id = s.id
                   ) as guardians,
                   (
                       SELECT a.status 
                       FROM attendance_logs a 
                       WHERE a.student_id = s.id AND a.log_date = CURRENT_DATE 
                       ORDER BY a.check_in_time DESC LIMIT 1
                   ) as today_status
            FROM students s
            JOIN classes c ON c.id = s.class_id
            JOIN schools sch ON sch.id = s.school_id
        """
        params = []
        if class_id:
            query += " WHERE s.class_id = %s"
            params.append(class_id)
        
        query += " ORDER BY c.grade, c.section, s.roll_number, s.first_name;"
        cur.execute(query, params)
        students = cur.fetchall()
        return {"students": students}

@router.get("/classes")
def get_all_classes():
    with get_db_cursor() as cur:
        cur.execute("""
            SELECT c.id, c.school_id, c.grade, c.section, c.academic_year, c.room_number,
                   s.name as school_name,
                   (SELECT count(*) FROM students st WHERE st.class_id = c.id AND st.is_active = TRUE) as student_count,
                   (
                       SELECT count(*) 
                       FROM attendance_logs a
                       JOIN students st ON st.id = a.student_id
                       WHERE st.class_id = c.id AND a.log_date = CURRENT_DATE AND a.status IN ('PRESENT', 'LATE')
                   ) as present_today_count
            FROM classes c
            JOIN schools s ON s.id = c.school_id
            ORDER BY c.grade, c.section;
        """)
        classes = cur.fetchall()
        return {"classes": classes}

@router.get("/schools")
def get_all_schools():
    with get_db_cursor() as cur:
        cur.execute("SELECT id, name, code, city, state, contact_phone, contact_email, is_active FROM schools ORDER BY name;")
        return {"schools": cur.fetchall()}

@router.get("/fees")
def get_all_fees():
    with get_db_cursor() as cur:
        cur.execute("""
            SELECT f.id, f.invoice_number, f.amount, f.tax_gst, f.total_amount, f.payment_status, 
                   f.paid_at, f.payment_mode, f.razorpay_payment_id,
                   s.first_name || ' ' || s.last_name as student_name,
                   s.admission_number, s.roll_number,
                   c.grade as class_grade, c.section
            FROM fee_invoices f
            JOIN students s ON s.id = f.student_id
            JOIN classes c ON c.id = s.class_id
            ORDER BY f.created_at DESC;
        """)
        return {"invoices": cur.fetchall()}

@router.post("/broadcast")
def create_broadcast(req: BroadcastCreateRequest):
    with get_db_cursor(commit=True) as cur:
        # Default sender to teacher or admin user if not passed
        sender_id = req.sender_id
        if not sender_id:
            cur.execute("SELECT id FROM users WHERE school_id = %s LIMIT 1;", (req.school_id,))
            u = cur.fetchone()
            sender_id = u["id"] if u else None

        broadcast_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO class_broadcasts (id, school_id, class_id, sender_id, title, content, category, is_urgent)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, created_at;
        """, (broadcast_id, req.school_id, req.class_id, sender_id, req.title, req.content, req.category, req.is_urgent))
        row = cur.fetchone()
        return {"message": "Announcement broadcast successfully posted!", "id": broadcast_id, "created_at": row["created_at"]}

class AssignTeacherRequest(BaseModel):
    class_id: str
    teacher_id: str
    subject: str = "Class Teacher"
    is_primary: bool = True

@router.get("/teachers")
def get_all_teachers():
    with get_db_cursor() as cur:
        cur.execute("""
            SELECT u.id, u.full_name, u.email, u.phone, u.role,
                   (
                       SELECT string_agg(c.grade || '-' || c.section || ' (' || ct.subject || ')', ', ')
                       FROM class_teachers ct
                       JOIN classes c ON c.id = ct.class_id
                       WHERE ct.teacher_id = u.id
                   ) as assigned_classes
            FROM users u
            WHERE u.role = 'TEACHER' AND u.is_active = TRUE
            ORDER BY u.full_name;
        """)
        return {"teachers": cur.fetchall()}

@router.get("/class-rooms")
def get_class_rooms():
    with get_db_cursor() as cur:
        cur.execute("""
            SELECT c.id, c.school_id, c.grade, c.section, c.room_number, c.academic_year,
                   c.class_teacher_id,
                   u.full_name as primary_teacher_name,
                   u.email as primary_teacher_email,
                   u.phone as primary_teacher_phone,
                   'class-' || lower(c.grade) || lower(c.section) as room_key,
                   (SELECT count(*) FROM students st WHERE st.class_id = c.id AND st.is_active = TRUE) as student_count,
                   (
                       SELECT count(DISTINCT sg.guardian_id)
                       FROM students st
                       JOIN student_guardians sg ON sg.student_id = st.id
                       WHERE st.class_id = c.id
                   ) as parent_count,
                   (
                       SELECT COALESCE(json_agg(json_build_object(
                           'id', ct.id,
                           'teacher_id', ct.teacher_id,
                           'teacher_name', tu.full_name,
                           'teacher_avatar', '👩‍🏫',
                           'subject', ct.subject,
                           'assigned_at', ct.assigned_at
                       )), '[]'::json)
                       FROM class_teachers ct
                       JOIN users tu ON tu.id = ct.teacher_id
                       WHERE ct.class_id = c.id
                   ) as assigned_teachers
            FROM classes c
            LEFT JOIN users u ON u.id = c.class_teacher_id
            ORDER BY c.grade, c.section;
        """)
        rooms = cur.fetchall()
        return {"class_rooms": rooms}

class SubjectTeacherItem(BaseModel):
    teacher_id: str
    subject: str

class CreateClassRoomRequest(BaseModel):
    grade: str
    section: str
    room_number: Optional[str] = "Room 101"
    academic_year: Optional[str] = "2026-2027"
    school_id: Optional[str] = None
    class_teacher_id: Optional[str] = None
    subject_teachers: Optional[List[SubjectTeacherItem]] = []

@router.post("/create-class-room")
async def create_class_room(req: CreateClassRoomRequest):
    grade_clean = req.grade.strip().upper().replace("CLASS", "").replace("GRADE", "").strip()
    section_clean = req.section.strip().upper()
    if not grade_clean or not section_clean:
        raise HTTPException(status_code=400, detail="Grade and Section are required")

    with get_db_cursor(commit=True) as cur:
        # Resolve school_id
        school_id = req.school_id
        if not school_id:
            cur.execute("SELECT id FROM schools LIMIT 1;")
            sch = cur.fetchone()
            if sch:
                school_id = str(sch["id"])
            else:
                raise HTTPException(status_code=400, detail="No school found in the system")

        # Check if class exists
        cur.execute("""
            SELECT id FROM classes 
            WHERE school_id = %s AND UPPER(grade) = UPPER(%s) AND UPPER(section) = UPPER(%s);
        """, (school_id, grade_clean, section_clean))
        existing_cls = cur.fetchone()

        if existing_cls:
            class_id = str(existing_cls["id"])
            cur.execute("""
                UPDATE classes 
                SET room_number = %s, academic_year = %s, class_teacher_id = %s
                WHERE id = %s;
            """, (req.room_number, req.academic_year, req.class_teacher_id, class_id))
        else:
            class_id = str(uuid.uuid4())
            cur.execute("""
                INSERT INTO classes (id, school_id, grade, section, room_number, academic_year, class_teacher_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s);
            """, (class_id, school_id, grade_clean, section_clean, req.room_number, req.academic_year, req.class_teacher_id))

        primary_teacher_name = "Assigned Teacher"
        if req.class_teacher_id:
            cur.execute("SELECT id, full_name FROM users WHERE id = %s;", (req.class_teacher_id,))
            t_row = cur.fetchone()
            if t_row:
                primary_teacher_name = t_row["full_name"]
                cur.execute("""
                    INSERT INTO class_teachers (class_id, teacher_id, subject)
                    VALUES (%s, %s, 'Class Teacher')
                    ON CONFLICT (class_id, teacher_id, subject) DO UPDATE SET assigned_at = CURRENT_TIMESTAMP;
                """, (class_id, req.class_teacher_id))

        if req.subject_teachers:
            for st in req.subject_teachers:
                if st.teacher_id:
                    cur.execute("SELECT id FROM users WHERE id = %s;", (st.teacher_id,))
                    if cur.fetchone():
                        cur.execute("""
                            INSERT INTO class_teachers (class_id, teacher_id, subject)
                            VALUES (%s, %s, %s)
                            ON CONFLICT (class_id, teacher_id, subject) DO UPDATE SET assigned_at = CURRENT_TIMESTAMP;
                        """, (class_id, st.teacher_id, st.subject or "Subject Teacher"))

        room_key = f"class-{grade_clean.lower()}{section_clean.lower()}"

        welcome_msg = (
            f"🏫 Class {grade_clean}-{section_clean} Live WebSocket Room created! "
            f"Class Teacher: {primary_teacher_name}. All parents, assigned teachers, and school administration "
            f"are connected in this live channel."
        )
        msg_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO channel_messages (id, channel, sender_name, sender_role, sender_avatar, message_text, category)
            VALUES (%s, %s, 'Principal Desk (System)', 'SCHOOL_ADMIN', '🏫', %s, 'UPDATE');
        """, (msg_id, room_key, welcome_msg))

    try:
        from backend.routers.chat import manager
        await manager.broadcast(room_key, {
            "id": msg_id,
            "channel": room_key,
            "sender_name": "Principal Desk (System)",
            "sender_role": "SCHOOL_ADMIN",
            "sender_avatar": "🏫",
            "message_text": welcome_msg,
            "category": "UPDATE",
            "timestamp": "Just now"
        })
    except Exception as e:
        print(f"Broadcast error on create class: {e}")

    return {
        "status": "success",
        "message": f"Class {grade_clean}-{section_clean} socket room '{room_key}' created and initialized successfully!",
        "class_id": class_id,
        "room_key": room_key,
        "grade": grade_clean,
        "section": section_clean,
        "primary_teacher": primary_teacher_name
    }

@router.post("/assign-teacher")
async def assign_teacher_to_class(req: AssignTeacherRequest):
    with get_db_cursor(commit=True) as cur:
        # Check class
        cur.execute("SELECT id, grade, section FROM classes WHERE id = %s;", (req.class_id,))
        cls = cur.fetchone()
        if not cls:
            raise HTTPException(status_code=404, detail="Classroom not found")

        # Check teacher
        cur.execute("SELECT id, full_name, email, phone FROM users WHERE id = %s AND role = 'TEACHER';", (req.teacher_id,))
        teacher = cur.fetchone()
        if not teacher:
            raise HTTPException(status_code=404, detail="Teacher not found")

        # If primary, update class_teacher_id
        if req.is_primary or req.subject.lower() == "class teacher":
            cur.execute("UPDATE classes SET class_teacher_id = %s WHERE id = %s;", (req.teacher_id, req.class_id))

        # Insert or update in class_teachers
        cur.execute("""
            INSERT INTO class_teachers (class_id, teacher_id, subject)
            VALUES (%s, %s, %s)
            ON CONFLICT (class_id, teacher_id, subject) DO UPDATE SET assigned_at = CURRENT_TIMESTAMP
            RETURNING id;
        """, (req.class_id, req.teacher_id, req.subject))

        room_key = f"class-{cls['grade'].lower()}{cls['section'].lower()}"

        # Persist system announcement message into channel_messages
        system_msg = f"🎉 {teacher['full_name']} has been officially assigned as {req.subject} for Class {cls['grade']}-{cls['section']}! You can now send updates and answer queries directly in this channel."
        msg_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO channel_messages (id, channel, sender_name, sender_role, sender_avatar, message_text, category)
            VALUES (%s, %s, 'Principal Desk (System)', 'SCHOOL_ADMIN', '🏫', %s, 'UPDATE');
        """, (msg_id, room_key, system_msg))

    # Real-time WebSocket broadcast to all connected parents and teachers
    try:
        from backend.routers.chat import manager
        await manager.broadcast(room_key, {
            "id": msg_id,
            "channel": room_key,
            "sender_name": "Principal Desk (System)",
            "sender_role": "SCHOOL_ADMIN",
            "sender_avatar": "🏫",
            "message_text": system_msg,
            "category": "UPDATE",
            "timestamp": "Just now"
        })
    except Exception as e:
        print(f"Broadcast error: {e}")

    return {
        "status": "success",
        "message": f"Successfully assigned {teacher['full_name']} as {req.subject} for Class {cls['grade']}-{cls['section']}!",
        "room_key": room_key,
        "teacher": teacher["full_name"],
        "subject": req.subject
    }

class TeacherLeaveDecisionRequest(BaseModel):
    decision: str  # APPROVED, REJECTED
    remarks: Optional[str] = "Approved by Principal"

@router.get("/teacher-leaves")
def get_all_teacher_leaves():
    from backend.routers.teacher import TEACHER_LEAVES_STORE
    return {"leaves": TEACHER_LEAVES_STORE}

@router.post("/teacher-leaves/{leave_id}/action")
def decide_teacher_leave(leave_id: str, req: TeacherLeaveDecisionRequest):
    from backend.routers.teacher import TEACHER_LEAVES_STORE
    if req.decision not in ("APPROVED", "REJECTED"):
        raise HTTPException(status_code=400, detail="Decision must be APPROVED or REJECTED")
    for item in TEACHER_LEAVES_STORE:
        if item.get("id") == leave_id:
            item["status"] = req.decision
            item["admin_remarks"] = req.remarks
            return {"message": f"Teacher leave {req.decision.lower()} successfully", "leave": item}
    return {"message": f"Teacher leave {req.decision.lower()} processed (ID: {leave_id})", "leave_id": leave_id, "status": req.decision}
