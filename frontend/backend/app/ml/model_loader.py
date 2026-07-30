"""
==========================================================
MastiskhNet Model Loader
==========================================================
"""

import torch

from huggingface_hub import hf_hub_download

from app.config import DEVICE

from app.ml.model import AttentionUNet3D


MODEL = None


def load_model():

    global MODEL


    if MODEL is not None:
        return MODEL


    print("Downloading model from Hugging Face...")


    model_path = hf_hub_download(
        repo_id="classicmaster/mastiskhnet-brain-tumor-segmentation",
        filename="best_model.pth"
    )


    print("Loading model...")


    model = AttentionUNet3D()


    checkpoint = torch.load(
        model_path,
        map_location=DEVICE
    )


    # Handle checkpoint formats

    if isinstance(checkpoint, dict):

        if "model_state_dict" in checkpoint:

            checkpoint = checkpoint["model_state_dict"]


    model.load_state_dict(
        checkpoint
    )


    model.to(DEVICE)


    model.eval()


    MODEL = model


    print("✓ MastiskhNet loaded successfully.")


    return MODEL