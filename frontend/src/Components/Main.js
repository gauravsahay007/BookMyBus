import React from 'react';
import { Link } from 'react-router-dom';

const Main = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Bus Booking System!</h1>
      <div className="flex flex-col space-y-4">
        <Link 
          to="/view-bookings" 
          className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600"
        >
          View My Bookings
        </Link>
        <Link 
          to="/add-booking" 
          className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600"
        >
          Add New Booking
        </Link>
      </div>
    </div>
  );
};

export default Main;
