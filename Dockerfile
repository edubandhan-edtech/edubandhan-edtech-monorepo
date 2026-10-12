# =============================================================================
# EduBandhan (एडूबंधन) — Unified Single-Pod Multi-Stage Dockerfile
# Builds both React Frontend & FastAPI Backend into 1 High-Performance Pod
# Zero API Gateway Mapping Required • Native Relative Routing • Internal APIs
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build React 19 Frontend
# -----------------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Install dependencies with caching
COPY edubandhan_code/frontend/package*.json ./
RUN npm ci

# Copy frontend source and build production bundle into /app/frontend/dist
COPY edubandhan_code/frontend/ ./
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Python 3.11 ASGI Backend & Unified Host
# -----------------------------------------------------------------------------
FROM python:3.11-slim

# Prevent Python from writing .pyc and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Install system dependencies for PostgreSQL libpq
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY edubandhan_code/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Backend & Root Code
COPY edubandhan_code/ ./

# Copy compiled React Frontend bundle from Stage 1 into frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose unified application port
EXPOSE 8000

# Health check directly hitting FastAPI health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Launch Master Unified Server in production mode (Single Pod, Single Command)
CMD ["python", "run.py", "--host", "0.0.0.0", "--port", "8000", "--no-reload", "--no-browser"]
