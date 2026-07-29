from datetime import datetime

from pydantic import BaseModel


# ==========================================
# MRI Scan Response
# ==========================================

class MRIScanResponse(BaseModel):

    id: int

    patient_id: int

    doctor_id: int

    flair_file: str

    t1_file: str

    t1ce_file: str

    t2_file: str

    prediction_status: str

    created_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# Upload Response
# ==========================================

class UploadResponse(BaseModel):

    message: str

    scan_id: int