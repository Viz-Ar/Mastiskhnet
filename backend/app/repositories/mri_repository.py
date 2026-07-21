from sqlalchemy.orm import Session

from app.models.mri_scan import MRIScan


class MRIRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, scan: MRIScan):

        self.db.add(scan)

        self.db.commit()

        self.db.refresh(scan)

        return scan