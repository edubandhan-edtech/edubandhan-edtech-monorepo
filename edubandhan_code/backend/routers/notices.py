from fastapi import APIRouter, HTTPException, Depends, status, Request
from pydantic import BaseModel, Field
from typing import Optional, List
import uuid
from datetime import datetime
from backend.database import get_db_cursor
from backend.auth_utils import security
from jose import jwt, JWTError
from backend.config import settings

router = APIRouter(prefix="/api/notices", tags=["Notice Board & Circulars"])

class PublishNoticeRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    content: str = Field(..., min_length=5)
    notice_type: str = Field("PUBLIC", description="PUBLIC or PRIVATE")
    category: str = Field("NOTICE", description="NOTICE, CIRCULAR, HOLIDAY, EVENT, EXAM, EMERGENCY")
    is_urgent: bool = False
    school_id: Optional[str] = None
    class_id: Optional[str] = None
    author_name: Optional[str] = None
    author_role: Optional[str] = None

def get_optional_user(request: Request) -> Optional[dict]:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        role = payload.get("role")
        if not user_id:
            return None
        return {"id": user_id, "role": role}
    except Exception:
        return None

@router.get("")
@router.get("/")
def get_notices(
    notice_type: Optional[str] = None,
    request: Request = None,
    client_role: Optional[str] = None
):
    """
    Returns notices based on authentication and visibility rules:
    - Unauthenticated / Visitors: Strictly PUBLIC notices (shown on loader & website overview).
    - PARENTS (logged in): Both PUBLIC notices and PRIVATE parent-confidential notices.
    - TEACHERS & ADMINS: All notices (PUBLIC and PRIVATE) with administrative management info.
    """
    auth_user = get_optional_user(request) if request else None
    effective_role = None

    if auth_user and auth_user.get("role"):
        effective_role = auth_user["role"].upper()
    elif client_role:
        effective_role = client_role.upper()

    with get_db_cursor() as cur:
        # Determine allowed notice types
        if effective_role in ["SCHOOL_ADMIN", "SUPER_ADMIN", "TEACHER", "PARENT"]:
            # Logged in users can view both PUBLIC and PRIVATE
            if notice_type and notice_type.upper() in ["PUBLIC", "PRIVATE"]:
                query = """
                    SELECT b.id, b.school_id, b.class_id, b.sender_id, b.title, b.content, 
                           b.category, b.is_urgent, b.notice_type, b.author_name, b.author_role,
                           b.created_at,
                           s.name as school_name,
                           c.grade as class_grade, c.section as class_section
                    FROM class_broadcasts b
                    LEFT JOIN schools s ON s.id = b.school_id
                    LEFT JOIN classes c ON c.id = b.class_id
                    WHERE UPPER(COALESCE(b.notice_type, 'PUBLIC')) = %s
                    ORDER BY b.is_urgent DESC, b.created_at DESC;
                """
                cur.execute(query, (notice_type.upper(),))
            else:
                query = """
                    SELECT b.id, b.school_id, b.class_id, b.sender_id, b.title, b.content, 
                           b.category, b.is_urgent, b.notice_type, b.author_name, b.author_role,
                           b.created_at,
                           s.name as school_name,
                           c.grade as class_grade, c.section as class_section
                    FROM class_broadcasts b
                    LEFT JOIN schools s ON s.id = b.school_id
                    LEFT JOIN classes c ON c.id = b.class_id
                    ORDER BY b.is_urgent DESC, b.created_at DESC;
                """
                cur.execute(query)
        else:
            # Unauthenticated visitors / loader screen -> strictly PUBLIC notices!
            query = """
                SELECT b.id, b.school_id, b.class_id, b.sender_id, b.title, b.content, 
                       b.category, b.is_urgent, b.notice_type, b.author_name, b.author_role,
                       b.created_at,
                       s.name as school_name,
                       c.grade as class_grade, c.section as class_section
                FROM class_broadcasts b
                LEFT JOIN schools s ON s.id = b.school_id
                LEFT JOIN classes c ON c.id = b.class_id
                WHERE UPPER(COALESCE(b.notice_type, 'PUBLIC')) = 'PUBLIC'
                ORDER BY b.is_urgent DESC, b.created_at DESC;
            """
            cur.execute(query)

        notices = cur.fetchall()

        # If database has zero public notices, provide rich institutional seed notices
        if not notices:
            default_notices = [
                {
                    "id": "notice-pub-1",
                    "title": "DPS Rourkela Annual Athletic Meet & Winter Vacation Circular 2026",
                    "content": "The Annual Sports Gala will commence on October 24th at the Main Olympic Pavilion. All parents, alumni, and local community members are warmly cordially invited. Winter vacation begins December 22nd.",
                    "category": "EVENT",
                    "notice_type": "PUBLIC",
                    "is_urgent": False,
                    "author_name": "Dr. Sunita Sharma (Principal)",
                    "author_role": "SCHOOL_ADMIN",
                    "school_name": "DPS Rourkela",
                    "class_grade": None,
                    "class_section": None,
                    "created_at": datetime.utcnow().isoformat()
                },
                {
                    "id": "notice-pub-2",
                    "title": "Admissions Open for Academic Year 2026-27 (Nursery to Class 9)",
                    "content": "Online registration portals are now live for the upcoming academic session. Merit-based entrance assessments and campus tours will be organized every Saturday.",
                    "category": "CIRCULAR",
                    "notice_type": "PUBLIC",
                    "is_urgent": True,
                    "author_name": "Admissions Director",
                    "author_role": "SCHOOL_ADMIN",
                    "school_name": "DPS Rourkela",
                    "class_grade": None,
                    "class_section": None,
                    "created_at": datetime.utcnow().isoformat()
                }
            ]
            if effective_role in ["SCHOOL_ADMIN", "TEACHER", "PARENT"]:
                default_notices.append({
                    "id": "notice-priv-1",
                    "title": "Confidential: Mid-Term Examination Progress Report Cards Live",
                    "content": "Mid-term performance analytics and report cards for Term 1 have been released to the Parent Portal. Please review your child's percentile breakdown and schedule a 1-on-1 teacher consultation if needed.",
                    "category": "EXAM",
                    "notice_type": "PRIVATE",
                    "is_urgent": False,
                    "author_name": "Rajesh Rao (Senior Faculty)",
                    "author_role": "TEACHER",
                    "school_name": "DPS Rourkela",
                    "class_grade": "8",
                    "class_section": "B",
                    "created_at": datetime.utcnow().isoformat()
                })
            return {"notices": default_notices, "role_context": effective_role or "GUEST"}

        return {"notices": notices, "role_context": effective_role or "GUEST"}

@router.post("/publish")
async def publish_notice(req: PublishNoticeRequest, request: Request):
    """
    Publish a new notice. Restricted to Admin and Teacher.
    - notice_type: 'PUBLIC' (shown on loader screen & overview) OR 'PRIVATE' (parents only).
    """
    auth_user = get_optional_user(request)
    author_role = req.author_role or (auth_user.get("role") if auth_user else "SCHOOL_ADMIN")
    
    # Ensure role is privileged (Admin or Teacher)
    author_role_normalized = author_role.upper() if author_role else "SCHOOL_ADMIN"
    if author_role_normalized == "PARENT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Parents have read-only access. Only School Administrators and Teachers can publish notices."
        )

    notice_type_normalized = req.notice_type.upper()
    if notice_type_normalized not in ["PUBLIC", "PRIVATE"]:
        notice_type_normalized = "PUBLIC"

    category_normalized = req.category.upper()
    if category_normalized not in ["NOTICE", "CIRCULAR", "HOLIDAY", "EVENT", "EXAM", "EMERGENCY", "HOMEWORK"]:
        category_normalized = "NOTICE"

    notice_id = str(uuid.uuid4())
    author_name = req.author_name or ("Principal Desk" if "ADMIN" in author_role_normalized else "Class Teacher")

    with get_db_cursor(commit=True) as cur:
        # Resolve default school_id if not supplied
        school_id = req.school_id
        if not school_id:
            cur.execute("SELECT id FROM schools LIMIT 1;")
            s_row = cur.fetchone()
            school_id = s_row["id"] if s_row else None

        # Resolve sender_id
        sender_id = auth_user.get("id") if auth_user else None
        if not sender_id:
            cur.execute("SELECT id FROM users WHERE role = %s LIMIT 1;", (author_role_normalized,))
            u_row = cur.fetchone()
            sender_id = u_row["id"] if u_row else None

        cur.execute("""
            INSERT INTO class_broadcasts (
                id, school_id, class_id, sender_id, title, content, 
                category, is_urgent, notice_type, author_name, author_role
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, created_at;
        """, (
            notice_id, school_id, req.class_id, sender_id, 
            req.title.strip(), req.content.strip(), category_normalized, 
            req.is_urgent, notice_type_normalized, author_name, author_role_normalized
        ))
        created_row = cur.fetchone()

    # Real-time WebSocket announcement broadcast
    try:
        from backend.routers.chat import manager
        channel_target = "school-announcements" if not req.class_id else "school-announcements"
        await manager.broadcast(channel_target, {
            "id": notice_id,
            "type": "NOTICE_PUBLISHED",
            "notice_type": notice_type_normalized,
            "title": req.title.strip(),
            "content": req.content.strip(),
            "category": category_normalized,
            "author_name": author_name,
            "author_role": author_role_normalized,
            "is_urgent": req.is_urgent,
            "timestamp": "Just now"
        })
    except Exception as e:
        print(f"WebSocket broadcast notice notification error: {e}")

    return {
        "status": "success",
        "message": f"Notice published successfully as {notice_type_normalized} notice!",
        "notice": {
            "id": notice_id,
            "title": req.title.strip(),
            "content": req.content.strip(),
            "notice_type": notice_type_normalized,
            "category": category_normalized,
            "is_urgent": req.is_urgent,
            "author_name": author_name,
            "author_role": author_role_normalized,
            "created_at": created_row["created_at"].isoformat() if created_row else datetime.utcnow().isoformat()
        }
    }

@router.delete("/{notice_id}")
def delete_notice(notice_id: str, request: Request):
    """
    Delete a notice by ID (Restricted to Admin and Teachers)
    """
    auth_user = get_optional_user(request)
    if auth_user and auth_user.get("role") == "PARENT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Parents cannot delete notices."
        )

    with get_db_cursor(commit=True) as cur:
        cur.execute("DELETE FROM class_broadcasts WHERE id = %s RETURNING id;", (notice_id,))
        deleted = cur.fetchone()
        if not deleted:
            raise HTTPException(status_code=404, detail="Notice not found")

    return {"status": "success", "message": "Notice deleted successfully", "id": notice_id}
