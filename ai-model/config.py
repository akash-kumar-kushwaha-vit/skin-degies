"""
SkinDegies AI Service — Configuration
======================================
Central configuration module. All tuneable parameters live here.
To retrain the model and deploy a new version, replace best_model.pth
and update IMAGE_SIZE if the new model uses a different resolution.
No other files need to change.
"""

import os
from pathlib import Path
from pydantic_settings import BaseSettings


# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).parent.resolve()
CHECKPOINTS_DIR = BASE_DIR / "checkpoints"
LOGS_DIR = BASE_DIR / "logs"

# Create directories if they don't exist
CHECKPOINTS_DIR.mkdir(parents=True, exist_ok=True)
LOGS_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# Model — 22 skin disease classes (must match training order exactly)
# ---------------------------------------------------------------------------
CLASSES = [
    "Acne",
    "Actinic_Keratosis",
    "Benign_tumors",
    "Bullous",
    "Candidiasis",
    "DrugEruption",
    "Eczema",
    "Infestations_Bites",
    "Lichen",
    "Lupus",
    "Moles",
    "Psoriasis",
    "Rosacea",
    "Seborrh_Keratoses",
    "SkinCancer",
    "Sun_Sunlight_Damage",
    "Tinea",
    "Unknown_Normal",
    "Vascular_Tumors",
    "Vasculitis",
    "Vitiligo",
    "Warts",
]

NUM_CLASSES = len(CLASSES)  # 22


# ---------------------------------------------------------------------------
# Image Preprocessing — must mirror training transforms exactly
# ---------------------------------------------------------------------------
IMAGE_SIZE = 384          # EfficientNetV2-S training resolution
IMAGE_MEAN = (0.485, 0.456, 0.406)   # ImageNet mean
IMAGE_STD  = (0.229, 0.224, 0.225)   # ImageNet std
MAX_IMAGE_BYTES = 10 * 1024 * 1024   # 10 MB upload limit
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp"}


# ---------------------------------------------------------------------------
# Application settings (loaded from environment / .env)
# ---------------------------------------------------------------------------
class Settings(BaseSettings):
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 1          # Keep at 1; model is loaded once per process
    RELOAD: bool = False      # True only in local dev

    # Model
    MODEL_PATH: str = str(CHECKPOINTS_DIR / "best_model.pth")
    MODEL_ARCH: str = "efficientnet_v2_s"   # torchvision identifier

    # Inference
    TOP_K: int = 3            # Return top-K predictions
    CONFIDENCE_THRESHOLD: float = 0.0   # Min confidence to include (0 = all)

    # CORS — comma-separated allowed origins
    ALLOWED_ORIGINS: str = "*"

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = str(LOGS_DIR / "ai_service.log")

    # Environment tag
    ENVIRONMENT: str = "production"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


settings = Settings()
