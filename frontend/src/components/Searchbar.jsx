// components/Searchbar.jsx
import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { BloodContext } from '../context/BloodContext';

export default function Searchbar() {
  const { search, setSearch, showSearch, setShowSearch } = useContext(BloodContext);

  if (!showSearch) return null;

  return (
    <div className='border-t border-b border-gray-500 bg-gray-50 text-center'>
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-3 rounded-full w-3/4 sm:w-1/2 hover:bg-gray-100">
        <input 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className='flex-1 outline-none bg-inherit text-sm' 
          type="text" 
          placeholder='Search donors by name or city...' 
        />
        <img className='w-4' src={assets.search_icon} alt="" />
      </div>
      <img 
        onClick={() => setShowSearch(false)} 
        className='inline mx-2 w-3 cursor-pointer' 
        src={assets.cross_icon} 
        alt="Close" 
      />
    </div>
  );
}