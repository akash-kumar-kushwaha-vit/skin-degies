"""
SkinDegies AI Service — Image Preprocessing Pipeline
======================================================
Replicates the EXACT same transforms used during training:
  - Resize to 384×384
  - ToTensor (converts PIL image to [0,1] float tensor)
  - Normalize with ImageNet mean/std

No test-time augmentation (TTA) is applied for latency reasons, but
the pipeline is designed to be extended easily.
"""

import io
import logging
from typing import Tuple

import cv2
import numpy as np
import torch
from PIL import Image, UnidentifiedImageError

from config import (
    ALLOWED_MIME_TYPES,
    IMAGE_MEAN,
    IMAGE_SIZE,
    IMAGE_STD,
    MAX_IMAGE_BYTES,
)

logger = logging.getLogger("skindegies.preprocess")


# ---------------------------------------------------------------------------
# Torchvision-style transforms (no albumentations at inference to stay
# consistent with validation transforms used during training)
# ---------------------------------------------------------------------------

def _get_inference_transforms():
    """
    Returns a callable that applies the same transforms used at validation time.
    Uses torchvision.transforms for minimal dependencies at runtime.
    """
    from torchvision import transforms

    return transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=list(IMAGE_MEAN), std=list(IMAGE_STD)),
    ])


# Build transform once at module load — reused for every request
_INFERENCE_TRANSFORM = _get_inference_transforms()


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def validate_image_bytes(data: bytes, content_type: str | None) -> None:
    """
    Validate raw image bytes before preprocessing.

    Raises:
        ValueError: If validation fails (size, MIME type, or content).
    """
    # 1. Size check
    if len(data) > MAX_IMAGE_BYTES:
        raise ValueError(
            f"Image too large: {len(data) / (1024 * 1024):.1f} MB. "
            f"Maximum allowed: {MAX_IMAGE_BYTES // (1024 * 1024)} MB."
        )

    # 2. MIME type check (from Content-Type header)
    if content_type and content_type not in ALLOWED_MIME_TYPES:
        raise ValueError(
            f"Unsupported file type: '{content_type}'. "
            f"Allowed types: {', '.join(ALLOWED_MIME_TYPES)}."
        )

    # 3. Content validation — try to open with PIL (catches corrupt files)
    try:
        img = Image.open(io.BytesIO(data))
        img.verify()  # checks integrity without fully decoding
    except (UnidentifiedImageError, Exception) as exc:
        raise ValueError(f"Uploaded file is not a valid image: {exc}") from exc


def preprocess_image(data: bytes) -> Tuple[torch.Tensor, Tuple[int, int]]:
    """
    Decode and preprocess image bytes into an inference-ready tensor.

    Steps:
        1. Decode bytes → PIL RGB image
        2. Apply inference transforms (resize → tensor → normalize)
        3. Add batch dimension → (1, 3, 384, 384)

    Args:
        data: Raw image bytes from the uploaded file.

    Returns:
        Tuple of:
            - Preprocessed tensor: shape (1, C, H, W)
            - Original image dimensions: (width, height)

    Raises:
        ValueError: If image cannot be decoded.
    """
    try:
        pil_image = Image.open(io.BytesIO(data)).convert("RGB")
    except Exception as exc:
        logger.error("Failed to open image: %s", exc)
        raise ValueError(f"Cannot decode image: {exc}") from exc

    original_size = pil_image.size  # (width, height)
    logger.debug(
        "Image decoded — original size: %dx%d, mode: %s",
        original_size[0],
        original_size[1],
        pil_image.mode,
    )

    # Apply transforms
    tensor = _INFERENCE_TRANSFORM(pil_image)  # (C, H, W)
    tensor = tensor.unsqueeze(0)              # (1, C, H, W)

    logger.debug("Preprocessed tensor shape: %s", tensor.shape)
    return tensor, original_size
