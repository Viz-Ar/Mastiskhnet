import os
import numpy as np
import nibabel as nib



LABELS = {

    0: "Necrotic Tumor",

    1: "Edema",

    2: "Enhancing Tumor"

}



def get_voxel_spacing(mri_path):

    """
    Extract voxel size from MRI header
    """

    img = nib.load(mri_path)

    spacing = img.header.get_zooms()[:3]

    return tuple(
        float(x)
        for x in spacing
    )



def calculate_statistics(
        prediction,
        voxel_spacing
):


    voxel_volume = (

        voxel_spacing[0]
        *
        voxel_spacing[1]
        *
        voxel_spacing[2]

    )


    statistics = {}


    total_voxels = prediction.size



    for label, name in LABELS.items():


        voxel_count = np.sum(
            prediction == label
        )


        volume_mm3 = (

            voxel_count
            *
            voxel_volume

        )


        percentage = (

            voxel_count
            /
            total_voxels

            *
            100

        )


        statistics[name] = {


            "voxels":
                int(voxel_count),


            "volume_mm3":
                float(volume_mm3),


            "volume_cm3":
                float(
                    volume_mm3 / 1000
                ),


            "percentage":
                float(percentage)

        }


    return statistics


def save_prediction_nifti(
    prediction,
    reference_mri,
    output_dir
):
    """
    Save prediction as NIfTI while preserving
    the original MRI affine and header.
    """

    reference = nib.load(reference_mri)

    affine = reference.affine
    header = reference.header.copy()

    prediction = prediction.astype(np.uint8)

    prediction_img = nib.Nifti1Image(
        prediction,
        affine,
        header
    )

    output_path = os.path.join(
        output_dir,
        "prediction_mask.nii.gz"
    )

    nib.save(
        prediction_img,
        output_path
    )

    print(f"Prediction saved to: {output_path}")

    return output_path