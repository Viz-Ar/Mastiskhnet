from fastapi import APIRouter, UploadFile, File

import shutil
import os


from app.ml.predictor import predict_brain_tumor


from app.ml.postprocess import (
    calculate_statistics,
    get_voxel_spacing
)


from app.ml.visualization_3d import create_3d_mesh


from app.ml.report_generator import generate_medical_report




router = APIRouter(
    prefix="/mri",
    tags=["MRI"]
)



UPLOAD_DIR = "uploads"

OUTPUT_DIR = "outputs"



os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


os.makedirs(
    OUTPUT_DIR,
    exist_ok=True
)





@router.post("/analyze")
async def analyze_mri(


    flair: UploadFile = File(...),

    t1: UploadFile = File(...),

    t1ce: UploadFile = File(...),

    t2: UploadFile = File(...)


):


    files = {


        "flair": flair,

        "t1": t1,

        "t1ce": t1ce,

        "t2": t2

    }



    paths = {}



    # ==================================
    # Save uploaded MRI files
    # ==================================

    for name, file in files.items():


        file_path = os.path.join(

            UPLOAD_DIR,

            file.filename

        )


        with open(

            file_path,

            "wb"

        ) as buffer:


            shutil.copyfileobj(

                file.file,

                buffer

            )


        paths[name] = file_path





    # ==================================
    # MastiskhNet Inference
    # ==================================

    prediction_result = predict_brain_tumor(

        paths["flair"],

        paths["t1"],

        paths["t1ce"],

        paths["t2"],

        OUTPUT_DIR

    )



    prediction_mask = prediction_result["mask"]





    # ==================================
    # MRI Voxel Information
    # ==================================

    voxel_spacing = get_voxel_spacing(

        paths["flair"]

    )





    # ==================================
    # Tumor Statistics
    # ==================================

    statistics = calculate_statistics(

        prediction_mask,

        voxel_spacing

    )





    # ==================================
    # Generate 3D Tumor Mesh
    # ==================================

    mesh_path = create_3d_mesh(

        prediction_mask,

        output_path=os.path.join(

            OUTPUT_DIR,

            "tumor_mesh.obj"

        )

    )





    # ==================================
    # Generate Medical Report
    # ==================================

    report = generate_medical_report(

        statistics,

        voxel_spacing

    )





    # ==================================
    # Convert NumPy values
    # For FastAPI JSON
    # ==================================

    clean_statistics = {}



    for key, value in statistics.items():


        clean_statistics[key] = {


            "voxels":

            int(value["voxels"]),



            "volume_mm3":

            float(value["volume_mm3"]),



            "percentage":

            float(value["percentage"])

        }





    # ==================================
    # Final API Response
    # ==================================

    return {


        "message":

        "MRI analyzed successfully",



        "mask_generated":

        True,



        "3d_model":

        mesh_path,



        "voxel_spacing":

        {

            "x":

            float(voxel_spacing[0]),


            "y":

            float(voxel_spacing[1]),


            "z":

            float(voxel_spacing[2])

        },



        "report":

        report,



        "statistics":

        clean_statistics

    }