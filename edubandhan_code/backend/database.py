import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from backend.config import settings

@contextmanager
def get_db():
    conn = psycopg2.connect(settings.DATABASE_URL)
    try:
        yield conn
    finally:
        conn.close()

@contextmanager
def get_db_cursor(commit=False):
    conn = psycopg2.connect(settings.DATABASE_URL)
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
        conn.close()
