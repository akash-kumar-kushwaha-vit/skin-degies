/**
 * Auth Routes
 * @openapi
 * tags:
 *   name: Auth
 *   description: User authentication endpoints
 */

const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

// Strict rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many auth attempts. Please wait 15 minutes." },
});

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "Jane Doe" }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201:
 *         description: Account created
 *       409:
 *         description: Email already registered
 */
router.post(
  "/register",
  authLimiter,
  [
    body("name").trim().isLength({ min: 2, max: 60 }).withMessage("Name must be 2–60 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Password must contain uppercase, lowercase, and a number"),
  ],
  validate,
  register
);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     security: []
 */
router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.post("/refresh-token", [body("refreshToken").notEmpty()], validate, refreshToken);

/**
 * @openapi
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request password reset email
 *     tags: [Auth]
 *     security: []
 */
router.post(
  "/forgot-password",
  authLimiter,
  [body("email").isEmail().normalizeEmail().withMessage("Valid email required")],
  validate,
  forgotPassword
);

/**
 * @openapi
 * /api/v1/auth/reset-password/{token}:
 *   post:
 *     summary: Reset password using token
 *     tags: [Auth]
 *     security: []
 */
router.post(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Password must contain uppercase, lowercase, and a number"),
  ],
  validate,
  resetPassword
);

// Protected routes
router.get("/me", protect, getMe);

module.exports = router;
