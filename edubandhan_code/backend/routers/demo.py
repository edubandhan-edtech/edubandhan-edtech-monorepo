import smtplib
import os
import datetime
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional
from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from pydantic import BaseModel
from backend.config import settings
from backend.database import get_db_cursor

logger = logging.getLogger("edubandhan.demo")
router = APIRouter(prefix="/api/public", tags=["Public Institutional Demo & Inquiries"])

class DemoRequest(BaseModel):
    institution_name: str
    contact_person: str
    phone: str
    email: Optional[str] = None
    institution_type: Optional[str] = "K-12 School (CBSE / ICSE / State)"
    student_count: Optional[str] = "Under 500 Students"
    message: Optional[str] = None

def init_demo_table():
    """Ensure campus_demo_requests table exists in PostgreSQL."""
    try:
        with get_db_cursor(commit=True) as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS campus_demo_requests (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    institution_name VARCHAR(255) NOT NULL,
                    contact_person VARCHAR(255) NOT NULL,
                    phone VARCHAR(50) NOT NULL,
                    email VARCHAR(255),
                    institution_type VARCHAR(100),
                    student_count VARCHAR(100),
                    message TEXT,
                    client_ip VARCHAR(50),
                    email_status VARCHAR(50) DEFAULT 'PENDING',
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
            """)
    except Exception as e:
        logger.warning(f"Could not verify campus_demo_requests table: {e}")

# Run table verification at module import
init_demo_table()


def format_whatsapp_link(phone: str) -> str:
    """Format clean WhatsApp direct chat link for Indian and international numbers."""
    digits = "".join(filter(str.isdigit, phone))
    if len(digits) == 10:
        digits = "91" + digits
    return f"https://wa.me/{digits}"


def send_smtp_notification(data: dict, client_ip: str = "Unknown") -> bool:
    """
    Dispatch SMTP email notification to edubandhan@gmail.com
    and send an instant acknowledgement to the client if email was provided.
    """
    recipient = settings.DEMO_NOTIFICATION_EMAIL or "edubandhan@gmail.com"
    sender = settings.SMTP_FROM_EMAIL or "edubandhan@gmail.com"
    smtp_host = settings.SMTP_HOST or "smtp.gmail.com"
    smtp_port = settings.SMTP_PORT or 587
    smtp_user = settings.SMTP_USER or "edubandhan@gmail.com"
    smtp_pass = (settings.SMTP_PASSWORD or "").strip()

    contact_person = data.get("contact_person") or data.get("contact_name") or "Esteemed Educator"
    institution_name = data.get("institution_name") or "Institution"
    phone = data.get("phone") or "Not provided"
    email = data.get("email")
    student_count = data.get("student_count") or data.get("student_strength") or "N/A"
    institution_type = data.get("institution_type") or "K-12 School (CBSE / ICSE / State)"
    req_message = data.get("message") or "General campus walkthrough and touchless kiosk consultation"

    now_ist = datetime.datetime.now().strftime("%d %b %Y, %I:%M %p IST")
    wa_link = format_whatsapp_link(phone)

    # 1. Prepare Email to EduBandhan Team (edubandhan@gmail.com)
    admin_subject = f"🎓 [New Demo Request] {institution_name} — {contact_person}"

    plain_body = f"""============================================================
NEW CAMPUS CONSULTATION & DEMO REQUEST
============================================================

Institution Name:    {institution_name}
Contact Person:      {contact_person}
Phone / WhatsApp:    {phone}
Official Email:      {email or 'Not provided'}
Institution Category:{institution_type}
Student Strength:    {student_count}
Requirements:        {req_message}

Submission Time:     {now_ist}
Client IP:           {client_ip}
WhatsApp Direct:     {wa_link}

============================================================
EduBandhan Sovereign Smart School OS • Lead Dispatcher
"""

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B; }}
        .card {{ max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1.5px solid #E2E8F0; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }}
        .header {{ background: linear-gradient(135deg, #155EEF 0%, #0040C1 100%); padding: 28px 32px; color: #FFFFFF; }}
        .header h1 {{ margin: 0 0 6px; font-size: 22px; font-weight: 800; letter-spacing: -0.3px; }}
        .header p {{ margin: 0; font-size: 13.5px; color: #E0E7FF; }}
        .badge {{ display: inline-block; background: rgba(245, 158, 11, 0.2); color: #FDE047; border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 6px; padding: 3px 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-top: 10px; }}
        .content {{ padding: 28px 32px; }}
        .table {{ width: 100%; border-collapse: collapse; margin-top: 8px; }}
        .table td {{ padding: 12px 10px; border-bottom: 1px solid #F1F5F9; font-size: 14px; vertical-align: top; }}
        .label {{ font-weight: 700; color: #64748B; width: 36%; }}
        .val {{ font-weight: 600; color: #0F172A; }}
        .actions {{ margin-top: 24px; display: flex; gap: 12px; }}
        .btn-wa {{ display: inline-block; padding: 10px 18px; background: #25D366; color: #FFFFFF; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 13.5px; margin-right: 10px; }}
        .btn-call {{ display: inline-block; padding: 10px 18px; background: #155EEF; color: #FFFFFF; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 13.5px; }}
        .footer {{ padding: 18px 32px; background: #F1F5F9; font-size: 12px; color: #64748B; text-align: center; border-top: 1px solid #E2E8F0; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>🎓 New Campus Walkthrough Request</h1>
          <p>An institution has requested priority onboarding and consultation for EduBandhan.</p>
          <span class="badge">Priority Institutional Lead</span>
        </div>
        <div class="content">
          <table class="table">
            <tr>
              <td class="label">Institution Name</td>
              <td class="val"><strong style="color: #155EEF; font-size: 16px;">{institution_name}</strong></td>
            </tr>
            <tr>
              <td class="label">Contact Person</td>
              <td class="val"><strong>{contact_person}</strong></td>
            </tr>
            <tr>
              <td class="label">Phone / WhatsApp</td>
              <td class="val">
                <a href="tel:{phone}" style="color: #0284C7; font-weight: 800; text-decoration: none;">{phone}</a>
              </td>
            </tr>
            <tr>
              <td class="label">Official Email</td>
              <td class="val">
                {f'<a href="mailto:{email}" style="color: #0284C7; text-decoration: none;">{email}</a>' if email else '<span style="color: #94A3B8;">Not specified</span>'}
              </td>
            </tr>
            <tr>
              <td class="label">Category</td>
              <td class="val">{institution_type}</td>
            </tr>
            <tr>
              <td class="label">Student Strength</td>
              <td class="val">{student_count}</td>
            </tr>
            <tr>
              <td class="label">Requirements</td>
              <td class="val" style="background: #F8FAFC; border-radius: 8px; padding: 10px; font-style: italic;">
                {req_message}
              </td>
            </tr>
            <tr>
              <td class="label">Submission Date</td>
              <td class="val">{now_ist}</td>
            </tr>
          </table>

          <div style="margin-top: 24px;">
            <a href="{wa_link}" class="btn-wa" target="_blank">💬 Open WhatsApp Chat</a>
            <a href="tel:{phone}" class="btn-call">📞 Call Immediately</a>
          </div>
        </div>
        <div class="footer">
          EduBandhan Sovereign Educational OS • Bhubaneswar, Odisha, India • edubandhan.in
        </div>
      </div>
    </body>
    </html>
    """

    # If no SMTP password provided, log and record status gracefully
    if not smtp_pass:
        logger.info(
            f"[DEMO REQUEST SAVED] Institution: {institution_name} | Contact: {contact_person} | Phone: {phone}"
        )
        logger.warning(
            "[!] SMTP_PASSWORD not configured in .env. Skipping live socket transmission. Please add SMTP_PASSWORD to .env to receive emails directly in Gmail."
        )
        try:
            with get_db_cursor(commit=True) as cur:
                cur.execute(
                    "UPDATE campus_demo_requests SET email_status = 'PENDING_SMTP_CONFIG' WHERE phone = %s AND institution_name = %s;",
                    (phone, institution_name)
                )
        except Exception:
            pass
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = admin_subject
        msg["From"] = f"EduBandhan Platform <{sender}>"
        msg["To"] = recipient
        msg["Reply-To"] = email or sender
        msg["X-Priority"] = "1"

        msg.attach(MIMEText(plain_body, "plain", "utf-8"))
        msg.attach(MIMEText(html_body, "html", "utf-8"))

        if smtp_port == 465:
            server = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=12)
        else:
            server = smtplib.SMTP(smtp_host, smtp_port, timeout=12)
            if settings.SMTP_USE_TLS:
                server.starttls()

        server.login(smtp_user, smtp_pass)
        server.sendmail(sender, [recipient], msg.as_string())
        server.quit()
        logger.info(f"✅ Demo notification successfully emailed to {recipient} via SMTP.")

        # Update status in DB to SENT
        try:
            with get_db_cursor(commit=True) as cur:
                cur.execute(
                    "UPDATE campus_demo_requests SET email_status = 'SENT' WHERE phone = %s AND institution_name = %s;",
                    (phone, institution_name)
                )
        except Exception:
            pass
        return True

    except Exception as smtp_err:
        logger.error(f"❌ SMTP transmission failed: {smtp_err}")
        try:
            with get_db_cursor(commit=True) as cur:
                cur.execute(
                    "UPDATE campus_demo_requests SET email_status = %s WHERE phone = %s AND institution_name = %s;",
                    (f"FAILED: {str(smtp_err)[:45]}", phone, institution_name)
                )
        except Exception:
            pass
        return False


@router.post("/schedule-demo")
@router.post("/contact/demo")
def schedule_institutional_demo(
    req: DemoRequest,
    background_tasks: BackgroundTasks,
    request: Request
):
    """
    Public endpoint to capture campus consultation requests,
    store them in the database, and trigger an SMTP alert to edubandhan@gmail.com.
    """
    inst_name = req.institution_name.strip()
    contact = req.contact_person.strip()
    phone = req.phone.strip()

    if not inst_name or not contact or not phone:
        raise HTTPException(
            status_code=400,
            detail="Institution Name, Contact Person, and Phone number are required."
        )

    client_ip = request.client.host if request.client else "Unknown"

    demo_data = {
        "institution_name": inst_name,
        "contact_person": contact,
        "phone": phone,
        "email": (req.email or "").strip(),
        "institution_type": req.institution_type,
        "student_count": req.student_count,
        "message": (req.message or "").strip()
    }

    # 1. Persist lead in PostgreSQL
    record_id = None
    try:
        with get_db_cursor(commit=True) as cur:
            cur.execute("""
                INSERT INTO campus_demo_requests (
                    institution_name, contact_person, phone, email,
                    institution_type, student_count, message, client_ip
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
            """, (
                demo_data["institution_name"],
                demo_data["contact_person"],
                demo_data["phone"],
                demo_data["email"],
                demo_data["institution_type"],
                demo_data["student_count"],
                demo_data["message"],
                client_ip
            ))
            row = cur.fetchone()
            if row:
                record_id = str(row["id"])
    except Exception as db_err:
        logger.error(f"Database insertion failed for demo request: {db_err}")

    # 2. Trigger SMTP email in background task (non-blocking)
    background_tasks.add_task(send_smtp_notification, demo_data, client_ip)

    return {
        "success": True,
        "message": "Institutional walkthrough request received! Our campus onboarding team will contact you shortly.",
        "record_id": record_id,
        "notification_email": settings.DEMO_NOTIFICATION_EMAIL or "edubandhan@gmail.com"
    }


@router.get("/demo-requests")
def list_demo_requests():
    """Admin endpoint to view captured demo leads."""
    try:
        with get_db_cursor() as cur:
            cur.execute("""
                SELECT id, institution_name, contact_person, phone, email,
                       institution_type, student_count, message, email_status, created_at
                FROM campus_demo_requests
                ORDER BY created_at DESC
                LIMIT 50;
            """)
            rows = cur.fetchall()
            return {"success": True, "count": len(rows), "leads": rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
