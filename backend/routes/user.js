const express = require('express');
const router = express.Router();
const {
  getUserById,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/user');
const { isSignedIn, isAuthenticated } = require('../controllers/auth');

// Middleware to get user by userId from params
router.param('userId', getUserById);

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:userId', isSignedIn, isAuthenticated, getUserProfile);
router.put('/profile/:userId', isSignedIn, isAuthenticated, updateUserProfile);

module.exports = router;
