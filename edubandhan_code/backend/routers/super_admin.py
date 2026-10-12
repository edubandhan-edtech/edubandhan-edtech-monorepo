from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional, List
import uuid
from backend.database import get_db_cursor
from backend.auth_utils import hash_password, get_current_user

router = APIRouter(prefix="/api/super-admin", tags=["Super Admin Platform Management"])

class CreateSchoolAdminRequest(BaseModel):
    school_name: str
    admin_id: str  # Unique Admin ID created by Super Admin e.g. "ADM-DPS-002"
    principal_name: str
    contact_email: str
    contact_phone: str
    city: str = "Rourkela"
    state: str = "Odisha"
    code: Optional[str] = None
    password: Optional[str] = "edubandhan2026"

@router.get("/stats")
def get_platform_stats():
    """Returns platform-wide metrics for the Super Admin tier."""
    with get_db_cursor() as cur:
        cur.execute("SELECT count(*) FROM schools;")
        total_schools = cur.fetchone()["count"]

        cur.execute("SELECT count(*) FROM users WHERE role = 'SCHOOL_ADMIN';")
        total_admins = cur.fetchone()["count"]

        cur.execute("SELECT count(*) FROM users WHERE role = 'TEACHER';")
        total_teachers = cur.fetchone()["count"]

        cur.execute("SELECT count(*) FROM students;")
        total_students = cur.fetchone()["count"]

        cur.execute("SELECT count(*) FROM users WHERE role = 'PARENT';")
        total_parents = cur.fetchone()["count"]

        cur.execute("SELECT coalesce(sum(total_amount), 0) FROM fee_invoices WHERE payment_status = 'PAID';")
        total_fees = cur.fetchone()["coalesce"]

        return {
            "total_schools": total_schools,
            "total_admins": total_admins,
            "total_teachers": total_teachers,
            "total_students": total_students,
            "total_parents": total_parents,
            "platform_escrow_volume": float(total_fees),
            "system_health": "100% Operational (Neon PostgreSQL + pgvector)"
        }

@router.get("/schools")
def list_schools_and_admins():
    """Lists all schools and their authorized Admin IDs created by Super Admin."""
    with get_db_cursor() as cur:
        cur.execute("""
            SELECT s.id, s.name as school_name, s.code, s.admin_id, s.city, s.state, 
                   s.contact_email, s.contact_phone, s.created_at, s.is_active,
                   (SELECT count(*) FROM users u WHERE u.school_id = s.id AND u.role = 'TEACHER') as teacher_count,
                   (SELECT count(*) FROM students st WHERE st.school_id = s.id) as student_count,
                   (SELECT full_name FROM users u WHERE u.school_id = s.id AND u.role = 'SCHOOL_ADMIN' LIMIT 1) as principal_name,
                   (SELECT email FROM users u WHERE u.school_id = s.id AND u.role = 'SCHOOL_ADMIN' LIMIT 1) as principal_email
            FROM schools s
            ORDER BY s.created_at DESC;
        """)
        schools = cur.fetchall()
        return {"schools": schools}

@router.post("/create-school-admin")
def create_school_admin(req: CreateSchoolAdminRequest):
    """
    Tier 1 Super Admin action:
    Creates a new school and its authorized unique Admin ID.
    If the Admin ID is not created here, the Admin cannot register or sign in.
    """
    clean_admin_id = req.admin_id.strip().upper()
    if not clean_admin_id:
        raise HTTPException(status_code=400, detail="Admin ID cannot be empty.")

    code = (req.code or clean_admin_id.replace("ADM-", "").replace("ADMIN-", "")).strip().upper()

    with get_db_cursor(commit=True) as cur:
        # Check if admin_id or code already exists
        cur.execute("""
            SELECT id, name FROM schools 
            WHERE LOWER(admin_id) = LOWER(%s) OR LOWER(code) = LOWER(%s);
        """, (clean_admin_id, code))
        if cur.fetchone():
            raise HTTPException(
                status_code=400, 
                detail=f"An administrator or school with Admin ID '{clean_admin_id}' or Code '{code}' already exists."
            )

        # 1. Create School Record
        school_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO schools (
                id, code, admin_id, name, city, state, contact_email, contact_phone, 
                morning_cutoff_time, saas_tier, is_active, created_by_super_admin
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, '08:30:00', 'STANDARD_TIER', TRUE, TRUE)
            RETURNING id;
        """, (
            school_id, code, clean_admin_id, req.school_name.strip(), 
            req.city.strip(), req.state.strip(), req.contact_email.strip(), req.contact_phone.strip()
        ))

        # 2. Check if user already exists
        cur.execute("SELECT id FROM users WHERE email = %s OR phone = %s;", (req.contact_email.strip(), req.contact_phone.strip()))
        existing_user = cur.fetchone()

        user_id = str(uuid.uuid4())
        hashed_pwd = hash_password(req.password or "edubandhan2026")

        if existing_user:
            # Update user to be school admin of this newly created school
            cur.execute("""
                UPDATE users 
                SET school_id = %s, role = 'SCHOOL_ADMIN', full_name = %s, password_hash = %s
                WHERE id = %s;
            """, (school_id, req.principal_name.strip(), hashed_pwd, existing_user["id"]))
            user_id = existing_user["id"]
        else:
            # Insert initial School Admin
            cur.execute("""
                INSERT INTO users (
                    id, school_id, role, full_name, email, phone, password_hash, is_phone_verified, is_active
                )
                VALUES (%s, %s, 'SCHOOL_ADMIN', %s, %s, %s, %s, TRUE, TRUE)
                RETURNING id;
            """, (
                user_id, school_id, req.principal_name.strip(), 
                req.contact_email.strip(), req.contact_phone.strip(), hashed_pwd
            ))

        return {
            "status": "success",
            "message": f"School '{req.school_name}' and Admin ID '{clean_admin_id}' successfully created and authorized by Super Admin!",
            "school": {
                "id": school_id,
                "school_name": req.school_name,
                "admin_id": clean_admin_id,
                "code": code,
                "principal_name": req.principal_name,
                "email": req.contact_email,
                "phone": req.contact_phone
            }
        }
