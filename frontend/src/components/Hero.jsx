// components/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className='relative bg-gradient-to-r from-red-700 to-red-900 text-white rounded-2xl overflow-hidden my-6'>
      <div className='absolute inset-0 bg-black opacity-20'></div>
      <div className='relative container mx-auto px-6 py-16 md:py-24'>
        <div className='max-w-2xl'>
          <div className='flex items-center gap-2 mb-4'>
            <div className='w-12 h-[2px] bg-white'></div>
            <p className='text-sm uppercase tracking-wider'>Save Lives Today</p>
          </div>
          
          <h1 className='text-4xl md:text-6xl font-bold mb-4 leading-tight'>
            Donate Blood, <br />
            <span className='text-red-300'>Save Lives</span>
          </h1>
          
          <p className='text-base md:text-lg mb-8 opacity-90'>
            Every drop counts. Join thousands of heroes who donate blood regularly.
            One donation can save up to three lives.
          </p>
          
          <div className='flex flex-col sm:flex-row gap-4'>
            <Link 
              to='/donors' 
              className='bg-white text-red-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-center'
            >
              Find Donors Now
            </Link>
            <Link 
              to='/become-donor' 
              className='border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-700 transition text-center'
            >
              Become a Donor
            </Link>
          </div>
          
          <div className='flex gap-8 mt-12'>
            <div>
              <div className='text-2xl font-bold'>500+</div>
              <div className='text-sm opacity-75'>Lives Saved</div>
            </div>
            <div>
              <div className='text-2xl font-bold'>200+</div>
              <div className='text-sm opacity-75'>Active Donors</div>
            </div>
            <div>
              <div className='text-2xl font-bold'>24/7</div>
              <div className='text-sm opacity-75'>Emergency Support</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className='absolute bottom-0 right-0 w-64 h-64 bg-red-500 rounded-full filter blur-3xl opacity-20'></div>
    </div>
  );
}