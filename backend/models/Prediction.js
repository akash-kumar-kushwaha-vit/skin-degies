/**
 * Prediction Model
 * =================
 * Stores the raw output of the AI service for each user upload.
 */

const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Uploaded image info
    imageName: {
      type: String,
      required: true,
    },
    imageSize: {
      type: Number, // bytes
      required: true,
    },
    imageMimeType: {
      type: String,
    },
    // Stored image reference (cloud URL or local path)
    imageUrl: {
      type: String,
      default: null,
    },
    // AI model output — top-3 predictions
    top3: [
      {
        disease: { type: String, required: true },
        confidence: { type: Number, required: true },
        rank: { type: Number, required: true },
      },
    ],
    // Primary prediction (top-1)
    primaryDisease: {
      type: String,
      required: true,
    },
    primaryConfidence: {
      type: Number,
      required: true,
    },
    // Model metadata
    modelVersion: {
      type: String,
      default: "best_model.pth",
    },
    processingTimeMs: {
      type: Number,
    },
    // Status
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    // Link to report (if generated)
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      default: null,
    },
    // Questionnaire answers (stored with prediction for report generation)
    questionnaire: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Indexes for common queries
predictionSchema.index({ userId: 1, createdAt: -1 });
predictionSchema.index({ primaryDisease: 1 });
predictionSchema.index({ createdAt: -1 });

const Prediction = mongoose.model("Prediction", predictionSchema);
module.exports = Prediction;
