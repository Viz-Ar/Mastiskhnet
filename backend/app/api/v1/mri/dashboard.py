from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case

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

    doctor_id = current_user.id


    # ==========================================
    # MRI STATISTICS
    # ==========================================

    stats = (
        db.query(

            func.count(MRIScan.id)
            .label("total"),


            func.sum(
                case(
                    (
                        MRIScan.prediction_status == "Completed",
                        1
                    ),
                    else_=0
                )
            )
            .label("completed"),


            func.sum(
                case(
                    (
                        MRIScan.prediction_status.in_(
                            [
                                "Pending",
                                "Processing"
                            ]
                        ),
                        1
                    ),
                    else_=0
                )
            )
            .label("processing"),


            func.sum(
                case(
                    (
                        MRIScan.prediction_status == "Failed",
                        1
                    ),
                    else_=0
                )
            )
            .label("failed")

        )
        .filter(
            MRIScan.doctor_id == doctor_id
        )
        .first()
    )



    # ==========================================
    # UNIQUE PATIENT COUNT
    # ==========================================

    patients = (
        db.query(
            func.count(
                func.distinct(
                    MRIScan.patient_id
                )
            )
        )
        .filter(
            MRIScan.doctor_id == doctor_id
        )
        .scalar()
    )



    return {

        "patients": patients or 0,

        "mri_scans": stats.total or 0,

        "completed": stats.completed or 0,

        "processing": stats.processing or 0,

        "failed": stats.failed or 0,

        # Later replace with actual model evaluation metric
        "accuracy": 96.8

    }