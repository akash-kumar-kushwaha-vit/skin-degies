/**
 * User Routes — includes doctor profile fields + avatar upload
 */

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const User = require("../models/User");

// ── Multer setup: store avatars in /uploads/avatars ───────────────────────
const uploadsDir = path.join(__dirname, "../uploads/avatars");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar_${req.user.userId}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|jpg|png|webp|gif)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpg, png, webp) are allowed"));
    }
  },
});

// Serve uploaded avatars statically
router.use("/avatars", express.static(uploadsDir));

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

// PUT /api/v1/users/profile  — update name, email, doctor fields
router.put(
  "/profile",
  protect,
  [
    body("name").optional().trim().isLength({ min: 2, max: 60 }),
    body("email").optional().isEmail().normalizeEmail(),
    body("degree").optional().trim().isLength({ max: 100 }),
    body("specialization").optional().trim().isLength({ max: 100 }),
    body("hospital").optional().trim().isLength({ max: 150 }),
    body("clinicAddress").optional().trim().isLength({ max: 300 }),
    body("phone").optional().trim().isLength({ max: 30 }),
    body("medicalLicense").optional().trim().isLength({ max: 60 }),
    body("yearsOfExperience").optional().isInt({ min: 0, max: 70 }),
    body("bio").optional().trim().isLength({ max: 500 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const fields = ["name", "email", "degree", "specialization", "hospital",
        "clinicAddress", "phone", "medicalLicense", "yearsOfExperience", "bio"];
      const update = {};
      fields.forEach((f) => {
        if (req.body[f] !== undefined) update[f] = req.body[f];
      });

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

// POST /api/v1/users/avatar — upload profile photo
router.post("/avatar", protect, upload.single("avatar"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided." });
    }

    // Build public URL for the avatar
    const avatarUrl = `/api/v1/users/avatar-file/${req.file.filename}`;

    // Remove old avatar file if it exists and is a local file
    const existingUser = await User.findById(req.user.userId);
    if (existingUser?.avatar && existingUser.avatar.startsWith("/api/v1/users/avatar-file/")) {
      const oldFilename = existingUser.avatar.split("/").pop();
      const oldPath = path.join(uploadsDir, oldFilename);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { avatar: avatarUrl },
      { new: true }
    );
    res.status(200).json({ success: true, data: { user: user.toPublicJSON(), avatarUrl } });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/users/avatar-file/:filename — serve avatar file
router.get("/avatar-file/:filename", (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "Avatar not found." });
  }
  res.sendFile(filePath);
});

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
