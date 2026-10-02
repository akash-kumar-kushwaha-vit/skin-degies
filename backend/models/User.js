/**
 * User Model
 * ===========
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required: [name, email, password]
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           default: user
 *         avatar:
 *           type: string
 *         isActive:
 *           type: boolean
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [60, "Name cannot exceed 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: null,
    },
    // Doctor professional profile
    degree: {
      type: String,
      trim: true,
      maxlength: [100, 'Degree cannot exceed 100 characters'],
      default: '',
    },
    specialization: {
      type: String,
      trim: true,
      maxlength: [100, 'Specialization cannot exceed 100 characters'],
      default: '',
    },
    hospital: {
      type: String,
      trim: true,
      maxlength: [150, 'Hospital name cannot exceed 150 characters'],
      default: '',
    },
    clinicAddress: {
      type: String,
      trim: true,
      maxlength: [300, 'Clinic address cannot exceed 300 characters'],
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [30, 'Phone cannot exceed 30 characters'],
      default: '',
    },
    medicalLicense: {
      type: String,
      trim: true,
      maxlength: [60, 'Medical license cannot exceed 60 characters'],
      default: '',
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      max: 70,
      default: null,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Password reset
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    // Stats (denormalized for dashboard performance)
    totalPredictions: {
      type: Number,
      default: 0,
    },
    totalReports: {
      type: Number,
      default: 0,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// ---------------------------------------------------------------------------
// Pre-save: hash password
// ---------------------------------------------------------------------------
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ---------------------------------------------------------------------------
// Instance methods
// ---------------------------------------------------------------------------
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  delete obj.__v;
  return obj;
};

// ---------------------------------------------------------------------------
// Virtual: prediction history (populated on demand)
// ---------------------------------------------------------------------------
userSchema.virtual("predictions", {
  ref: "Prediction",
  localField: "_id",
  foreignField: "userId",
});

const User = mongoose.model("User", userSchema);
module.exports = User;
