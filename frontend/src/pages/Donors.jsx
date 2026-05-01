// pages/Donors.jsx
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { BloodContext } from '../context/BloodContext';
import Title from '../components/Title';
import DonorCard from '../components/DonorCard';

export default function Donors() {
  const { donors, fetchDonors, loading, user } = useContext(BloodContext);
  const [showFilter, setShowFilter] = useState(false);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [cities, setCities] = useState([]);
  const [availability, setAvailability] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  // Use useMemo to prevent recalculation on every render
  const otherDonors = useMemo(() => {
    return user?._id 
      ? donors.filter(d => d._id !== user._id)
      : donors;
  }, [donors, user?._id]);
  
  // Get unique cities - useMemo to avoid recalculation
  const cityOptions = useMemo(() => {
    return [...new Set(
      otherDonors
        .map(d => d?.address?.city)
        .filter(city => city && city.trim() !== '')
    )];
  }, [otherDonors]);

  const toggleBloodGroup = (e) => {
    const value = e.target.value;
    setBloodGroups(prev => 
      prev.includes(value) ? prev.filter(bg => bg !== value) : [...prev, value]
    );
  };

  const toggleCity = (e) => {
    const value = e.target.value;
    setCities(prev => 
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    );
  };

  // Filter donors - useMemo to prevent infinite re-renders
  const filteredDonors = useMemo(() => {
    let filtered = [...otherDonors];

    if (bloodGroups.length > 0) {
      filtered = filtered.filter(donor => bloodGroups.includes(donor.bloodGroup));
    }
    if (cities.length > 0) {
      filtered = filtered.filter(donor => cities.includes(donor?.address?.city));
    }
    if (availability) {
      filtered = filtered.filter(donor => donor?.donorInfo?.available === true);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(donor => 
        donor.name?.toLowerCase().includes(term) ||
        donor.address?.city?.toLowerCase().includes(term) ||
        donor.bloodGroup?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [otherDonors, bloodGroups, cities, availability, searchTerm]);

  const clearFilters = () => {
    setBloodGroups([]);
    setCities([]);
    setAvailability(false);
    setSearchTerm('');
  };

  return (
    <div className='flex flex-col lg:flex-row gap-8 pt-10 border-t'>
      {/* Filters Sidebar */}
      <div className='lg:w-72'>
        <button 
          onClick={() => setShowFilter(!showFilter)} 
          className='my-2 text-xl flex items-center gap-2 font-semibold lg:hidden'
        >
          FILTERS
          <span className={`transition-transform ${showFilter ? "rotate-90" : ""}`}>▶</span>
        </button>

        <div className={`space-y-6 ${showFilter ? "block" : "hidden lg:block"}`}>
          {/* Search */}
          <div className='border rounded-lg p-4'>
            <input
              type="text"
              placeholder="Search name, city, blood group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Blood Group Filter */}
          <div className='border rounded-lg p-4'>
            <p className='mb-3 font-semibold text-gray-800'>BLOOD GROUP</p>
            <div className='grid grid-cols-2 gap-2'>
              {bloodGroupOptions.map(bg => (
                <label key={bg} className='flex items-center gap-2 text-sm cursor-pointer'>
                  <input 
                    type="checkbox" 
                    onChange={toggleBloodGroup} 
                    value={bg} 
                    checked={bloodGroups.includes(bg)} 
                    className='w-4 h-4 accent-red-600' 
                  />
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    bg === 'O-' ? 'bg-red-100 text-red-700' : 
                    bg.includes('A') ? 'bg-green-100 text-green-700' : 
                    bg.includes('B') ? 'bg-blue-100 text-blue-700' : 
                    'bg-purple-100 text-purple-700'
                  }`}>{bg}</span>
                </label>
              ))}
            </div>
          </div>

          {/* City Filter */}
          {cityOptions.length > 0 && (
            <div className='border rounded-lg p-4'>
              <p className='mb-3 font-semibold text-gray-800'>CITY</p>
              <div className='space-y-2 max-h-48 overflow-y-auto'>
                {cityOptions.map(city => (
                  <label key={city} className='flex items-center gap-2 text-sm cursor-pointer'>
                    <input 
                      type="checkbox" 
                      onChange={toggleCity} 
                      value={city} 
                      checked={cities.includes(city)} 
                      className='w-4 h-4 accent-red-600' 
                    />
                    {city}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Availability Filter */}
          <div className='border rounded-lg p-4'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input 
                type="checkbox" 
                onChange={(e) => setAvailability(e.target.checked)} 
                checked={availability} 
                className='w-4 h-4 accent-red-600' 
              />
              <span className='text-sm'>Available Donors Only</span>
            </label>
          </div>

          <button 
            onClick={clearFilters} 
            className='w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition'
          >
            Clear Filters
          </button>
          
          {/* Info for donors */}
          {user?.isDonor && (
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700'>
              💡 <strong>Note:</strong> You are not shown in search results. Other donors can still find you.
            </div>
          )}
        </div>
      </div>

      {/* Donors List */}
      <div className='flex-1'>
        <div className='flex justify-between items-center mb-6 flex-wrap gap-4'>
          <Title text1={"FIND"} text2={"DONORS"} />
          <p className='text-sm text-gray-500'>
            {filteredDonors.length} donor{filteredDonors.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {loading ? (
          <div className='flex justify-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-600'></div>
          </div>
        ) : filteredDonors.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredDonors.map(donor => (
              <DonorCard key={donor._id} donor={donor} />
            ))}
          </div>
        ) : (
          <div className='text-center py-16 bg-gray-50 rounded-lg'>
            <div className='text-6xl mb-4'>🩸</div>
            <p className='text-gray-500 text-lg mb-2'>
              {otherDonors.length === 0 
                ? 'No other donors registered yet.' 
                : 'No donors match your filters.'}
            </p>
            {otherDonors.length > 0 && (
              <button onClick={clearFilters} className='text-red-600 underline'>
                Clear all filters
              </button>
            )}
            {otherDonors.length === 0 && (
              <p className='text-sm text-gray-400 mt-2'>
                Be the first donor! Invite others to join.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}