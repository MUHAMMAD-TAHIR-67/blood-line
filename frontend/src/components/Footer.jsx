// components/Footer.jsx
import React from 'react';
import { assets } from '../assets/assets';

export default function Footer() {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
          <img className='mb-5 w-32' src={assets.logo} alt="Blood Donation" />
          <p className='w-full md:w-3/4 text-gray-700'>
            Connecting blood donors with those in need. Every donation can save up to three lives. Join our mission today.
          </p>
        </div>
        <div>
          <p className='font-medium mb-5 text-xl'>QUICK LINKS</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li className='hover:text-red-600 cursor-pointer'>Home</li>
            <li className='hover:text-red-600 cursor-pointer'>Find Donors</li>
            <li className='hover:text-red-600 cursor-pointer'>Become Donor</li>
            <li className='hover:text-red-600 cursor-pointer'>About Us</li>
          </ul>
        </div>
        <div>
          <p className='font-medium mb-5 text-xl'>EMERGENCY CONTACT</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>📞 Helpline: 1122</li>
            <li>📞 Blood Bank: 0800-12345</li>
            <li>✉️ help@blooddonation.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>
          Copyright 2025 © Blood Donation Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
}