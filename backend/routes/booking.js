const express = require('express');
const router = express.Router();
const {
  addBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingsByCentreSportAndDate,
  getBookingsForDate
} = require('../controllers/booking');
const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');

// Middleware to extract userId and bookingId from params
router.param('userId', getUserById);
router.param('bookingId', getBookingById);

// Routes
router.post('/booking/add/:userId', isSignedIn, isAuthenticated, addBooking);
router.get('/booking/getAll/:userId', isSignedIn, isAuthenticated, getAllBookings);
router.put('/booking/edit/:bookingId/:userId', isSignedIn, isAuthenticated, updateBooking);
router.delete('/booking/remove/:bookingId/:userId', isSignedIn, isAuthenticated, deleteBooking);
router.get('/booking/get/:userId', isSignedIn, isAuthenticated, getBookingsByCentreSportAndDate);
router.get('/admin/:userId/booking/getBydate', isSignedIn, isAuthenticated, getBookingsForDate);

module.exports = router;
