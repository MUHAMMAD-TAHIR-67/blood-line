// components/Navbar.jsx
import React, { useContext, useState } from 'react';
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { BloodContext } from '../context/BloodContext';
import { toast } from 'react-toastify';

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const { getTotalRequests, clearRequests, setToken, token, user } = useContext(BloodContext);
  const navigate = useNavigate();
  const location = useLocation(); // Get current path
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('bloodRequests');
    clearRequests();
    setToken('');
    setVisible(false);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handleNavClick = (path) => {
    setVisible(false);
    navigate(path);
  };

  // Check if current path matches
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className='flex items-center justify-between py-5 font-medium border-b relative'>
      {/* Logo */}
      <img 
        onClick={() => navigate('/')} 
        className='w-32 sm:w-36 cursor-pointer' 
        src={assets.logo} 
        alt="Blood Donation" 
      />
      
      {/* Desktop Navigation */}
      <ul className='hidden sm:flex gap-6 lg:gap-8 text-sm text-gray-700'>
        <NavLink to='/' className={({ isActive }) => 
          `flex flex-col gap-1 items-center ${isActive ? 'text-red-600' : 'hover:text-red-500'}`
        }>
          <p>Home</p>
          <hr className='w-2/4 border-none h-[2px] bg-red-600 hidden group-hover:block' />
        </NavLink>
        
        <NavLink to='/donors' className={({ isActive }) => 
          `flex flex-col gap-1 items-center ${isActive ? 'text-red-600' : 'hover:text-red-500'}`
        }>
          <p>Find Donors</p>
        </NavLink>
        
        <NavLink to='/become-donor' className={({ isActive }) => 
          `flex flex-col gap-1 items-center ${isActive ? 'text-red-600' : 'hover:text-red-500'}`
        }>
          <p>Become Donor</p>
        </NavLink>
        
        <NavLink to='/about' className={({ isActive }) => 
          `flex flex-col gap-1 items-center ${isActive ? 'text-red-600' : 'hover:text-red-500'}`
        }>
          <p>About</p>
        </NavLink>
        
        <NavLink to='/contact' className={({ isActive }) => 
          `flex flex-col gap-1 items-center ${isActive ? 'text-red-600' : 'hover:text-red-500'}`
        }>
          <p>Contact</p>
        </NavLink>
      </ul>
      
      {/* Right Side Icons */}
      <div className='flex items-center gap-4 sm:gap-6'>
        {/* Profile Dropdown (Desktop) */}
        <div className='group relative hidden sm:block'>
          <img 
            onClick={() => token ? null : navigate('/login')} 
            src={assets.profile_icon} 
            className='w-5 cursor-pointer' 
            alt="Profile" 
          />
          
          {token && (
            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50'>
              <div className='flex flex-col gap-2 w-48 py-3 px-4 bg-white shadow-lg rounded-lg border'>
                <p className='text-sm font-semibold text-gray-700 border-b pb-2'>
                  {user?.name || 'User'}
                </p>
                
                <p onClick={() => navigate('/profile')} className='cursor-pointer hover:text-red-600 text-sm'>
                   My Profile
                </p>
                
                <p onClick={() => navigate('/my-requests')} className='cursor-pointer hover:text-red-600 text-sm'>
                  My Requests
                </p>
                
                {user?.isDonor && (
                  <>
                    <div className='border-t pt-2 mt-1'>
                      <p className='text-xs text-gray-400 mb-1'>DONOR MENU</p>
                    </div>
                    
                    <p onClick={() => navigate('/incoming-requests')} className='cursor-pointer hover:text-red-600 text-sm'>
                       Incoming Requests
                    </p>
                    
                    {/* NEW: Donation History Link */}
                    <p onClick={() => navigate('/donation-history')} className='cursor-pointer hover:text-red-600 text-sm flex items-center gap-2'>
                      Donation History
                    </p>
                  </>
                )}
                
                <hr className='my-1' />
                <p onClick={handleLogout} className='cursor-pointer hover:text-red-600 text-sm'>
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Blood Request Cart */}
        <Link to='/blood-request' className='relative'>
          <img src={assets.cart_icon} className='w-5 cursor-pointer' alt="Requests" />
          {getTotalRequests() > 0 && (
            <p className='absolute -right-2 -bottom-2 w-5 h-5 text-center leading-5 bg-red-600 text-white rounded-full text-[10px] font-bold'>
              {getTotalRequests()}
            </p>
          )}
        </Link>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setVisible(true)} 
          className='sm:hidden p-1'
          aria-label="Open Menu"
        >
          <svg className='w-6 h-6 text-gray-700' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
          </svg>
        </button>
      </div>
      
      {/* Mobile Overlay - Semi-transparent, not fully black */}
      {visible && (
        <div 
          className='fixed inset-0 bg-black/30 z-40 sm:hidden backdrop-blur-sm'
          onClick={() => setVisible(false)}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`fixed right-0 top-0 bottom-0 w-[75%] max-w-[300px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out sm:hidden overflow-y-auto ${
        visible ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header with Close Button */}
        <div className='flex items-center justify-between p-4 border-b bg-white sticky top-0'>
          <p className='font-bold text-lg text-gray-800'>Menu</p>
          <button 
            onClick={() => setVisible(false)} 
            className='p-1 hover:bg-gray-100 rounded-full transition'
            aria-label="Close Menu"
          >
            <svg className='w-6 h-6 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
        
        {/* User Info */}
        {token && (
          <div className='p-4 bg-gradient-to-r from-red-50 to-red-100 border-b'>
            <p className='font-semibold text-gray-800'> {user?.name || 'User'}</p>
            <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
            {user?.isDonor && (
              <span className='inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium'>
                🩸 Blood Donor
              </span>
            )}
          </div>
        )}
        
        {/* Navigation Links with Active State */}
        <div className='flex flex-col py-2'>
          <button 
            onClick={() => handleNavClick('/')} 
            className={`flex items-center gap-3 px-6 py-3.5 text-left transition ${
              isActive('/') 
                ? 'bg-red-50 text-red-600 font-semibold border-r-4 border-red-600' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
             Home
          </button>
          
          <button 
            onClick={() => handleNavClick('/donors')} 
            className={`flex items-center gap-3 px-6 py-3.5 text-left transition ${
              isActive('/donors') 
                ? 'bg-red-50 text-red-600 font-semibold border-r-4 border-red-600' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
             Find Donors
          </button>
          
          <button 
            onClick={() => handleNavClick('/become-donor')} 
            className={`flex items-center gap-3 px-6 py-3.5 text-left transition ${
              isActive('/become-donor') 
                ? 'bg-red-50 text-red-600 font-semibold border-r-4 border-red-600' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
          Become Donor
          </button>
          
          <button 
            onClick={() => handleNavClick('/about')} 
            className={`flex items-center gap-3 px-6 py-3.5 text-left transition ${
              isActive('/about') 
                ? 'bg-red-50 text-red-600 font-semibold border-r-4 border-red-600' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            About
          </button>
          
          <button 
            onClick={() => handleNavClick('/contact')} 
            className={`flex items-center gap-3 px-6 py-3.5 text-left transition ${
              isActive('/contact') 
                ? 'bg-red-50 text-red-600 font-semibold border-r-4 border-red-600' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
           Contact
          </button>
        </div>
        
        <hr className='mx-4' />
        
        {/* Auth Links */}
        <div className='flex flex-col py-2'>
          {token ? (
            <>
              <button 
                onClick={() => handleNavClick('/profile')} 
                className={`flex items-center gap-3 px-6 py-3.5 text-left transition ${
                  isActive('/profile') 
                    ? 'bg-red-50 text-red-600 font-semibold border-r-4 border-red-600' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                My Profile
              </button>
              
              <button 
                onClick={() => handleNavClick('/my-requests')} 
                className={`flex items-center gap-3 px-6 py-3.5 text-left transition ${
                  isActive('/my-requests') 
                    ? 'bg-red-50 text-red-600 font-semibold border-r-4 border-red-600' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                My Requests
              </button>
              
              <button 
                onClick={() => handleNavClick('/blood-request')} 
                className={`flex items-center gap-3 px-6 py-3.5 text-left transition ${
                  isActive('/blood-request') 
                    ? 'bg-red-50 text-red-600 font-semibold border-r-4 border-red-600' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                Blood Request Cart
                {getTotalRequests() > 0 && (
                  <span className='ml-auto bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold'>
                    {getTotalRequests()}
                  </span>
                )}
              </button>
              
              {/* Donor Links - Highlighted */}
              {user?.isDonor && (
                <>
                  <button 
                    onClick={() => handleNavClick('/incoming-requests')} 
                    className={`flex items-center gap-3 px-6 py-3.5 text-left transition ${
                      isActive('/incoming-requests') 
                        ? 'bg-red-100 text-red-700 font-bold border-r-4 border-red-600' 
                        : 'bg-red-50 text-red-600 font-medium hover:bg-red-100'
                    }`}
                  >
                     Incoming Requests
                  </button>
                  
                  {/* NEW: Donation History Link for Mobile */}
                  <button 
                    onClick={() => handleNavClick('/donation-history')} 
                    className={`flex items-center gap-3 px-6 py-3.5 text-left transition ${
                      isActive('/donation-history') 
                        ? 'bg-purple-100 text-purple-700 font-bold border-r-4 border-purple-600' 
                        : 'bg-purple-50 text-purple-600 font-medium hover:bg-purple-100'
                    }`}
                  >
                    Donation History
                  </button>
                </>
              )}
              
              <hr className='mx-4 my-2' />
              <button 
                onClick={handleLogout} 
                className='flex items-center gap-3 px-6 py-3.5 text-red-600 hover:bg-red-50 text-left transition'
              >
                 Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => handleNavClick('/login')} 
              className='flex items-center gap-3 mx-4 my-2 px-6 py-3 bg-red-600 text-white text-center justify-center rounded-lg hover:bg-red-700 transition font-semibold'
            >
              Login / Register
            </button>
          )}
        </div>
        
        {/* Footer */}
        <div className='p-4 text-center text-xs text-gray-400 border-t mt-auto'>
          Blood Donation Platform
        </div>
      </div>
    </div>
  );
}