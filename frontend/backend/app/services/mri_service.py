import os
import time
import uuid

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.mri_scan import MRIScan
from app.ml.predictor import predict_brain_tumor
from app.reports.report_generator import generate_report
from app.services.notification_service import NotificationService


UPLOAD_FOLDER = "storage/mri_scans"


class MRIService:

    def __init__(self, db: Session):

        self.db = db

        os.makedirs(
            UPLOAD_FOLDER,
            exist_ok=True,
        )


    async def upload_scan(
        self,
        patient_id: int,
        doctor_id: int,
        flair: UploadFile,
        t1: UploadFile,
        t1ce: UploadFile,
        t2: UploadFile,
    ):

        start_time = time.time()


        # =====================================================
        # Create Case Folder
        # =====================================================

        case_id = str(uuid.uuid4())

        case_folder = os.path.join(
            UPLOAD_FOLDER,
            case_id,
        )

        os.makedirs(
            case_folder,
            exist_ok=True,
        )


        # =====================================================
        # Save MRI Files
        # =====================================================

        saved_files = {}

        files = {
            "flair": flair,
            "t1": t1,
            "t1ce": t1ce,
            "t2": t2,
        }


        for modality, file in files.items():

            extension = file.filename.split(".")[-1]

            filename = f"{modality}.{extension}"

            filepath = os.path.join(
                case_folder,
                filename,
            )


            with open(filepath, "wb") as buffer:

                buffer.write(
                    await file.read()
                )


            saved_files[modality] = filepath



        # =====================================================
        # Create Database Record
        # =====================================================

        scan = MRIScan(

            patient_id=patient_id,

            doctor_id=doctor_id,

            flair_file=saved_files["flair"],

            t1_file=saved_files["t1"],

            t1ce_file=saved_files["t1ce"],

            t2_file=saved_files["t2"],

            prediction_status="Pending",
        )


        self.db.add(scan)

        self.db.commit()

        self.db.refresh(scan)



        # =====================================================
        # Run AI Pipeline
        # =====================================================

        try:


            print(
                "\n========== AI Prediction Started ==========\n"
            )


            prediction = predict_brain_tumor(

                flair=saved_files["flair"],

                t1=saved_files["t1"],

                t1ce=saved_files["t1ce"],

                t2=saved_files["t2"],

                output_dir=case_folder,

            )



            # =====================================================
            # Generated Files
            # =====================================================

            scan.mask_file = prediction.get(
                "mask_file"
            )

            scan.mesh_file = prediction.get(
                 "mesh_file"
            )

            scan.mesh_glb_file = prediction.get(
                "mesh_glb_file"
            )   

            scan.region_stats = prediction.get(
                "statistics"
            )

            # =====================================================
            # Slice Viewer
            # =====================================================

            scan.original_folder = prediction.get(
                "original_folder"
                )

            scan.segmentation_folder = prediction.get(
                "segmentation_folder"
            )

            scan.overlay_folder = prediction.get(
                "overlay_folder"
            )

            scan.total_slices = prediction.get(
                "total_slices"
            )

            # Keep compatibility with existing report overlay
            scan.overlay_file = prediction.get(
                "overlay_file"
            )

        # =====================================================
        # Mesh Material
        # =====================================================

            mesh_file = prediction.get("mesh_file")

            scan.mesh_material_file = (
                os.path.join(
                    os.path.dirname(mesh_file),
                    "material.mtl",
                )
                if mesh_file
                else None
            )



            # =====================================================
            # AI Prediction Results
            # =====================================================

            stats = prediction.get(
                "statistics",
                {}
            )


            scan.prediction_status = "Completed"


            scan.tumor_type = prediction.get(
                "tumor_type",
                "Brain Tumor",
            )


            scan.confidence = float(

                prediction.get(
                    "confidence",
                    0.0,
                )

            )


            scan.tumor_volume = float(
    prediction.get("tumor_volume", 0.0)
)


            scan.processing_time = round(

                time.time() - start_time,

                2,

            )


            scan.model_name = "Attention U-Net"



            self.db.commit()

            self.db.refresh(scan)



            # =====================================================
            # Generate PDF Report
            # =====================================================

            report_file = generate_report(

                scan=scan,

                statistics=stats,

                output_dir=case_folder,

            )


            scan.report_file = report_file



            self.db.commit()

            self.db.refresh(scan)



            # =====================================================
            # Send Success Notifications
            # ONLY AFTER REPORT COMPLETED
            # =====================================================

            notification_service = NotificationService(
                self.db
            )


            # Patient Notification

            notification_service.create(

                user_id=scan.patient_id,

                title="MRI Analysis Completed",

                message="Your MRI analysis has completed successfully. Your report is now available.",

                notification_type="success",

                scan_id=scan.id,

            )



            # Doctor Notification

            notification_service.create(

                user_id=scan.doctor_id,

                title="New MRI Report Ready",

                message="An MRI assigned to you has completed AI analysis and isready for review.",

                notification_type="success",

                scan_id=scan.id,

            )



            print(
                "\n========== AI Prediction Completed ==========\n"
            )


            print(
                "Tumor Type:",
                scan.tumor_type
            )


            print(
                "Confidence:",
                scan.confidence
            )


            print(
                "Volume:",
                scan.tumor_volume
            )


            print(
                "Area:",
                scan.tumor_area
            )


            print(
                "Processing Time:",
                scan.processing_time
            )


            print(
                "Model:",
                scan.model_name
            )



        except Exception:


            import traceback

            traceback.print_exc()



            scan.prediction_status = "Failed"



            self.db.commit()

            self.db.refresh(scan)



            # =====================================================
            # Send Failure Notifications
            # =====================================================

            notification_service = NotificationService(
                self.db
            )



            notification_service.create(

                user_id=scan.patient_id,

                title="MRI Analysis Failed",

                message="The MRI analysis could not be completed. Please contactyour doctor.",

                notification_type="error",

                scan_id=scan.id,

            )



            notification_service.create(

                user_id=scan.doctor_id,

                title="MRI Processing Failed",

                message="An MRI assigned to you failed during AI processing.",

                notification_type="error",

                scan_id=scan.id,

            )


        return scan