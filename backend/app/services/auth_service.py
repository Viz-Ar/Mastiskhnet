from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import RegisterRequest
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)


class AuthService:

    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)

    # ==========================================
    # Register User
    # ==========================================

    def register(self, request: RegisterRequest):

        existing = self.user_repo.get_by_email(request.email)

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        user = User(
            full_name=request.full_name,
            email=request.email,
            password_hash=hash_password(request.password),
            role=request.role,
        )

        created_user = self.user_repo.create(user)

        return {
            "message": "Registration successful",
            "user": {
                "id": created_user.id,
                "full_name": created_user.full_name,
                "email": created_user.email,
                "role": created_user.role,
            }
        }

    # ==========================================
    # Login User
    # ==========================================

    def login(
        self,
        email: str,
        password: str
    ):

        user = self.user_repo.get_by_email(email)

        if user is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )

        if not verify_password(
            password,
            user.password_hash
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )

        token = create_access_token(user.id)

        return {
            "access_token": token,
            "token_type": "bearer",

            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role
            }
        }