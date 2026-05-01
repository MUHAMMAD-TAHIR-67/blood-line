// components/FeaturedDonors.jsx
import React from 'react';
import Title from './Title';
import DonorCard from './DonorCard';

export default function FeaturedDonors({ donors }) {
  // Return null if no donors
  if (!donors || donors.length === 0) {
    return null;
  }

  return (
    <div className='my-16'>
      <div className='text-center mb-10'>
        <Title text1={"FEATURED"} text2={"DONORS"} />
        <p className='text-gray-600 max-w-2xl mx-auto mt-4'>
          Our verified and trusted donors are ready to help. These generous individuals have pledged to donate blood when needed.
        </p>
      </div>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {donors.map(donor => (
          <DonorCard key={donor._id} donor={donor} />
        ))}
      </div>
    </div>
  );
}