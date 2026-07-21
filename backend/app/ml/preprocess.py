"""
==========================================================
Preprocessing Utilities
MastiskhNet
==========================================================
"""

import nibabel as nib
import numpy as np
import torch
import torch.nn.functional as F

from app.config import DEVICE


def load_nifti(path):
    volume = nib.load(path).get_fdata()
    return volume.astype(np.float32)


def normalize(volume):

    mask = volume > 0

    if mask.sum() == 0:
        return volume

    mean = volume[mask].mean()
    std = volume[mask].std()

    volume[mask] = (volume[mask] - mean) / (std + 1e-8)

    return volume


def prepare_input(flair, t1, t1ce, t2):

    flair = normalize(load_nifti(flair))
    t1 = normalize(load_nifti(t1))
    t1ce = normalize(load_nifti(t1ce))
    t2 = normalize(load_nifti(t2))

    volume = np.stack(
        [
            flair,
            t1,
            t1ce,
            t2
        ],
        axis=0
    )

    tensor = torch.tensor(
        volume,
        dtype=torch.float32
    )

    tensor = tensor.unsqueeze(0)

    tensor = F.interpolate(
        tensor,
        size=(128, 128, 128),
        mode="trilinear",
        align_corners=False
    )

    return tensor.to(DEVICE)


def get_original_geometry(path):

    img = nib.load(path)

    shape = img.shape[:3]
    zooms = tuple(float(z) for z in img.header.get_zooms()[:3])

    return shape, zooms