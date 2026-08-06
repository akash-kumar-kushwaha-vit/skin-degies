/**
 * Admin Controller
 * =================
 * User management, analytics, system stats.
 */

const User = require("../models/User");
const Prediction = require("../models/Prediction");
const Report = require("../models/Report");
const Contact = require("../models/Contact");
const logger = require("../utils/logger");

// GET /api/v1/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalPredictions,
      totalReports,
      unreadContacts,
      recentUsers,
      diseaseStats,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Prediction.countDocuments(),
      Report.countDocuments(),
      Contact.countDocuments({ status: "unread" }),
      User.find().sort({ createdAt: -1 }).limit(5).select("name email createdAt role"),
      Prediction.aggregate([
        { $group: { _id: "$primaryDisease", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: { totalUsers, totalPredictions, totalReports, unreadContacts },
        recentUsers,
        diseaseStats,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/admin/users
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const query = search
      ? { $or: [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }] }
      : {};

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    // Cascade delete predictions and reports
    const predictions = await Prediction.find({ userId: req.params.id });
    const predictionIds = predictions.map((p) => p._id);
    await Promise.all([
      Prediction.deleteMany({ userId: req.params.id }),
      Report.deleteMany({ predictionId: { $in: predictionIds } }),
    ]);

    logger.warn(`Admin deleted user: ${user.email} (${user._id})`);
    res.status(200).json({ success: true, message: `User ${user.email} deleted.` });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/admin/users/:id/toggle-active
const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"}.`,
      data: { isActive: user.isActive },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/admin/predictions
const getAllPredictions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [predictions, total] = await Promise.all([
      Prediction.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "name email"),
      Prediction.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        predictions,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/admin/contacts
const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json({ success: true, data: { contacts } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats, getUsers, deleteUser, toggleUserActive, getAllPredictions, getContacts };
