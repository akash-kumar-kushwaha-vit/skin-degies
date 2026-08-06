/**
 * MongoDB Connection — Mongoose
 * ==============================
 * Handles initial connection with retry logic.
 * Mongoose auto-reconnects on drop; we only need to call connectDB() once.
 */

const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables.");
  }

  const options = {
    // Connection pool
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    // Buffering
    bufferCommands: false,
  };

  try {
    const conn = await mongoose.connect(uri, options);
    logger.info(`MongoDB connected: ${conn.connection.host}`);

    // Mongoose event listeners
    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected. Mongoose will auto-reconnect.");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected.");
    });
  } catch (err) {
    logger.error(`MongoDB initial connection failed: ${err.message}`);
    throw err;
  }
};

module.exports = connectDB;
