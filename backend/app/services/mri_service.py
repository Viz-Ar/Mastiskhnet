import os
import uuid

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.mri_scan import MRIScan
from app.ml.predictor import predict_brain_tumor
from app.reports.report_generator import generate_report


UPLOAD_FOLDER = "storage/mri_scans"


class MRIService:

    def __init__(self, db: Session):

        self.db = db

        os.makedirs(
            UPLOAD_FOLDER,
            exist_ok=True
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

        # ==========================================
        # Create unique MRI case folder
        # ==========================================

        case_id = str(uuid.uuid4())

        case_folder = os.path.join(
            UPLOAD_FOLDER,
            case_id
        )

        os.makedirs(
            case_folder,
            exist_ok=True
        )

        # ==========================================
        # Save MRI files
        # ==========================================

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
                buffer.write(await file.read())

            saved_files[modality] = filepath

        # ==========================================
        # Create Database Scan Record
        # ==========================================

        scan = MRIScan(

            patient_id=patient_id,

            doctor_id=doctor_id,

            flair_file=saved_files["flair"],

            t1_file=saved_files["t1"],

            t1ce_file=saved_files["t1ce"],

            t2_file=saved_files["t2"],

            prediction_status="Pending"

        )

        self.db.add(scan)

        self.db.commit()

        self.db.refresh(scan)

        # ==========================================
        # Run AI Pipeline
        # ==========================================

        try:

            print("\n========== Starting AI Prediction ==========\n")

            prediction = predict_brain_tumor(

                flair=saved_files["flair"],

                t1=saved_files["t1"],

                t1ce=saved_files["t1ce"],

                t2=saved_files["t2"],

                output_dir=case_folder

            )

            # ==========================================
            # Save AI Results
            # ==========================================

            scan.mask_file = prediction["mask_file"]

            scan.mesh_file = prediction["mesh_file"]

            scan.prediction_status = "Completed"

            self.db.commit()

            self.db.refresh(scan)

            # ==========================================
            # Generate PDF Report
            # ==========================================

            print("Generating PDF report...")

            report_file = generate_report(

                scan=scan,

                statistics=prediction["statistics"],

                output_dir=case_folder

            )

            scan.report_file = report_file

            self.db.commit()

            self.db.refresh(scan)

            print("\n========== AI Prediction Completed ==========\n")

            print("Mask File:", scan.mask_file)

            print("Mesh File:", scan.mesh_file)

            print("Report File:", scan.report_file)

            print("Statistics:")

            print(prediction["statistics"])

        except Exception:

            import traceback

            print("\n========== AI Prediction Failed ==========\n")

            traceback.print_exc()

            scan.prediction_status = "Failed"

            self.db.commit()

            self.db.refresh(scan)

        # ==========================================
        # Return Scan
        # ==========================================

        return scan