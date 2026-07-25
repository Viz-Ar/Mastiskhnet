from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_database,
    get_current_user,
)

from app.models.mri_scan import MRIScan

router = APIRouter()


@router.get("/dashboard")
def dashboard_statistics(
    db: Session = Depends(get_database),
    current_user=Depends(get_current_user),
):

    scans = (
        db.query(MRIScan)
        .filter(
            MRIScan.doctor_id == current_user.id
        )
        .all()
    )

    total = len(scans)

    completed = len(
        [
            s for s in scans
            if s.prediction_status == "Completed"
        ]
    )

    processing = len(
        [
            s for s in scans
            if s.prediction_status in [
                "Pending",
                "Processing",
            ]
        ]
    )

    failed = len(
        [
            s for s in scans
            if s.prediction_status == "Failed"
        ]
    )

    return {
        "total": total,
        "completed": completed,
        "processing": processing,
        "failed": failed,
    }