import os
import uuid

from fastapi import UploadFile

from app.models.mri_scan import MRIScan
from app.repositories.mri_repository import MRIRepository


UPLOAD_FOLDER = "uploads/mri"


class MRIService:

    def __init__(self, repository: MRIRepository):
        self.repository = repository

    def upload_scan(
        self,
        patient_id: int,
        doctor_id: int,
        file: UploadFile,
    ):

        os.makedirs(
            UPLOAD_FOLDER,
            exist_ok=True,
        )

        extension = os.path.splitext(file.filename)[1]

        filename = f"{uuid.uuid4()}{extension}"

        filepath = os.path.join(
            UPLOAD_FOLDER,
            filename,
        )

        with open(filepath, "wb") as buffer:
            buffer.write(file.file.read())

        scan = MRIScan(

            patient_id=patient_id,

            doctor_id=doctor_id,

            original_filename=file.filename,

            stored_filename=filename,

            file_path=filepath,
        )

        return self.repository.create(scan)