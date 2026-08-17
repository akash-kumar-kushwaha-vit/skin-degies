"""
SkinDegies AI Service — FastAPI Application Entry Point
=========================================================
Startup/shutdown lifecycle:
  - ON STARTUP: Load EfficientNetV2-S model from checkpoints/best_model.pth
  - ON SHUTDOWN: Release model from memory

Run locally:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

Production (via Dockerfile / Railway):
    uvicorn main:app --host 0.0.0.0 --port 8000 --workers 1
"""

import logging
import logging.config
import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from routers.predict import router as predict_router
from services.model_service import model_service


# ---------------------------------------------------------------------------
# Logging configuration
# ---------------------------------------------------------------------------

def setup_logging() -> None:
    """Configure structured logging to stdout + file."""
    log_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "detailed": {
                "format": "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
                "datefmt": "%Y-%m-%dT%H:%M:%S",
            },
            "simple": {
                "format": "%(levelname)s: %(message)s",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",
                "formatter": "detailed",
                "level": settings.LOG_LEVEL,
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "filename": settings.LOG_FILE,
                "maxBytes": 10 * 1024 * 1024,  # 10 MB
                "backupCount": 5,
                "formatter": "detailed",
                "level": settings.LOG_LEVEL,
            },
        },
        "root": {
            "level": settings.LOG_LEVEL,
            "handlers": ["console", "file"],
        },
        "loggers": {
            "uvicorn": {"level": "INFO", "propagate": True},
            "uvicorn.access": {"level": "INFO", "propagate": True},
        },
    }
    logging.config.dictConfig(log_config)


setup_logging()
logger = logging.getLogger("skindegies.main")


# ---------------------------------------------------------------------------
# Application lifespan (startup / shutdown events)
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan context manager.
    Replaces deprecated @app.on_event("startup/shutdown").
    """
    # ── STARTUP ──────────────────────────────────────────────────────────
    logger.info("=" * 60)
    logger.info("SkinDegies AI Service starting up...")
    logger.info("Environment : %s", settings.ENVIRONMENT)
    logger.info("Device      : auto-detect (CUDA > MPS > CPU)")
    logger.info("Model path  : %s", settings.MODEL_PATH)
    logger.info("=" * 60)

    try:
        model_service.load()
        logger.info("Model loaded | Device: %s", model_service.device)
    except FileNotFoundError as exc:
        logger.critical("STARTUP FAILED — checkpoint missing: %s", exc)
        # Allow the server to start so the /health endpoint returns 503
        # (better than crashing — Railway/Docker will surface the error)
    except Exception as exc:
        logger.exception("STARTUP FAILED — unexpected error: %s", exc)

    yield  # ── Application runs ──────────────────────────────────────────

    # ── SHUTDOWN ─────────────────────────────────────────────────────────
    logger.info("Shutting down SkinDegies AI Service...")
    model_service.unload()
    logger.info("Shutdown complete.")


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="SkinDegies AI Service",
    description=(
        "AI-powered skin disease detection using EfficientNetV2-S.\n\n"
        "**Model**: EfficientNetV2-S (22 skin disease classes)\n"
        "**Validation Accuracy**: 81.56% | **Top-3 Accuracy**: 89.75%\n\n"
        "Upload a skin lesion image to receive top-3 disease predictions "
        "with confidence scores."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    contact={
        "name": "SkinDegies AI Team",
        "url": "https://github.com/your-org/skin-degies",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
)


# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------

# CORS — configurable via ALLOWED_ORIGINS env var
allowed_origins = (
    settings.ALLOWED_ORIGINS.split(",")
    if settings.ALLOWED_ORIGINS != "*"
    else ["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Global exception handlers
# ---------------------------------------------------------------------------

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all exception handler — prevents stack traces from leaking to clients."""
    logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred. Please try again.",
            },
        },
    )


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

app.include_router(predict_router)


# ---------------------------------------------------------------------------
# Root endpoint
# ---------------------------------------------------------------------------

@app.get("/", include_in_schema=False)
async def root():
    return {
        "service": "SkinDegies AI Service",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/v1/health",
    }


# ---------------------------------------------------------------------------
# Dev server entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD,
        workers=settings.WORKERS,
        log_level=settings.LOG_LEVEL.lower(),
    )
