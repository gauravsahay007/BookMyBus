const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    seatNumber: { type: String, required: true }, // Store the seat number booked by the user
    bookedAt: { type: Date, default: Date.now }, // Timestamp for the booking
  });
  
  module.exports = mongoose.model('Booking', bookingSchema);
  