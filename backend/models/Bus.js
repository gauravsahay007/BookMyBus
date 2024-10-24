const mongoose = require('mongoose');

// Schema for each seat in the bus
const seatSchema = new mongoose.Schema({
  seatNumber: { 
    type: String, 
    required: true, 
  },
  isBooked: { type: Boolean, default: false }, // Track if the seat is booked
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // User who booked the seat
  lockUntil: { type: Date, default: null }, // Optional: Lock seat temporarily for booking
});

// Main Bus Schema
const busSchema = new mongoose.Schema({
  busName: { type: String, required: true },
  totalSeats: { 
    type: Number, 
    required: true,
    validate: {
      validator: function(value) {
        return value > 0; // Ensure total seats is greater than 0
      },
      message: 'Total seats must be a positive number.'
    }
  },
  seats: [seatSchema], // Array of seat objects
  currentOccupancy: { 
    type: Number, 
    default: 0, 
    min: 0 // Ensure occupancy is non-negative
  },
  operationDays: [{ 
    type: String, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], // Validate days
  }],
  route: {
    source: { type: String, required: true },
    destination: { type: String, required: true },
    distance: { 
      type: Number, 
      required: true, 
      min: 0 // Distance must be non-negative
    }, 
    eta: { type: String, required: true, match: /^\d{2}:\d{2}$/ }, // Validate ETA (hh:mm format)
  },
}, { timestamps: true }); // Add createdAt and updatedAt timestamps

// Ensure that buses with the same name and route are unique
busSchema.index({ busName: 1, 'route.source': 1, 'route.destination': 1 }, { unique: true });

module.exports = mongoose.model('Bus', busSchema);
