// src/Components/ViewBookings.js
import React, { useEffect, useState } from 'react';
import { getAllBookings } from '../Api/bookings'; // Import the function to get bookings

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      const userId = JSON.parse(localStorage.getItem('user'))._id; // Get user ID from localStorage
      try {
        const response = await getAllBookings(userId);
        setBookings(response); // Set the bookings state
      } catch (err) {
        setError(err.message || 'An error occurred while fetching bookings.');
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Your Bookings</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <ul>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <li key={booking._id} className="border-b py-2">
              <p><strong>Bus:</strong> {booking.busId}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Seat:</strong> {booking.seat}</p>
            </li>
          ))
        ) : (
          <p>No bookings found.</p>
        )}
      </ul>
    </div>
  );
};

export default ViewBookings;
