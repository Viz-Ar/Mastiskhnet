from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class MRIScan(Base):

    __tablename__ = "mri_scans"

    # =====================================================
    # PRIMARY INFORMATION
    # =====================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    patient_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    doctor_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    # =====================================================
    # MRI MODALITIES
    # =====================================================

    flair_file = Column(
        String,
        nullable=False,
    )

    t1_file = Column(
        String,
        nullable=False,
    )

    t1ce_file = Column(
        String,
        nullable=False,
    )

    t2_file = Column(
        String,
        nullable=False,
    )

    # =====================================================
    # AI GENERATED FILES
    # =====================================================

    mask_file = Column(
        String,
        nullable=True,
    )

    mesh_file = Column(
        String,
        nullable=True,
    )

    mesh_material_file = Column(
        String,
        nullable=True,
    )

    mesh_glb_file = Column(
        String,
        nullable=True,
    )

    overlay_file = Column(
        String,
        nullable=True,
    )

    report_file = Column(
        String,
        nullable=True,
    )

    # =====================================================
    # AI PREDICTION
    # =====================================================

    prediction_status = Column(
        String,
        default="Pending",
    )

    tumor_type = Column(
        String,
        nullable=True,
    )

    confidence = Column(
        Float,
        nullable=True,
    )

    tumor_volume = Column(
        Float,
        nullable=True,
    )

    tumor_area = Column(
        Float,
        nullable=True,
    )

    processing_time = Column(
        Float,
        nullable=True,
    )

    model_name = Column(
        String,
        default="Attention U-Net",
        nullable=True,
    )

    # =====================================================
    # TIMESTAMP
    # =====================================================

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================

    patient = relationship(
        "User",
        foreign_keys=[patient_id],
        back_populates="patient_scans",
    )

    doctor = relationship(
        "User",
        foreign_keys=[doctor_id],
        back_populates="doctor_scans",
    )