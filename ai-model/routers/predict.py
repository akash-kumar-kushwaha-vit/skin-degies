"""
SkinDegies AI Service — Predict Router
========================================
Exposes:
    POST /predict   — Upload skin image, receive top-3 disease predictions
    GET  /health    — Service health check (used by load balancers / Railway)
"""

import logging
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, Request, UploadFile, status
from fastapi.responses import JSONResponse

from config import IMAGE_SIZE, settings
from schemas import HealthResponse, PredictionResponse
from services.model_service import model_service
from services.preprocess import preprocess_image, validate_image_bytes

logger = logging.getLogger("skindegies.router.predict")

router = APIRouter(prefix="/api/v1", tags=["Prediction"])


# ---------------------------------------------------------------------------
# POST /api/v1/predict
# ---------------------------------------------------------------------------

@router.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Predict skin disease from image",
    description=(
        "Upload a skin lesion image (JPEG / PNG / WebP / BMP, max 10 MB). "
        "Returns the top-3 predicted diseases with confidence percentages."
    ),
    responses={
        200: {"description": "Successful prediction"},
        400: {"description": "Invalid image (corrupt, wrong type, too large)"},
        503: {"description": "Model not loaded"},
        500: {"description": "Internal server error"},
    },
)
async def predict(
    request: Request,
    image: UploadFile = File(
        ...,
        description="Skin lesion image file (JPEG / PNG / WebP / BMP)",
    ),
) -> PredictionResponse:
    """
    Accepts a multipart/form-data upload with field name `image`.

    Pipeline:
        1. Read bytes & validate (size, MIME type, content)
        2. Preprocess → (1, 3, 384, 384) tensor
        3. Run EfficientNetV2-S inference
        4. Return top-3 predictions
    """
    # 1 — Read uploaded bytes
    try:
        image_bytes = await image.read()
    except Exception as exc:
        logger.error("Failed to read uploaded file: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "READ_ERROR", "message": str(exc)},
        ) from exc

    # 2 — Validate
    try:
        validate_image_bytes(image_bytes, content_type=image.content_type)
    except ValueError as exc:
        logger.warning("Image validation failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "INVALID_IMAGE", "message": str(exc), "field": "image"},
        ) from exc

    # 3 — Preprocess
    try:
        tensor, original_size = preprocess_image(image_bytes)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "PREPROCESS_ERROR", "message": str(exc)},
        ) from exc
    except Exception as exc:
        logger.exception("Unexpected preprocessing error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": "Image preprocessing failed."},
        ) from exc

    # 4 — Inference
    if not model_service.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"code": "MODEL_NOT_READY", "message": "AI model is not loaded yet."},
        )

    try:
        predictions, elapsed_ms = model_service.predict(tensor, top_k=settings.TOP_K)
    except Exception as exc:
        logger.exception("Inference failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INFERENCE_ERROR", "message": "Prediction failed. Please try again."},
        ) from exc

    logger.info(
        "Prediction complete | file='%s' size=%d bytes original=%dx%d | "
        "top1='%s' (%.2f%%) | %.1f ms",
        image.filename,
        len(image_bytes),
        original_size[0],
        original_size[1],
        predictions[0].disease,
        predictions[0].confidence,
        elapsed_ms,
    )

    return PredictionResponse(
        top3=predictions,
        model_version=model_service.model_version,
        image_size=f"{IMAGE_SIZE}x{IMAGE_SIZE}",
        processing_time_ms=round(elapsed_ms, 2),
    )


# ---------------------------------------------------------------------------
# GET /api/v1/health
# ---------------------------------------------------------------------------

@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Service health check",
    description="Returns model load status. Used by Railway / Docker health probes.",
)
async def health() -> HealthResponse:
    """Health endpoint — 200 if model is loaded, 503 if not."""
    from config import NUM_CLASSES

    if not model_service.is_loaded:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unavailable",
                "model_loaded": False,
                "model_version": model_service.model_version,
                "num_classes": NUM_CLASSES,
                "environment": settings.ENVIRONMENT,
            },
        )

    return HealthResponse(
        status="ok",
        model_loaded=True,
        model_version=model_service.model_version,
        num_classes=NUM_CLASSES,
        environment=settings.ENVIRONMENT,
    )
