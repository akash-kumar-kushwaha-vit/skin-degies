/**
 * Admin Routes
 */

const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const {
  getStats,
  getUsers,
  deleteUser,
  toggleUserActive,
  getAllPredictions,
  getContacts,
} = require("../controllers/adminController");

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/toggle-active", toggleUserActive);
router.get("/predictions", getAllPredictions);
router.get("/contacts", getContacts);

module.exports = router;
