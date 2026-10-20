/**
 * Auth Controller
 * ================
 * register, login, refreshToken, forgotPassword, resetPassword, logout
 */

const crypto = require("crypto");
const User = require("../models/User");
const { generateTokenPair, verifyRefreshToken } = require("../utils/jwt");
const logger = require("../utils/logger");
const { sendEmailVerification } = require("../services/emailService");

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const user = await User.create({
      name,
      email,
      password,
      isEmailVerified: false,
      emailVerificationToken: crypto.createHash("sha256").update(token).digest("hex"),
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    try {
      await sendEmailVerification({ to: user.email, name: user.name, token });
    } catch (emailError) {
      if (process.env.NODE_ENV === "development") {
        logger.warn(`Verification email unavailable for ${user.email}; returning a development-only verification token: ${emailError.message}`);
        return res.status(201).json({
          success: true,
          message: "Account created. Complete local email verification to continue.",
          data: { email: user.email, verificationToken: token },
        });
      }

      await User.deleteOne({ _id: user._id });
      logger.error(`Verification email could not be sent for ${user.email}: ${emailError.message}`);
      return res.status(503).json({
        success: false,
        message: "We couldn't send your verification email. Please try again later.",
      });
    }

    logger.info(`New user registered: ${email}`);
    res.status(201).json({
      success: true,
      message: "Account created. Check your email for a verification link.",
      data: { email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email address before signing in.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      });
    }

    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    const tokens = generateTokenPair(user);
    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: { user: user.toPublicJSON(), ...tokens },
    });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// Refresh Token
// ---------------------------------------------------------------------------
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: "Refresh token required." });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      return res.status(401).json({ success: false, message: "Invalid or expired refresh token." });
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive || !user.isEmailVerified) {
      return res.status(401).json({ success: false, message: "User not found or inactive." });
    }

    const tokens = generateTokenPair(user);
    res.status(200).json({ success: true, data: tokens });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// Verify email address
// ---------------------------------------------------------------------------
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
      isEmailVerified: false,
    }).select("+emailVerificationToken +emailVerificationExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This verification link is invalid or has expired. Request a new one to continue.",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    logger.info(`Email verified for user: ${user.email}`);
    res.status(200).json({ success: true, message: "Email verified. You can now sign in." });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// Resend email verification
// ---------------------------------------------------------------------------
const resendEmailVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: "If that email needs verification, a new link will be sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await sendEmailVerification({ to: user.email, name: user.name, token });
    user.emailVerificationToken = crypto.createHash("sha256").update(token).digest("hex");
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "If that email needs verification, a new link will be sent.",
    });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// Forgot Password
// ---------------------------------------------------------------------------
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always respond 200 to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email is registered, you will receive a reset link.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // In production: send email via nodemailer
    // For now, return the token in the response (dev mode) or send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    logger.info(`Password reset requested for ${email}. Reset URL: ${resetUrl}`);

    // TODO: sendEmail({ to: email, subject: "Password Reset", resetUrl })
    // For development, include token in response
    const responseData = { message: "Password reset link sent to your email." };
    if (process.env.NODE_ENV === "development") {
      responseData.resetToken = resetToken;
      responseData.resetUrl = resetUrl;
    }

    res.status(200).json({ success: true, ...responseData });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// Reset Password
// ---------------------------------------------------------------------------
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has expired.",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info(`Password reset successful for user: ${user.email}`);
    res.status(200).json({ success: true, message: "Password reset successfully. Please log in." });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// Get current user (me)
// ---------------------------------------------------------------------------
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, data: { user: user.toPublicJSON() } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  verifyEmail,
  resendEmailVerification,
  forgotPassword,
  resetPassword,
  getMe,
};
