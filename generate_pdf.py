"""
EduBandhan — Production Deployment Guide PDF Generator
Creates a professional, publication-quality A4 PDF with custom styling,
tables, embedded diagram, and page numbering.
"""

import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image as PlatypusImage,
    Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# Dimensions
PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN = 40

class NumberedCanvas(canvas.Canvas):
    """Two-pass canvas to dynamically compute and render total page count."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))

        # Top Running Header (Pages > 1)
        if self._pageNumber > 1:
            self.drawString(MARGIN, PAGE_HEIGHT - 28, "EduBandhan — Master Production Deployment Guide")
            self.drawRightString(PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 28, "Custom Domain: www.edubandhan.in")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(MARGIN, PAGE_HEIGHT - 32, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 32)

        # Bottom Running Footer
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(MARGIN, 34, PAGE_WIDTH - MARGIN, 34)

        self.drawString(MARGIN, 22, "Confidential & Proprietary — EduBandhan Ecosystem Engineering 2026")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(PAGE_WIDTH - MARGIN, 22, page_str)
        self.restoreState()


def build_pdf(output_path: str):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN + 10,
        bottomMargin=MARGIN + 10
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    c_primary = colors.HexColor("#0f172a")      # Slate 900
    c_blue = colors.HexColor("#2563eb")         # Blue 600
    c_emerald = colors.HexColor("#059669")      # Emerald 600
    c_subtext = colors.HexColor("#475569")      # Slate 600
    c_border = colors.HexColor("#e2e8f0")       # Slate 200
    c_code_bg = colors.HexColor("#f8fafc")      # Slate 50

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=c_primary
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=c_subtext
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=c_primary,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=c_blue,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#1e293b")
    )

    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#0f172a")
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#1e293b")
    )

    table_cell_code = ParagraphStyle(
        'TableCellCode',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#1e293b")
    )

    story = []

    # ---------------------------------------------------------
    # Header Banner: Logo + Document Title
    # ---------------------------------------------------------
    logo_path = r"d:\edubandhan\edubandhan_logo_dark.jpg"
    logo_img = PlatypusImage(logo_path, width=54, height=54) if os.path.exists(logo_path) else None

    title_block = [
        Paragraph("EduBandhan — Master Production Deployment Guide", title_style),
        Spacer(1, 4),
        Paragraph("<b>Domain:</b> <font color='#2563eb'>www.edubandhan.in</font> &nbsp;|&nbsp; <b>Strategy:</b> Unified Single-Pod Monorepo &nbsp;|&nbsp; <b>Host:</b> Railway", subtitle_style),
    ]

    if logo_img:
        header_table = Table([[logo_img, title_block]], colWidths=[65, PAGE_WIDTH - 2 * MARGIN - 65])
        header_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ]))
        story.append(header_table)
    else:
        story.extend(title_block)

    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_blue, spaceBefore=4, spaceAfter=12))

    # ---------------------------------------------------------
    # Executive Summary
    # ---------------------------------------------------------
    story.append(Paragraph("1. Executive Summary & Architecture Overview", h1_style))
    story.append(Paragraph(
        "EduBandhan adopts a <b>Unified Single-Container Monorepo Architecture</b> (Option 1). Both the React 19 Frontend and the FastAPI Backend reside within the same codebase and are built into a high-performance multi-stage Docker container deployed on <b>Railway</b>. The PostgreSQL database with the <code>pgvector</code> extension remains cloud-managed on <b>Neon</b> (AWS us-east-2).",
        body_style
    ))
    story.append(Spacer(1, 6))

    # Key Advantages Box
    adv_data = [
        [
            Paragraph("<b>• Zero CORS Friction</b><br/>Frontend uses relative paths (<code>/api/...</code>) because both frontend assets and API endpoints originate from the exact same domain.", table_cell),
            Paragraph("<b>• 24/7 WebSockets</b><br/>Railway persistent container keeps live chat channels and kiosk attendance feeds active without serverless disconnects.", table_cell),
            Paragraph("<b>• Single SSL & Domain</b><br/>One domain (<code>www.edubandhan.in</code>) serves all dashboards, APIs, and kiosk HUDs under one TLS certificate.", table_cell)
        ]
    ]
    adv_table = Table(adv_data, colWidths=[(PAGE_WIDTH - 2 * MARGIN) / 3] * 3)
    adv_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f1f5f9")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(adv_table)
    story.append(Spacer(1, 12))

    # ---------------------------------------------------------
    # Architecture Diagram Image
    # ---------------------------------------------------------
    story.append(Paragraph("2. Visual Deployment Dataflow", h1_style))
    diag_path = r"C:\Users\lokesh.debta\.gemini\antigravity-ide\brain\cd5e3ba2-91c6-4b7d-98bd-9dac4353338c\deployment_architecture_diagram_1791798738408.jpg"
    if os.path.exists(diag_path):
        # Scale to fit printable width nicely (aspect ratio 16:9)
        diag_w = PAGE_WIDTH - 2 * MARGIN
        diag_h = diag_w * (9.0 / 16.0)
        img_flowable = PlatypusImage(diag_path, width=diag_w, height=diag_h)
        story.append(img_flowable)
        story.append(Spacer(1, 4))
        story.append(Paragraph("<i>Figure 1: End-to-End Traffic Routing from Domain Registrar through Railway Container to Neon Cloud & Groq AI.</i>", ParagraphStyle('Caption', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=7.5, textColor=c_subtext, alignment=1)))
    
    story.append(Spacer(1, 14))

    # ---------------------------------------------------------
    # Page Break for Clean Layout
    # ---------------------------------------------------------
    story.append(PageBreak())

    # ---------------------------------------------------------
    # Environment Variables Configuration
    # ---------------------------------------------------------
    story.append(Paragraph("3. Production Environment Secrets Matrix", h1_style))
    story.append(Paragraph(
        "Copy and paste these exact environment variables into your <b>Railway Project Dashboard &gt; Service &gt; Variables &gt; Raw Editor</b>:",
        body_style
    ))
    story.append(Spacer(1, 6))

    env_rows = [
        [Paragraph("Variable Key", table_header), Paragraph("Recommended Production Value", table_header), Paragraph("Description & Impact", table_header)],
        [
            Paragraph("PORT", table_cell_code),
            Paragraph("8000", table_cell_code),
            Paragraph("Unified server listening port", table_cell)
        ],
        [
            Paragraph("DATABASE_URL", table_cell_code),
            Paragraph("postgresql://neondb_owner:***@ep-***-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require", table_cell_code),
            Paragraph("Neon pooled connection URL for high-concurrency requests", table_cell)
        ],
        [
            Paragraph("DIRECT_URL", table_cell_code),
            Paragraph("postgresql://neondb_owner:***@ep-***.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require", table_cell_code),
            Paragraph("Direct non-pooled connection URL for DDL/schema migrations", table_cell)
        ],
        [
            Paragraph("APP_ENV", table_cell_code),
            Paragraph("production", table_cell_code),
            Paragraph("Production runtime mode (disables debug leak)", table_cell)
        ],
        [
            Paragraph("JWT_SECRET", table_cell_code),
            Paragraph("edubandhan_super_secret_jwt_key_2026_change_in_production", table_cell_code),
            Paragraph("Cryptographic secret for signing auth session tokens", table_cell)
        ],
        [
            Paragraph("ALGORITHM", table_cell_code),
            Paragraph("HS256", table_cell_code),
            Paragraph("JWT token hashing algorithm", table_cell)
        ],
        [
            Paragraph("ACCESS_TOKEN_EXPIRE_MINUTES", table_cell_code),
            Paragraph("43200", table_cell_code),
            Paragraph("Session expiry duration (43,200 min = 30 days)", table_cell)
        ],
        [
            Paragraph("PLATFORM_FEE_PERCENTAGE", table_cell_code),
            Paragraph("20", table_cell_code),
            Paragraph("School SaaS billing transaction fee percentage", table_cell)
        ],
        [
            Paragraph("FACE_SIMILARITY_THRESHOLD", table_cell_code),
            Paragraph("0.85", table_cell_code),
            Paragraph("pgvector cosine similarity cutoff for kiosk facial match", table_cell)
        ],
        [
            Paragraph("CUTOFF_TIME", table_cell_code),
            Paragraph("08:30:00", table_cell_code),
            Paragraph("Morning school attendance cutoff timestamp", table_cell)
        ],
        [
            Paragraph("GROQ_API_KEY", table_cell_code),
            Paragraph("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", table_cell_code),
            Paragraph("API key for AI Doubt Solver & Parent Teaching Guides", table_cell)
        ],
        [
            Paragraph("GROQ_MODEL", table_cell_code),
            Paragraph("qwen/qwen3.8-27b", table_cell_code),
            Paragraph("Low-latency instruction-tuned model for school AI", table_cell)
        ],
    ]

    col_widths = [140, 200, PAGE_WIDTH - 2 * MARGIN - 340]
    env_table = Table(env_rows, colWidths=col_widths, repeatRows=1)
    env_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_primary),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(env_table)
    story.append(Spacer(1, 14))

    # ---------------------------------------------------------
    # Railway Step-by-Step Deployment
    # ---------------------------------------------------------
    story.append(Paragraph("4. Step-by-Step Railway Deployment", h1_style))
    
    steps = [
        ("Step 1: Push Code to GitHub", "Ensure your local repository has the root <code>Dockerfile</code> and <code>.dockerignore</code>. From PowerShell run:<br/><code>git add . && git commit -m 'Production ready' && git push origin main</code>"),
        ("Step 2: Initialize Railway Project", "Log in to <b>railway.com</b> using GitHub. Click <b>+ New Project</b> &gt; <b>Deploy from GitHub repo</b> &gt; select <code>edubandhan</code>. Railway automatically detects your root multi-stage Dockerfile."),
        ("Step 3: Inject Environment Variables", "Navigate to your service box &gt; <b>Variables</b> tab &gt; click <b>Raw Editor</b> and paste the 12 production variables from Section 3. Click <b>Save</b>."),
        ("Step 4: Automatic Multi-Stage Container Build", "Railway builds the React frontend with Node 20, copies <code>dist/</code> into Python 3.11, starts FastAPI via <code>run.py</code>, and exposes port 8000. Build takes ~2-3 minutes.")
    ]

    for title, desc in steps:
        story.append(Paragraph(f"<b>{title}</b>", h2_style))
        story.append(Paragraph(desc, bullet_style))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # Domain Registrar & DNS Mapping (edubandhan.in)
    # ---------------------------------------------------------
    story.append(Paragraph("5. Custom Domain Configuration (edubandhan.in)", h1_style))
    story.append(Paragraph(
        "To link your purchased domain <b>edubandhan.in</b> to Railway with automatic SSL certification:",
        body_style
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("1. In Railway &gt; <b>Settings &gt; Networking &gt; Custom Domains</b>, add both <code>edubandhan.in</code> and <code>www.edubandhan.in</code>.", bullet_style))
    story.append(Paragraph("2. In your Domain Registrar (Hostinger / GoDaddy / Namecheap / Cloudflare), open <b>DNS Zone Editor</b> and add the following records:", bullet_style))
    story.append(Spacer(1, 6))

    dns_rows = [
        [Paragraph("Type", table_header), Paragraph("Name / Host", table_header), Paragraph("Value / Target / RDATA", table_header), Paragraph("TTL", table_header)],
        [
            Paragraph("CNAME", table_cell_code),
            Paragraph("www", table_cell_code),
            Paragraph("&lt;assigned-app&gt;.up.railway.app", table_cell_code),
            Paragraph("300 (or Auto)", table_cell)
        ],
        [
            Paragraph("ALIAS / A", table_cell_code),
            Paragraph("@ (root)", table_cell_code),
            Paragraph("&lt;assigned-app&gt;.up.railway.app (or Railway IP)", table_cell_code),
            Paragraph("300 (or Auto)", table_cell)
        ]
    ]

    dns_table = Table(dns_rows, colWidths=[70, 90, PAGE_WIDTH - 2 * MARGIN - 260, 100])
    dns_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_emerald),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(dns_table)
    story.append(Spacer(1, 14))

    # ---------------------------------------------------------
    # Verification & Health Check
    # ---------------------------------------------------------
    story.append(Paragraph("6. Post-Deployment Verification Checklist", h1_style))
    
    checkpoints = [
        ("Health Check Endpoint", "Navigate to <code>https://www.edubandhan.in/api/health</code>. You should receive HTTP 200 with <code>{\"status\":\"healthy\",\"database\":\"Neon PostgreSQL (Connected Live)\",\"pgvector_version\":\"0.8.0\"}</code>."),
        ("Web Portal & Navigation", "Open <code>https://www.edubandhan.in</code>. Ensure all modules (Organization Hierarchy, Teacher Portal, Parent Hub, School Admin) load cleanly without 404s."),
        ("Biometric Kiosk Attendance", "Open <code>https://www.edubandhan.in/kiosk</code>, scan a test face, and verify real-time cosine similarity matching against pgvector."),
        ("Real-time WebSockets", "Verify that announcements and live parent-teacher chat connect over <code>wss://www.edubandhan.in/ws/channel/...</code> without dropping.")
    ]

    for title, desc in checkpoints:
        story.append(Paragraph(f"• <b>{title}:</b> {desc}", bullet_style))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 14))

    # Sign-off box
    sign_data = [
        [Paragraph("<b>Status: PRODUCTION READY</b> &nbsp;|&nbsp; <b>Architecture: Option 1 Monorepo</b> &nbsp;|&nbsp; <b>Release: v1.0.0</b>", ParagraphStyle('Sign', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, textColor=c_primary, alignment=1))]
    ]
    sign_table = Table(sign_data, colWidths=[PAGE_WIDTH - 2 * MARGIN])
    sign_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#e0e7ff")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#6366f1")),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(sign_table)

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[+] Successfully generated PDF: {output_path}")

if __name__ == "__main__":
    out_pdf1 = r"d:\edubandhan\deployement_guide.pdf"
    out_pdf2 = r"d:\edubandhan\deployment_guide.pdf"
    build_pdf(out_pdf1)
    # Also save with standard spelling for safety
    import shutil
    shutil.copyfile(out_pdf1, out_pdf2)
    print(f"[+] Created mirror copy: {out_pdf2}")
