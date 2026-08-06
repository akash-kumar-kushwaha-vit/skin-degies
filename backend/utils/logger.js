/**
 * Winston Logger
 * ===============
 * Structured logging with rotating file transport.
 * Log levels: error, warn, info, http, debug
 */

const winston = require("winston");
const path = require("path");
const fs = require("fs");

const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} | ${level.padEnd(7)} | ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DDTHH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Console — colorized for development
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DDTHH:mm:ss" }),
        errors({ stack: true }),
        logFormat
      ),
    }),
    // File — combined log
    new winston.transports.File({
      filename: path.join(logsDir, "backend.log"),
      maxsize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 5,
      tailable: true,
    }),
    // File — errors only
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    }),
  ],
});

module.exports = logger;
