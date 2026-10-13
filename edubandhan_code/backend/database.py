import psycopg2
from psycopg2 import pool
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from backend.config import settings

_db_pool = None

def get_connection_pool():
    global _db_pool
    if _db_pool is None:
        try:
            _db_pool = pool.ThreadedConnectionPool(
                minconn=1,
                maxconn=10,
                dsn=settings.DATABASE_URL
            )
        except Exception as e:
            print(f"[!] Warning: Connection pool initialization failed ({e}), falling back to direct connections.")
            _db_pool = None
    return _db_pool

@contextmanager
def get_db():
    p = get_connection_pool()
    conn = p.getconn() if p else psycopg2.connect(settings.DATABASE_URL)
    try:
        yield conn
    finally:
        if p:
            p.putconn(conn)
        else:
            conn.close()

@contextmanager
def get_db_cursor(commit=False):
    p = get_connection_pool()
    conn = p.getconn() if p else psycopg2.connect(settings.DATABASE_URL)
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        yield cursor
        if commit:
            conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        if p:
            p.putconn(conn)
        else:
            conn.close()
