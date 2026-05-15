// pages/Home.jsx
import React, { useContext } from 'react';
import { BloodContext } from '../context/BloodContext';
import Hero from '../components/Hero';
import FeaturedDonors from '../components/FeaturedDonors';
import UrgentRequests from '../components/UrgentRequests';
import Title from '../components/Title';
import { Link, useNavigate } from 'react-router-dom';

// BecomeDonor component
const BecomeDonor = ({ user, token }) => {
  const navigate = useNavigate();

  // If user is already a donor, show a different message
  if (user?.isDonor) {
    return (
      <div className='my-16 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-2xl p-8 md:p-12 text-center'>
        <h2 className='text-3xl md:text-4xl font-bold mb-4'>You're Already a Donor! 🎉</h2>
        <p className='text-lg mb-8 max-w-2xl mx-auto opacity-90'>
          Thank you for being a life-saver! Check your incoming requests or update your availability.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link 
            to='/incoming-requests' 
            className='inline-block bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition'
          >
            🔔 View Incoming Requests
          </Link>
          <Link 
            to='/profile' 
            className='inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition'
          >
            👤 Manage Profile
          </Link>
        </div>
      </div>
    );
  }

  // If user is logged in but NOT a donor yet
  if (token && !user?.isDonor) {
    return (
      <div className='my-16 bg-gradient-to-r from-red-800 to-red-900 text-white rounded-2xl p-8 md:p-12 text-center'>
        <h2 className='text-3xl md:text-4xl font-bold mb-4'>Ready to Save Lives?</h2>
        <p className='text-lg mb-4 max-w-2xl mx-auto opacity-90'>
          You're just one step away from becoming a blood donor. Add your blood group and details to start helping others!
        </p>
        <div className='flex items-center justify-center gap-2 mb-6'>
          <span className='text-yellow-300 text-lg'>⚠️</span>
          <p className='text-yellow-100 text-sm'>
            You need to add your blood group, age, and weight to become a donor
          </p>
        </div>
        <button 
          onClick={() => navigate('/profile')}
          className='inline-block bg-white text-red-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-lg'
        >
          🩸 Become a Donor Now
        </button>
        <p className='text-sm text-red-200 mt-3'>
          You'll be redirected to your profile to complete donor registration
        </p>
      </div>
    );
  }

  // If user is NOT logged in
  return (
    <div className='my-16 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-2xl p-8 md:p-12 text-center'>
      <h2 className='text-3xl md:text-4xl font-bold mb-4'>Become a Blood Donor Today</h2>
      <p className='text-lg mb-8 max-w-2xl mx-auto opacity-90'>
        Join our community of life-savers. Your donation can give someone another chance at life.
      </p>
      <Link 
        to='/login' 
        className='inline-block bg-white text-red-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition'
      >
        Register as Donor
      </Link>
    </div>
  );
};

export default function Home() {
  const { featuredDonors, urgentRequests, user, token } = useContext(BloodContext);

  return (
    <div>
      <Hero />
      
      {/* Urgent Blood Requests Section */}
      {urgentRequests && urgentRequests.length > 0 && <UrgentRequests />}
      
      {/* Featured Donors Section */}
      {featuredDonors && featuredDonors.length > 0 && <FeaturedDonors donors={featuredDonors} />}
      
      {/* Why Donate Blood Section */}
      <div className='my-16 py-8 bg-gradient-to-r from-red-50 to-white rounded-2xl'>
        <div className='text-center mb-10'>
          <Title text1={"WHY"} text2={"DONATE BLOOD?"} />
          <p className='text-gray-600 max-w-2xl mx-auto mt-4'>
            Your donation can make a significant difference in someone's life
          </p>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 px-4'>
          <div className='text-center p-6'>
            <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-2xl'>🩸</span>
            </div>
            <h3 className='font-bold text-lg mb-2'>Save Lives</h3>
            <p className='text-gray-600 text-sm'>
              One donation can save up to three lives. Your blood is precious and needed.
            </p>
          </div>
          
          <div className='text-center p-6'>
            <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-2xl'>❤️</span>
            </div>
            <h3 className='font-bold text-lg mb-2'>Health Benefits</h3>
            <p className='text-gray-600 text-sm'>
              Regular blood donation reduces the risk of heart disease and burns calories.
            </p>
          </div>
          
          <div className='text-center p-6'>
            <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-2xl'>🤝</span>
            </div>
            <h3 className='font-bold text-lg mb-2'>Community Impact</h3>
            <p className='text-gray-600 text-sm'>
              Join a community of heroes who are committed to saving lives every day.
            </p>
          </div>
        </div>
      </div>
      
      {/* Become a Donor CTA - Shows different content based on user status */}
      <BecomeDonor user={user} token={token} />
    </div>
  );
}