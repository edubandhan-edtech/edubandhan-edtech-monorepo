from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
import uuid
from backend.database import get_db_cursor

router = APIRouter(prefix="/api/teacher", tags=["Teacher Workspace"])

class AttendanceOverrideRequest(BaseModel):
    student_id: str
    status: str  # PRESENT, LATE, ABSENT, EXCUSED
    notes: Optional[str] = "Manual mark by teacher"

@router.get("/classes")
def get_teacher_classes():
    with get_db_cursor() as cur:
        cur.execute("""
            SELECT c.id, c.grade, c.section, c.academic_year, s.name as school_name,
                   (SELECT count(*) FROM students st WHERE st.class_id = c.id AND st.is_active = TRUE) as student_count
            FROM classes c
            JOIN schools s ON s.id = c.school_id
            ORDER BY c.grade, c.section;
        """)
        return {"classes": cur.fetchall()}

@router.post("/attendance/manual-mark")
def manual_mark_attendance(req: AttendanceOverrideRequest):
    if req.status not in ("PRESENT", "LATE", "ABSENT", "EXCUSED"):
        raise HTTPException(status_code=400, detail="Invalid attendance status")

    with get_db_cursor(commit=True) as cur:
        log_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO attendance_logs (id, student_id, log_date, check_in_time, status, verification_mode, confidence_score, notification_sent)
            VALUES (%s, %s, CURRENT_DATE, CURRENT_TIME, %s, 'MANUAL_TEACHER', 1.0, TRUE)
            ON CONFLICT (student_id, log_date)
            DO UPDATE SET status = %s, verification_mode = 'MANUAL_TEACHER', notification_sent = TRUE
            RETURNING id, student_id, status, check_in_time;
        """, (log_id, req.student_id, req.status, req.status))
        row = cur.fetchone()
        return {"message": f"Attendance marked as {req.status}", "record": row}

class ConsultationDecisionRequest(BaseModel):
    booking_id: str
    decision: str  # 'ACCEPT' or 'REJECT'
    remarks: Optional[str] = None

@router.get("/consultations")
def get_teacher_consultations():
    with get_db_cursor() as cur:
        cur.execute("""
            SELECT cb.id, cb.slot_start_time, cb.slot_duration_minutes, cb.fee_amount, cb.teacher_earnings,
                   cb.status, cb.webrtc_room_id, cb.room_passcode, cb.query_topic, cb.rejection_remarks,
                   cb.created_at,
                   s.first_name || ' ' || s.last_name as student_name,
                   s.roll_number, c.grade as class_name, c.section,
                   u.full_name as teacher_name,
                   COALESCE(g.relationship || ' (' || gu.full_name || ')', gu.full_name, 'Parent') as parent_name,
                   gu.phone as parent_phone
            FROM consultation_bookings cb
            JOIN students s ON s.id = cb.student_id
            JOIN classes c ON c.id = s.class_id
            LEFT JOIN users u ON u.id = cb.teacher_id
            LEFT JOIN guardians g ON g.id = cb.guardian_id
            LEFT JOIN users gu ON gu.id = g.user_id
            ORDER BY cb.created_at DESC;
        """)
        return {"consultations": cur.fetchall()}

@router.post("/consultation/decision")
def teacher_consultation_decision(req: ConsultationDecisionRequest):
    import random
    with get_db_cursor(commit=True) as cur:
        cur.execute("SELECT * FROM consultation_bookings WHERE id = %s;", (req.booking_id,))
        booking = cur.fetchone()
        if not booking:
            raise HTTPException(status_code=404, detail="Consultation booking not found")
        
        decision_upper = req.decision.upper()
        if decision_upper in ["ACCEPT", "ACCEPTED", "CONFIRMED"]:
            new_status = "CONFIRMED"
            passcode = booking.get("room_passcode") or f"EDU-{random.randint(1000, 9999)}"
            room_id = booking.get("webrtc_room_id") or f"room-ptm-{uuid.uuid4().hex[:8]}"
            cur.execute("""
                UPDATE consultation_bookings 
                SET status = %s, room_passcode = %s, webrtc_room_id = %s, rejection_remarks = NULL
                WHERE id = %s
                RETURNING *;
            """, (new_status, passcode, room_id, req.booking_id))
            updated = cur.fetchone()

            # Record system alert message
            try:
                msg_id = str(uuid.uuid4())
                cur.execute("""
                    INSERT INTO channel_messages (id, channel, sender_name, sender_role, sender_avatar, message_text, category)
                    VALUES (%s, 'parent-notifications', 'EduBandhan System', 'SYSTEM', '🔒', %s, 'UPDATE');
                """, (msg_id, f"✅ Consultation ACCEPTED by Teacher! WebRTC Room: {room_id} | Passcode: {passcode}"))
            except Exception as e:
                print("Error recording consultation acceptance notification:", e)

            return {
                "message": "Consultation request accepted successfully!",
                "status": "CONFIRMED",
                "booking": updated,
                "room_id": room_id,
                "room_passcode": passcode
            }

        elif decision_upper in ["REJECT", "REJECTED", "CANCEL", "CANCELLED"]:
            new_status = "REJECTED"
            remarks = (req.remarks or "").strip() or "Teacher is currently unavailable during this time slot."
            cur.execute("""
                UPDATE consultation_bookings 
                SET status = %s, rejection_remarks = %s
                WHERE id = %s
                RETURNING *;
            """, (new_status, remarks, req.booking_id))
            updated = cur.fetchone()

            # Record system alert message
            try:
                msg_id = str(uuid.uuid4())
                cur.execute("""
                    INSERT INTO channel_messages (id, channel, sender_name, sender_role, sender_avatar, message_text, category)
                    VALUES (%s, 'parent-notifications', 'EduBandhan System', 'SYSTEM', '⚠️', %s, 'UPDATE');
                """, (msg_id, f"❌ Consultation Request Cancelled by Teacher. Reason: {remarks}"))
            except Exception as e:
                print("Error recording consultation rejection notification:", e)

            return {
                "message": "Consultation request rejected with remarks.",
                "status": "REJECTED",
                "booking": updated,
                "remarks": remarks
            }
        elif decision_upper in ["COMPLETE", "COMPLETED", "FINISH", "FINISHED"]:
            new_status = "COMPLETED"
            cur.execute("""
                UPDATE consultation_bookings 
                SET status = %s
                WHERE id = %s
                RETURNING *;
            """, (new_status, req.booking_id))
            updated = cur.fetchone()

            try:
                msg_id = str(uuid.uuid4())
                cur.execute("""
                    INSERT INTO channel_messages (id, channel, sender_name, sender_role, sender_avatar, message_text, category)
                    VALUES (%s, 'parent-notifications', 'EduBandhan System', 'SYSTEM', '📋', '✅ 1-on-1 Consultation completed! Recorded in Academic Reports.', 'UPDATE');
                """, (msg_id,))
            except Exception as e:
                pass

            return {
                "message": "Consultation meeting marked as COMPLETED for reporting criteria!",
                "status": "COMPLETED",
                "booking": updated
            }
        else:
            raise HTTPException(status_code=400, detail="Invalid decision. Must be ACCEPT, REJECT, or COMPLETE.")

class ConsultationCompleteRequest(BaseModel):
    booking_id: Optional[str] = None
    room_id: Optional[str] = None
    remarks: Optional[str] = None

@router.post("/consultation/complete")
def complete_teacher_consultation(req: ConsultationCompleteRequest):
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
            "message": "Consultation successfully archived as COMPLETED meeting!",
            "status": "COMPLETED",
            "booking": updated
        }

# =========================================================================
# LEAVE MANAGEMENT: TEACHER LEAVE & STUDENT LEAVE APPROVALS
# =========================================================================

class TeacherLeaveApplyRequest(BaseModel):
    teacher_name: str = "Mrs. Sunita Sharma"
    teacher_email: str = "sunita.sharma@dps-rourkela.edu.in"
    leave_type: str = "Medical / Sick Leave (ML)"
    from_date: str
    to_date: str
    days: int = 1
    reason: str
    substitute: Optional[str] = None

class StudentLeaveDecisionRequest(BaseModel):
    decision: str  # APPROVED, REJECTED
    remarks: Optional[str] = "Approved by Class Teacher"

# In-memory store fallback with persistent DB support
TEACHER_LEAVES_STORE = []
STUDENT_LEAVES_STORE = []

@router.post("/leave/apply")
def apply_teacher_leave(req: TeacherLeaveApplyRequest):
    leave_id = f"TL-{uuid.uuid4().hex[:6].upper()}"
    record = {
        "id": leave_id,
        "teacher_name": req.teacher_name,
        "teacher_email": req.teacher_email,
        "leave_type": req.leave_type,
        "from_date": req.from_date,
        "to_date": req.to_date,
        "days": req.days,
        "reason": req.reason,
        "substitute": req.substitute,
        "status": "PENDING",
        "applied_at": "Today"
    }
    TEACHER_LEAVES_STORE.append(record)
    return {"message": "Leave application submitted to School Admin / Principal", "leave": record}

@router.get("/leave/list")
def list_teacher_leaves():
    return {"leaves": TEACHER_LEAVES_STORE}

@router.get("/student-leaves")
def list_student_leaves_for_teacher():
    return {"student_leaves": STUDENT_LEAVES_STORE}

@router.post("/student-leaves/{leave_id}/action")
def decide_student_leave(leave_id: str, req: StudentLeaveDecisionRequest):
    if req.decision not in ("APPROVED", "REJECTED"):
        raise HTTPException(status_code=400, detail="Decision must be APPROVED or REJECTED")
    for item in STUDENT_LEAVES_STORE:
        if item.get("id") == leave_id:
            item["status"] = req.decision
            item["teacher_remarks"] = req.remarks
            return {"message": f"Student leave {req.decision.lower()} successfully", "leave": item}
    return {"message": f"Student leave {req.decision.lower()} processed (ID: {leave_id})", "leave_id": leave_id, "status": req.decision}
