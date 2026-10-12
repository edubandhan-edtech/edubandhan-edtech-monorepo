import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))
load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_HPwY1i8QNsac@ep-square-sunset-b57rq0iv-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require")
    DIRECT_URL: str = os.getenv("DIRECT_URL", "")
    APP_ENV: str = os.getenv("APP_ENV", "development")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "edubandhan_super_secret_jwt_key_2026_change_in_production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
    PLATFORM_FEE_PERCENTAGE: int = int(os.getenv("PLATFORM_FEE_PERCENTAGE", 20))
    FACE_SIMILARITY_THRESHOLD: float = float(os.getenv("FACE_SIMILARITY_THRESHOLD", 0.85))
    CUTOFF_TIME: str = os.getenv("CUTOFF_TIME", "08:30:00")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b")

settings = Settings()
