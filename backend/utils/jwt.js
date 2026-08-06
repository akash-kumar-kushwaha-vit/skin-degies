/**
 * JWT Utilities
 * ==============
 * Generates and verifies access + refresh tokens.
 */

const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error(
    "JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be defined in environment variables."
  );
}

/**
 * Generate an access token (short-lived).
 * @param {object} payload - { userId, role }
 */
const generateAccessToken = (payload) =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });

/**
 * Generate a refresh token (long-lived).
 * @param {object} payload - { userId }
 */
const generateRefreshToken = (payload) =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });

/**
 * Verify an access token.
 * @throws {JsonWebTokenError|TokenExpiredError}
 */
const verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);

/**
 * Verify a refresh token.
 * @throws {JsonWebTokenError|TokenExpiredError}
 */
const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);

/**
 * Generate both tokens for a user.
 * @param {object} user - Mongoose User document
 */
const generateTokenPair = (user) => ({
  accessToken: generateAccessToken({ userId: user._id, role: user.role }),
  refreshToken: generateRefreshToken({ userId: user._id }),
  expiresIn: ACCESS_EXPIRES,
});

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
};
