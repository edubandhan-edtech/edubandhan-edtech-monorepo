from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uuid
from backend.database import get_db_cursor

router = APIRouter(prefix="/api/hierarchy", tags=["Organization Hierarchy & Directory"])

@router.get("/tree")
def get_organization_tree(
    role: Optional[str] = Query(None, description="Requesting role: SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, etc."),
    school_id: Optional[str] = Query(None, description="Optional school_id filter"),
    teacher_id: Optional[str] = Query(None, description="Optional teacher_id filter")
):
    """
    Returns the multi-tier organizational tree:
    Super Admin -> Schools -> Admins -> Teachers -> Classes -> Students (-> Parents)
    Scoped according to the requesting user's role and parameters.
    """
    with get_db_cursor() as cur:
        # 1. Fetch schools
        school_query = "SELECT id, name, code, admin_id, city, state, contact_email, contact_phone, is_active FROM schools"
        params = []
        if school_id:
            school_query += " WHERE id = %s"
            params.append(school_id)
        school_query += " ORDER BY name;"
        
        cur.execute(school_query, tuple(params))
        schools_data = cur.fetchall()

        if not schools_data:
            # Fallback if no schools exist
            return {"role": role, "tree": []}

        school_ids = [str(s["id"]) for s in schools_data]

        # 2. Fetch Users (Admins and Teachers)
        cur.execute("""
            SELECT id, school_id, role, full_name, email, phone, is_active, last_login_at
            FROM users
            WHERE school_id::text = ANY(%s) AND is_active = TRUE
            ORDER BY full_name;
        """, (school_ids,))
        users_data = cur.fetchall()

        # 3. Fetch Classes
        cur.execute("""
            SELECT id, school_id, grade, section, room_number, academic_year, class_teacher_id
            FROM classes
            WHERE school_id::text = ANY(%s)
            ORDER BY grade, section;
        """, (school_ids,))
        classes_data = cur.fetchall()
        class_ids = [str(c["id"]) for c in classes_data]

        # 4. Fetch Class Teachers assignments
        class_teachers_data = []
        if class_ids:
            cur.execute("""
                SELECT ct.id, ct.class_id, ct.teacher_id, ct.subject, ct.assigned_at,
                       u.full_name as teacher_name, u.email as teacher_email, u.phone as teacher_phone
                FROM class_teachers ct
                JOIN users u ON u.id = ct.teacher_id
                WHERE ct.class_id::text = ANY(%s);
            """, (class_ids,))
            class_teachers_data = cur.fetchall()

        # 5. Fetch Students with today's attendance
        students_data = []
        if school_ids:
            cur.execute("""
                SELECT s.id, s.school_id, s.class_id, s.roll_number, s.admission_number,
                       s.first_name, s.last_name, s.gender, s.dob, s.avatar_url, s.is_active,
                       COALESCE(al.status, 'NOT_MARKED') as today_attendance_status,
                       al.check_in_time as today_checkin_time
                FROM students s
                LEFT JOIN attendance_logs al ON al.student_id = s.id AND al.log_date = CURRENT_DATE
                WHERE s.school_id::text = ANY(%s) AND s.is_active = TRUE
                ORDER BY s.roll_number, s.first_name;
            """, (school_ids,))
            students_data = cur.fetchall()

        student_ids = [str(st["id"]) for st in students_data]

        # 6. Fetch Guardians/Parents linked to students
        guardians_map = {}
        if student_ids:
            cur.execute("""
                SELECT sg.student_id, g.id as guardian_id, g.relationship, g.is_kyc_verified,
                       u.id as user_id, u.full_name, u.phone, u.email
                FROM student_guardians sg
                JOIN guardians g ON g.id = sg.guardian_id
                JOIN users u ON u.id = g.user_id
                WHERE sg.student_id::text = ANY(%s);
            """, (student_ids,))
            for g_row in cur.fetchall():
                st_id = g_row["student_id"]
                if st_id not in guardians_map:
                    guardians_map[st_id] = []
                guardians_map[st_id].append({
                    "id": g_row["guardian_id"],
                    "user_id": g_row["user_id"],
                    "full_name": g_row["full_name"],
                    "relationship": g_row["relationship"] or "Parent",
                    "phone": g_row["phone"],
                    "email": g_row["email"],
                    "is_kyc_verified": g_row["is_kyc_verified"]
                })

        # Pre-group students by class_id
        students_by_class = {}
        for st in students_data:
            c_id = st["class_id"]
            if c_id not in students_by_class:
                students_by_class[c_id] = []
            st_dict = dict(st)
            st_dict["guardians"] = guardians_map.get(st["id"], [])
            students_by_class[c_id].append(st_dict)

        # Pre-group classes by teacher
        # A teacher can be linked via `class_teachers` or as primary `class_teacher_id`
        teacher_assigned_classes = {} # teacher_id -> list of class dicts with students
        classes_dict = {c["id"]: dict(c) for c in classes_data}

        # Build class objects with their enrolled students
        for c_id, c_obj in classes_dict.items():
            c_obj["students"] = students_by_class.get(c_id, [])
            c_obj["student_count"] = len(c_obj["students"])

        for ct in class_teachers_data:
            t_id = ct["teacher_id"]
            c_id = ct["class_id"]
            if c_id in classes_dict:
                if t_id not in teacher_assigned_classes:
                    teacher_assigned_classes[t_id] = []
                c_copy = dict(classes_dict[c_id])
                c_copy["assigned_subject"] = ct["subject"]
                # Avoid duplicates
                if not any(item["id"] == c_id for item in teacher_assigned_classes[t_id]):
                    teacher_assigned_classes[t_id].append(c_copy)

        # Also link classes where teacher is `class_teacher_id`
        for c_id, c_obj in classes_dict.items():
            pri_teacher_id = c_obj.get("class_teacher_id")
            if pri_teacher_id:
                if pri_teacher_id not in teacher_assigned_classes:
                    teacher_assigned_classes[pri_teacher_id] = []
                if not any(item["id"] == c_id for item in teacher_assigned_classes[pri_teacher_id]):
                    c_copy = dict(c_obj)
                    c_copy["assigned_subject"] = "Class Teacher"
                    teacher_assigned_classes[pri_teacher_id].append(c_copy)

        # Assemble per-school hierarchy
        tree = []
        for s in schools_data:
            s_id = str(s["id"])
            s_users = [u for u in users_data if str(u["school_id"]) == s_id]
            s_admins = [u for u in s_users if u["role"] == "SCHOOL_ADMIN"]
            s_teachers = [u for u in s_users if u["role"] == "TEACHER"]
            s_classes = [classes_dict[c["id"]] for c in classes_data if str(c["school_id"]) == s_id]
            s_students = [st for st in students_data if str(st["school_id"]) == s_id]

            # Build teacher nodes with their children (classes and students)
            teachers_tree = []
            for t in s_teachers:
                t_id = t["id"]
                t_classes = teacher_assigned_classes.get(t_id, [])
                
                # If teacher has no explicit class_teachers row, but there are classes in the school,
                # attach school classes if they are the only teacher or mark as unassigned faculty
                if not t_classes and s_classes:
                    # Provide view of school classes for reference
                    t_classes = []

                total_teacher_students = sum(len(c.get("students", [])) for c in t_classes)
                teachers_tree.append({
                    "id": t["id"],
                    "entity_type": "teacher",
                    "full_name": t["full_name"],
                    "email": t["email"],
                    "phone": t["phone"],
                    "role": t["role"],
                    "is_active": t["is_active"],
                    "classes_count": len(t_classes),
                    "students_count": total_teacher_students,
                    "classes": t_classes
                })

            # School node
            school_node = {
                "id": s["id"],
                "entity_type": "school",
                "name": s["name"],
                "code": s["code"],
                "admin_id": s["admin_id"],
                "city": s["city"],
                "state": s["state"],
                "contact_email": s["contact_email"],
                "contact_phone": s["contact_phone"],
                "stats": {
                    "total_admins": len(s_admins),
                    "total_teachers": len(s_teachers),
                    "total_classes": len(s_classes),
                    "total_students": len(s_students),
                    "present_today": sum(1 for st in s_students if st["today_attendance_status"] == "PRESENT")
                },
                "admins": [
                    {
                        "id": a["id"],
                        "entity_type": "admin",
                        "full_name": a["full_name"],
                        "email": a["email"],
                        "phone": a["phone"],
                        "role": a["role"],
                        "is_active": a["is_active"]
                    } for a in s_admins
                ],
                "teachers": teachers_tree,
                "classes": s_classes  # Classrooms perspective
            }
            tree.append(school_node)

        # Scoping based on role:
        normalized_role = (role or "").upper()
        if "TEACHER" in normalized_role and teacher_id:
            # Filter tree to only this teacher's classes and students
            filtered_tree = []
            for s in tree:
                t_matches = [t for t in s["teachers"] if t["id"] == teacher_id]
                if t_matches:
                    s_copy = dict(s)
                    s_copy["teachers"] = t_matches
                    filtered_tree.append(s_copy)
            if filtered_tree:
                tree = filtered_tree

        return {
            "role": role,
            "total_schools": len(tree),
            "tree": tree
        }

@router.get("/profile/{entity_type}/{entity_id}")
def get_entity_profile(entity_type: str, entity_id: str):
    """
    Returns complete, rich details for any clicked entity in the hierarchy:
    school | admin | teacher | student | parent | class
    """
    clean_type = entity_type.lower().strip()

    with get_db_cursor() as cur:
        if clean_type == "school":
            cur.execute("""
                SELECT s.*, 
                       (SELECT count(*) FROM users u WHERE u.school_id = s.id AND u.role = 'SCHOOL_ADMIN') as admin_count,
                       (SELECT count(*) FROM users u WHERE u.school_id = s.id AND u.role = 'TEACHER') as teacher_count,
                       (SELECT count(*) FROM classes c WHERE c.school_id = s.id) as class_count,
                       (SELECT count(*) FROM students st WHERE st.school_id = s.id AND st.is_active = TRUE) as student_count,
                       (SELECT coalesce(sum(total_amount), 0) FROM fee_invoices f WHERE f.school_id = s.id AND f.payment_status = 'PAID') as fee_collected,
                       (SELECT count(*) FROM attendance_logs al WHERE al.school_id = s.id AND al.log_date = CURRENT_DATE AND al.status = 'PRESENT') as present_today
                FROM schools s
                WHERE s.id = %s;
            """, (entity_id,))
            school = cur.fetchone()
            if not school:
                raise HTTPException(status_code=404, detail="School not found")

            # Fetch school administrators
            cur.execute("""
                SELECT id, full_name, email, phone, role, last_login_at, created_at
                FROM users
                WHERE school_id = %s AND role = 'SCHOOL_ADMIN'
                ORDER BY created_at;
            """, (entity_id,))
            admins = cur.fetchall()

            return {
                "entity_type": "school",
                "profile": school,
                "administrators": admins
            }

        elif clean_type in ("admin", "teacher"):
            cur.execute("""
                SELECT u.id, u.school_id, u.role, u.full_name, u.email, u.phone, 
                       u.is_active, u.last_login_at, u.created_at,
                       s.name as school_name, s.code as school_code, s.city as school_city, s.admin_id as school_admin_id
                FROM users u
                LEFT JOIN schools s ON s.id = u.school_id
                WHERE u.id = %s;
            """, (entity_id,))
            user = cur.fetchone()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            assigned_classes = []
            stats = {}
            if user["role"] == "TEACHER":
                cur.execute("""
                    SELECT c.id, c.grade, c.section, c.room_number, c.academic_year,
                           ct.subject,
                           (SELECT count(*) FROM students st WHERE st.class_id = c.id AND st.is_active = TRUE) as student_count,
                           (c.class_teacher_id = %s) as is_primary_class_teacher
                    FROM class_teachers ct
                    JOIN classes c ON c.id = ct.class_id
                    WHERE ct.teacher_id = %s
                    UNION
                    SELECT c.id, c.grade, c.section, c.room_number, c.academic_year,
                           'Class Teacher' as subject,
                           (SELECT count(*) FROM students st WHERE st.class_id = c.id AND st.is_active = TRUE) as student_count,
                           TRUE as is_primary_class_teacher
                    FROM classes c
                    WHERE c.class_teacher_id = %s
                    ORDER BY grade, section;
                """, (entity_id, entity_id, entity_id))
                assigned_classes = cur.fetchall()

                total_students = sum(c["student_count"] for c in assigned_classes)
                # Consultation counts
                cur.execute("""
                    SELECT count(*) as total_consultations,
                           count(*) FILTER (WHERE status = 'CONFIRMED' OR status = 'ACCEPTED') as confirmed_consultations
                    FROM consultation_bookings
                    WHERE teacher_id = %s;
                """, (entity_id,))
                consult_stats = cur.fetchone()

                stats = {
                    "total_assigned_classes": len(assigned_classes),
                    "total_students_taught": total_students,
                    "total_consultations": consult_stats["total_consultations"] if consult_stats else 0,
                    "confirmed_consultations": consult_stats["confirmed_consultations"] if consult_stats else 0
                }

            elif user["role"] == "SCHOOL_ADMIN":
                s_id = user["school_id"]
                cur.execute("""
                    SELECT 
                        (SELECT count(*) FROM users WHERE school_id = %s AND role = 'TEACHER') as teacher_count,
                        (SELECT count(*) FROM students WHERE school_id = %s AND is_active = TRUE) as student_count,
                        (SELECT count(*) FROM classes WHERE school_id = %s) as class_count
                """, (s_id, s_id, s_id))
                stats = cur.fetchone()

            return {
                "entity_type": clean_type,
                "profile": user,
                "assigned_classes": assigned_classes,
                "stats": stats
            }

        elif clean_type == "student":
            cur.execute("""
                SELECT s.id, s.school_id, s.class_id, s.roll_number, s.admission_number,
                       s.first_name, s.last_name, s.gender, s.dob, s.avatar_url, s.is_active, s.created_at,
                       sch.name as school_name, sch.code as school_code,
                       c.grade, c.section, c.room_number, c.academic_year,
                       tu.full_name as class_teacher_name, tu.phone as class_teacher_phone, tu.email as class_teacher_email
                FROM students s
                LEFT JOIN schools sch ON sch.id = s.school_id
                LEFT JOIN classes c ON c.id = s.class_id
                LEFT JOIN users tu ON tu.id = c.class_teacher_id
                WHERE s.id = %s;
            """, (entity_id,))
            student = cur.fetchone()
            if not student:
                raise HTTPException(status_code=404, detail="Student not found")

            # Parents / Guardians
            cur.execute("""
                SELECT g.id as guardian_id, g.relationship, g.is_kyc_verified,
                       u.id as user_id, u.full_name, u.phone, u.email, sg.is_primary
                FROM student_guardians sg
                JOIN guardians g ON g.id = sg.guardian_id
                JOIN users u ON u.id = g.user_id
                WHERE sg.student_id = %s;
            """, (entity_id,))
            guardians = cur.fetchall()

            # Today's attendance
            cur.execute("""
                SELECT status, check_in_time, confidence_score, verified_by_kiosk
                FROM attendance_logs
                WHERE student_id = %s AND log_date = CURRENT_DATE;
            """, (entity_id,))
            today_att = cur.fetchone()

            # Past 30 days attendance stats
            cur.execute("""
                SELECT 
                    COUNT(*) as total_logged_days,
                    COUNT(*) FILTER (WHERE status = 'PRESENT') as present_days,
                    COUNT(*) FILTER (WHERE status = 'LATE') as late_days,
                    COUNT(*) FILTER (WHERE status = 'ABSENT') as absent_days
                FROM attendance_logs
                WHERE student_id = %s AND log_date >= CURRENT_DATE - INTERVAL '30 days';
            """, (entity_id,))
            att_30d = cur.fetchone()
            tot_days = att_30d["total_logged_days"] or 0
            pres_days = (att_30d["present_days"] or 0) + (att_30d["late_days"] or 0)
            rate_30d = round((pres_days / max(tot_days, 1)) * 100, 1) if tot_days > 0 else 100.0

            # Recent 7 attendance records
            cur.execute("""
                SELECT log_date, check_in_time, status, confidence_score
                FROM attendance_logs
                WHERE student_id = %s
                ORDER BY log_date DESC
                LIMIT 7;
            """, (entity_id,))
            recent_logs = cur.fetchall()

            # Fee Invoices
            cur.execute("""
                SELECT invoice_number, amount, tax_gst, total_amount, payment_status, paid_at, payment_mode
                FROM fee_invoices
                WHERE student_id = %s
                ORDER BY created_at DESC;
            """, (entity_id,))
            invoices = cur.fetchall()

            return {
                "entity_type": "student",
                "profile": student,
                "guardians": guardians,
                "attendance": {
                    "today": today_att or {"status": "NOT_MARKED", "check_in_time": None},
                    "thirty_day_rate": rate_30d,
                    "total_logged_days": tot_days,
                    "present_days": pres_days,
                    "recent_logs": recent_logs
                },
                "fees": {
                    "invoices": invoices,
                    "total_billed": sum(float(i["total_amount"]) for i in invoices),
                    "total_paid": sum(float(i["total_amount"]) for i in invoices if i["payment_status"] == "PAID"),
                    "pending_dues": sum(float(i["total_amount"]) for i in invoices if i["payment_status"] != "PAID")
                }
            }

        elif clean_type == "class":
            cur.execute("""
                SELECT c.*, s.name as school_name,
                       tu.full_name as class_teacher_name, tu.phone as class_teacher_phone, tu.email as class_teacher_email
                FROM classes c
                LEFT JOIN schools s ON s.id = c.school_id
                LEFT JOIN users tu ON tu.id = c.class_teacher_id
                WHERE c.id = %s;
            """, (entity_id,))
            class_info = cur.fetchone()
            if not class_info:
                raise HTTPException(status_code=404, detail="Classroom not found")

            # Subject teachers
            cur.execute("""
                SELECT ct.subject, u.id as teacher_id, u.full_name, u.email, u.phone
                FROM class_teachers ct
                JOIN users u ON u.id = ct.teacher_id
                WHERE ct.class_id = %s;
            """, (entity_id,))
            subject_teachers = cur.fetchall()

            # Enrolled students
            cur.execute("""
                SELECT s.id, s.roll_number, s.admission_number, s.first_name, s.last_name, s.gender,
                       COALESCE(al.status, 'NOT_MARKED') as today_status
                FROM students s
                LEFT JOIN attendance_logs al ON al.student_id = s.id AND al.log_date = CURRENT_DATE
                WHERE s.class_id = %s AND s.is_active = TRUE
                ORDER BY s.roll_number, s.first_name;
            """, (entity_id,))
            students = cur.fetchall()

            return {
                "entity_type": "class",
                "profile": class_info,
                "subject_teachers": subject_teachers,
                "students": students,
                "student_count": len(students)
            }

        elif clean_type == "parent":
            cur.execute("""
                SELECT g.id, g.user_id, g.relationship, g.is_kyc_verified,
                       u.full_name, u.phone, u.email, u.created_at
                FROM guardians g
                JOIN users u ON u.id = g.user_id
                WHERE g.id = %s OR u.id = %s;
            """, (entity_id, entity_id))
            parent = cur.fetchone()
            if not parent:
                raise HTTPException(status_code=404, detail="Parent not found")

            # Fetch linked children
            cur.execute("""
                SELECT s.id, s.first_name, s.last_name, s.roll_number, s.admission_number,
                       c.grade, c.section, sch.name as school_name,
                       COALESCE(al.status, 'NOT_MARKED') as today_status
                FROM student_guardians sg
                JOIN students s ON s.id = sg.student_id
                LEFT JOIN classes c ON c.id = s.class_id
                LEFT JOIN schools sch ON sch.id = s.school_id
                LEFT JOIN attendance_logs al ON al.student_id = s.id AND al.log_date = CURRENT_DATE
                WHERE sg.guardian_id = %s;
            """, (parent["id"],))
            children = cur.fetchall()

            return {
                "entity_type": "parent",
                "profile": parent,
                "children": children
            }

        else:
            raise HTTPException(status_code=400, detail=f"Unsupported entity type: {clean_type}")
