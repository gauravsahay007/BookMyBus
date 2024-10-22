const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { signup, signin } = require("../controllers/auth");

// Signup Route
router.post("/signup", [
  check("username", "Username should be at least 3 characters").isLength({ min: 3 }),
  check("email", "Email is required").isEmail(),
  check("password", "Password should be at least 3 characters").isLength({ min: 3 }),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  signup(req, res, next);
});

// Signin Route
router.post("/signin", [
  check("email", "Email is required").isEmail(),
  check("password", "Password field is required").isLength({ min: 1 }),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  signin(req, res, next);
});

module.exports = router;
