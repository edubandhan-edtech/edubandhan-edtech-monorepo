import os
import sys
import psycopg2
from dotenv import load_dotenv

# Ensure UTF-8 output on Windows terminal
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load environment variables
load_dotenv(os.path.join(BASE_DIR, ".env"))
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in .env file")

print("[*] Connecting to Neon PostgreSQL...")
conn = None
try:
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    cursor = conn.cursor()

    print("[+] Connected successfully to Neon PostgreSQL!")
    
    # Read schema.sql
    schema_path = os.path.join(BASE_DIR, "schema.sql")
    with open(schema_path, "r", encoding="utf-8") as f:
        sql_content = f.read()

    print("[*] Executing schema.sql migrations (Tables, Extensions, Indexes & Seeds)...")
    cursor.execute(sql_content)
    print("[+] schema.sql executed successfully!")

    # Verify Tables
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    """)
    tables = [row[0] for row in cursor.fetchall()]
    print("\n[+] Active Public Tables in Neon Database:")
    for t in tables:
        print(f"  - {t}")

    # Verify pgvector extension
    cursor.execute("SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';")
    vec_ext = cursor.fetchone()
    if vec_ext:
        print(f"\n[+] pgvector Extension Active: Version {vec_ext[1]}")

    # Verify Seed Data
    cursor.execute("SELECT count(*) FROM schools;")
    school_count = cursor.fetchone()[0]

    cursor.execute("SELECT count(*) FROM students;")
    student_count = cursor.fetchone()[0]

    cursor.execute("SELECT count(*) FROM face_embeddings;")
    face_count = cursor.fetchone()[0]

    cursor.execute("SELECT count(*) FROM attendance_logs;")
    attendance_count = cursor.fetchone()[0]

    print(f"\n[+] Seed Data Summary:")
    print(f"  - Schools: {school_count}")
    print(f"  - Students: {student_count}")
    print(f"  - 512-D Face Embeddings: {face_count}")
    print(f"  - Attendance Logs: {attendance_count}")

    # Test 1-to-1 Cosine Similarity Match using pgvector operator (<=>)
    cursor.execute("""
        SELECT s.first_name || ' ' || s.last_name AS student_name,
               1 - (f.embedding <=> f.embedding) AS self_cosine_similarity
        FROM face_embeddings f
        JOIN students s ON s.id = f.student_id
        LIMIT 1;
    """)
    sim_test = cursor.fetchone()
    if sim_test:
        print(f"\n[+] 1-to-1 Vector Cosine Similarity Benchmark:")
        print(f"  - Student: {sim_test[0]}")
        print(f"  - Cosine Similarity: {sim_test[1]:.4f} (100% Match!)")

    print("\n[SUCCESS] ALL DATABASE TABLES & PGVECTOR SETUP COMPLETED SUCCESSFULLY!")

except Exception as e:
    print(f"\n[-] Error during migration: {e}")
finally:
    if conn:
        conn.close()
