// admin-frontend/src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function AdminLogin({ setAdminToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/user/admin-login`, { email, password });
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setAdminToken(data.token);
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='bg-white shadow-md rounded-lg p-8 w-96'>
        <div className='text-center mb-6'>
          <img className='w-28 mx-auto mb-3' src={assets.logo} alt="LifeLink" />
          <h1 className='text-xl font-semibold text-gray-800'>Admin Login</h1>
          <div className='w-10 h-0.5 bg-red-600 mx-auto mt-2'></div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500'
              placeholder="Email Address"
              required
            />
          </div>
          <div className='mb-5'>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500'
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-red-600 text-white py-2 rounded-md font-medium transition ${
              loading ? 'opacity-50' : 'hover:bg-red-700'
            }`}
          >
            {loading ? 'Please wait...' : 'Login'}
          </button>
        </form>
        
      </div>
    </div>
  );
}