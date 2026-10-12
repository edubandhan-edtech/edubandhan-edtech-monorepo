import hashlib
import hmac
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import jwt, JWTError
from fastapi import HTTPException, Security, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.config import settings
from backend.database import get_db_cursor

security = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    # Use standard SHA-256 + salt for cross-environment consistency
    salt = "edubandhan_salt_2026"
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: Optional[str]) -> bool:
    if not hashed_password:
        # Support fallback passwords for initial unhashed seed records
        return plain_password in ["edubandhan2026", "password123", "admin123"]
    if plain_password == hashed_password:
        return True
    return hmac.compare_digest(hash_password(plain_password), hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "token_type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "token_type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_refresh_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        if payload.get("token_type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid token type: expected refresh token"
            )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid refresh token payload"
            )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Dict[str, Any]:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        if payload.get("token_type") == "refresh":
            raise HTTPException(status_code=401, detail="Cannot use refresh token as access token")
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    with get_db_cursor() as cur:
        cur.execute("""
            SELECT u.id, u.school_id, u.email, u.phone, u.role, u.is_active,
                   s.name as school_name
            FROM users u
            LEFT JOIN schools s ON s.id = u.school_id
            WHERE u.id = %s;
        """, (user_id,))
        user = cur.fetchone()
        if not user or not user["is_active"]:
            raise HTTPException(status_code=401, detail="User not found or inactive")
        return user

def require_roles(allowed_roles: list):
    def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)):
        if current_user["role"] not in allowed_roles and current_user["role"] != "SUPER_ADMIN":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden for role {current_user['role']}"
            )
        return current_user
    return role_checker
