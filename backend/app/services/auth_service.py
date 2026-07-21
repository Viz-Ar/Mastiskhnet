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

        return self.user_repo.create(user)

    def login(
        self,
        email: str,
        password: str
    ):

        user = self.user_repo.get_by_email(email)

        if not user:
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
            "token_type": "bearer"
        }