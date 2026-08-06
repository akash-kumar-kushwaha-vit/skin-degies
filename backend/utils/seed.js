/**
 * Admin Seed Script
 * ==================
 * Creates the initial admin user.
 * Run ONCE with: node utils/seed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL || "admin@skindegies.com" });
  if (existing) {
    console.log("Admin user already exists:", existing.email);
    process.exit(0);
  }

  const admin = await User.create({
    name: "SkinDegies Admin",
    email: process.env.ADMIN_EMAIL || "admin@skindegies.com",
    password: process.env.ADMIN_PASSWORD || "Admin@123456",
    role: "admin",
  });

  console.log("✓ Admin user created:", admin.email);
  console.log("  Password:", process.env.ADMIN_PASSWORD || "Admin@123456");
  console.log("  IMPORTANT: Change the password after first login!");
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
