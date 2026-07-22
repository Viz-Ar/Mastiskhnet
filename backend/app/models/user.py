from datetime import datetime
from enum import Enum

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum as SqlEnum,
    Integer,
    String,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.base import Base


class UserRole(str, Enum):
    ADMIN = "admin"
    DOCTOR = "doctor"
    PATIENT = "patient"


class User(Base):
    __tablename__ = "users"

    # ==========================================
    # Basic Information
    # ==========================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    role: Mapped[UserRole] = mapped_column(
        SqlEnum(UserRole),
        nullable=False
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )

    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # ==========================================
    # MRI Relationships
    # ==========================================

    patient_scans = relationship(
        "MRIScan",
        foreign_keys="MRIScan.patient_id",
        back_populates="patient",
        cascade="all, delete-orphan"
    )

    doctor_scans = relationship(
        "MRIScan",
        foreign_keys="MRIScan.doctor_id",
        back_populates="doctor",
        cascade="all, delete-orphan"
    )

    # ==========================================
    # Chat Relationships
    # ==========================================

    sent_messages = relationship(
        "ChatMessage",
        foreign_keys="ChatMessage.sender_id",
        back_populates="sender",
        cascade="all, delete-orphan"
    )

    received_messages = relationship(
        "ChatMessage",
        foreign_keys="ChatMessage.receiver_id",
        back_populates="receiver",
        cascade="all, delete-orphan"
    )