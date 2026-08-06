"""
SkinDegies AI Service — Pydantic Schemas
=========================================
All request/response models for the FastAPI endpoints.
Using strict Pydantic v2 models for runtime validation.
"""

from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


# ---------------------------------------------------------------------------
# Prediction schemas
# ---------------------------------------------------------------------------

class DiseasePrediction(BaseModel):
    """A single disease prediction with confidence score."""

    disease: str = Field(
        ...,
        description="Disease class name",
        examples=["Eczema"],
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Confidence percentage (0–100)",
        examples=[91.5],
    )
    rank: int = Field(
        ...,
        ge=1,
        description="Rank among top-K predictions (1 = highest confidence)",
        examples=[1],
    )

    @field_validator("confidence")
    @classmethod
    def round_confidence(cls, v: float) -> float:
        return round(v, 2)


class PredictionResponse(BaseModel):
    """
    Response body for POST /predict.
    Returns top-K disease predictions sorted by confidence descending.
    """

    top3: List[DiseasePrediction] = Field(
        ...,
        description="Top-3 disease predictions sorted by confidence",
        min_length=1,
        max_length=10,
    )
    model_version: str = Field(
        ...,
        description="Identifier of the model checkpoint used",
        examples=["best_model.pth"],
    )
    image_size: str = Field(
        ...,
        description="Resolution the image was resized to before inference",
        examples=["384x384"],
    )
    processing_time_ms: Optional[float] = Field(
        default=None,
        description="Server-side inference time in milliseconds",
    )

    model_config = {"json_schema_extra": {
        "example": {
            "top3": [
                {"disease": "Lichen",   "confidence": 91.5, "rank": 1},
                {"disease": "Psoriasis","confidence": 5.2,  "rank": 2},
                {"disease": "Eczema",   "confidence": 2.1,  "rank": 3},
            ],
            "model_version": "best_model.pth",
            "image_size": "384x384",
            "processing_time_ms": 42.7,
        }
    }}


# ---------------------------------------------------------------------------
# Health check schema
# ---------------------------------------------------------------------------

class HealthResponse(BaseModel):
    """Response for GET /health."""

    status: str = Field(..., examples=["ok"])
    model_loaded: bool = Field(..., description="Whether the AI model is loaded")
    model_version: str = Field(..., examples=["best_model.pth"])
    num_classes: int = Field(..., examples=[22])
    environment: str = Field(..., examples=["production"])


# ---------------------------------------------------------------------------
# Error schemas
# ---------------------------------------------------------------------------

class ErrorDetail(BaseModel):
    """Standard error detail payload."""

    code: str = Field(..., examples=["INVALID_IMAGE"])
    message: str = Field(..., examples=["Uploaded file is not a valid image."])
    field: Optional[str] = Field(default=None, examples=["image"])


class ErrorResponse(BaseModel):
    """Standard error response body."""

    success: bool = Field(default=False)
    error: ErrorDetail
