from pathlib import Path
import torch


# Project root directory
ROOT = Path(__file__).resolve().parent.parent


# Device configuration
DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# Model configuration

MODEL_NAME = "best_model.pth"

NUM_CLASSES = 4

INPUT_CHANNELS = 4


# Storage paths

UPLOAD_DIR = ROOT / "uploads"

OUTPUT_DIR = ROOT / "outputs"


UPLOAD_DIR.mkdir(
    exist_ok=True
)

OUTPUT_DIR.mkdir(
    exist_ok=True
)