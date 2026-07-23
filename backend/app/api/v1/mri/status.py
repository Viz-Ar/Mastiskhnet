from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_database,
    get_current_user,
)

from app.models.mri_scan import MRIScan

router = APIRouter()


# ============================================================
# MRI Prediction Status
# ============================================================

@router.get("/{scan_id}/status")
def prediction_status(
    scan_id: int,
    db: Session = Depends(get_database),
    current_user=Depends(get_current_user),
):

    scan = (
        db.query(MRIScan)
        .filter(MRIScan.id == scan_id)
        .first()
    )

    if not scan:
        raise HTTPException(
            status_code=404,
            detail="MRI Scan not found",
        )

    return {
        "scan_id": scan.id,
        "prediction_status": scan.prediction_status,
        "report_ready": scan.report_file is not None,
        "mask_ready": scan.mask_file is not None,
        "mesh_ready": scan.mesh_file is not None,
    }