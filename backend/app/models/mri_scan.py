from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base



class MRIScan(Base):

    __tablename__ = "mri_scans"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    patient_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )


    doctor_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )


    # Original uploaded file

    original_filename = Column(
        String,
        nullable=False
    )


    stored_filename = Column(
        String,
        nullable=False,
        unique=True
    )


    file_path = Column(
        String,
        nullable=False
    )


    # AI outputs

    mask_file = Column(
        String,
        nullable=True
    )


    mesh_file = Column(
        String,
        nullable=True
    )


    overlay_file = Column(
        String,
        nullable=True
    )


    prediction_status = Column(
        String,
        default="Pending"
    )


    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


    patient = relationship(
        "User",
        foreign_keys=[patient_id],
        back_populates="patient_scans"
    )


    doctor = relationship(
        "User",
        foreign_keys=[doctor_id],
        back_populates="doctor_scans"
    )
    
    report = relationship(
        "MedicalReport",
        back_populates="scan",
        uselist=False
    )