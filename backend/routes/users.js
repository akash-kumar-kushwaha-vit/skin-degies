/**
 * User Routes
 */

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const User = require("../models/User");

// GET /api/v1/users/profile
router.get("/profile", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.status(200).json({ success: true, data: { user: user.toPublicJSON() } });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/users/profile
router.put(
  "/profile",
  protect,
  [
    body("name").optional().trim().isLength({ min: 2, max: 60 }),
    body("email").optional().isEmail().normalizeEmail(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, email } = req.body;
      const update = {};
      if (name) update.name = name;
      if (email) update.email = email;

      const user = await User.findByIdAndUpdate(req.user.userId, update, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({ success: true, data: { user: user.toPublicJSON() } });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/v1/users/change-password
router.put(
  "/change-password",
  protect,
  [
    body("currentPassword").notEmpty().withMessage("Current password required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Must contain uppercase, lowercase, and number"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId).select("+password");
      if (!(await user.comparePassword(req.body.currentPassword))) {
        return res.status(401).json({ success: false, message: "Current password is incorrect." });
      }
      user.password = req.body.newPassword;
      await user.save();
      res.status(200).json({ success: true, message: "Password changed successfully." });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
