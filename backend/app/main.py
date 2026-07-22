from fastapi import FastAPI
from sqlalchemy import text

from app.core.config import settings
from app.database.session import engine
from app.database.base import Base

# ==================================
# Load Models
# ==================================

from app.models import *

# ==================================
# API Routers
# ==================================

from app.api.v1.auth.router import router as auth_router
from app.api.v1.users.router import router as user_router
from app.api.v1.mri.router import router as mri_router
from app.api.v1.chat.router import router as chat_router
from app.api.v1.chat.websocket import router as websocket_router

# ==================================
# Create Database Tables
# ==================================

Base.metadata.create_all(bind=engine)

# ==================================
# FastAPI Application
# ==================================

app = FastAPI(
    title=settings.APP_NAME,
    description="AI Powered Brain Tumor Detection & Analysis System",
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
)

# ==================================
# Register Routers
# ==================================

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(mri_router)
app.include_router(chat_router)
app.include_router(websocket_router)

# ==================================
# Root Endpoint
# ==================================

@app.get("/", tags=["Root"])
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.APP_VERSION
    }

# ==================================
# Health Check
# ==================================

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "message": "Backend is running successfully."
    }

# ==================================
# Database Test
# ==================================

@app.get("/db-test", tags=["Database"])
def db_test():

    with engine.connect() as conn:

        database = conn.execute(
            text("SELECT current_database();")
        ).scalar()

        schema = conn.execute(
            text("SELECT current_schema();")
        ).scalar()

        tables = conn.execute(
            text("""
                SELECT tablename
                FROM pg_tables
                WHERE schemaname = 'public';
            """)
        ).fetchall()

    return {
        "database": database,
        "schema": schema,
        "tables": [table[0] for table in tables]
    }