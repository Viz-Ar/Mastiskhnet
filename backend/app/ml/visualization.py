"""
========================================================
MRI Overlay Visualization

Creates MRI slice + tumor mask overlay

========================================================
"""


import os

import numpy as np

import matplotlib.pyplot as plt

import nibabel as nib




def create_overlay_image(
        mri_path,
        mask,
        output_path="outputs/tumor_overlay.png"
):


    os.makedirs(
        os.path.dirname(output_path),
        exist_ok=True
    )



    # Load MRI volume

    volume = nib.load(
        mri_path
    ).get_fdata()



    # Middle axial slice

    slice_index = volume.shape[2] // 2



    image_slice = volume[:, :, slice_index]



    mask_slice = mask[:, :, slice_index]



    plt.figure(
        figsize=(6,6)
    )



    plt.imshow(

        image_slice.T,

        cmap="gray",

        origin="lower"

    )



    plt.imshow(

        mask_slice.T,

        cmap="jet",

        alpha=0.45,

        origin="lower"

    )



    plt.axis("off")



    plt.savefig(

        output_path,

        bbox_inches="tight",

        dpi=300

    )



    plt.close()



    return output_path