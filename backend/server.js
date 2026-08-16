/**
 * SkinDegies Backend — Express Server Entry Point
 * =================================================
 * Initializes middleware, routes, and database connection.
 * Handles graceful shutdown on SIGTERM/SIGINT (Render compatible).
 */

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const logger = require("./utils/logger");
const connectDB = require("./config/db");
const { swaggerSpec, swaggerUi } = require("./config/swagger");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const predictionRoutes = require("./routes/predictions");
const reportRoutes = require("./routes/reports");
const adminRoutes = require("./routes/admin");
const feedbackRoutes = require("./routes/feedback");
const contactRoutes = require("./routes/contact");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Security middleware
// ---------------------------------------------------------------------------

// Helmet — sets secure HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Handled by frontend
  })
);

// CORS — whitelist allowed origins
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:5174,http://localhost:4173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin '${origin}' not allowed`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Global rate limiter — 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
});
app.use(globalLimiter);

// ---------------------------------------------------------------------------
// General middleware
// ---------------------------------------------------------------------------

app.use(compression());

app.use((req, res, next) => {
  if (req.is("application/json") || req.is("application/*+json")) {
    return express.json({ limit: "10mb" })(req, res, next);
  }
  if (req.is("application/x-www-form-urlencoded")) {
    return express.urlencoded({ extended: true, limit: "10mb" })(req, res, next);
  }
  next();
});

app.use(mongoSanitize()); // Prevent MongoDB operator injection

// HTTP request logging
app.use(
  morgan("combined", {
    stream: { write: (msg) => logger.http(msg.trim()) },
    skip: (req) => req.url === "/health", // Don't log health checks
  })
);

// ---------------------------------------------------------------------------
// API Documentation
// ---------------------------------------------------------------------------

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "SkinDegies API Docs",
  customCss: ".swagger-ui .topbar { display: none }",
}));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/predictions", predictionRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/contact", contactRoutes);

// ---------------------------------------------------------------------------
// Health endpoint (Render uses this)
// ---------------------------------------------------------------------------

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Service health check
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "SkinDegies Backend",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    dbState: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Root
app.get("/", (req, res) => {
  res.json({
    service: "SkinDegies Backend API",
    version: "1.0.0",
    docs: "/api/docs",
    health: "/health",
  });
});

// ---------------------------------------------------------------------------
// 404 handler — must come after all routes
// ---------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ---------------------------------------------------------------------------
// Global error handler — must be last middleware
// ---------------------------------------------------------------------------
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      logger.info(`SkinDegies Backend running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
      logger.info(`API Docs: http://localhost:${PORT}/api/docs`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await mongoose.connection.close();
        logger.info("MongoDB connection closed.");
        process.exit(0);
      });
      // Force exit after 10s
      setTimeout(() => process.exit(1), 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    logger.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();

module.exports = app; // For testing
