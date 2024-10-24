import React, { useState } from 'react';
import { signup } from '../Api/auth';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(formData);
      localStorage.setItem('user', JSON.stringify(response)); // Store user data in localStorage
      setSuccess('Account created successfully!');
      setError('');
      navigate('/'); // Redirect to the main page
    } catch (err) {
      setError(err.response.data.errors[0].msg || 'An error occurred');
      setSuccess('');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-lg font-semibold mb-4">Sign Up</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}
        
        <div className="mb-4">
          <label className="block mb-2">Username</label>
          <input 
            type="text" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            className="border rounded w-full p-2" 
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            className="border rounded w-full p-2" 
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            className="border rounded w-full p-2" 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="bg-blue-500 text-white rounded w-full py-2 hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
