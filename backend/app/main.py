from fastapi import FastAPI

app = FastAPI(
    title="MastiskhNet API",
    description="Backend API for AI-Powered Brain Tumor Analysis",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to MastiskhNet Backend"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }