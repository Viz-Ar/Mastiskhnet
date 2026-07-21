from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_database
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
)
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_database)
):

    service = AuthService(db)

    return service.register(request)


@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_database)
):

    service = AuthService(db)

    return service.login(
        request.email,
        request.password
    )