/**
 * Feedback Routes
 */

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { optionalAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");
const Feedback = require("../models/Feedback");

router.post(
  "/",
  optionalAuth,
  [
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1–5"),
    body("comment").optional().isLength({ max: 1000 }),
    body("category").optional().isIn(["accuracy", "ui", "speed", "report_quality", "other"]),
  ],
  validate,
  async (req, res, next) => {
    try {
      const feedback = await Feedback.create({
        ...req.body,
        userId: req.user?.userId || null,
      });
      res.status(201).json({ success: true, message: "Feedback submitted. Thank you!", data: { feedback } });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
