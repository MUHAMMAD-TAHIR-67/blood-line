// components/DonorCard.jsx
import React, { useContext } from 'react';
import { BloodContext } from '../context/BloodContext';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

export default function DonorCard({ donor }) {
  const { addBloodRequest, user } = useContext(BloodContext);

  const getBloodGroupColor = (bloodGroup) => {
    const colors = {
      'A+': 'bg-green-100 text-green-700',
      'A-': 'bg-emerald-100 text-emerald-700',
      'B+': 'bg-blue-100 text-blue-700',
      'B-': 'bg-cyan-100 text-cyan-700',
      'AB+': 'bg-purple-100 text-purple-700',
      'AB-': 'bg-violet-100 text-violet-700',
      'O+': 'bg-orange-100 text-orange-700',
      'O-': 'bg-red-100 text-red-700'
    };
    return colors[bloodGroup] || 'bg-gray-100 text-gray-700';
  };

  // Check if viewing own profile
  const isOwnProfile = user?._id === donor?._id;
  
  const donorImage = donor.donorInfo?.image?.[0] || assets.profile_icon;
  const isAvailable = donor.donorInfo?.available ?? true;
  const isUrgent = donor.donorInfo?.urgent ?? false;
  const isVerified = donor.donorInfo?.verified ?? false;
  const donationCount = donor.donorInfo?.donationCount ?? 0;

  return (
    <div className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100'>
      {/* <Link to={`/donor/${donor._id}`}>
        <div className='overflow-hidden h-48 bg-gradient-to-br from-red-50 to-gray-100'>
          <img 
            className='w-full h-full object-cover hover:scale-110 transition-transform duration-500' 
            src={donorImage} 
            alt={donor.name} 
          />
        </div>
      </Link> */}
      
      <div className='p-4'>
        <div className='flex justify-between items-start mb-2'>
          <Link to={`/donor/${donor._id}`}>
            <h3 className='font-bold text-lg text-gray-800 hover:text-red-600 transition'>
              {donor.name}
            </h3>
          </Link>
          <div className='flex gap-1 flex-wrap'>
            {isUrgent && (
              <span className='bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse'>
                URGENT
              </span>
            )}
            {isVerified && (
              <span className='bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full'>
                ✓ Verified
              </span>
            )}
          </div>
        </div>
        
        <div className='space-y-2 mb-4'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-500'>Blood Group:</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getBloodGroupColor(donor.bloodGroup)}`}>
              {donor.bloodGroup}
            </span>
          </div>
          
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-500'>📍 City:</span>
            <span className='text-sm text-gray-700'>{donor.address?.city || 'N/A'}</span>
          </div>
          
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-500'>📞 Contact:</span>
            <span className='text-sm text-gray-700'>{donor.phone || 'N/A'}</span>
          </div>
          
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-500'>🩸 Donations:</span>
            <span className='text-sm text-gray-700'>{donationCount} times</span>
          </div>
          
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-500'>Status:</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>
        
        {/* Button Section */}
        {isOwnProfile ?
         (
          <button disabled className='w-full bg-blue-100 text-blue-700 py-2 rounded-lg cursor-default text-sm font-medium'>
            👤 This is your profile
          </button>
        )
         : isAvailable ? (
          <button 
            onClick={() => addBloodRequest(donor._id, donor.bloodGroup, donor.name)}
            className='w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition duration-300 flex items-center justify-center gap-2'
          >
            <span>🩸</span>
            Request Blood
          </button>
        ) : (
          <button disabled className='w-full bg-gray-300 text-gray-500 py-2 rounded-lg cursor-not-allowed text-sm'>
            Currently Unavailable
          </button>
        )}
      </div>
    </div>
  );
}