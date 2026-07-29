"""
==========================================================
MastiskhNet 3D Mesh Generator
==========================================================

Input:
    prediction_mask.nii.gz

Output:
    tumor_mesh.obj + tumor_mesh.obj.mtl  (download / legacy)
    tumor_mesh.glb                        (in-app 3D viewer)
    (3 colored regions: necrotic, edema, enhancing)

==========================================================
"""

import os

import nibabel as nib
import numpy as np

from skimage import measure
import trimesh


# BraTS label convention
LABEL_INFO = {
    1: {"name": "necrotic", "color": [220, 20, 20, 255]},    # red
    2: {"name": "edema", "color": [230, 220, 30, 255]},      # yellow
    4: {"name": "enhancing", "color": [30, 200, 60, 255]},   # green
}


def generate_mesh(
    mask_path: str,
    output_dir: str
):
    """
    Generate a 3D colored mesh from the predicted tumor
    segmentation, split into necrotic / edema / enhancing
    regions. Exports both .obj (download) and .glb (viewer).
    """

    os.makedirs(output_dir, exist_ok=True)

    # -----------------------------------
    # Load segmentation mask
    # -----------------------------------

    mask_img = nib.load(mask_path)

    mask = mask_img.get_fdata()

    if np.sum(mask > 0) == 0:

        print("No tumor found.")

        return None

    # -----------------------------------
    # Marching Cubes Per Label
    # -----------------------------------

    geometries = {}

    for label, info in LABEL_INFO.items():

        label_mask = (mask == label).astype(np.uint8)

        if np.sum(label_mask) == 0:

            print(f"No voxels for label {label} ({info['name']}), skipping.")

            continue

        try:

            verts, faces, normals, values = measure.marching_cubes(
                label_mask,
                level=0.5
            )

        except Exception as e:

            print(f"Marching cubes failed for {info['name']}: {e}")

            continue

        sub_mesh = trimesh.Trimesh(
            vertices=verts,
            faces=faces,
            vertex_normals=normals,
            process=False
        )

        sub_mesh.visual = trimesh.visual.TextureVisuals(
            material=trimesh.visual.material.SimpleMaterial(
                diffuse=info["color"]
            )
        )

        geometries[info["name"]] = sub_mesh

    if not geometries:

        print("No tumor regions could be meshed.")

        return None

    # -----------------------------------
    # Combine Into Scene & Export
    # -----------------------------------

    scene = trimesh.Scene(geometries)

    mesh_path = os.path.join(
        output_dir,
        "tumor_mesh.obj"
    )

    scene.export(mesh_path)

    print(f"Mesh saved: {mesh_path} (regions: {list(geometries.keys())})")

    # -----------------------------------
    # Also export GLB for the in-app 3D
    # viewer (model-viewer/web only loads
    # glTF/GLB, not raw OBJ).
    # -----------------------------------

    glb_path = os.path.join(
        output_dir,
        "tumor_mesh.glb"
    )

    try:

        scene.export(glb_path)

        print(f"GLB saved: {glb_path}")

    except Exception as e:

        print(f"GLB export failed: {e}")

        glb_path = None

    return {
        "obj_path": mesh_path,
        "glb_path": glb_path,
    }