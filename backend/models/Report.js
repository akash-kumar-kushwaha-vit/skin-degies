/**
 * Report Model
 * =============
 * Stores the AI-generated medical report (from Gemini/OpenAI LLM).
 * One report per prediction.
 */

const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    predictionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prediction",
      required: true,
      unique: true, // One report per prediction
    },
    // Report sections (structured LLM output)
    predictedDisease: { type: String, required: true },
    top3Diseases: [
      {
        disease: String,
        confidence: Number,
        rank: Number,
      },
    ],
    confidenceScore: { type: Number },
    symptomsSummary: { type: String },
    possibleCauses: { type: String },
    imageFindings: { type: String },
    riskLevel: {
      type: String,
      enum: ["Low", "Moderate", "High", "Critical"],
      default: "Moderate",
    },
    recommendedActions: { type: String },
    lifestyleSuggestions: { type: String },
    whenToConsultDermatologist: { type: String },
    disclaimer: { type: String },
    // Full raw LLM response (for debugging / re-parsing)
    rawResponse: { type: String, select: false },
    // LLM provider metadata
    llmProvider: {
      type: String,
      enum: ["gemini", "openai", "fallback"],
      default: "gemini",
    },
    llmModel: { type: String, default: "gemini-2.0-flash" },
    generationTimeMs: { type: Number },
    // Report status
    status: {
      type: String,
      enum: ["generating", "completed", "failed"],
      default: "completed",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ predictionId: 1 }, { unique: true });

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
