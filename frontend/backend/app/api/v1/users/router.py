import os
import secrets
import string

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_current_user,
    get_database,
)
from app.core.security import hash_password
from app.models.user import User
from app.reports.report_generator import generate_patient_credentials_report

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

CREDENTIALS_FOLDER = "storage/patient_credentials"


class RegisterPatientRequest(BaseModel):
    full_name: str
    email: EmailStr


def generate_temp_password(length: int = 10) -> str:

    alphabet = string.ascii_letters + string.digits

    return "".join(
        secrets.choice(alphabet) for _ in range(length)
    )


# =====================================================
# CURRENT LOGGED IN USER
# =====================================================

@router.get("/me")
def current_user(
    user: User = Depends(get_current_user),
):
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
    }


# =====================================================
# GET ALL PATIENTS
# Doctor/Admin only
# =====================================================

@router.get("/patients")
def get_patients(
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):

    print("========== USERS DEBUG ==========")
    print("User:", current_user.email)
    print("Role:", current_user.role)

    if current_user.role not in ["doctor", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Only doctors and admins can view patients",
        )

    patients = (
        db.query(User)
        .filter(User.role == "patient")
        .order_by(User.full_name)
        .all()
    )

    print("Patients Found:", len(patients))

    return [
        {
            "id": patient.id,
            "full_name": patient.full_name,
            "email": patient.email,
            "role": patient.role,
        }
        for patient in patients
    ]


# =====================================================
# DOCTOR REGISTERS A NEW PATIENT
# =====================================================

@router.post("/register-patient")
def register_patient(
    request: RegisterPatientRequest,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):

    if current_user.role not in ["doctor", "admin"]:

        raise HTTPException(
            status_code=403,
            detail="Only doctors and admins can register patients",
        )

    existing = (
        db.query(User)
        .filter(User.email == request.email)
        .first()
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    temp_password = generate_temp_password()

    patient = User(
        full_name=request.full_name,
        email=request.email,
        password_hash=hash_password(temp_password),
        role="patient",
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)

    os.makedirs(CREDENTIALS_FOLDER, exist_ok=True)

    generate_patient_credentials_report(
        patient=patient,
        doctor=current_user,
        temp_password=temp_password,
        output_dir=CREDENTIALS_FOLDER,
    )

    return {
        "patient": {
            "id": patient.id,
            "full_name": patient.full_name,
            "email": patient.email,
        },
        "temp_password": temp_password,
        "credentials_report_url": f"/users/{patient.id}/credentials-report",
    }


# =====================================================
# DOWNLOAD PATIENT CREDENTIALS REPORT (PDF)
# =====================================================

@router.get("/{patient_id}/credentials-report")
def download_credentials_report(
    patient_id: int,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):

    if current_user.role not in ["doctor", "admin"]:

        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    report_path = os.path.join(
        CREDENTIALS_FOLDER,
        f"patient_{patient_id}_credentials.pdf",
    )

    if not os.path.exists(report_path):

        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    return FileResponse(
        path=report_path,
        media_type="application/pdf",
        filename=f"patient_{patient_id}_credentials.pdf",
    )


# =====================================================
# GET USER BY ID
# Used for Chat / Profile
# =====================================================

@router.get("/{user_id}")
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    # -------------------------------------------------
    # ACCESS CONTROL
    # -------------------------------------------------

    # Admin can view everyone
    if current_user.role == "admin":
        pass

    # Doctor can view themselves and patients
    elif current_user.role == "doctor":
        if current_user.id != user.id and user.role != "patient":
            raise HTTPException(
                status_code=403,
                detail="Access denied",
            )

    # Patient can view themselves and doctors
    elif current_user.role == "patient":
        if current_user.id != user.id and user.role != "doctor":
            raise HTTPException(
                status_code=403,
                detail="Access denied",
            )

    else:
        raise HTTPException(
            status_code=403,
            detail="Invalid role",
        )

    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
    }