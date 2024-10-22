const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware to get user by userId
exports.getUserById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    req.profile = user; // Attach user to req.profile for further use
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user.', details: error.message });
  }
};

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email.' });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, location });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user.', details: error.message });
  }
};

// Login user and generate JWT token
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the provided password matches the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Generate a JWT token
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Send the token and user information in the response
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login.', details: error.message });
  }
};

// Get user profile (User only)
exports.getUserProfile = (req, res) => {
  return res.status(200).json(req.profile);
};

// Update user profile (User only)
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.profile._id;
    const updates = req.body;

    // Update the user profile in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      select: '-password', // Exclude password from the response
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'Profile updated successfully!', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile.', details: error.message });
  }
};
