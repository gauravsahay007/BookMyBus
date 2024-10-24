// src/API/auth.js
import axios from 'axios';

const database = process.env.REACT_APP_BACKEND
export const signup = async (userData) => {
  const response = await axios.post(`${database}/api/signup`, userData);
  return response.data; // Return the response data for further use if needed
};

export const signin = async (userData) => {
  const response = await axios.post(`${database}/api/signin`, userData);
  return response.data; // Return the response data for further use if needed
};
