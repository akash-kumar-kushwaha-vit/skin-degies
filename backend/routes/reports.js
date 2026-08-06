/**
 * Report Routes
 */

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Report = require("../models/Report");

// GET /api/v1/reports — User's reports
router.get("/", protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      Report.find({ userId: req.user.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-rawResponse"),
      Report.countDocuments({ userId: req.user.userId }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        reports,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/reports/:id
router.get("/:id", protect, async (req, res, next) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    }).populate("predictionId", "top3 primaryDisease primaryConfidence imageName createdAt");

    if (!report) return res.status(404).json({ success: false, message: "Report not found." });
    res.status(200).json({ success: true, data: { report } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
