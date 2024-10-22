const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  isBooked: { type: Boolean, default: false }, // Track booking status of the seat
});

const busSchema = new mongoose.Schema({
  busName: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  seats: [seatSchema], // Store the seats as an array of seat objects
  currentOccupancy: { type: Number, default: 0 }, // Number of booked seats
  operationDays: [{ type: String }], // Days of operation (e.g., ['Monday', 'Wednesday'])
  route: {
    source: { type: String, required: true },
    destination: { type: String, required: true },
    distance: { type: Number, required: true }, // In kilometers
    eta: { type: String, required: true }, // Estimated Time of Arrival in hh:mm format
  },
});

module.exports = mongoose.model('Bus', busSchema);
