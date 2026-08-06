/**
 * Prediction Controller
 * ======================
 * Handles image upload → AI prediction → questionnaire → report generation.
 */

const Prediction = require("../models/Prediction");
const Report = require("../models/Report");
const User = require("../models/User");
const { callAIService } = require("../services/aiService");
const { generateMedicalReport } = require("../services/llmService");
const logger = require("../utils/logger");

// ---------------------------------------------------------------------------
// POST /api/v1/predictions/predict
// ---------------------------------------------------------------------------
const predict = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const file = req.file; // from uploadImage middleware

    // Forward to AI service
    const aiResult = await callAIService(file.buffer, file.originalname, file.mimetype);
    const { top3, model_version: modelVersion, processing_time_ms: processingTimeMs } = aiResult;

    if (!top3 || top3.length === 0) {
      return res.status(502).json({ success: false, message: "AI service returned no predictions." });
    }

    const primaryPrediction = top3[0];

    // Save prediction to DB
    const prediction = await Prediction.create({
      userId,
      imageName: file.originalname,
      imageSize: file.size,
      imageMimeType: file.mimetype,
      top3,
      primaryDisease: primaryPrediction.disease,
      primaryConfidence: primaryPrediction.confidence,
      modelVersion: modelVersion || "best_model.pth",
      processingTimeMs,
      status: "completed",
    });

    // Increment user stats
    await User.findByIdAndUpdate(userId, { $inc: { totalPredictions: 1 } });

    logger.info(
      `Prediction saved | user=${userId} | top1=${primaryPrediction.disease} (${primaryPrediction.confidence}%)`
    );

    res.status(201).json({
      success: true,
      message: "Prediction complete.",
      data: {
        predictionId: prediction._id,
        top3: prediction.top3,
        primaryDisease: prediction.primaryDisease,
        primaryConfidence: prediction.primaryConfidence,
        modelVersion: prediction.modelVersion,
        processingTimeMs: prediction.processingTimeMs,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// POST /api/v1/predictions/:id/report
// Generate AI report from questionnaire answers
// ---------------------------------------------------------------------------
const generateReport = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id: predictionId } = req.params;
    const questionnaire = req.body;

    // Verify prediction belongs to user
    const prediction = await Prediction.findOne({ _id: predictionId, userId });
    if (!prediction) {
      return res.status(404).json({ success: false, message: "Prediction not found." });
    }

    // Check if report already exists
    const existingReport = await Report.findOne({ predictionId });
    if (existingReport) {
      return res.status(200).json({
        success: true,
        message: "Report already exists.",
        data: { report: existingReport },
      });
    }

    // Save questionnaire to prediction
    prediction.questionnaire = questionnaire;
    await prediction.save();

    // Generate report via LLM
    const reportData = await generateMedicalReport(
      {
        top3: prediction.top3,
        primaryDisease: prediction.primaryDisease,
        primaryConfidence: prediction.primaryConfidence,
      },
      questionnaire
    );

    // Save report
    const report = await Report.create({
      userId,
      predictionId: prediction._id,
      ...reportData,
    });

    // Link report to prediction
    prediction.reportId = report._id;
    await prediction.save();

    // Update prediction to completed with report
    await User.findByIdAndUpdate(userId, { $inc: { totalReports: 1 } });

    logger.info(`Report generated | user=${userId} | prediction=${predictionId} | risk=${report.riskLevel}`);

    res.status(201).json({
      success: true,
      message: "Medical report generated successfully.",
      data: { report },
    });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// GET /api/v1/predictions — User's prediction history
// ---------------------------------------------------------------------------
const getPredictions = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [predictions, total] = await Promise.all([
      Prediction.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-questionnaire"),
      Prediction.countDocuments({ userId }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        predictions,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// GET /api/v1/predictions/:id — Single prediction with report
// ---------------------------------------------------------------------------
const getPrediction = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const prediction = await Prediction.findOne({
      _id: req.params.id,
      userId,
    }).populate("reportId");

    if (!prediction) {
      return res.status(404).json({ success: false, message: "Prediction not found." });
    }

    res.status(200).json({ success: true, data: { prediction } });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// DELETE /api/v1/predictions/:id
// ---------------------------------------------------------------------------
const deletePrediction = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const prediction = await Prediction.findOneAndDelete({ _id: req.params.id, userId });
    if (!prediction) {
      return res.status(404).json({ success: false, message: "Prediction not found." });
    }
    // Delete associated report
    if (prediction.reportId) {
      await Report.findByIdAndDelete(prediction.reportId);
    }
    res.status(200).json({ success: true, message: "Prediction deleted." });
  } catch (err) {
    next(err);
  }
};

module.exports = { predict, generateReport, getPredictions, getPrediction, deletePrediction };
