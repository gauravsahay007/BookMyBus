const Bus = require('../models/Bus');
const Booking = require('../models/Booking');
// Add a new bus
exports.addBus = async (req, res) => {
  try {
    const newBus = new Bus(req.body); // Assuming req.body contains bus details
    await newBus.save();
    res.status(201).json({ message: 'Bus added successfully!', bus: newBus });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add bus.', details: error.message });
  }
};

// Update an existing bus
exports.updateBus = async (req, res) => {
  try {
    const { busId } = req.params; // Get busId from URL parameters
    const updatedBus = await Bus.findByIdAndUpdate(busId, req.body, { new: true });
    
    if (!updatedBus) {
      return res.status(404).json({ error: 'Bus not found.' });
    }

    res.status(200).json({ message: 'Bus updated successfully!', bus: updatedBus });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bus.', details: error.message });
  }
};

// Delete a bus
exports.deleteBus = async (req, res) => {
  try {
    const { busId } = req.params; // Get busId from URL parameters
    const deletedBus = await Bus.findByIdAndDelete(busId);
    
    if (!deletedBus) {
      return res.status(404).json({ error: 'Bus not found.' });
    }

    res.status(200).json({ message: 'Bus deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bus.', details: error.message });
  }
};

// Get a bus by ID
// Get Bus by ID Middleware
exports.getBusById = async (req, res, next) => {
  try {
    const { busId } = req.params; // Get busId from URL parameters

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found.' });
    }

    req.bus = bus; // Attach bus to req.bus for further use
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bus.', details: error.message });
  }
};


// Get bus details including seat availability
exports.getBusByIdDetails = async (req, res) => {
  try {
    const { busId } = req.params; // Get busId from URL parameters

    const bus = await Bus.findById(busId).populate('seats'); // Populate seats if needed
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found.' });
    }

    res.status(200).json(bus);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bus details.', details: error.message });
  }
};

// Get all available buses with pagination
exports.getAvailableBuses = async (req, res) => {
  try {
    const { source, destination, page = 1, limit = 10 } = req.body;
    console.log(source,destination);
    const buses = await Bus.find({
      'route.source': source,
      'route.destination': destination,
    })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (!buses.length) {
      return res.status(404).json({ message: 'No buses available for this route.' });
    }

    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available buses.', details: error.message });
  }
};

// Get seat availability for a specific bus
exports.getSeatAvailability = async (req, res) => {
  try {
    const { busId } = req.params; // Get busId from URL parameters

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found.' });
    }

    const seatAvailability = bus.seats.map(seat => ({
      seatNumber: seat.seatNumber,
      isBooked: seat.isBooked,
      bookedBy: seat.bookedBy,
    }));

    res.status(200).json(seatAvailability);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch seat availability.', details: error.message });
  }
};

// Book a seat on a bus
exports.bookSeat = async (req, res) => {
  try {
    const { seatNumber} = req.body; // Get seatNumber and userId from the request body
    const {userId} = req.params; // Use the bus information attached to req
    const bus = req.bus;
    const seat = bus.seats.find(seat => seat.seatNumber === seatNumber);

    if (!seat) return res.status(404).json({ error: 'Seat not found.' });
    if (seat.isBooked) return res.status(400).json({ error: 'Seat already booked.' });

    // Book the seat
    seat.isBooked = true;
    seat.bookedBy = userId;
    bus.currentOccupancy += 1;

    const newBooking = new Booking({
      userId,
      busId: bus._id, // Reference the booked bus
      seatNumber,
    });

    const booking = await newBooking.save();

    await bus.save();
    res.status(200).json({ message: `Seat ${seatNumber} booked successfully!` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book seat.', details: error.message });
  }
};


// Cancel a booked seat
exports.cancelSeatBooking = async (req, res) => {
  try {
    const { seatNumber } = req.body; // Get seatNumber from the request body
    const bus = req.bus; // Use the bus information attached to req

    const seat = bus.seats.find(seat => seat.seatNumber === seatNumber);

    if (!seat || !seat.isBooked) {
      return res.status(400).json({ error: 'Seat is not booked.' });
    }

    // Cancel the booking
    seat.isBooked = false;
    seat.bookedBy = null;
    bus.currentOccupancy -= 1;

    await bus.save();
    res.status(200).json({ message: `Seat ${seatNumber} booking canceled successfully!` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel booking.', details: error.message });
  }
};


// Lock a seat temporarily for booking (optional)
exports.lockSeat = async (req, res) => {
  try {
    const { seatNumber } = req.body; // Get seatNumber from the request body
    const bus = req.bus; // Use the bus information attached to req
    const lockTime = 5 * 60 * 1000; // 5 minutes

    const seat = bus.seats.find(seat => seat.seatNumber === seatNumber);

    if (!seat) return res.status(404).json({ error: 'Seat not found.' });
    if (seat.isBooked || seat.lockUntil > new Date()) {
      return res.status(400).json({ error: 'Seat is already locked or booked.' });
    }

    // Lock the seat temporarily
    seat.lockUntil = new Date(Date.now() + lockTime);
    await bus.save();

    res.status(200).json({ message: `Seat ${seatNumber} locked for 5 minutes.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to lock seat.', details: error.message });
  }
};


// Get all buses (Admin only)
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all buses.', details: error.message });
  }
};


exports.getBusOccupancyColor = async (req, res) => {
  try {
    const { busId } = req.params; // Get the bus ID from the request parameters

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found.' });
    }

    // Calculate occupancy percentage
    const totalSeats = bus.totalSeats;
    const currentOccupancy = bus.currentOccupancy;

    const occupancyPercentage = (currentOccupancy / totalSeats) * 100;

    // Determine color based on occupancy percentage
    let color;
    if (occupancyPercentage <= 60) {
      color = 'Green'; // 60% or less
    } else if (occupancyPercentage > 60 && occupancyPercentage < 90) {
      color = 'Yellow'; // Between 60% and 90%
    } else {
      color = 'Red'; // 90% or more
    }

    res.status(200).json({ 
      busId, 
      occupancyPercentage: occupancyPercentage.toFixed(2), // Round to two decimal places
      color 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bus occupancy.', details: error.message });
  }
};