from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository


class AuthService:

    def __init__(self, db: Session):

        self.user_repository = UserRepository(db)