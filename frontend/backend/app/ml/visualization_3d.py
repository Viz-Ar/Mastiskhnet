"""
========================================================
MastiskhNet Visualization Module

Functions:
1. create_3d_mesh()
   - Convert segmentation mask into OBJ mesh

2. create_overlay_image()
   - Generate MRI + tumor mask overlay

========================================================
"""


import os
import numpy as np

import matplotlib.pyplot as plt

import nibabel as nib

from skimage import measure

import trimesh




# ======================================================
# 3D Tumor Mesh Generation
# ======================================================


def create_3d_mesh(
        mask,
        output_path="outputs/tumor_mesh.obj"
):


    """
    Convert 3D segmentation mask into mesh
    using Marching Cubes
    """


    # Create output folder

    folder = os.path.dirname(output_path)

    if folder:

        os.makedirs(
            folder,
            exist_ok=True
        )



    # Remove background

    binary_mask = (
        mask > 0
    ).astype(np.uint8)



    if binary_mask.sum() == 0:

        raise ValueError(
            "No tumor detected"
        )



    # ==============================
    # Marching Cubes
    # ==============================


    vertices, faces, normals, values = measure.marching_cubes(

        binary_mask,

        level=0.5

    )



    # ==============================
    # Create Mesh
    # ==============================


    mesh = trimesh.Trimesh(

        vertices=vertices,

        faces=faces,

        vertex_normals=normals

    )



    # ==============================
    # Mesh Cleanup
    # Compatible with latest trimesh
    # ==============================


    mesh.process(
        validate=True
    )



    # Save OBJ

    mesh.export(
        output_path
    )



    return output_path





# ======================================================
# MRI Overlay Visualization
# ======================================================


def create_overlay_image(

        mri_path,

        mask,

        output_path="outputs/overlay.png"

):


    """
    Create MRI slice with tumor overlay
    """


    folder = os.path.dirname(output_path)


    if folder:

        os.makedirs(

            folder,

            exist_ok=True

        )



    # Load MRI

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

        alpha=0.4,

        origin="lower"

    )



    plt.axis(
        "off"
    )



    plt.savefig(

        output_path,

        bbox_inches="tight",

        dpi=300

    )


    plt.close()



    return output_path