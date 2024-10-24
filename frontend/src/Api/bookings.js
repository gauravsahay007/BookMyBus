// src/API/bookings.js
import axios from 'axios';

const database = process.env.REACT_APP_BACKEND;

export const getAllBookings = async (userId) => {
  const response = await axios.get(`${database}/api/booking/getAll/${userId}`);
  return response.data; // Return the bookings data
};

export const addBooking = async (bookingData, userId) => {
  const response = await axios.post(`${database}/api/booking/add/${userId}`, bookingData);
  return response.data; // Return the response data after adding booking
};
