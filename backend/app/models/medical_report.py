from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
    Text
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base



class MedicalReport(Base):

    __tablename__ = "medical_reports"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    scan_id = Column(
        Integer,
        ForeignKey("mri_scans.id"),
        nullable=False
    )


    # AI Finding

    finding = Column(
        String,
        nullable=False
    )


    tumor_volume_mm3 = Column(
        Float,
        nullable=True
    )


    tumor_volume_cm3 = Column(
        Float,
        nullable=True
    )


    # Complete JSON report

    report_data = Column(
        Text,
        nullable=True
    )


    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


    scan = relationship(
        "MRIScan",
        back_populates="report"
    )