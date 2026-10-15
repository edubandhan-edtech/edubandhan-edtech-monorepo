"""
EduBandhan (एडूबंधन) — Master Single Entry Point
Launch the complete EduBandhan platform (FastAPI Backend, REST APIs, pgvector AI Services, and Web HUD) with one command.

Usage:
    python run.py
    python run.py --migrate
    python run.py --port 8000 --no-browser
"""

import sys
import os
import subprocess
import time
import argparse
import webbrowser
from pathlib import Path

# Fix terminal encoding for Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent
CODE_DIR = ROOT_DIR / "edubandhan_code" if (ROOT_DIR / "edubandhan_code").exists() else ROOT_DIR

# Ensure CODE_DIR is in python path
if str(CODE_DIR) not in sys.path:
    sys.path.insert(0, str(CODE_DIR))

BANNER = r"""
=============================================================================
  ███████╗██████╗ ██╗   ██╗██████╗  █████╗ ███╗   ██╗██████╗ ██╗  ██╗ █████╗ ███╗   ██╗
  ██╔════╝██╔══██╗██║   ██║██╔══██╗██╔══██╗████╗  ██║██╔══██╗██║  ██║██╔══██╗████╗  ██║
  █████╗  ██║  ██║██║   ██║██████╔╝███████║██╔██╗ ██║██║  ██║███████║███████║██╔██╗ ██║
  ██╔══╝  ██║  ██║██║   ██║██╔══██╗██╔══██║██║╚██╗██║██║  ██║██╔══██║██╔══██║██║╚██╗██║
  ███████╗██████╔╝╚██████╔╝██████╔╝██║  ██║██║ ╚████║██████╔╝██║  ██║██║  ██║██║ ╚████║
  ╚══════╝╚═════╝  ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
=============================================================================
              The Sacred Bond Connecting Child, Parent & Educational Organization
       AI Smart School Ecosystem • Kiosk Attendance • Facial Verification
=============================================================================
"""

def print_banner():
    print(BANNER)

def check_and_install_dependencies():
    """Verify essential packages are installed, prompt/install if missing."""
    req_file = CODE_DIR / "requirements.txt"
    if not req_file.exists():
        return

    required_packages = ["fastapi", "uvicorn", "psycopg2", "dotenv", "jose", "passlib"]
    missing = []
    
    for pkg in required_packages:
        try:
            if pkg == "dotenv":
                import dotenv
            elif pkg == "jose":
                import jose
            elif pkg == "psycopg2":
                import psycopg2
            else:
                __import__(pkg)
        except ImportError:
            missing.append(pkg)
            
    if missing:
        print(f"[*] Missing dependencies detected: {', '.join(missing)}")
        print(f"[*] Installing requirements from {req_file}...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", str(req_file)])
            print("[+] Dependencies installed successfully!\n")
        except Exception as e:
            print(f"[!] Warning: Could not auto-install dependencies: {e}")

def check_frontend_build(force_rebuild: bool = False):
    """Ensure React build in frontend/dist is up-to-date with frontend/src.
    If dist is missing OR any file in src/ was modified after dist/index.html was built,
    automatically runs 'npm run build' so developers NEVER have to run it manually."""
    frontend_dir = CODE_DIR / "frontend"
    src_dir = frontend_dir / "src"
    dist_dir = frontend_dir / "dist"
    index_file = dist_dir / "index.html"
    
    needs_rebuild = force_rebuild or not index_file.exists()
    
    # Check if any source file in src/ or public/ is newer than dist/index.html
    if not needs_rebuild and index_file.exists() and src_dir.exists():
        dist_mtime = index_file.stat().st_mtime
        for path in src_dir.rglob("*"):
            if path.is_file() and path.stat().st_mtime > dist_mtime:
                print(f"[*] Detected changes in '{path.name}', auto-compiling React frontend...")
                needs_rebuild = True
                break

    if needs_rebuild:
        print("[*] ⚙️ Building fresh React bundle into frontend/dist...")
        try:
            shell_cmd = "npm run build"
            subprocess.check_call(shell_cmd, shell=True, cwd=str(frontend_dir))
            print("[+] ✅ React Frontend updated successfully into frontend/dist!\n")
        except Exception as e:
            print(f"[!] Warning: Frontend auto-build failed ({e}). Run 'npm run build' inside {frontend_dir}.\n")
    else:
        print(f"[+] ✅ React Frontend distribution is up to date: {dist_dir}")

def ensure_port_available(port: int) -> int:
    """Ensure the target port is available. If occupied, cleanly terminates
    any stale process bound to that port or falls back to an open port."""
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        in_use = s.connect_ex(('127.0.0.1', port)) == 0
        if not in_use:
            return port

    print(f"[*] Port {port} is occupied. Attempting to free port from stale process...")
    freed = False
    if sys.platform == "win32":
        try:
            cmd = f'powershell -Command "(Get-NetTCPConnection -LocalPort {port} -ErrorAction SilentlyContinue).OwningProcess"'
            output = subprocess.check_output(cmd, shell=True, text=True).strip()
            pids = [int(p) for p in output.split() if p.isdigit()]
            for pid in pids:
                if pid > 0 and pid != os.getpid():
                    print(f"[*] Terminating conflicting process PID {pid} on port {port}...")
                    subprocess.run(f"taskkill /F /PID {pid}", shell=True, capture_output=True)
            time.sleep(1)
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
                freed = s2.connect_ex(('127.0.0.1', port)) != 0
        except Exception:
            pass

    if freed:
        print(f"[+] Successfully released port {port}!\n")
        return port
    else:
        for alt_port in range(port + 1, port + 10):
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s3:
                if s3.connect_ex(('127.0.0.1', alt_port)) != 0:
                    print(f"[+] Switched to available port {alt_port}.\n")
                    return alt_port
    return port

def run_database_migration():
    """Run database schema migration using migrate.py."""
    migrate_script = CODE_DIR / "migrate.py"
    if migrate_script.exists():
        print("[*] Running Database Migration & Seed script...")
        result = subprocess.run([sys.executable, str(migrate_script)], cwd=str(CODE_DIR))
        if result.returncode == 0:
            print("[+] Database migration completed successfully!\n")
        else:
            print("[!] Migration finished with warnings or errors. Check connection details.\n")

def open_browser(url: str, delay: float = 1.5):
    """Open browser in a non-blocking background thread."""
    def _open():
        time.sleep(delay)
        print(f"[*] Opening EduBandhan Portal in default browser: {url}")
        webbrowser.open(url)
    
    import threading
    threading.Thread(target=_open, daemon=True).start()

def verify_neon_connection():
    """Perform a live check to Neon PostgreSQL database."""
    print("[*] Verifying Neon PostgreSQL connection...")
    try:
        from backend.database import get_db_cursor
        with get_db_cursor() as cur:
            cur.execute("SELECT current_database(), version();")
            res = cur.fetchone()
            cur.execute("SELECT count(*) FROM students;")
            student_count = cur.fetchone()["count"]
            print(f"[+] Neon PostgreSQL Connected Successfully! (DB: '{res['current_database']}', Students: {student_count})")
    except Exception as e:
        print(f"[!]  Neon PostgreSQL Connection Warning: {e}")

def main():
    parser = argparse.ArgumentParser(description="EduBandhan (एडूबंधन) Master Unified Launcher")
    parser.add_argument("--host", default="0.0.0.0", help="Host address (default: 0.0.0.0)")
    parser.add_argument("--port", type=int, default=8000, help="Port to run server on (default: 8000)")
    parser.add_argument("--reload", action="store_true", default=True, help="Enable auto-reloading")
    parser.add_argument("--no-reload", action="store_false", dest="reload", help="Disable auto-reloading")
    parser.add_argument("--migrate", action="store_true", help="Run database migrations before launching")
    parser.add_argument("--build", action="store_true", help="Force rebuild of React frontend bundle before starting")
    parser.add_argument("--no-browser", action="store_true", help="Do not automatically open web browser")
    
    args = parser.parse_args()

    print_banner()
    
    # 1. Dependency check
    check_and_install_dependencies()

    # 2. Frontend bundle check (for single-pod / single-process deployment)
    check_frontend_build(force_rebuild=args.build)

    # 3. Port check
    args.port = ensure_port_available(args.port)

    # 4. Database migration or verification
    if args.migrate:
        run_database_migration()
    else:
        verify_neon_connection()

    # 3. Print access information
    app_url = f"http://localhost:{args.port}"
    root_url = f"http://localhost:{args.port}"
    docs_url = f"http://localhost:{args.port}/docs"
    health_url = f"http://localhost:{args.port}/api/health"

    print("-----------------------------------------------------------------------------")
    print(f" [★] EduBandhan Web App: {app_url}")
    print(f" [★] React SPA Direct:   {app_url}")
    print(f" [★] Interactive Docs: {docs_url}")
    print(f" [★] Health Check API: {health_url}")
    print(f" [★] Tech Stack:       React 19 (Frontend) + FastAPI & Neon pgvector (Backend)")
    print(f" [★] Project Root:     {CODE_DIR}")
    print("-----------------------------------------------------------------------------")
    print("[*] Starting EduBandhan ASGI Server...")
    print("    Press Ctrl+C at any time to gracefully stop.\n")

    # 4. Auto-open browser
    if not args.no_browser:
        open_browser(app_url)

    # 5. Start Uvicorn Server
    import uvicorn
    os.chdir(str(CODE_DIR))
    
    uvicorn.run(
        "backend.main:app",
        host=args.host,
        port=args.port,
        reload=args.reload,
        app_dir=str(CODE_DIR)
    )

if __name__ == "__main__":
    main()
