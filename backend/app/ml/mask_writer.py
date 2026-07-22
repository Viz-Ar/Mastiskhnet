import os
import nibabel as nib
import numpy as np


def save_mask_nifti(mask, output_dir):

    os.makedirs(output_dir, exist_ok=True)

    path = os.path.join(
        output_dir,
        "prediction_mask.nii.gz"
    )

    img = nib.Nifti1Image(
        mask.astype(np.uint8),
        affine=np.eye(4)
    )

    nib.save(
        img,
        path
    )

    print(
        f"NIfTI mask saved: {path}"
    )

    return path