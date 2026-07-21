from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.repositories.mri_repository import MRIRepository
from app.services.mri_service import MRIService

router = APIRouter(
    prefix="/mri",
    tags=["MRI"],
)


@router.post("/upload")
def upload_scan(
    patient_id: int,
    doctor_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    repository = MRIRepository(db)

    service = MRIService(repository)

    return service.upload_scan(
        patient_id,
        doctor_id,
        file,
    )