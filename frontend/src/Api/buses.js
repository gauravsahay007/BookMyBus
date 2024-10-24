// src/API/buses.js
import axios from 'axios';

const database = process.env.REACT_APP_BACKEND;

export const getAvailableBuses = async (source, destination) => {
  const response = await axios.get(`${database}/api/available-buses`, {
    params: { source, destination },
  });
  return response.data; // Return the list of available buses
};
