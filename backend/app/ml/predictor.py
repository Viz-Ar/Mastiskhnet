"""
==========================================================
MastiskhNet Predictor

MRI
 |
Preprocessing
 |
Attention U-Net 3D
 |
Segmentation
 |
Postprocessing
 |
Statistics
 |
3D Mesh

==========================================================
"""


import os


from app.ml.model_loader import load_model

from app.ml.preprocess import prepare_input

from app.ml.inference import run_inference

from app.ml.mesh import generate_mesh

from app.ml.postprocess import (
    save_prediction_nifti,
    get_voxel_spacing,
    calculate_statistics
)



def predict_brain_tumor(
    flair,
    t1,
    t1ce,
    t2,
    output_dir="outputs"
):

    """
    Complete MastiskhNet prediction pipeline

    Input:
        Four MRI modalities:
        - Flair
        - T1
        - T1CE
        - T2

    Output:
        Segmentation mask
        NIfTI mask
        3D mesh
        Tumor statistics
    """



    # ==================================================
    # Create output folder
    # ==================================================

    os.makedirs(
        output_dir,
        exist_ok=True
    )



    # ==================================================
    # Preprocessing
    # ==================================================

    print("\nPreparing MRI volumes...")

    input_tensor = prepare_input(
        flair,
        t1,
        t1ce,
        t2
    )



    # ==================================================
    # Load Model
    # ==================================================

    print("\nLoading model...")

    model = load_model()



    # ==================================================
    # Segmentation Inference
    # ==================================================

    print("\nRunning segmentation...")

    mask = run_inference(
        input_tensor,
        model,
        output_dir
    )



    print(
        "Segmentation mask generated"
    )



    # ==================================================
    # Save NIfTI Mask
    # ==================================================

    print("\nSaving NIfTI prediction...")


    mask_file = save_prediction_nifti(
        prediction=mask,
        reference_mri=flair,
        output_dir=output_dir
    )



    print(
        "NIfTI mask:",
        mask_file
    )



    # ==================================================
    # Generate 3D Mesh
    # ==================================================

    print("\nGenerating 3D tumor mesh...")


    mesh_file = generate_mesh(
        mask_path=mask_file,
        output_dir=output_dir
    )



    print(
        "Mesh:",
        mesh_file
    )



    # ==================================================
    # Tumor Statistics
    # ==================================================

    print("\nCalculating tumor statistics...")


    spacing = get_voxel_spacing(
        flair
    )


    statistics = calculate_statistics(
        prediction=mask,
        voxel_spacing=spacing
    )



    print(
        "Statistics calculated"
    )



    # ==================================================
    # Debug Check
    # ==================================================

    print("\n========== Prediction Output ==========")

    print(
        "Mask file:",
        mask_file
    )

    print(
        "Mesh file:",
        mesh_file
    )

    print(
        "Statistics:",
        statistics
    )

    print(
        "======================================"
    )



    # ==================================================
    # Return Result
    # ==================================================

    return {

        "mask": mask,

        "mask_file": mask_file,

        "mesh_file": mesh_file,

        "statistics": statistics,

        "input": input_tensor

    }