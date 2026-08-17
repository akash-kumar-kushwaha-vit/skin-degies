"""
SkinDegies AI Service — Model Loader & Inference Engine
=========================================================
The model is loaded ONCE at application startup via the `load_model()`
function. The singleton `ModelService` instance is injected into
FastAPI routes as a dependency.

Replacing the model: Drop a new best_model.pth into checkpoints/ and
restart the server. No other code changes required.
"""

import logging
import os
import time
from pathlib import Path
from typing import List

import torch

from config import CLASSES, IMAGE_SIZE, NUM_CLASSES, TOP_K, settings
from models.efficientnet_model import SkinDiseaseEfficientNetV2
from schemas import DiseasePrediction

logger = logging.getLogger("skindegies.model_service")


class ModelService:
    """
    Singleton service that owns the model lifecycle:
      - Loading weights from disk
      - Moving model to available device (CUDA / MPS / CPU)
      - Running inference and returning top-K predictions

    Thread-safety: PyTorch inference with torch.no_grad() is safe for
    concurrent reads on CPU. For GPU, GIL + no_grad() is sufficient for
    the expected request volume.
    """

    def __init__(self) -> None:
        self._model: SkinDiseaseEfficientNetV2 | None = None
        self._device: torch.device | None = None
        self._model_version: str = Path(settings.MODEL_PATH).name
        self._loaded: bool = False

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    def load(self) -> None:
        """
        Load model weights from disk and move to the best available device.
        Called ONCE at application startup (lifespan event).

        Raises:
            FileNotFoundError: If the checkpoint does not exist.
            RuntimeError: If the weights cannot be loaded (architecture mismatch).
        """
        model_path = Path(settings.MODEL_PATH)
        if not model_path.exists():
            raise FileNotFoundError(
                f"Model checkpoint not found: {model_path}\n"
                f"Place best_model.pth in ai-model/checkpoints/ and restart."
            )

        # Resolve device
        if torch.cuda.is_available():
            self._device = torch.device("cuda")
        elif torch.backends.mps.is_available():
            self._device = torch.device("mps")
        else:
            self._device = torch.device("cpu")

        logger.info("Loading model from: %s (device: %s)", model_path, self._device)
        start = time.perf_counter()

        # Instantiate architecture
        self._model = SkinDiseaseEfficientNetV2(num_classes=NUM_CLASSES)

        # Load checkpoint — support both full model dict and state_dict-only
        checkpoint = torch.load(
            model_path,
            map_location=self._device,
            weights_only=False,  # Allow arbitrary objects for flexibility
        )
        if isinstance(checkpoint, dict) and "state_dict" in checkpoint:
            state_dict = checkpoint["state_dict"]
        elif isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
            state_dict = checkpoint["model_state_dict"]
        elif isinstance(checkpoint, dict) and not any(
            k in checkpoint for k in ("state_dict", "model_state_dict")
        ):
            # Assume the dict itself is the state_dict
            state_dict = checkpoint
        else:
            state_dict = checkpoint  # Full model saved with torch.save(model, ...)

        # Handle DataParallel / DistributedDataParallel prefix and the common
        # case where a checkpoint was saved without the model wrapper prefix.
        cleaned = {}
        for k, v in (state_dict.items() if isinstance(state_dict, dict) else state_dict.state_dict().items()):
            normalized = k.replace("module.", "")
            normalized = normalized.replace("backbone.", "", 1)
            normalized = f"backbone.{normalized}"
            cleaned[normalized] = v

        self._model.load_state_dict(cleaned, strict=True)
        self._model.to(self._device)
        self._model.eval()

        elapsed = (time.perf_counter() - start) * 1000
        self._loaded = True
        logger.info(
            "Model loaded successfully in %.1f ms | Classes: %d | Checkpoint: %s",
            elapsed,
            NUM_CLASSES,
            self._model_version,
        )

    def unload(self) -> None:
        """Release model from memory (called at shutdown)."""
        if self._model is not None:
            del self._model
            self._model = None
            self._loaded = False
            if self._device and self._device.type == "cuda":
                torch.cuda.empty_cache()
            logger.info("Model unloaded from memory.")

    # ------------------------------------------------------------------
    # Inference
    # ------------------------------------------------------------------

    def predict(self, tensor: torch.Tensor, top_k: int = TOP_K) -> List[DiseasePrediction]:
        """
        Run inference on a preprocessed image tensor and return top-K predictions.

        Args:
            tensor: Preprocessed image tensor, shape (1, 3, 384, 384).
            top_k:  Number of top predictions to return.

        Returns:
            List of DiseasePrediction sorted by confidence descending.

        Raises:
            RuntimeError: If model is not loaded.
        """
        if not self._loaded or self._model is None:
            raise RuntimeError("Model is not loaded. Call model_service.load() first.")

        tensor = tensor.to(self._device)

        start = time.perf_counter()
        with torch.no_grad():
            probs = self._model.predict_proba(tensor)  # (1, 22)
        elapsed_ms = (time.perf_counter() - start) * 1000

        # Get top-K indices sorted by probability (descending)
        k = min(top_k, NUM_CLASSES)
        top_probs, top_indices = torch.topk(probs[0], k=k)

        predictions: List[DiseasePrediction] = []
        for rank, (prob, idx) in enumerate(
            zip(top_probs.cpu().tolist(), top_indices.cpu().tolist()), start=1
        ):
            predictions.append(
                DiseasePrediction(
                    disease=CLASSES[idx],
                    confidence=round(prob * 100.0, 2),
                    rank=rank,
                )
            )

        logger.info(
            "Inference complete in %.1f ms | Top-1: %s (%.2f%%)",
            elapsed_ms,
            predictions[0].disease,
            predictions[0].confidence,
        )
        return predictions, elapsed_ms

    # ------------------------------------------------------------------
    # Properties
    # ------------------------------------------------------------------

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    @property
    def device(self) -> str:
        return str(self._device) if self._device else "uninitialized"

    @property
    def model_version(self) -> str:
        return self._model_version


# ---------------------------------------------------------------------------
# Module-level singleton — imported by routers and main.py
# ---------------------------------------------------------------------------
model_service = ModelService()
