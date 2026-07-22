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



router = APIRouter(
    prefix="/mri",
    tags=["MRI"]
)



# ==================================================
# Access Control
# ==================================================

def check_scan_access(
    scan: MRIScan,
    current_user: User
):

    # Admin can access everything
    if current_user.role == "admin":
        return


    # Patient can access only own scans
    if current_user.role == "patient":

        if scan.patient_id != current_user.id:

            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )


    # Doctor can access only assigned scans
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



# ==================================================
# Upload MRI
# ==================================================

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


    # Only doctor can upload MRI

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

        "message": "MRI uploaded successfully",

        "scan_id": scan.id,

        "status": scan.prediction_status

    }





# ==================================================
# MRI Details
# ==================================================

@router.get("/{scan_id}")
def get_scan(

    scan_id: int,

    db: Session = Depends(get_database),

    current_user: User = Depends(get_current_user)

):


    scan = db.query(MRIScan).filter(

        MRIScan.id == scan_id

    ).first()



    if scan is None:

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

        "prediction_status": scan.prediction_status,

        "created_at": scan.created_at,


        "files": {

            "mask":
                f"/mri/{scan.id}/mask",


            "mesh":
                f"/mri/{scan.id}/mesh",


            "report":
                f"/mri/{scan.id}/report"

        }

    }





# ==================================================
# Download Mask
# ==================================================

@router.get("/{scan_id}/mask")
def download_mask(

    scan_id: int,

    db: Session = Depends(get_database),

    current_user: User = Depends(get_current_user)

):


    scan = db.query(MRIScan).filter(

        MRIScan.id == scan_id

    ).first()



    if scan is None:

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





# ==================================================
# Download Mesh
# ==================================================

@router.get("/{scan_id}/mesh")
def download_mesh(

    scan_id: int,

    db: Session = Depends(get_database),

    current_user: User = Depends(get_current_user)

):


    scan = db.query(MRIScan).filter(

        MRIScan.id == scan_id

    ).first()



    if scan is None:

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





# ==================================================
# Download PDF Report
# ==================================================

@router.get("/{scan_id}/report")
def download_report(

    scan_id: int,

    db: Session = Depends(get_database),

    current_user: User = Depends(get_current_user)

):


    scan = db.query(MRIScan).filter(

        MRIScan.id == scan_id

    ).first()



    if scan is None:

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





# ==================================================
# Patient History
# ==================================================

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


    scans = db.query(MRIScan).filter(

        MRIScan.patient_id == patient_id

    ).order_by(

        MRIScan.created_at.desc()

    ).all()



    return scans





# ==================================================
# Doctor History
# ==================================================

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


    scans = db.query(MRIScan).filter(

        MRIScan.doctor_id == doctor_id

    ).order_by(

        MRIScan.created_at.desc()

    ).all()



    return scans