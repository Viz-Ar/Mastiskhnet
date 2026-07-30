import os
import cv2
import numpy as np
import nibabel as nib


LABELS = {
    1: "Necrotic Tumor",
    2: "Edema",
    3: "Enhancing Tumor",
}


# ==========================================================
# MRI INFORMATION
# ==========================================================

def get_voxel_spacing(mri_path):
    """
    Extract voxel spacing from MRI header.
    """

    img = nib.load(mri_path)

    spacing = img.header.get_zooms()[:3]

    return tuple(float(x) for x in spacing)


# ==========================================================
# TUMOR STATISTICS
# ==========================================================

def calculate_statistics(
    prediction,
    voxel_spacing,
):
    """
    Calculate per-class tumor statistics.
    """

    voxel_volume = (
        voxel_spacing[0]
        * voxel_spacing[1]
        * voxel_spacing[2]
    )

    statistics = {}

    total_voxels = prediction.size

    for label, name in LABELS.items():

        voxel_count = np.sum(prediction == label)

        volume_mm3 = voxel_count * voxel_volume

        percentage = (
            voxel_count
            / total_voxels
            * 100
        )

        statistics[name] = {

            "voxels": int(voxel_count),

            "volume_mm3": float(volume_mm3),

            "volume_cm3": float(volume_mm3 / 1000),

            "percentage": float(percentage),

        }

    return statistics


# ==========================================================
# SAVE PREDICTION MASK
# ==========================================================

def save_prediction_nifti(
    prediction,
    reference_mri,
    output_dir,
):
    """
    Save prediction mask while preserving
    affine and header.
    """

    reference = nib.load(reference_mri)

    prediction_img = nib.Nifti1Image(

        prediction.astype(np.uint8),

        reference.affine,

        reference.header.copy(),

    )

    output_path = os.path.join(

        output_dir,

        "prediction_mask.nii.gz",

    )

    nib.save(
        prediction_img,
        output_path,
    )

    print(f"Prediction saved to: {output_path}")

    return output_path


# ==========================================================
# GENERATE SLICE IMAGES
# ==========================================================

def generate_slice_images(
    input_tensor,
    prediction,
    output_dir,
):
    """
    Creates

    output_dir/
        slices/
            original/
            mask/
            overlay/

    Each folder contains matching slice indices.
    """

    slice_root = os.path.join(
        output_dir,
        "slices",
    )

    original_dir = os.path.join(
        slice_root,
        "original",
    )

    mask_dir = os.path.join(
        slice_root,
        "mask",
    )

    overlay_dir = os.path.join(
        slice_root,
        "overlay",
    )

    os.makedirs(original_dir, exist_ok=True)
    os.makedirs(mask_dir, exist_ok=True)
    os.makedirs(overlay_dir, exist_ok=True)

    # ======================================================
    # Prepare MRI
    # ======================================================

    flair = input_tensor

    if hasattr(flair, "detach"):
        flair = flair.detach().cpu().numpy()

    flair = np.asarray(flair)

    while flair.ndim > 4:
        flair = flair[0]

    if flair.ndim == 4:
        flair = flair[0]

    flair = flair.astype(np.float32)

    flair -= flair.min()

    flair /= (flair.max() + 1e-8)

    flair *= 255

    flair = flair.astype(np.uint8)

    # ======================================================
    # Prepare Prediction
    # ======================================================

    if prediction.ndim == 4:
        prediction = prediction.squeeze(0)

    prediction = prediction.astype(np.uint8)

    total_slices = prediction.shape[0]

    print(f"Generating {total_slices} slice images...")

    # ======================================================
    # Generate Images
    # ======================================================

    for i in range(total_slices):

        original = flair[i]

        mask_slice = prediction[i]

        # -----------------------------
        # Colored Segmentation
        # Matches mesh.py: 1=Necrotic(red), 2=Edema(yellow), 3=Enhancing(green)
        # -----------------------------

        segmentation = np.zeros(
            (mask_slice.shape[0], mask_slice.shape[1], 3),
            dtype=np.uint8,
        )

        segmentation[mask_slice == 1] = (0, 0, 255)      # BGR → Red    (Necrotic)
        segmentation[mask_slice == 2] = (0, 255, 255)    # BGR → Yellow (Edema)
        segmentation[mask_slice == 3] = (0, 255, 0)      # BGR → Green  (Enhancing)

        # -----------------------------
        # Overlay
        # -----------------------------

        overlay = cv2.cvtColor(
            original,
            cv2.COLOR_GRAY2BGR,
        )

        overlay = cv2.addWeighted(
            overlay,
            0.75,
            segmentation,
            0.60,
            0,
        )

        # -----------------------------
        # Save Images
        # -----------------------------

        cv2.imwrite(
            os.path.join(
                original_dir,
                f"{i:03d}.png",
            ),
            original,
        )

        cv2.imwrite(
            os.path.join(
                mask_dir,
                f"{i:03d}.png",
            ),
            segmentation,
        )

        cv2.imwrite(
            os.path.join(
                overlay_dir,
                f"{i:03d}.png",
            ),
            overlay,
        )

    print("Slice generation completed.")

    # ======================================================
    # Return Information
    # ======================================================

    return {

        "total_slices": total_slices,

        "slice_root": slice_root,

        "original_folder": original_dir,

        "segmentation_folder": mask_dir,

        "overlay_folder": overlay_dir,

    }