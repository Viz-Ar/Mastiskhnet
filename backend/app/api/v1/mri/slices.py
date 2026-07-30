import os

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from fastapi.responses import FileResponse

from sqlalchemy.orm import Session

from app.core.dependencies import get_database
from app.core.auth import get_current_user

from app.models.user import User
from app.models.mri_scan import MRIScan


router = APIRouter()


# ==========================================================
# ACCESS CONTROL
# ==========================================================

def check_scan_access(
    scan: MRIScan,
    current_user: User,
):

    if current_user.role == "admin":
        return

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

    else:

        raise HTTPException(
            status_code=403,
            detail="Invalid role",
        )


# ==========================================================
# LOAD MRI SCAN
# ==========================================================

def get_scan(
    scan_id: int,
    db: Session,
):

    scan = (
        db.query(MRIScan)
        .filter(MRIScan.id == scan_id)
        .first()
    )

    if scan is None:

        raise HTTPException(
            status_code=404,
            detail="Scan not found",
        )

    return scan


# ==========================================================
# SLICE INFORMATION
# ==========================================================

@router.get("/{scan_id}/slices")
def slice_information(

    scan_id: int,

    db: Session = Depends(get_database),

    current_user: User = Depends(get_current_user),

):

    scan = get_scan(scan_id, db)

    check_scan_access(scan, current_user)

    return {

        "total_slices": scan.total_slices,

        "original": f"/mri/{scan.id}/slice/original",

        "mask": f"/mri/{scan.id}/slice/mask",

        "overlay": f"/mri/{scan.id}/slice/overlay",

    }


# ==========================================================
# ORIGINAL MRI SLICE
# ==========================================================

@router.get("/{scan_id}/slice/original/{index}")
def original_slice(

    scan_id: int,

    index: int,

    db: Session = Depends(get_database),

    current_user: User = Depends(get_current_user),

):

    scan = get_scan(scan_id, db)

    check_scan_access(scan, current_user)

    file_path = os.path.join(
        scan.original_folder,
        f"{index:03d}.png",
    )

    if not os.path.exists(file_path):

        raise HTTPException(
            status_code=404,
            detail="Slice not found",
        )

    return FileResponse(
        file_path,
        media_type="image/png",
    )


# ==========================================================
# SEGMENTATION MASK SLICE
# ==========================================================

@router.get("/{scan_id}/slice/mask/{index}")
def mask_slice(

    scan_id: int,

    index: int,

    db: Session = Depends(get_database),

    current_user: User = Depends(get_current_user),

):

    scan = get_scan(scan_id, db)

    check_scan_access(scan, current_user)

    file_path = os.path.join(
        scan.segmentation_folder,
        f"{index:03d}.png",
    )

    if not os.path.exists(file_path):

        raise HTTPException(
            status_code=404,
            detail="Slice not found",
        )

    return FileResponse(
        file_path,
        media_type="image/png",
    )


# ==========================================================
# OVERLAY SLICE
# ==========================================================

@router.get("/{scan_id}/slice/overlay/{index}")
def overlay_slice(

    scan_id: int,

    index: int,

    db: Session = Depends(get_database),

    current_user: User = Depends(get_current_user),

):

    scan = get_scan(scan_id, db)

    check_scan_access(scan, current_user)

    file_path = os.path.join(
        scan.overlay_folder,
        f"{index:03d}.png",
    )

    if not os.path.exists(file_path):

        raise HTTPException(
            status_code=404,
            detail="Slice not found",
        )

    return FileResponse(
        file_path,
        media_type="image/png",
    )