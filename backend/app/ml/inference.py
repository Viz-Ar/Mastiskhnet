"""
========================================================
MastiskhNet Inference Engine

Pipeline:

Input:
    Preprocessed MRI tensor

Process:
    Attention U-Net 3D

Output:
    Segmentation Mask (.npy)

Responsibilities:
    ✓ Model inference
    ✓ GPU/CPU handling
    ✓ Tensor conversion
    ✓ Mask saving

Not responsible for:
    ✗ Statistics
    ✗ 3D Mesh
    ✗ Visualization
    ✗ Report generation

========================================================
"""


import os

import numpy as np

import torch





def run_inference(

        input_tensor,

        model,

        output_dir="outputs"

):


    """
    Run MastiskhNet prediction


    Parameters
    ----------
    input_tensor:
        Preprocessed MRI tensor
        Shape:
        [1,4,128,128,128]


    model:
        Loaded Attention U-Net model


    output_dir:
        Folder for saving prediction


    Returns
    -------
    numpy.ndarray
        Segmentation mask

    """



    # =====================================
    # Create output directory
    # =====================================


    os.makedirs(

        output_dir,

        exist_ok=True

    )



    # =====================================
    # Select device
    # =====================================


    device = next(

        model.parameters()

    ).device



    input_tensor = input_tensor.to(

        device

    )



    # =====================================
    # Evaluation mode
    # =====================================


    model.eval()



    # =====================================
    # Model prediction
    # =====================================


    with torch.no_grad():


        output = model(

            input_tensor

        )



        """
        Output shape:

        [batch, classes, depth, height, width]

        Example:

        [1,4,128,128,128]

        """



        prediction = torch.argmax(

            output,

            dim=1

        )



    # =====================================
    # Remove batch dimension
    # =====================================


    mask = prediction.squeeze(

        0

    )



    # =====================================
    # Tensor -> NumPy
    # =====================================


    mask = mask.cpu().numpy()



    # =====================================
    # Ensure integer mask
    # =====================================


    mask = mask.astype(

        np.uint8

    )



    # =====================================
    # Save segmentation mask
    # =====================================


    mask_path = os.path.join(

        output_dir,

        "prediction_mask.npy"

    )



    np.save(

        mask_path,

        mask

    )



    print(

        f"Mask saved: {mask_path}"

    )



    print(

        "Prediction shape:",

        mask.shape

    )


    print(

        "Unique classes:",

        np.unique(mask)

    )



    return mask