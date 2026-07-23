from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_current_user,
    get_database,
)

from app.models.user import User

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

# ==========================================
# Current Logged-in User
# ==========================================

@router.get("/me")
def current_user(
    user=Depends(get_current_user),
):
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
    }


# ==========================================
# Get All Patients
# ==========================================

@router.get("/patients")
def get_patients(
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):

    print("========== DEBUG ==========")
    print("Current User:", current_user.email)
    print("Current Role:", current_user.role)

    patients = (
        db.query(User)
        .filter(User.role == "patient")
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