from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException
)

from fastapi.responses import FileResponse

from sqlalchemy.orm import Session

from app.core.dependencies import get_database
from app.core.auth import get_current_user

from app.services.mri_service import MRIService

from app.models.mri_scan import MRIScan
from app.models.user import User

from .status import router as status_router

router = APIRouter(
    prefix="/mri",
    tags=["MRI"]
)



# =====================================================
# ACCESS CONTROL
# =====================================================

def check_scan_access(
    scan: MRIScan,
    current_user: User
):

    if current_user.role == "admin":
        return


    if current_user.role == "patient":

        if scan.patient_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )


    elif current_user.role == "doctor":

        if scan.doctor_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )


    else:

        raise HTTPException(
            status_code=403,
            detail="Invalid role"
        )



# =====================================================
# UPLOAD MRI
# =====================================================

@router.post("/upload")
async def upload_scan(

    patient_id: int = Form(...),

    flair: UploadFile = File(...),
    t1: UploadFile = File(...),
    t1ce: UploadFile = File(...),
    t2: UploadFile = File(...),

    db: Session = Depends(get_database),

    current_user: User = Depends(get_current_user)

):

    if current_user.role != "doctor":

        raise HTTPException(
            status_code=403,
            detail="Only doctors can upload MRI"
        )


    service = MRIService(db)


    scan = await service.upload_scan(

        patient_id,

        current_user.id,

        flair,
        t1,
        t1ce,
        t2
    )


    return {

        "message":"MRI uploaded successfully",

        "scan_id":scan.id,

        "status":scan.prediction_status

    }

# =====================================================
# GET SINGLE SCAN
# =====================================================

@router.get("/{scan_id}")
def get_scan(

    scan_id:int,

    db:Session=Depends(get_database),

    current_user:User=Depends(get_current_user)

):

    scan=db.query(MRIScan).filter(
        MRIScan.id==scan_id
    ).first()


    if not scan:

        raise HTTPException(
            status_code=404,
            detail="Scan not found"
        )


    check_scan_access(
        scan,
        current_user
    )
    
    return {
    "id": scan.id,

    "patient_id": scan.patient_id,
    "doctor_id": scan.doctor_id,

    "patient_name": (
        scan.patient.full_name
        if scan.patient
        else None
    ),

    "doctor_name": (
        scan.doctor.full_name
        if scan.doctor
        else None
    ),

    "prediction_status": scan.prediction_status,

    # ===========================
    # AI RESULTS
    # ===========================

    "tumor_type": scan.tumor_type,

    "confidence": scan.confidence,

    "tumor_volume": scan.tumor_volume,

    "tumor_area": scan.tumor_area,

    "processing_time": scan.processing_time,

    "model_name": scan.model_name,

    # ===========================
    # Date
    # ===========================

    "created_at": scan.created_at,

    # ===========================
    # Files
    # ===========================

    "report_url": f"/mri/{scan.id}/report",

    "mask_url": f"/mri/{scan.id}/mask",

    "mesh_url": f"/mri/{scan.id}/mesh",

    "overlay_url": (
        f"/mri/{scan.id}/overlay"
        if scan.overlay_file
        else None
    ),
}

# =====================================================
# REPORT DOWNLOAD
# =====================================================

@router.get("/{scan_id}/report")
def download_report(

    scan_id:int,

    db:Session=Depends(get_database),

    current_user:User=Depends(get_current_user)

):

    scan=db.query(MRIScan).filter(
        MRIScan.id==scan_id
    ).first()


    if not scan:

        raise HTTPException(
            status_code=404,
            detail="Scan not found"
        )


    check_scan_access(
        scan,
        current_user
    )


    if not scan.report_file:

        raise HTTPException(
            status_code=404,
            detail="Report not generated"
        )


    return FileResponse(

        path=scan.report_file,

        media_type="application/pdf",

        filename=f"MastiskhNet_Report_{scan.id}.pdf"

    )





# =====================================================
# MASK DOWNLOAD
# =====================================================

@router.get("/{scan_id}/mask")
def download_mask(

    scan_id:int,

    db:Session=Depends(get_database),

    current_user:User=Depends(get_current_user)

):

    scan=db.query(MRIScan).filter(
        MRIScan.id==scan_id
    ).first()


    if not scan:

        raise HTTPException(
            status_code=404,
            detail="Scan not found"
        )


    check_scan_access(
        scan,
        current_user
    )


    if not scan.mask_file:

        raise HTTPException(
            status_code=404,
            detail="Mask not found"
        )


    return FileResponse(

        path=scan.mask_file,

        media_type="application/gzip",

        filename="tumor_mask.nii.gz"

    )





# =====================================================
# MESH DOWNLOAD
# =====================================================

@router.get("/{scan_id}/mesh")
def download_mesh(

    scan_id:int,

    db:Session=Depends(get_database),

    current_user:User=Depends(get_current_user)

):

    scan=db.query(MRIScan).filter(
        MRIScan.id==scan_id
    ).first()


    if not scan:

        raise HTTPException(
            status_code=404,
            detail="Scan not found"
        )


    check_scan_access(
        scan,
        current_user
    )


    if not scan.mesh_file:

        raise HTTPException(
            status_code=404,
            detail="Mesh not found"
        )


    return FileResponse(

        path=scan.mesh_file,

        media_type="application/octet-stream",

        filename="tumor_mesh.obj"

    )

# =====================================================
# OVERLAY DOWNLOAD
# =====================================================

@router.get("/{scan_id}/overlay")
def download_overlay(
    scan_id: int,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):

    scan = (
        db.query(MRIScan)
        .filter(MRIScan.id == scan_id)
        .first()
    )

    if not scan:
        raise HTTPException(
            status_code=404,
            detail="Scan not found",
        )

    check_scan_access(scan, current_user)

    if not scan.overlay_file:
        raise HTTPException(
            status_code=404,
            detail="Overlay not found",
        )

    return FileResponse(
        path=scan.overlay_file,
        media_type="image/png",
        filename=f"tumor_overlay_{scan.id}.png",
    )

# ==================================================
# Latest Doctor For Patient
# ==================================================

@router.get("/latest-doctor/{patient_id}")
def latest_doctor(

    patient_id: int,

    db: Session = Depends(get_database),

    current_user: User = Depends(get_current_user)

):

    # Patient can only access their own doctor
    if current_user.role == "patient":

        if current_user.id != patient_id:

            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

    scan = (
        db.query(MRIScan)
        .filter(
            MRIScan.patient_id == patient_id
        )
        .order_by(
            MRIScan.created_at.desc()
        )
        .first()
    )

    if scan is None:

        raise HTTPException(
            status_code=404,
            detail="No MRI found"
        )

    return {

        "doctor_id": scan.doctor_id,

        "scan_id": scan.id

    }


# =====================================================
# DOCTOR HISTORY
# =====================================================
@router.get("/history/doctor/{doctor_id}")
def doctor_history(

    doctor_id: int,

    db: Session = Depends(get_database),

    current_user: User = Depends(get_current_user)

):

    if current_user.role == "doctor":

        if current_user.id != doctor_id:

            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

    scans = (
        db.query(MRIScan)
        .filter(
            MRIScan.doctor_id == doctor_id
        )
        .order_by(
            MRIScan.created_at.desc()
        )
        .all()
    )

    result = []

    for scan in scans:

        patient = (
            db.query(User)
            .filter(
                User.id == scan.patient_id
            )
            .first()
        )

        result.append({

            "id": scan.id,

            "patient_id": scan.patient_id,

            "patient_name": (
                patient.full_name
                if patient
                else "Unknown Patient"
            ),

            "patient_email": (
                patient.email
                if patient
                else ""
            ),

            "doctor_id": scan.doctor_id,

            "prediction_status": scan.prediction_status,

            # =====================================
            # AI RESULTS
            # =====================================

            "tumor_type": scan.tumor_type,

            "confidence": scan.confidence,

            "tumor_volume": scan.tumor_volume,

            "tumor_area": scan.tumor_area,

            "processing_time": scan.processing_time,

            "model_name": scan.model_name,

            # =====================================
            # DATE
            # =====================================

            "created_at": scan.created_at,

            # =====================================
            # FILE PATHS
            # =====================================

            "report_file": scan.report_file,

            "mask_file": scan.mask_file,

            "mesh_file": scan.mesh_file,

            "overlay_file": scan.overlay_file,

            # =====================================
            # DOWNLOAD URLS
            # =====================================

            "report_url":
                f"/mri/{scan.id}/report",

            "mask_url":
                f"/mri/{scan.id}/mask",

            "mesh_url":
                f"/mri/{scan.id}/mesh",

            "overlay_url":
                (
                    f"/mri/{scan.id}/overlay"
                    if scan.overlay_file
                    else None
                )

        })

    return result
# =====================================================
# PATIENT HISTORY
# =====================================================
@router.get("/history/patient/{patient_id}")
def patient_history(

    patient_id: int,

    db: Session = Depends(get_database),

    current_user: User = Depends(get_current_user)

):

    if current_user.role == "patient":

        if current_user.id != patient_id:
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

    scans = (
        db.query(MRIScan)
        .filter(
            MRIScan.patient_id == patient_id
        )
        .order_by(
            MRIScan.created_at.desc()
        )
        .all()
    )

    return [

        {

            "id": scan.id,

            "patient_id": scan.patient_id,

            "doctor_id": scan.doctor_id,

            # =====================================
            # AI RESULTS
            # =====================================

            "prediction_status": scan.prediction_status,

            "tumor_type": scan.tumor_type,

            "confidence": scan.confidence,

            "tumor_volume": scan.tumor_volume,

            "tumor_area": scan.tumor_area,

            "processing_time": scan.processing_time,

            "model_name": scan.model_name,

            # =====================================
            # DATE
            # =====================================

            "created_at": scan.created_at,

            # =====================================
            # FILES
            # =====================================

            "report_file": scan.report_file,

            "mask_file": scan.mask_file,

            "mesh_file": scan.mesh_file,

            "overlay_file": scan.overlay_file,

            # =====================================
            # DOWNLOAD URLS
            # =====================================

            "report_url":
                f"/mri/{scan.id}/report",

            "mask_url":
                f"/mri/{scan.id}/mask",

            "mesh_url":
                f"/mri/{scan.id}/mesh",

            "overlay_url":
                (
                    f"/mri/{scan.id}/overlay"
                    if scan.overlay_file
                    else None
                )

        }

        for scan in scans

    ]


router.include_router(status_router)