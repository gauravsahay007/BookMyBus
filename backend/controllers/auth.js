// Importing User model and JWT for authentication
const User = require("../models/User");
var jwt = require("jsonwebtoken");

// Importing express-jwt to protect routes
const { expressjwt: expressJwt } = require("express-jwt");

// Importing express-validator for validation and error handling
const { check, validationResult } = require("express-validator");

// User signup logic
exports.signup = async (req, res) => {
    const errors = validationResult(req);
  
    // Return error if validation fails
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg,
      });
    }
  
    try {
      // Create a new user
      const user = new User(req.body);
      const savedUser = await user.save(); // Save user to DB
  
      // Generate a JWT token immediately upon signup (optional)
      const token = jwt.sign({ _id: savedUser._id }, process.env.SECRET);
  
      // Store token in cookie (optional)
      res.cookie("token", token, { expire: new Date() + 9999 });
  
      // Return token and basic user info
      const { _id, name, email, role } = savedUser;
      return res.json({
        token,
        user: { _id, name, email, role },
      });
    } catch (error) {
      console.error("Error saving user:", error);
      return res.status(400).json({
        error: "Not able to save user in DATABASE",
      });
    }
  };
// User signin logic
exports.signin = (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body;

    // Return error if validation fails
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    // Find user by email
    User.findOne({ email }).then((user, err) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User email does not exist"
            });
        }

        // Authenticate the user by password
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match"
            });
        }

        // Generate JWT token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);

        // Store token in cookie
        res.cookie("token", token, { expire: new Date() + 9999 });

        // Send response with user details and token
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, name, email, role } });
    });
};

// Middleware to check if user is signed in (protected route)
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
    userProperty: "auth"
});

// Middleware to check if the user is authenticated
exports.isAuthenticated = (req, res, next) => {
    const check = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!check) {
        return res.status(403).json({
            error: "Access Denied"
        });
    }
    next();
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
    if (req.profile.role == 0) {
        return res.status(403).json({
            error: "You are not an admin"
        });
    }
    next();
};
