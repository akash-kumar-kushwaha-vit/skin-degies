/**
 * Feedback Model
 */

const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    predictionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prediction",
      default: null,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      maxlength: 1000,
      default: "",
    },
    category: {
      type: String,
      enum: ["accuracy", "ui", "speed", "report_quality", "other"],
      default: "other",
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

feedbackSchema.index({ userId: 1 });
feedbackSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Feedback", feedbackSchema);
