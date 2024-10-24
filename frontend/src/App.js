import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import SignUp from './Components/Signup';
import SignIn from './Components/Signin';
import Main from './Components/Main';
import ViewBookings from './Components/ViewBookings';
import AddBooking from './Components/AddBookings';

const AppRoutes = () => {
  const navigate = useNavigate(); // Hook for navigation
  const user = localStorage.getItem('user'); // Check if user is in localStorage

  // useEffect(() => {
  //   // Navigate to the appropriate page based on authentication status
  //   if (user) {
  //     navigate('/'); // If user is found, navigate to the main page
  //   } else {
  //     navigate('/signin'); // If no user is found, navigate to sign-in page
  //   }
  // }, [user, navigate]); // Dependency array includes user and navigate

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={user ? <Main /> : <Navigate to="/signin" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/view-bookings" element={user ? <ViewBookings /> : <Navigate to="/signin" />} />
        <Route path="/add-booking" element={<AddBooking />} />
        {/* Add other routes here as needed */}
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
