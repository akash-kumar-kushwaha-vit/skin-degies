/**
 * Contact Routes
 */

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { optionalAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");
const Contact = require("../models/Contact");
const rateLimit = require("express-rate-limit");

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Contact message limit reached. Try again in 1 hour." },
});

router.post(
  "/",
  contactLimiter,
  optionalAuth,
  [
    body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("subject").trim().isLength({ min: 3, max: 200 }).withMessage("Subject is required"),
    body("message").trim().isLength({ min: 10, max: 2000 }).withMessage("Message must be 10–2000 characters"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const contact = await Contact.create({
        ...req.body,
        userId: req.user?.userId || null,
      });
      res.status(201).json({ success: true, message: "Message sent! We'll get back to you soon." });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
