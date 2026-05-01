// components/RequestSummary.jsx
import React, { useContext } from 'react';
import { BloodContext } from '../context/BloodContext';
import Title from './Title';

export default function RequestSummary() {
  const { bloodRequests, donors } = useContext(BloodContext);
  
  const getTotalUnits = () => {
    return Object.values(bloodRequests).reduce((total, item) => total + item.quantity, 0);
  };

  const getRequestDetails = () => {
    const details = [];
    for (const donorId in bloodRequests) {
      const donor = donors.find(d => d._id === donorId);
      if (donor) {
        details.push({
          name: donor.name,
          // FIXED: Use donor.bloodGroup directly (it's on the user model)
          bloodGroup: donor.bloodGroup || bloodRequests[donorId].bloodGroup,
          units: bloodRequests[donorId].quantity
        });
      }
    }
    return details;
  };

  const totalUnits = getTotalUnits();
  const requestDetails = getRequestDetails();

  return (
    <div className='w-full bg-gray-50 rounded-lg p-6'>
      <div className='mb-4'>
        <Title text1={'REQUEST'} text2={'SUMMARY'} />
      </div>
      
      {requestDetails.length === 0 ? (
        <p className='text-gray-500 text-sm text-center py-4'>No donors selected</p>
      ) : (
        <div className='space-y-3 mb-4'>
          {requestDetails.map((item, index) => (
            <div key={index} className='flex justify-between text-sm py-2 border-b border-gray-200'>
              <span>
                {item.name} 
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                  item.bloodGroup === 'O-' ? 'bg-red-100 text-red-700' :
                  item.bloodGroup === 'A+' ? 'bg-green-100 text-green-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {item.bloodGroup}
                </span>
              </span>
              <span>{item.units} unit{item.units !== 1 ? 's' : ''}</span>
            </div>
          ))}
        </div>
      )}
      
      <hr className='my-3' />
      
      <div className='flex justify-between font-bold text-lg'>
        <span>Total Units Required:</span>
        <span className='text-red-600'>{totalUnits}</span>
      </div>
      
      <div className='mt-3 text-xs text-gray-500 text-center'>
        * Each unit is approximately 450ml of blood
      </div>
    </div>
  );
}