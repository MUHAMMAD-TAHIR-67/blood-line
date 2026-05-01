import React from 'react'
import { assets } from '../assets/assets'

export default function Navbar({setToken}) {
  const handleLogout =()=>{
    setToken("")
  }
  return (
    <div className='flex item-center py-2 px-[4%] justify-between'>
        <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
        <button onClick={handleLogout} className='bg-gray-600 text-white py-2 sm:px-7 px-5 rounded-full text-xs sm:text-sm '>Logout</button>
    </div>
  )
}
