from fastapi import FastAPI

from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
)


@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }