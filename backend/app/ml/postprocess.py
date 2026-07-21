import numpy as np
import nibabel as nib



LABELS = {

    0: "Background",

    1: "Necrotic Tumor",

    2: "Edema",

    3: "Enhancing Tumor"

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


    total_voxels = prediction.size


    statistics = {}



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