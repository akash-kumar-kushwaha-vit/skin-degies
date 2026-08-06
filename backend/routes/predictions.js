/**
 * Prediction Routes
 */

const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {
  predict,
  generateReport,
  getPredictions,
  getPrediction,
  deletePrediction,
} = require("../controllers/predictionController");
const { protect } = require("../middleware/auth");
const { uploadImage } = require("../middleware/upload");

// Rate limit predictions: 30 per hour
const predictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { success: false, message: "Prediction limit reached. Try again in 1 hour." },
});

/**
 * @openapi
 * /api/v1/predictions/predict:
 *   post:
 *     summary: Upload image and get skin disease prediction
 *     tags: [Predictions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Prediction complete
 *       400:
 *         description: Invalid image
 *       429:
 *         description: Rate limit exceeded
 */
router.post("/predict", protect, predictLimiter, uploadImage, predict);

/**
 * @openapi
 * /api/v1/predictions/{id}/report:
 *   post:
 *     summary: Generate AI medical report for a prediction
 *     tags: [Predictions]
 *     security:
 *       - bearerAuth: []
 */
router.post("/:id/report", protect, generateReport);

router.get("/", protect, getPredictions);
router.get("/:id", protect, getPrediction);
router.delete("/:id", protect, deletePrediction);

module.exports = router;
