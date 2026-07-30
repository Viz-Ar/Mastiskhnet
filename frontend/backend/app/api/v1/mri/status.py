from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_database,
    get_current_user,
)

from app.models.mri_scan import MRIScan
from app.models.user import User

router = APIRouter()

# ============================================================
# MRI Prediction Status
# ============================================================

@router.get("/{scan_id}/status")
def prediction_status(
    scan_id: int,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):

    scan = (
        db.query(MRIScan)
        .filter(MRIScan.id == scan_id)
        .first()
    )

    if scan is None:
        raise HTTPException(
            status_code=404,
            detail="MRI Scan not found",
        )

    # ============================================================
    # Permission Check
    # ============================================================

    if current_user.role == "doctor":

        if scan.doctor_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Access denied",
            )

    elif current_user.role == "patient":

        if scan.patient_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Access denied",
            )

    # ============================================================
    # Response
    # ============================================================

    return {

        "scan_id": scan.id,

        "prediction_status": scan.prediction_status,

        # =====================================
        # AI Prediction
        # =====================================

        "tumor_type": scan.tumor_type,

        "confidence": scan.confidence,

        "tumor_volume": scan.tumor_volume,

        "tumor_area": scan.tumor_area,

        "processing_time": scan.processing_time,

        "model_name": scan.model_name,

        # =====================================
        # File Status
        # =====================================

        "report_ready": scan.report_file is not None,

        "mask_ready": scan.mask_file is not None,

        "mesh_ready": scan.mesh_file is not None,

        "overlay_ready": scan.overlay_file is not None,

        # =====================================
        # File URLs
        # =====================================

        "report_url": (
            f"/mri/{scan.id}/report"
            if scan.report_file
            else None
        ),

        "mask_url": (
            f"/mri/{scan.id}/mask"
            if scan.mask_file
            else None
        ),

        "mesh_url": (
            f"/mri/{scan.id}/mesh"
            if scan.mesh_file
            else None
        ),

        "overlay_url": (
            f"/mri/{scan.id}/overlay"
            if scan.overlay_file
            else None
        ),

    }