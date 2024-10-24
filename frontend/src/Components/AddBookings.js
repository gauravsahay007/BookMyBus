import React, { useState, useEffect } from 'react';
import { addBooking } from '../API/bookings'; // Import the function to add a booking
import { getAvailableBuses } from '../API/buses'; // Import function to get available buses

const AddBooking = () => {
  const [formData, setFormData] = useState({
    busId: '',
    date: '',
    seat: '',
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [availableBuses, setAvailableBuses] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSourceChange = (e) => {
    setSource(e.target.value);
    setFormData({ ...formData, busId: '' }); // Reset busId when source changes
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
    setFormData({ ...formData, busId: '' }); // Reset busId when destination changes
  };

  const fetchAvailableBuses = async () => {
    if (source && destination) {
      try {
        const buses = await getAvailableBuses(source, destination);
        setAvailableBuses(buses);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching available buses.');
      }
    }
  };

  useEffect(() => {
    fetchAvailableBuses(); // Fetch available buses when source or destination changes
  }, [source, destination]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = JSON.parse(localStorage.getItem('user'))._id; // Get user ID from localStorage
    try {
      await addBooking(formData, userId); // Call the addBooking API function
      setSuccess('Booking added successfully!');
      setError('');
      setFormData({ busId: '', date: '', seat: '' }); // Reset form
      setAvailableBuses([]); // Clear available buses
      setSource('');
      setDestination('');
    } catch (err) {
      setError(err.message || 'An error occurred while adding the booking.');
      setSuccess('');
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Add New Booking</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Source</label>
          <select
            name="source"
            value={source}
            onChange={handleSourceChange}
            className="border rounded w-full p-2"
            required
          >
            <option value="">Select Source</option>
            {/* Add your source options here */}
            <option value="Source1">Source 1</option>
            <option value="Source2">Source 2</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Destination</label>
          <select
            name="destination"
            value={destination}
            onChange={handleDestinationChange}
            className="border rounded w-full p-2"
            required
          >
            <option value="">Select Destination</option>
            {/* Add your destination options here */}
            <option value="Destination1">Destination 1</option>
            <option value="Destination2">Destination 2</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Bus</label>
          <select
            name="busId"
            value={formData.busId}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          >
            <option value="">Select Bus</option>
            {availableBuses.map((bus) => (
              <option key={bus._id} value={bus._id}>{bus.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Seat</label>
          <input
            type="text"
            name="seat"
            value={formData.seat}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded w-full py-2 hover:bg-blue-600"
        >
          Add Booking
        </button>
      </form>
    </div>
  );
};

export default AddBooking;
