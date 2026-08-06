/**
 * JWT Authentication Middleware
 * ==============================
 * Protects routes by verifying the Bearer token from the Authorization header.
 * Attaches { userId, role } to req.user on success.
 */

const { verifyAccessToken } = require("../utils/jwt");
const User = require("../models/User");
const logger = require("../utils/logger");

/**
 * Protect middleware — requires a valid JWT access token.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please provide a valid token.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    // Attach lean user info (avoid DB call on every request using token payload)
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    logger.warn(`Auth failed: ${err.message}`);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
        code: "TOKEN_EXPIRED",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid token. Please log in again.",
    });
  }
};

/**
 * Admin-only middleware — must be used AFTER protect.
 */
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

/**
 * Optional auth — populates req.user if token present, but doesn't block.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = verifyAccessToken(token);
      req.user = { userId: decoded.userId, role: decoded.role };
    }
  } catch {
    // Silently ignore — auth is optional
  }
  next();
};

module.exports = { protect, adminOnly, optionalAuth };
