const Booking = require('../models/Booking');
const Bus = require('../models/Bus');

// Middleware to get a specific booking by ID
exports.getBookingById = async (req, res, next, id) => {
  try {
    const booking = await Booking.findById(id).populate('busId', 'busName route');
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    req.booking = booking;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking.', details: error.message });
  }
};

// Add a new booking
exports.addBooking = async (req, res) => {
  try {
    const { busId, seatNumber } = req.body;
    const userId = req.params.userId;

    // Check if the seat is available
    const bus = await Bus.findOneAndUpdate(
      { _id: busId, 'seats.seatNumber': seatNumber, 'seats.isBooked': false },
      { $set: { 'seats.$.isBooked': true }, $inc: { currentOccupancy: 1 } },
      { new: true }
    );

    if (!bus) {
      return res.status(400).json({ error: 'Seat is already booked or bus not found.' });
    }

    // Create a new booking
    const booking = new Booking({ userId, busId, seatNumber });
    await booking.save();

    res.status(201).json({ message: 'Booking added successfully!', booking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add booking.', details: error.message });
  }
};

// Get all bookings for a specific user
exports.getAllBookings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.find({ userId }).populate('busId', 'busName route');

    if (!bookings.length) {
      return res.status(404).json({ message: 'No bookings found for this user.' });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user bookings.', details: error.message });
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updates = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, updates, { new: true }).populate(
      'busId',
      'busName route'
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    res.status(200).json({ message: 'Booking updated successfully!', booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking.', details: error.message });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking to be deleted
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });

    // Update the seat status on the bus
    const bus = await Bus.findOne({ _id: booking.busId, 'seats.seatNumber': booking.seatNumber });
    if (!bus) return res.status(404).json({ error: 'Bus not found.' });

    const seat = bus.seats.find(seat => seat.seatNumber === booking.seatNumber);
    if (seat) {
      seat.isBooked = false; // Cancel the seat booking
      seat.bookedBy = null; // Clear the bookedBy field
      bus.currentOccupancy -= 1; // Decrease current occupancy
      await bus.save(); // Save the updated bus
    }

    // Delete the booking record
    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({ message: 'Booking deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking.', details: error.message });
  }
};

// Get bookings by centre, sport, and date (useful for admin views)
exports.getBookingsByCentreSportAndDate = async (req, res) => {
  try {
    const { date, busId } = req.query;

    const bookings = await Booking.find({ busId, date });
    if (!bookings.length) {
      return res.status(404).json({ message: 'No bookings found for this bus and date.' });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings.', details: error.message });
  }
};

// Get bookings for a specific date
exports.getBookingsForDate = async (req, res) => {
  try {
    const { date } = req.query;

    // Convert the date from the query to a start and end range
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1); // Set to the next day

    const bookings = await Booking.find({
      bookedAt: { $gte: startDate, $lt: endDate } // Filter for bookings within the date range
    }).populate('busId', 'busName route');

    if (!bookings.length) {
      return res.status(404).json({ message: 'No bookings found for this date.' });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings.', details: error.message });
  }
};


// Get booked courts with time slots (useful for admin views)
exports.getBookedCourtsWithTimeSlots = async (req, res) => {
  try {
    const { date, busId } = req.query;

    const bookings = await Booking.find({ busId, date });

    if (!bookings.length) {
      return res.status(404).json({ message: 'No bookings found for this bus and date.' });
    }

    const timeSlots = bookings.map((booking) => ({
      seatNumber: booking.seatNumber,
      time: booking.date.toTimeString(),
    }));

    res.status(200).json(timeSlots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booked courts.', details: error.message });
  }
};
