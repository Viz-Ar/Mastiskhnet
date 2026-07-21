from pydantic import BaseModel
from datetime import datetime


class MRIScanResponse(BaseModel):

    id: int

    patient_id: int

    doctor_id: int

    original_filename: str

    stored_filename: str

    file_path: str

    prediction_status: str

    created_at: datetime

    class Config:
        from_attributes = True