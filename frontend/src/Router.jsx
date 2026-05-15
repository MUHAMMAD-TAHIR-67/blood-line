// Router.jsx
import React, { useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import BloodRequest from './pages/BloodRequest';
import RequestForm from './pages/RequestForm';
import MyRequests from './pages/MyRequests';
import IncomingRequests from './pages/IncomingRequests';
import Profile from './pages/Profile';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Donors from './pages/Donors';
import DonationHistory from './pages/DonationHistory';  // ADD THIS IMPORT
import { BloodContext } from './context/BloodContext';

// Become Donor Page - Smart routing based on user status
const BecomeDonorPage = () => {
  const { token, user } = useContext(BloodContext);
  const navigate = useNavigate();

  // Not logged in - show login/register prompt
  if (!token) {
    return (
      <div className='max-w-2xl mx-auto py-16 px-4 text-center'>
        <div className='text-6xl mb-6'>🩸</div>
        <h1 className='text-3xl font-bold mb-4'>Become a Blood Donor</h1>
        <p className='text-gray-600 mb-8 text-lg'>
          Register an account and set up your donor profile to start saving lives!
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <button 
            onClick={() => navigate('/login')}
            className='bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition text-lg'
          >
            Login / Register
          </button>
        </div>
        <p className='text-sm text-gray-400 mt-6'>
          Already have an account? Login and go to your profile to become a donor.
        </p>
      </div>
    );
  }

  // Logged in but NOT a donor
  if (!user?.isDonor) {
    return (
      <div className='max-w-2xl mx-auto py-16 px-4 text-center'>
        <div className='text-6xl mb-6'>🩸</div>
        <h1 className='text-3xl font-bold mb-4'>You're Almost There!</h1>
        <p className='text-gray-600 mb-4 text-lg'>
          Hi <strong>{user?.name}</strong>! You just need to add your donor details to start saving lives.
        </p>
        
        {/* Requirements */}
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 text-left'>
          <p className='font-semibold text-yellow-800 mb-3'>📋 Requirements to become a donor:</p>
          <ul className='space-y-2 text-sm text-yellow-700'>
            <li className='flex items-center gap-2'>
              <span>✅</span> Be between 18-65 years old
            </li>
            <li className='flex items-center gap-2'>
              <span>✅</span> Weight at least 50 kg
            </li>
            <li className='flex items-center gap-2'>
              <span>✅</span> Know your blood group
            </li>
            <li className='flex items-center gap-2'>
              <span>✅</span> Be in good health
            </li>
          </ul>
        </div>

        <button 
          onClick={() => navigate('/profile')}
          className='bg-red-700 text-white px-10 py-4 rounded-lg font-bold hover:bg-red-800 transition text-xl shadow-lg hover:shadow-xl'
        >
           Complete Your Donor Profile
        </button>
        <p className='text-sm text-gray-400 mt-4'>
          You'll be redirected to your profile to add blood group, age, and weight.
        </p>
      </div>
    );
  }

  // Already a donor
  return (
    <div className='max-w-2xl mx-auto py-16 px-4 text-center'>
      <div className='text-6xl mb-6'>🎉</div>
      <h1 className='text-3xl font-bold mb-4'>You're Already a Donor!</h1>
      <p className='text-gray-600 mb-4 text-lg'>
        Thank you <strong>{user?.name}</strong> for being a life-saver!
      </p>
      
      {/* Donor Stats */}
      <div className='bg-green-50 border border-green-200 rounded-lg p-6 mb-8'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-3xl font-bold text-red-600'>
              {user?.bloodGroup || 'N/A'}
            </p>
            <p className='text-sm text-gray-500'>Your Blood Group</p>
          </div>
          <div>
            <p className='text-3xl font-bold text-green-600'>
              {user?.donorInfo?.donationCount || 0}
            </p>
            <p className='text-sm text-gray-500'>Total Donations</p>
          </div>
        </div>
        <div className='mt-3'>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            user?.donorInfo?.available 
              ? 'bg-green-200 text-green-800' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {user?.donorInfo?.available ? '🟢 Available for Donation' : '🔴 Currently Unavailable'}
          </span>
        </div>
      </div>

      <div className='flex flex-col sm:flex-row gap-4 justify-center'>
        <button 
          onClick={() => navigate('/incoming-requests')}
          className='bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition'
        >
          🔔 View Incoming Requests
        </button>
        <button 
          onClick={() => navigate('/profile')}
          className='border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition'
        >
          👤 Manage Profile
        </button>
      </div>
    </div>
  );
};

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/donors" element={<Donors />} />
      <Route path="/blood-request" element={<BloodRequest />} />
      <Route path="/request-form" element={<RequestForm />} />
      <Route path="/my-requests" element={<MyRequests />} />
      <Route path="/incoming-requests" element={<IncomingRequests />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/become-donor" element={<BecomeDonorPage />} />
      <Route path="/donation-history" element={<DonationHistory />} />  {/* ADD THIS LINE */}
    </Routes>
  );
}