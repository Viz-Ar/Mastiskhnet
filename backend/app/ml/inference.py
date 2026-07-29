"""
========================================================
MastiskhNet Inference Engine
========================================================
"""


import os

import numpy as np

import torch

import torch.nn.functional as F


def run_inference(

        input_tensor,

        model,

        output_dir="outputs"

):

    os.makedirs(
        output_dir,
        exist_ok=True
    )

    device = next(
        model.parameters()
    ).device

    input_tensor = input_tensor.to(
        device
    )

    model.eval()

    with torch.no_grad():

        output = model(
            input_tensor
        )

        # =====================================
        # Softmax probabilities (before argmax)
        # Used to compute a confidence score.
        # =====================================

        probs = F.softmax(
            output,
            dim=1
        )

        prediction = torch.argmax(
            output,
            dim=1
        )

        # Max class probability per voxel
        max_probs = torch.max(
            probs,
            dim=1
        ).values

    mask = prediction.squeeze(0)
    max_probs = max_probs.squeeze(0)

    mask = mask.cpu().numpy().astype(np.uint8)
    max_probs = max_probs.cpu().numpy()

    # =====================================
    # Confidence = mean probability over
    # voxels predicted as tumor (label > 0).
    # Falls back to 0.0 if no tumor found.
    # =====================================

    tumor_voxels = mask > 0

    if np.sum(tumor_voxels) > 0:

        confidence = float(
            np.mean(max_probs[tumor_voxels]) * 100
        )

    else:

        confidence = 0.0

    mask_path = os.path.join(
        output_dir,
        "prediction_mask.npy"
    )

    np.save(mask_path, mask)

    print(f"Mask saved: {mask_path}")
    print("Prediction shape:", mask.shape)
    print("Unique classes:", np.unique(mask))
    print("Confidence:", round(confidence, 2), "%")

    return mask, confidence