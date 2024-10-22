const Bus = require('../models/Bus');

// Middleware to get bus details by busId
exports.getBusById = async (req, res, next, id) => {
  try {
    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found.' });
    }
    req.bus = bus; // Attach the bus to the request object
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bus details.', details: error.message });
  }
};

// Add a new bus (Admin only)
exports.addBus = async (req, res) => {
  try {
    const { busName, totalSeats, operationDays, route } = req.body;

    // Create the seat plan
    const seats = Array.from({ length: totalSeats }, (_, index) => ({
      seatNumber: (index + 1).toString(),
      isBooked: false,
    }));

    const newBus = new Bus({
      busName,
      totalSeats,
      seats,
      operationDays,
      route,
    });

    await newBus.save();
    res.status(201).json({ message: 'Bus added successfully!', bus: newBus });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add bus.', details: error.message });
  }
};

// Update a bus (Admin only)
exports.updateBus = async (req, res) => {
  try {
    const { busId } = req.params;
    const updates = req.body;

    const updatedBus = await Bus.findByIdAndUpdate(busId, updates, { new: true });
    if (!updatedBus) {
      return res.status(404).json({ error: 'Bus not found.' });
    }

    res.status(200).json({ message: 'Bus updated successfully!', bus: updatedBus });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bus.', details: error.message });
  }
};

// Delete a bus (Admin only)
exports.deleteBus = async (req, res) => {
  try {
    const { busId } = req.params;

    const deletedBus = await Bus.findByIdAndDelete(busId);
    if (!deletedBus) {
      return res.status(404).json({ error: 'Bus not found.' });
    }

    res.status(200).json({ message: 'Bus deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bus.', details: error.message });
  }
};

// Get all available buses for a route
exports.getAvailableBuses = async (req, res) => {
  try {
    const { source, destination } = req.query;

    const buses = await Bus.find({
      'route.source': source,
      'route.destination': destination,
    });

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
    const { busId } = req.params;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found.' });
    }

    const availableSeats = bus.seats.filter(seat => !seat.isBooked);
    const occupancyPercentage = (bus.currentOccupancy / bus.totalSeats) * 100;

    res.status(200).json({
      totalSeats: bus.totalSeats,
      availableSeats: availableSeats.length,
      occupancy: `${occupancyPercentage.toFixed(2)}%`,
      seats: availableSeats,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch seat availability.', details: error.message });
  }
};

// Get a specific bus by ID
exports.getBusByIdDetails = async (req, res) => {
  try {
    const { busId } = req.params;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found.' });
    }

    res.status(200).json(bus);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bus details.', details: error.message });
  }
};
