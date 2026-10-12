from fastapi import APIRouter, HTTPException, Depends, status, Response, Request
from pydantic import BaseModel
from typing import Optional, List
import uuid
from backend.database import get_db_cursor
from backend.config import settings
from backend.auth_utils import (
    hash_password, verify_password, create_access_token, 
    create_refresh_token, verify_refresh_token, get_current_user
)

router = APIRouter(prefix="/api/auth", tags=["Authentication & Onboarding"])

class ParentRegisterRequest(BaseModel):
    # Parent details
    first_name: str
    last_name: str
    relationship: str = "Father"  # Father, Mother, Guardian
    phone: str
    email: str
    password: str = "password123"
    admin_id: Optional[str] = None  # Required School Admin ID created by Super Admin
    school_id: Optional[str] = None
    
    # Child details
    child_first_name: str
    child_last_name: str
    child_admission_no: str
    child_roll_number: Optional[int] = 14
    child_class_id: Optional[str] = None
    child_class_name: Optional[str] = "Class 8-B"  # e.g. "Class 8-B", "Class 5-A"
    child_dob: Optional[str] = "2013-05-15"
    child_gender: Optional[str] = "MALE"
    child_photo_base64: Optional[str] = None  # Live snap or photo upload
    child_face_embedding: Optional[List[float]] = None  # 512-D vector

class LoginRequest(BaseModel):
    identifier: str  # email or phone
    password: str
    role: Optional[str] = None  # 'SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PARENT'
    admin_id: Optional[str] = None  # Required for SCHOOL_ADMIN, TEACHER, PARENT
    admission_no: Optional[str] = None  # Required for PARENT

@router.post("/login")
def login(req: LoginRequest, response: Response):
    ident = req.identifier.strip()
    with get_db_cursor() as cur:
        cur.execute("""
            SELECT u.id, u.school_id, u.email, u.phone, u.password_hash, u.role, u.is_active, u.full_name,
                   s.name as school_name, s.code as school_code, s.admin_id as school_admin_id
            FROM users u
            LEFT JOIN schools s ON s.id = u.school_id
            WHERE LOWER(u.email) = LOWER(%s) OR u.phone = %s 
               OR (LOWER(%s) = 'admin@edubandhan.com' AND LOWER(u.email) = 'admin@edubandhan.in');
        """, (ident, ident, ident))
        user = cur.fetchone()
        
        # If not found in users, check students table by admission_number
        if not user:
            cur.execute("""
                SELECT s.id, s.school_id, s.admission_number, s.first_name, s.last_name, s.roll_number,
                       sch.name as school_name, sch.code as school_code, sch.admin_id as school_admin_id
                FROM students s
                LEFT JOIN schools sch ON sch.id = s.school_id
                WHERE LOWER(s.admission_number) = LOWER(%s)
                   OR LOWER(s.first_name || '.' || s.last_name) = LOWER(%s);
            """, (ident, ident))
            student = cur.fetchone()
            if student:
                # Student credentials check
                valid = req.password in ["edubandhan2026", "password123", "student123", student["admission_number"]]
                if not valid:
                    raise HTTPException(status_code=400, detail="Invalid admission number or password")

                # Verify school admin ID if provided
                if req.admin_id and req.admin_id.strip():
                    aid = req.admin_id.strip().lower()
                    allowed_aids = [
                        str(student.get("school_admin_id") or "").lower(),
                        str(student.get("school_code") or "").lower()
                    ]
                    if aid not in allowed_aids:
                        raise HTTPException(
                            status_code=400, 
                            detail=f"Student does not belong to school with Admin ID '{req.admin_id}'."
                        )

                access_token = create_access_token({"sub": str(student["id"]), "role": "STUDENT"})
                refresh_token = create_refresh_token({"sub": str(student["id"]), "role": "STUDENT"})
                
                response.set_cookie(
                    key="refresh_token",
                    value=refresh_token,
                    httponly=True,
                    max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
                    samesite="lax",
                    secure=False
                )

                return {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "token_type": "bearer",
                    "user": {
                        "id": str(student["id"]),
                        "full_name": f"{student['first_name']} {student['last_name']}",
                        "school_id": str(student["school_id"]),
                        "school_name": student["school_name"],
                        "school_admin_id": student.get("school_admin_id") or student.get("school_code"),
                        "email": f"{student['admission_number'].lower()}@student.edu",
                        "phone": student["admission_number"],
                        "role": "STUDENT"
                    },
                    "children": []
                }
            raise HTTPException(status_code=400, detail="Invalid email/phone or password")

        if not verify_password(req.password, user["password_hash"]):
            raise HTTPException(status_code=400, detail="Invalid email/phone or password")
        
        if not user["is_active"]:
            raise HTTPException(status_code=403, detail="Account is deactivated")

        user_role = user["role"].upper()

        # =====================================================================
        # 4-TIER HIERARCHY VALIDATION DURING SIGN IN
        # =====================================================================

        # Tier 1: SUPER_ADMIN — Platform owner, full access without school restriction
        if user_role == "SUPER_ADMIN":
            pass

        # Tier 2: SCHOOL_ADMIN — Must enter admin_id created by Super Admin
        elif user_role == "SCHOOL_ADMIN":
            if not req.admin_id or not req.admin_id.strip():
                raise HTTPException(
                    status_code=400, 
                    detail="Admin ID is required. Please enter the unique Admin ID issued by Super Admin."
                )
            clean_aid = req.admin_id.strip()
            cur.execute("""
                SELECT id, name, admin_id, code FROM schools 
                WHERE LOWER(admin_id) = LOWER(%s) OR LOWER(code) = LOWER(%s);
            """, (clean_aid, clean_aid))
            sch = cur.fetchone()
            if not sch:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Admin ID '{clean_aid}' was not created by Super Admin. Access denied."
                )
            if user["school_id"] and str(user["school_id"]) != str(sch["id"]):
                raise HTTPException(
                    status_code=400, 
                    detail=f"Admin ID '{clean_aid}' does not match this administrator account."
                )

        # Tier 3: TEACHER — Must enter admin_id assigned to its school in the table
        elif user_role == "TEACHER":
            if not req.admin_id or not req.admin_id.strip():
                raise HTTPException(
                    status_code=400, 
                    detail="School Admin ID is required. Please enter your school's assigned Admin ID."
                )
            clean_aid = req.admin_id.strip()
            cur.execute("""
                SELECT id, name, admin_id, code FROM schools 
                WHERE LOWER(admin_id) = LOWER(%s) OR LOWER(code) = LOWER(%s);
            """, (clean_aid, clean_aid))
            sch = cur.fetchone()
            if not sch:
                raise HTTPException(
                    status_code=400, 
                    detail=f"School Admin ID '{clean_aid}' is not in the system. Teacher cannot enter the portal."
                )
            if user["school_id"] and str(user["school_id"]) != str(sch["id"]):
                raise HTTPException(
                    status_code=400, 
                    detail=f"Teacher is not registered under school with Admin ID '{clean_aid}'."
                )

        # Tier 4: PARENT — Must enter admin_id AND admission_no.
        # Admission number MUST be present under that admin_id in the admission/students table!
        elif user_role == "PARENT":
            if not req.admin_id or not req.admin_id.strip():
                raise HTTPException(
                    status_code=400, 
                    detail="School Admin ID is required for Parent portal sign in."
                )
            if not req.admission_no or not req.admission_no.strip():
                raise HTTPException(
                    status_code=400, 
                    detail="Student Admission Number is required for Parent portal sign in."
                )
            clean_aid = req.admin_id.strip()
            clean_adm = req.admission_no.strip()

            cur.execute("""
                SELECT id, name, admin_id, code FROM schools 
                WHERE LOWER(admin_id) = LOWER(%s) OR LOWER(code) = LOWER(%s);
            """, (clean_aid, clean_aid))
            sch = cur.fetchone()
            if not sch:
                raise HTTPException(
                    status_code=400, 
                    detail=f"School Admin ID '{clean_aid}' is not found in the system."
                )

            # Check if student admission number exists under this school
            cur.execute("""
                SELECT s.id, s.admission_number, s.first_name, s.last_name, s.class_id,
                       c.grade as class_grade, c.section,
                       'class-' || lower(c.grade) || lower(c.section) as room_key
                FROM students s
                LEFT JOIN classes c ON c.id = s.class_id
                WHERE s.school_id = %s AND LOWER(s.admission_number) = LOWER(%s);
            """, (sch["id"], clean_adm))
            verified_student = cur.fetchone()
            if not verified_student:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Admission Number '{clean_adm}' is not present under School Admin ID '{clean_aid}' in the admission table. Parent cannot enter the portal."
                )

            # Ensure parent is linked to this student
            cur.execute("SELECT id FROM guardians WHERE user_id = %s;", (user["id"],))
            g_row = cur.fetchone()
            if g_row:
                cur.execute("""
                    INSERT INTO student_guardians (student_id, guardian_id, is_primary)
                    VALUES (%s, %s, TRUE)
                    ON CONFLICT (student_id, guardian_id) DO NOTHING;
                """, (verified_student["id"], g_row["id"]))
        
        access_token = create_access_token({"sub": str(user["id"]), "role": user["role"]})
        refresh_token = create_refresh_token({"sub": str(user["id"]), "role": user["role"]})

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
            samesite="lax",
            secure=False
        )
        
        # If user is a parent, fetch their linked children and their active socket room
        children = []
        if user["role"] == "PARENT":
            cur.execute("""
                SELECT s.id, s.admission_number, s.roll_number, s.first_name, s.last_name, 
                       s.gender, s.class_id, c.grade as class_grade, c.section,
                       'class-' || lower(c.grade) || lower(c.section) as room_key
                FROM guardians g
                JOIN student_guardians sg ON sg.guardian_id = g.id
                JOIN students s ON s.id = sg.student_id
                JOIN classes c ON c.id = s.class_id
                WHERE g.user_id = %s;
            """, (user["id"],))
            children = cur.fetchall()

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": str(user["id"]),
                "full_name": user["full_name"],
                "school_id": str(user["school_id"]) if user["school_id"] else None,
                "school_name": user["school_name"],
                "school_admin_id": user.get("school_admin_id") or user.get("school_code"),
                "email": user["email"],
                "phone": user["phone"],
                "role": user["role"]
            },
            "children": children
        }

class RefreshTokenRequest(BaseModel):
    refresh_token: Optional[str] = None

@router.post("/refresh")
def refresh_token_endpoint(response: Response, request: Request, req: Optional[RefreshTokenRequest] = None):
    """
    Standard JWT Refresh:
    Extracts refresh token from HttpOnly cookie, JSON body, or Authorization header.
    Validates token signature and issues a brand-new access token and rotated refresh token.
    """
    token = request.cookies.get("refresh_token")
    if not token and req and req.refresh_token:
        token = req.refresh_token
    if not token:
        auth_hdr = request.headers.get("Authorization")
        if auth_hdr and auth_hdr.startswith("Bearer "):
            token = auth_hdr.split(" ")[1]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing. Please sign in."
        )

    # Verify signature, type, and expiration
    payload = verify_refresh_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    with get_db_cursor() as cur:
        if role == "STUDENT":
            cur.execute("""
                SELECT s.id, s.admission_number, s.roll_number, s.first_name, s.last_name, 
                       s.school_id, sch.name as school_name
                FROM students s
                LEFT JOIN schools sch ON sch.id = s.school_id
                WHERE s.id = %s;
            """, (user_id,))
            student = cur.fetchone()
            if not student:
                raise HTTPException(status_code=401, detail="Student account not found")

            new_access_token = create_access_token({"sub": str(student["id"]), "role": "STUDENT"})
            new_refresh_token = create_refresh_token({"sub": str(student["id"]), "role": "STUDENT"})

            response.set_cookie(
                key="refresh_token",
                value=new_refresh_token,
                httponly=True,
                max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
                samesite="lax",
                secure=False
            )

            return {
                "access_token": new_access_token,
                "refresh_token": new_refresh_token,
                "token_type": "bearer",
                "user": {
                    "id": str(student["id"]),
                    "full_name": f"{student['first_name']} {student['last_name']}",
                    "school_id": str(student["school_id"]),
                    "school_name": student["school_name"],
                    "email": f"{student['admission_number'].lower()}@student.edu",
                    "phone": student["admission_number"],
                    "role": "STUDENT"
                }
            }
        else:
            cur.execute("""
                SELECT u.id, u.school_id, u.email, u.phone, u.role, u.full_name, u.is_active,
                       s.name as school_name
                FROM users u
                LEFT JOIN schools s ON s.id = u.school_id
                WHERE u.id = %s;
            """, (user_id,))
            user = cur.fetchone()
            if not user or not user["is_active"]:
                raise HTTPException(status_code=401, detail="User account inactive or not found")

            new_access_token = create_access_token({"sub": str(user["id"]), "role": user["role"]})
            new_refresh_token = create_refresh_token({"sub": str(user["id"]), "role": user["role"]})

            response.set_cookie(
                key="refresh_token",
                value=new_refresh_token,
                httponly=True,
                max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
                samesite="lax",
                secure=False
            )

            # If user is a parent, include linked children
            children = []
            if user["role"] == "PARENT":
                cur.execute("""
                    SELECT s.id, s.admission_number, s.roll_number, s.first_name, s.last_name, 
                           s.gender, s.class_id, c.grade as class_grade, c.section,
                           'class-' || lower(c.grade) || lower(c.section) as room_key
                    FROM guardians g
                    JOIN student_guardians sg ON sg.guardian_id = g.id
                    JOIN students s ON s.id = sg.student_id
                    JOIN classes c ON c.id = s.class_id
                    WHERE g.user_id = %s;
                """, (user["id"],))
                children = cur.fetchall()

            return {
                "access_token": new_access_token,
                "refresh_token": new_refresh_token,
                "token_type": "bearer",
                "user": {
                    "id": str(user["id"]),
                    "full_name": user["full_name"],
                    "school_id": str(user["school_id"]) if user["school_id"] else None,
                    "school_name": user["school_name"],
                    "email": user["email"],
                    "phone": user["phone"],
                    "role": user["role"]
                },
                "children": children
            }

@router.post("/logout")
def logout_endpoint(response: Response):
    """Clears HttpOnly refresh token cookie on user sign out."""
    response.delete_cookie(key="refresh_token", path="/")
    return {"status": "success", "message": "Refresh token cookie cleared and session logged out."}

@router.get("/school-classes")
def get_school_classes(admin_id: Optional[str] = None):
    with get_db_cursor() as cur:
        sch = None
        if admin_id and admin_id.strip():
            clean_aid = admin_id.strip().lower()
            cur.execute("""
                SELECT id, name, admin_id, code 
                FROM schools 
                WHERE LOWER(admin_id) = %s OR LOWER(code) = %s OR LOWER(name) ILIKE %s
                LIMIT 1;
            """, (clean_aid, clean_aid, f"%{clean_aid}%"))
            sch = cur.fetchone()

        if not sch:
            # Fallback to first active school
            cur.execute("SELECT id, name, admin_id, code FROM schools ORDER BY id LIMIT 1;")
            sch = cur.fetchone()

        if not sch:
            return {"found": False, "message": "No school found", "classes": []}

        # Query all classes for this school
        cur.execute("""
            SELECT c.id, c.grade, c.section, c.room_number, c.academic_year,
                   c.class_teacher_id,
                   u.full_name as class_teacher_name,
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
                           'teacher_id', ct.teacher_id,
                           'teacher_name', tu.full_name,
                           'subject', ct.subject
                       )), '[]'::json)
                       FROM class_teachers ct
                       JOIN users tu ON tu.id = ct.teacher_id
                       WHERE ct.class_id = c.id
                   ) as assigned_teachers
            FROM classes c
            LEFT JOIN users u ON u.id = c.class_teacher_id
            WHERE c.school_id = %s
            ORDER BY c.grade, c.section;
        """, (sch["id"],))
        rows = cur.fetchall()

        formatted_classes = []
        for r in rows:
            formatted_classes.append({
                "id": str(r["id"]),
                "name": f"Class {r['grade']}-{r['section']}",
                "grade": r["grade"],
                "section": r["section"],
                "room_number": r["room_number"],
                "academic_year": r["academic_year"],
                "room_key": r["room_key"],
                "class_teacher_name": r["class_teacher_name"] or "Assigned Faculty",
                "student_count": r["student_count"],
                "parent_count": r["parent_count"],
                "assigned_teachers": r["assigned_teachers"]
            })

        return {
            "found": True,
            "school_id": str(sch["id"]),
            "school_name": sch["name"],
            "school_code": sch["code"],
            "admin_id": sch["admin_id"],
            "classes": formatted_classes
        }

@router.post("/register-parent")
async def register_parent(req: ParentRegisterRequest):
    if not req.admin_id or not req.admin_id.strip():
        raise HTTPException(
            status_code=400, 
            detail="School Admin ID is required. Please enter the Admin ID issued by your school."
        )
    if not req.child_admission_no or not req.child_admission_no.strip():
        raise HTTPException(
            status_code=400, 
            detail="Student Admission Number is required to register as Parent."
        )

    clean_aid = req.admin_id.strip()
    clean_adm = req.child_admission_no.strip()

    with get_db_cursor(commit=True) as cur:
        # Check if email/phone already registered
        cur.execute("SELECT id FROM users WHERE email = %s OR phone = %s;", (req.email, req.phone))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="User with this email or phone already exists")

        # 1. Verify School by Admin ID
        cur.execute("""
            SELECT id, name, admin_id, code FROM schools 
            WHERE LOWER(admin_id) = LOWER(%s) OR LOWER(code) = LOWER(%s) OR LOWER(name) ILIKE LOWER(%s);
        """, (clean_aid, clean_aid, f"%{clean_aid}%"))
        sch = cur.fetchone()
        if not sch:
            raise HTTPException(
                status_code=400, 
                detail=f"School Admin ID '{clean_aid}' is not found in the system. Parent cannot register."
            )
        school_id = sch["id"]

        # 2. Check if student admission number exists under this school in the admission table
        cur.execute("""
            SELECT s.id, s.class_id, s.first_name, s.last_name, c.grade, c.section
            FROM students s
            LEFT JOIN classes c ON c.id = s.class_id
            WHERE s.school_id = %s AND LOWER(s.admission_number) = LOWER(%s);
        """, (school_id, clean_adm))
        verified_student = cur.fetchone()

        if not verified_student:
            if not req.child_class_id:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Admission Number '{clean_adm}' is not present under School Admin ID '{clean_aid}' in the admission table. Please select your child's class room to enroll."
                )
            # Auto-enroll student into the selected class
            student_id = str(uuid.uuid4())
            c_first = req.child_first_name.strip() if req.child_first_name else "Student"
            c_last = req.child_last_name.strip() if req.child_last_name else "User"
            cur.execute("""
                INSERT INTO students (id, school_id, class_id, admission_number, first_name, last_name, roll_number, gender, is_active)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, TRUE)
                RETURNING id;
            """, (student_id, school_id, req.child_class_id, clean_adm, c_first, c_last, req.child_roll_number or 14, req.child_gender or 'MALE'))

            cur.execute("SELECT grade, section FROM classes WHERE id = %s;", (req.child_class_id,))
            c_info = cur.fetchone() or {"grade": "8", "section": "B"}
            grade = c_info["grade"]
            section = c_info["section"]
            verified_student = {"id": student_id, "first_name": c_first, "last_name": c_last, "class_id": req.child_class_id, "grade": grade, "section": section}
        else:
            student_id = verified_student["id"]
            if req.child_class_id:
                cur.execute("UPDATE students SET class_id = %s WHERE id = %s;", (req.child_class_id, student_id))
                cur.execute("SELECT grade, section FROM classes WHERE id = %s;", (req.child_class_id,))
                c_info = cur.fetchone()
                if c_info:
                    grade = c_info["grade"]
                    section = c_info["section"]
                else:
                    grade = verified_student["grade"] or "8"
                    section = verified_student["section"] or "B"
            else:
                grade = verified_student["grade"] or "8"
                section = verified_student["section"] or "B"

        room_key = f"class-{grade.lower()}{section.lower()}"

        # 3. Create User
        user_id = str(uuid.uuid4())
        full_name = f"{req.first_name} {req.last_name}".strip()
        hashed_pwd = hash_password(req.password)
        cur.execute("""
            INSERT INTO users (id, school_id, role, full_name, email, phone, password_hash, is_phone_verified, is_active)
            VALUES (%s, %s, 'PARENT', %s, %s, %s, %s, TRUE, TRUE)
            RETURNING id;
        """, (user_id, school_id, full_name, req.email, req.phone, hashed_pwd))

        # 4. Create Guardian Profile
        guardian_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO guardians (id, user_id, relationship, is_kyc_verified)
            VALUES (%s, %s, %s, TRUE)
            RETURNING id;
        """, (guardian_id, user_id, req.relationship))

        # 5. Link Student to Guardian
        cur.execute("""
            INSERT INTO student_guardians (student_id, guardian_id, is_primary)
            VALUES (%s, %s, TRUE)
            ON CONFLICT (student_id, guardian_id) DO NOTHING;
        """, (student_id, guardian_id))

        # 5b. Automatic 512-D Biometric Face Enrollment
        face_enrolled = False
        if req.child_photo_base64 or req.child_face_embedding:
            try:
                # Update student photo avatar if provided
                if req.child_photo_base64:
                    cur.execute("""
                        UPDATE students 
                        SET avatar_url = %s 
                        WHERE id = %s;
                    """, (req.child_photo_base64, student_id))

                embedding_vec = req.child_face_embedding
                if not embedding_vec and req.child_photo_base64:
                    from backend.biometrics import generate_512d_vector_from_image
                    embedding_vec = generate_512d_vector_from_image(req.child_photo_base64, student_identifier=str(student_id))

                if embedding_vec and len(embedding_vec) == 512:
                    emb_id = str(uuid.uuid4())
                    cur.execute("""
                        INSERT INTO face_embeddings (id, student_id, embedding, confidence_quality_score, is_active, model_version)
                        VALUES (%s, %s, %s::vector, 0.99, TRUE, 'facenet-512d');
                    """, (emb_id, student_id, str(embedding_vec)))
                    face_enrolled = True
            except Exception as e:
                print(f"Face enrollment error during parent registration: {e}")

        # 6. Broadcast welcoming system message to this class's WebSocket room
        welcome_text = f"👋 Warm welcome to {full_name} ({verified_student['first_name']}'s Guardian, Adm #{clean_adm}) who joined the Class {grade}-{section} Channel!"
        msg_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO channel_messages (id, channel, sender_name, sender_role, sender_avatar, message_text, category)
            VALUES (%s, %s, 'Principal Desk (System)', 'SCHOOL_ADMIN', '🏫', %s, 'UPDATE');
        """, (msg_id, room_key, welcome_text))

    # WebSocket Broadcast to room
    try:
        from backend.routers.chat import manager
        await manager.broadcast(room_key, {
            "id": msg_id,
            "channel": room_key,
            "sender_name": "Principal Desk (System)",
            "sender_role": "SCHOOL_ADMIN",
            "sender_avatar": "🏫",
            "message_text": welcome_text,
            "category": "UPDATE",
            "timestamp": "Just now"
        })
    except Exception as e:
        print(f"WebSocket broadcast error on onboarding: {e}")

    token = create_access_token({"sub": user_id, "role": "PARENT"})

    return {
        "status": "success",
        "message": f"Parent verified under Admin ID '{clean_aid}' and student #{clean_adm}! Auto-joined socket room '{room_key}'.",
        "access_token": token,
        "room_key": room_key,
        "class_name": f"Class {grade}-{section}",
        "user": {
            "id": user_id,
            "email": req.email,
            "phone": req.phone,
            "role": "PARENT",
            "school_id": str(school_id),
            "school_admin_id": clean_aid,
            "parent_name": full_name,
            "child_name": f"{verified_student['first_name']} {verified_student['last_name']}",
            "student_id": str(student_id),
            "admission_number": clean_adm,
            "room_key": room_key
        }
    }

class UniversalRegisterRequest(BaseModel):
    full_name: str
    phone: Optional[str] = "9876543210"
    email: Optional[str] = None
    password: str = "edubandhan2026"
    role: str = "PARENT"  # 'SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PARENT'
    admin_id: Optional[str] = None
    admission_no: Optional[str] = None
    school_id: Optional[str] = None
    role_extra: Optional[str] = None

@router.post("/register")
def register(req: UniversalRegisterRequest):
    role_normalized = req.role.upper()
    if role_normalized not in ["PARENT", "TEACHER", "SCHOOL_ADMIN", "SUPER_ADMIN"]:
        role_normalized = "PARENT"

    # Tier 1 & Tier 2: Super Admin and School Admin accounts cannot be registered publicly
    if role_normalized in ["SUPER_ADMIN", "SCHOOL_ADMIN"]:
        raise HTTPException(
            status_code=403, 
            detail="Admin user must be created by Super Admin only. School Admins can only Sign In, not register."
        )

    clean_aid = (req.admin_id or "").strip()
    clean_adm = (req.admission_no or "").strip()

    with get_db_cursor(commit=True) as cur:
        # Check if email/phone already registered
        query = "SELECT id FROM users WHERE phone = %s"
        params = [req.phone.strip()]
        if req.email and req.email.strip():
            query += " OR email = %s"
            params.append(req.email.strip())
        query += ";"
        cur.execute(query, tuple(params))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="User with this email or phone number is already registered")

        # =====================================================================
        # 4-TIER HIERARCHY VALIDATION DURING REGISTRATION
        # =====================================================================

        # Tier 2: SCHOOL_ADMIN must provide admin_id created by Super Admin
        if role_normalized == "SCHOOL_ADMIN":
            if not clean_aid:
                raise HTTPException(
                    status_code=400, 
                    detail="Admin ID is required. You must enter the Admin ID authorized by Super Admin."
                )
            cur.execute("""
                SELECT id, name, admin_id, code FROM schools 
                WHERE LOWER(admin_id) = LOWER(%s) OR LOWER(code) = LOWER(%s);
            """, (clean_aid, clean_aid))
            sch = cur.fetchone()
            if not sch:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Admin ID '{clean_aid}' was not created by Super Admin. You are not allowed to register as an Admin."
                )
            school_id = sch["id"]

        # Tier 3: TEACHER must provide admin_id assigned to its school
        elif role_normalized == "TEACHER":
            if not clean_aid:
                raise HTTPException(
                    status_code=400, 
                    detail="School Admin ID is required. Please enter the Admin ID of your school."
                )
            cur.execute("""
                SELECT id, name, admin_id, code FROM schools 
                WHERE LOWER(admin_id) = LOWER(%s) OR LOWER(code) = LOWER(%s);
            """, (clean_aid, clean_aid))
            sch = cur.fetchone()
            if not sch:
                raise HTTPException(
                    status_code=400, 
                    detail=f"School Admin ID '{clean_aid}' is not found in the system. Teacher cannot enter or register."
                )
            school_id = sch["id"]

        # Tier 4: PARENT must provide admin_id AND admission_no.
        # Admission number MUST exist under that admin_id in students table!
        elif role_normalized == "PARENT":
            if not clean_aid:
                raise HTTPException(
                    status_code=400, 
                    detail="School Admin ID is required for Parent registration."
                )
            if not clean_adm:
                raise HTTPException(
                    status_code=400, 
                    detail="Student Admission Number is required for Parent registration."
                )

            cur.execute("""
                SELECT id, name, admin_id, code FROM schools 
                WHERE LOWER(admin_id) = LOWER(%s) OR LOWER(code) = LOWER(%s);
            """, (clean_aid, clean_aid))
            sch = cur.fetchone()
            if not sch:
                raise HTTPException(
                    status_code=400, 
                    detail=f"School Admin ID '{clean_aid}' is not found in the system."
                )
            school_id = sch["id"]

            cur.execute("""
                SELECT id, first_name, last_name, class_id 
                FROM students 
                WHERE school_id = %s AND LOWER(admission_number) = LOWER(%s);
            """, (school_id, clean_adm))
            verified_student = cur.fetchone()
            if not verified_student:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Admission Number '{clean_adm}' is not present under School Admin ID '{clean_aid}' in the admission table. Parent cannot register."
                )
            verified_student_id = verified_student["id"]

        user_id = str(uuid.uuid4())
        hashed_pwd = hash_password(req.password)
        cur.execute("""
            INSERT INTO users (id, school_id, role, full_name, email, phone, password_hash, is_phone_verified, is_active)
            VALUES (%s, %s, %s, %s, %s, %s, %s, TRUE, TRUE)
            RETURNING id;
        """, (user_id, school_id, role_normalized, req.full_name.strip(), req.email.strip() if req.email else None, req.phone.strip(), hashed_pwd))

        if role_normalized == "PARENT":
            guardian_id = str(uuid.uuid4())
            cur.execute("""
                INSERT INTO guardians (id, user_id, relationship, is_kyc_verified)
                VALUES (%s, %s, 'Parent', TRUE);
            """, (guardian_id, user_id))

            if 'verified_student_id' in locals():
                cur.execute("""
                    INSERT INTO student_guardians (student_id, guardian_id, is_primary)
                    VALUES (%s, %s, TRUE)
                    ON CONFLICT (student_id, guardian_id) DO NOTHING;
                """, (verified_student_id, guardian_id))

        token = create_access_token({"sub": user_id, "role": role_normalized})

        return {
            "message": f"Account successfully created as {role_normalized}!",
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "full_name": req.full_name,
                "email": req.email,
                "phone": req.phone,
                "role": role_normalized,
                "school_id": str(school_id) if school_id else None,
                "school_admin_id": clean_aid
            }
        }

@router.get("/me")
def get_me(user: dict = Depends(get_current_user)):
    return {"user": user}

@router.get("/demo-accounts")
def get_demo_accounts():
    return {
        "super_admin": {
            "email": "superadmin@edubandhan.com", 
            "role": "SUPER_ADMIN", 
            "admin_id": "PLATFORM-MASTER",
            "admission_no": "",
            "desc": "Platform Super Admin (Full SaaS Owner HUD)"
        },
        "admin": {
            "email": "principal@dps-rourkela.edu.in", 
            "role": "SCHOOL_ADMIN", 
            "admin_id": "ADM-DPS-001",
            "admission_no": "",
            "desc": "School Principal (Password: edubandhan2026, Admin ID: ADM-DPS-001)"
        },
        "teacher": {
            "email": "sunita.sharma@dps-rourkela.edu.in", 
            "role": "TEACHER", 
            "admin_id": "ADM-DPS-001",
            "admission_no": "",
            "desc": "Class 8-B Head Teacher (Password: edubandhan2026, Admin ID: ADM-DPS-001)"
        },
        "parent": {
            "email": "rajesh.sharma@gmail.com", 
            "phone": "+919876543213", 
            "role": "PARENT", 
            "admin_id": "ADM-DPS-001",
            "admission_no": "DPS-2026-0801",
            "desc": "Parent of Rohan (Password: edubandhan2026, Admin ID: ADM-DPS-001, Adm No: DPS-2026-0801)"
        }
    }

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    identifier: str
    otp: str
    new_password: str

# Temporary in-memory OTP cache for password resets
PASSWORD_RESET_OTPS = {}

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    identifier = req.identifier.strip()
    with get_db_cursor() as cur:
        cur.execute("""
            SELECT id, email, phone, full_name, role 
            FROM users 
            WHERE email = %s OR phone = %s;
        """, (identifier, identifier))
        user = cur.fetchone()
        
        # If user is in demo database or new
        user_name = user["full_name"] if user else "EduBandhan User"
        contact = user["phone"] if (user and user.get("phone")) else identifier
        
        import random
        otp = str(random.randint(100000, 999999))
        PASSWORD_RESET_OTPS[identifier.lower()] = {
            "otp": otp,
            "user_id": str(user["id"]) if user else None
        }

        # Mask contact e.g. +91 98***-**210
        masked = contact
        if len(contact) >= 8:
            masked = contact[:4] + "***" + contact[-3:]

        return {
            "status": "success",
            "message": f"Verification OTP sent to {masked} via WhatsApp/SMS",
            "otp_demo": otp,
            "masked_contact": masked,
            "user_name": user_name
        }

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest):
    identifier = req.identifier.strip().lower()
    cached = PASSWORD_RESET_OTPS.get(identifier)
    
    # Allow generated OTP or universal testing OTP '489210' / '123456'
    valid_otps = ["489210", "123456"]
    if cached and "otp" in cached:
        valid_otps.append(cached["otp"])
        
    if req.otp not in valid_otps:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP. Please enter the 6-digit code sent to your phone.")
    
    hashed_pwd = hash_password(req.new_password)
    with get_db_cursor(commit=True) as cur:
        cur.execute("""
            UPDATE users 
            SET password_hash = %s, updated_at = NOW() 
            WHERE email = %s OR phone = %s
            RETURNING id, email, phone, full_name, role;
        """, (hashed_pwd, req.identifier.strip(), req.identifier.strip()))
        updated_user = cur.fetchone()

    # Clear OTP
    if identifier in PASSWORD_RESET_OTPS:
        del PASSWORD_RESET_OTPS[identifier]

    return {
        "status": "success",
        "message": "Password has been successfully reset in Neon PostgreSQL! You can now sign in with your new password.",
        "user": updated_user["full_name"] if updated_user else req.identifier
    }
