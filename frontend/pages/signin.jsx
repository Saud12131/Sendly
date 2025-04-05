import { useState } from 'react';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../backendurl';

const Signin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/signin`, formData);
      localStorage.setItem('token', res.data.token);
      alert('Signed in successfully!');
      navigate('/');
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handlelogincred = () => {
    setFormData({
      email: "saudsayyed@gmail.com",
      password: "saud"
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            value={formData.password}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition"
          >
            Sign In
          </button>

        </form>
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded-md font-medium hover:bg-red-700 transition mt-1.5"
          onClick={handlelogincred}
        >
          Guest Credentials
        </button>
        <button
          className="w-full bg-yellow-500 text-white py-3 rounded-md font-medium hover:bg-yellow-600 transition mt-4"
          onClick={() => navigate('/signup')}
        >
          New here? Sign Up
        </button>
      </div>
    </div>
  );
};

export default Signin;
