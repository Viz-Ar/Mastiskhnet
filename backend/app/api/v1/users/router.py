from fastapi import APIRouter, Depends, HTTPException
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