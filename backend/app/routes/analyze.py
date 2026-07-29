from fastapi import APIRouter, UploadFile, File
import os
import shutil

from app.ml.predictor import predict_brain_tumor
from app.ml.postprocess import (
    calculate_statistics,
    get_voxel_spacing,
)
from app.ml.visualization_3d import create_3d_mesh
from app.ml.report_generator import generate_medical_report

router = APIRouter(
    prefix="/mri",
    tags=["MRI"],
)

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


@router.post("/analyze")
async def analyze_mri(
    flair: UploadFile = File(...),
    t1: UploadFile = File(...),
    t1ce: UploadFile = File(...),
    t2: UploadFile = File(...),
):
    # =====================================================
    # Save uploaded MRI files
    # =====================================================

    files = {
        "flair": flair,
        "t1": t1,
        "t1ce": t1ce,
        "t2": t2,
    }

    paths = {}

    for modality, file in files.items():

        file_path = os.path.join(
            UPLOAD_DIR,
            file.filename,
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        paths[modality] = file_path

    # =====================================================
    # Run AI Prediction
    # =====================================================

    prediction = predict_brain_tumor(
        flair=paths["flair"],
        t1=paths["t1"],
        t1ce=paths["t1ce"],
        t2=paths["t2"],
        output_dir=OUTPUT_DIR,
    )

    prediction_mask = prediction["mask"]

    # =====================================================
    # Calculate Statistics
    # =====================================================

    voxel_spacing = get_voxel_spacing(paths["flair"])

    statistics = calculate_statistics(
        prediction_mask,
        voxel_spacing,
    )

    # =====================================================
    # Generate 3D Mesh
    # =====================================================

    mesh_path = create_3d_mesh(
        prediction_mask,
        output_path=os.path.join(
            OUTPUT_DIR,
            "tumor_mesh.obj",
        ),
    )

    # =====================================================
    # Generate Medical Report
    # =====================================================

    report = generate_medical_report(
        statistics,
        voxel_spacing,
    )

    # =====================================================
    # Convert Statistics to JSON-safe values
    # =====================================================

    clean_statistics = {}

    for key, value in statistics.items():

        clean_statistics[key] = {
            "voxels": int(value["voxels"]),
            "volume_mm3": float(value["volume_mm3"]),
            "percentage": float(value["percentage"]),
        }

    # =====================================================
    # Extract AI Results
    # =====================================================

    tumor_type = prediction.get("tumor_type", "Unknown")

    confidence = float(
        prediction.get("confidence", 0.0)
    )

    tumor_volume = float(
        prediction.get("tumor_volume", 0.0)
    )

    tumor_area = float(
        prediction.get("tumor_area", 0.0)
    )

    processing_time = float(
        prediction.get("processing_time", 0.0)
    )

    model_name = prediction.get(
        "model_name",
        "Attention U-Net",
    )

    # =====================================================
    # Response
    # =====================================================

    return {
        "message": "MRI analyzed successfully",

        "prediction_status": "Completed",

        "tumor_type": tumor_type,

        "confidence": confidence,

        "tumor_volume": tumor_volume,

        "tumor_area": tumor_area,

        "processing_time": processing_time,

        "model_name": model_name,

        "mask_generated": True,

        "mask_file": prediction.get("mask_file"),

        "overlay_file": prediction.get("overlay_file"),

        "mesh_file": prediction.get("mesh_file"),

        "3d_model": mesh_path,

        "voxel_spacing": {
            "x": float(voxel_spacing[0]),
            "y": float(voxel_spacing[1]),
            "z": float(voxel_spacing[2]),
        },

        "report": report,

        "statistics": clean_statistics,
    }