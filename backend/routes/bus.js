const express = require('express');
const router = express.Router();
const {addBus,updateBus,deleteBus,getAvailableBuses,getSeatAvailability,getBusByIdDetails,getBusById} = require('../controllers/bus');
const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');

// Middleware to extract userId and busId from route params
router.param('userId', getUserById);
router.param('busId', getBusById);

// Routes
router.post('/add/:userId', isSignedIn, isAuthenticated, addBus);
router.put('/update/:busId/:userId', isSignedIn, isAuthenticated, updateBus);
router.delete('/delete/:busId/:userId', isSignedIn, isAuthenticated, deleteBus);
router.get('/available', getAvailableBuses);
router.get('/:busId/seats', getSeatAvailability);
router.get('/:busId', getBusByIdDetails);

module.exports = router;
