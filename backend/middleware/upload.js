/**
 * Multer — Image Upload Middleware
 * =================================
 * Validates file type and size before passing to the controller.
 * Files stored in memory (Buffer) — forwarded to AI service as multipart.
 */

const multer = require("multer");
const path = require("path");

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/bmp",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Memory storage — no disk writes on the backend
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        `Unsupported file type: ${file.mimetype}. Allowed: JPEG, PNG, WebP, BMP`
      ),
      false
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
});

/**
 * Single image upload middleware.
 * Usage: router.post("/predict", uploadImage, controller)
 */
const uploadImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const messages = {
        LIMIT_FILE_SIZE: `File too large. Maximum allowed size is ${MAX_FILE_SIZE / (1024 * 1024)} MB.`,
        LIMIT_UNEXPECTED_FILE: err.message,
        LIMIT_FILE_COUNT: "Only one image can be uploaded at a time.",
      };
      const message = messages[err.code] || err.message;
      console.warn("Upload rejected:", { code: err.code, message, field: req.file ? req.file.fieldname : null });
      return res.status(400).json({
        success: false,
        message,
        code: err.code,
      });
    }
    if (err) {
      console.warn("Upload rejected with generic error:", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      console.warn("Upload rejected: no image payload received for field 'image'.");
      return res.status(400).json({
        success: false,
        message: "No image uploaded. Please attach an image with field name 'image'.",
      });
    }
    next();
  });
};

module.exports = { uploadImage };
