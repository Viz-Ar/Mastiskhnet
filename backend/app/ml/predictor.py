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
Slice Generation
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
    calculate_statistics,
    generate_slice_images,
)


def predict_brain_tumor(
    flair,
    t1,
    t1ce,
    t2,
    output_dir="outputs",
):

    os.makedirs(output_dir, exist_ok=True)

    # ==================================================
    # PREPROCESSING
    # ==================================================

    print("\nPreparing MRI volumes...")

    input_tensor = prepare_input(
        flair,
        t1,
        t1ce,
        t2,
    )

    # ==================================================
    # LOAD MODEL
    # ==================================================

    print("\nLoading Attention U-Net...")

    model = load_model()

    # ==================================================
    # INFERENCE
    # ==================================================

    print("\nRunning Segmentation...")

    mask, confidence = run_inference(
        input_tensor,
        model,
        output_dir,
    )

    # ==================================================
    # SAVE NIFTI MASK
    # ==================================================

    print("\nSaving Prediction Mask...")

    mask_file = save_prediction_nifti(
        prediction=mask,
        reference_mri=flair,
        output_dir=output_dir,
    )

    print("Mask Saved:", mask_file)

    # ==================================================
    # GENERATE SLICE IMAGES
    # ==================================================

    print("\nGenerating Slice Viewer Images...")

    slice_result = generate_slice_images(
        flair_path=flair,
        prediction=mask,
        output_dir=output_dir,
    )

    print("Original Folder:", slice_result["original_folder"])
    print("Segmentation Folder:", slice_result["segmentation_folder"])
    print("Overlay Folder:", slice_result["overlay_folder"])
    print("Total Slices:", slice_result["total_slices"])

    # ==================================================
    # GENERATE 3D MESH
    # ==================================================

    print("\nGenerating 3D Mesh...")

    mesh_result = generate_mesh(
        mask_path=mask_file,
        output_dir=output_dir,
    )

    mesh_file = None
    mesh_glb_file = None

    if mesh_result:

        mesh_file = mesh_result.get("obj_path")
        mesh_glb_file = mesh_result.get("glb_path")

    print("OBJ:", mesh_file)
    print("GLB:", mesh_glb_file)

    # ==================================================
    # CALCULATE STATISTICS
    # ==================================================

    print("\nCalculating Statistics...")

    spacing = get_voxel_spacing(flair)

    statistics = calculate_statistics(
        prediction=mask,
        voxel_spacing=spacing,
    )

    total_volume_cm3 = sum(
        region["volume_cm3"]
        for region in statistics.values()
    )

    detected_regions = {
        name: region
        for name, region in statistics.items()
        if region["voxels"] > 0
    }

    if detected_regions:

        dominant_region = max(
            detected_regions,
            key=lambda x: detected_regions[x]["volume_cm3"],
        )

    else:

        dominant_region = "No Tumor Detected"

    # ==================================================
    # DEBUG
    # ==================================================

    print("\n========== MastiskhNet Prediction ==========")

    print("Mask File:", mask_file)

    print("Mesh OBJ:", mesh_file)

    print("Mesh GLB:", mesh_glb_file)

    print("Original:", slice_result["original_folder"])

    print("Segmentation:", slice_result["segmentation_folder"])

    print("Overlay:", slice_result["overlay_folder"])

    print("Total Slices:", slice_result["total_slices"])

    print("Tumor:", dominant_region)

    print("Confidence:", confidence)

    print("Volume:", total_volume_cm3)

    print("============================================")

    # ==================================================
    # RETURN
    # ==================================================

    return {

        "mask": mask,

        "mask_file": mask_file,

        "mesh_file": mesh_file,

        "mesh_glb_file": mesh_glb_file,

        "statistics": statistics,

        "tumor_type": dominant_region,

        "confidence": confidence,

        "tumor_volume": total_volume_cm3,

        "input": input_tensor,

        "original_folder": slice_result["original_folder"],

        "segmentation_folder": slice_result["segmentation_folder"],

        "overlay_folder": slice_result["overlay_folder"],

        "total_slices": slice_result["total_slices"],

    }