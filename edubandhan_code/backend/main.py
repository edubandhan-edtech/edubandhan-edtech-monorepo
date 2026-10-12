from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
import os
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from backend.routers import auth, admin, kiosk, parent, teacher, chat, notices, super_admin, hierarchy
from backend.config import settings

app = FastAPI(
    title="EduBandhan (एडूबंधन) — Master API",
    description="The Sacred Bond Connecting Child, Parent & School • Multi-Tenant AI Smart School Ecosystem",
    version="1.0.0"
)

# Enable CORS for local and cloud deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router)
app.include_router(super_admin.router)
app.include_router(admin.router)
app.include_router(hierarchy.router)
app.include_router(kiosk.router)
app.include_router(parent.router)
app.include_router(teacher.router)
app.include_router(chat.router)
app.include_router(chat.api_router)
app.include_router(notices.router)

# Mount current directory and React frontend build assets
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIST = os.path.join(BASE_DIR, "frontend", "dist")
FRONTEND_ASSETS = os.path.join(FRONTEND_DIST, "assets")

from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse

@app.get("/edubandhan_logo_dark.jpg")
@app.get("/assets/edubandhan_logo_dark.jpg")
@app.get("/web_app/edubandhan/edubandhan_logo_dark.jpg")
@app.get("/web_app/edubandhan/assets/edubandhan_logo_dark.jpg")
def get_logo():
    for candidate in [
        os.path.join(FRONTEND_DIST, "edubandhan_logo_dark.jpg"),
        os.path.join(FRONTEND_DIST, "assets", "edubandhan_logo_dark.jpg"),
        os.path.join(BASE_DIR, "edubandhan_logo_dark.jpg"),
        os.path.join(BASE_DIR, "assets", "edubandhan_logo_dark.jpg"),
        os.path.join(os.path.dirname(BASE_DIR), "edubandhan_logo_dark.jpg")
    ]:
        if os.path.exists(candidate):
            return FileResponse(candidate, media_type="image/jpeg")
    return FileResponse(os.path.join(BASE_DIR, "edubandhan_logo_dark.jpg"), media_type="image/jpeg")

@app.get("/favicon.svg")
@app.get("/web_app/edubandhan/favicon.svg")
def get_favicon():
    fav_path = os.path.join(FRONTEND_DIST, "favicon.svg")
    if os.path.exists(fav_path):
        return FileResponse(fav_path, media_type="image/svg+xml")
    return HTMLResponse(content="", status_code=404)

if os.path.exists(FRONTEND_ASSETS):
    app.mount("/web_app/edubandhan/assets", StaticFiles(directory=FRONTEND_ASSETS), name="web_app_assets")
    app.mount("/assets", StaticFiles(directory=FRONTEND_ASSETS), name="assets")
elif os.path.exists(os.path.join(BASE_DIR, "assets")):
    app.mount("/web_app/edubandhan/assets", StaticFiles(directory=os.path.join(BASE_DIR, "assets")), name="web_app_assets")
    app.mount("/assets", StaticFiles(directory=os.path.join(BASE_DIR, "assets")), name="assets")

from backend.database import get_db_cursor

@app.get("/api/health")
def health_check():
    try:
        with get_db_cursor() as cur:
            cur.execute("SELECT version(), current_database();")
            db_info = cur.fetchone()
            
            cur.execute("SELECT extversion FROM pg_extension WHERE extname = 'vector';")
            vec_info = cur.fetchone()
            
            cur.execute("SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';")
            table_count = cur.fetchone()["count"]

        return {
            "status": "healthy",
            "service": "EduBandhan AI Smart School Platform",
            "database": "Neon PostgreSQL (Connected Live)",
            "database_name": db_info["current_database"],
            "pgvector_version": vec_info["extversion"] if vec_info else "Not Installed",
            "active_tables_count": table_count,
            "version": "1.0.0"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "EduBandhan AI Smart School Platform",
            "database": "Neon PostgreSQL (Disconnected / Error)",
            "error_details": str(e),
            "version": "1.0.0"
        }

@app.get("/", response_class=HTMLResponse)
def serve_root():
    react_index = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.exists(react_index):
        return FileResponse(
            react_index, 
            media_type="text/html",
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        )
    html_path = os.path.join(BASE_DIR, "edubandhan_app.html")
    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>EduBandhan Backend API is Live</h1><p>Visit /docs for Swagger UI</p>")

@app.get("/web_app/edubandhan")
@app.get("/web_app/edubandhan/")
@app.get("/web_app/edubandhan/{full_path:path}")
def legacy_web_app_redirect(full_path: str = ""):
    target = f"/{full_path}" if full_path else "/"
    return RedirectResponse(url=target, status_code=301)

@app.get("/web-api/edubandhan_ui")
@app.get("/web-api/edubandhan_ui/")
def legacy_ui_redirect():
    return RedirectResponse(url="/", status_code=301)

CLIENT_TABS = {
    "organization", "super_admin", "admin", "teacher", "parent_hub",
    "management", "students", "fees", "kiosk", "sockets", "consultation",
    "leaves", "quiz", "aichat", "attendance_view", "overview", "parent"
}

@app.get("/{tab_name}", response_class=HTMLResponse)
def direct_tab_route(tab_name: str):
    if tab_name in CLIENT_TABS:
        react_index = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(react_index):
            return FileResponse(
                react_index, 
                media_type="text/html",
                headers={
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache",
                    "Expires": "0"
                }
            )
    raise HTTPException(status_code=404, detail="Page not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
