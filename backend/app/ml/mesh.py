"""
==========================================================
MastiskhNet 3D Mesh Generator
==========================================================

Input:
    prediction_mask.nii.gz

Output:
    tumor_mesh.obj

==========================================================
"""

import os

import nibabel as nib
import numpy as np

from skimage import measure
import trimesh


def generate_mesh(
    mask_path: str,
    output_dir: str
):
    """
    Generate a 3D OBJ mesh from the
    predicted tumor segmentation.
    """

    os.makedirs(output_dir, exist_ok=True)

    # -----------------------------------
    # Load segmentation mask
    # -----------------------------------

    mask_img = nib.load(mask_path)

    mask = mask_img.get_fdata()

    # Convert to binary tumor mask
    # All tumor labels become 1

    binary_mask = (mask > 0).astype(np.uint8)

    # No tumor detected

    if np.sum(binary_mask) == 0:

        print("No tumor found.")

        return None

    # -----------------------------------
    # Marching Cubes
    # -----------------------------------

    verts, faces, normals, values = measure.marching_cubes(
        binary_mask,
        level=0.5
    )

    # -----------------------------------
    # Create mesh
    # -----------------------------------

    mesh = trimesh.Trimesh(
        vertices=verts,
        faces=faces,
        vertex_normals=normals,
        process=False
    )

    mesh_path = os.path.join(
        output_dir,
        "tumor_mesh.obj"
    )

    mesh.export(mesh_path)

    print(f"Mesh saved: {mesh_path}")

    return mesh_path