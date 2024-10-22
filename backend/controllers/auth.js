const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { expressjwt: expressJwt } = require("express-jwt");
const { validationResult } = require("express-validator");

// User signup
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }

  try {
    const user = new User(req.body);
    const savedUser = await user.save();

    const token = jwt.sign({ _id: savedUser._id }, process.env.SECRET);
    res.cookie("token", token, { expire: new Date() + 9999 });

    const { _id, name, email, role } = savedUser;
    res.json({ token, user: { _id, name, email, role } });
  } catch (error) {
    res.status(400).json({ error: "Unable to save user in the database" });
  }
};

// User signin
exports.signin = async (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !user.authenticate(password)) {
      return res.status(401).json({ error: "Email and password do not match" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    res.cookie("token", token, { expire: new Date() + 9999 });

    const { _id, name, email, role } = user;
    res.json({ token, user: { _id, name, email, role } });
  } catch (error) {
    res.status(400).json({ error: "User email does not exist" });
  }
};

// Check if user is signed in
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

// Check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  const check = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!check) {
    return res.status(403).json({ error: "Access Denied" });
  }
  next();
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({ error: "You are not an admin" });
  }
  next();
};
