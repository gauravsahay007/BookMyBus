const express = require('express');
const router = express.Router();
const { 
  addBus, 
  updateBus, 
  deleteBus, 
  getAvailableBuses, 
  getSeatAvailability, 
  getBusByIdDetails, 
  getBusById, 
  bookSeat, 
  cancelSeatBooking, 
  lockSeat ,
  getBusOccupancyColor
} = require('../controllers/bus');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');

// Middleware to extract `userId` and `busId` from route params
router.param('userId', getUserById);
router.param('busId', getBusById);

// Admin Routes (for managing buses)
router.post('/admin/:userId/add-bus', isSignedIn, isAuthenticated, isAdmin, addBus);
router.put('/admin/:busId/:userId/update-bus', isSignedIn, isAuthenticated, isAdmin, updateBus);
router.delete('/admin/:busId/:userId/delete-bus', isSignedIn, isAuthenticated, isAdmin, deleteBus);

// Public Routes (for users to browse and book buses)
router.get('/available-buses', getAvailableBuses); // Get available buses for a route
router.get('/:busId/seats', getSeatAvailability); // Check seat availability for a specific bus
router.get('/:busId/getDetails', getBusByIdDetails); // Get full details of a specific bus
router.get('/:busId/getStatus', getBusOccupancyColor); // Get full details of a specific bus

// User Routes (for booking and canceling seats)
router.post('/:busId/:userId/book-seat', isSignedIn, isAuthenticated, bookSeat); // Book a seat
router.post('/:busId/:userId/lock-seat', isSignedIn, isAuthenticated, lockSeat); // Lock a seat temporarily
router.delete('/:busId/:userId/cancel-seat', isSignedIn, isAuthenticated, cancelSeatBooking); // Cancel a booking

module.exports = router;
