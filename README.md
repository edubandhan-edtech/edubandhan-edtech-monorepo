# EduBandhan (एडूबंधन) — Project Workspace

> **The Sacred Bond Connecting Child, Parent & School**  
> Multi-Tenant AI Smart School Ecosystem • Kiosk Attendance • Facial Verification • Real-Time Parent HUD

---

## 📁 Repository Structure

```text
edubandhan/
│
├── run.py                 # 🚀 Single Master Entry Point (Launch entire project)
├── start.bat              # Windows double-click launcher
├── start.ps1              # PowerShell launcher
├── README.md              # Project overview & quickstart
│
└── edubandhan_code/       # 📦 Complete EduBandhan Source Code & Assets
    ├── backend/           # FastAPI backend routers, config & database logic
    │   ├── routers/       # auth, admin, kiosk, parent, teacher, chat routers
    │   ├── auth_utils.py  # JWT & role-based access control
    │   ├── config.py      # App settings & environment loader
    │   ├── database.py    # Neon PostgreSQL connection pooling
    │   └── main.py        # ASGI application definition & static mounting
    │
    ├── edubandhan_app.html # Interactive Frontend Web HUD (Light/Dark Hybrid)
    ├── migrate.py         # Automated database migration & vector validation
    ├── schema.sql         # Database tables, pgvector extensions & seed data
    ├── requirements.txt   # Python package dependencies
    ├── .env               # Database & JWT environment configurations
    ├── Dockerfile         # Containerized production deployment
    ├── docker-compose.yml # Docker Compose service configuration
    └── run.py             # Internal single entry point
```

---

## ⚡ Quick Start (Single Entry Point)

To start the entire EduBandhan ecosystem (backend APIs + interactive Web UI + docs):

### Option 1: Using Python
```bash
python run.py
```

### Option 2: Windows Batch / PowerShell
```cmd
start.bat
```
or in PowerShell:
```powershell
.\start.ps1
```

---

## 🌐 Endpoints & Access URLs

Once launched, access the following in your web browser:

| Interface | URL | Description |
| :--- | :--- | :--- |
| **EduBandhan Web UI** | `http://localhost:8000/web-api/edubandhan_ui` | Primary Frontend Single-Page Application |
| **Root Portal** | `http://localhost:8000` | Full Web HUD (Admin, Kiosk, Parent & Teacher) |
| **Interactive API Docs** | `http://localhost:8000/docs` | Swagger UI API Explorer & Testing |
| **Alternative API Docs** | `http://localhost:8000/redoc` | ReDoc Documentation |
| **Health Check** | `http://localhost:8000/api/health` | Service and Neon pgvector status |

---

## ⚙️ Advanced CLI Options

You can pass optional arguments to `run.py`:

```bash
# Run database migrations before starting
python run.py --migrate

# Start on custom port without opening browser automatically
python run.py --port 8080 --no-browser

# Start with auto-reload disabled
python run.py --no-reload
```
