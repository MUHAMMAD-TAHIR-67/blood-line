// components/DonationTips.jsx
import React from 'react';

export default function DonationTips() {
  return (
    <div className='bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 mb-6'>
      <h3 className='font-bold text-lg text-gray-800 mb-3'>Blood Donation Tips</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <p className='font-semibold text-red-700 mb-2'>Before Donation:</p>
          <ul className='text-sm text-gray-700 space-y-1'>
            <li>✓ Get plenty of sleep (7-8 hours)</li>
            <li>✓ Eat iron-rich foods (spinach, red meat, beans)</li>
            <li>✓ Drink extra water</li>
            <li>✓ Avoid alcohol 24 hours before</li>
          </ul>
        </div>
        <div>
          <p className='font-semibold text-green-700 mb-2'>After Donation:</p>
          <ul className='text-sm text-gray-700 space-y-1'>
            <li>✓ Rest for 10-15 minutes</li>
            <li>✓ Eat a snack and drink fluids</li>
            <li>✓ Avoid heavy lifting for 24 hours</li>
            <li>✓ Keep the bandage on for 4-5 hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
}