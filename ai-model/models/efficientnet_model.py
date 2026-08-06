"""
SkinDegies AI Service — EfficientNetV2-S Model Definition
===========================================================
Wraps torchvision's EfficientNetV2-S with a custom classifier head
that matches the training configuration (22 classes).

IMPORTANT: This architecture must be identical to what was used during
training. The weights from best_model.pth are loaded directly into this
class via model_service.py.
"""

import torch
import torch.nn as nn
from torchvision import models
from torchvision.models import EfficientNet_V2_S_Weights

from config import NUM_CLASSES


class SkinDiseaseEfficientNetV2(nn.Module):
    """
    EfficientNetV2-S backbone with a custom classification head for
    22-class skin disease prediction.

    Architecture mirrors the training setup:
        - EfficientNetV2-S backbone (pretrained ImageNet weights replaced
          by fine-tuned weights from best_model.pth)
        - Dropout(0.3) before the final linear layer
        - Linear(1280 → 22)
    """

    def __init__(self, num_classes: int = NUM_CLASSES, dropout: float = 0.3):
        super().__init__()

        # Load EfficientNetV2-S architecture (weights=None; we load custom
        # checkpoint separately to avoid downloading ImageNet weights at runtime)
        self.backbone = models.efficientnet_v2_s(weights=None)

        # Replace the default classifier head to match training config
        in_features = self.backbone.classifier[1].in_features  # 1280
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(p=dropout, inplace=True),
            nn.Linear(in_features, num_classes),
        )

        self.num_classes = num_classes

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass.

        Args:
            x: Input tensor of shape (B, 3, H, W).

        Returns:
            Logits tensor of shape (B, num_classes).
        """
        return self.backbone(x)

    def predict_proba(self, x: torch.Tensor) -> torch.Tensor:
        """
        Run forward pass and apply softmax to get probability distribution.

        Args:
            x: Input tensor of shape (B, 3, H, W).

        Returns:
            Probability tensor of shape (B, num_classes).
        """
        with torch.no_grad():
            logits = self.forward(x)
            return torch.softmax(logits, dim=1)
