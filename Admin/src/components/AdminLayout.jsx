// admin-frontend/src/components/AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

export default function AdminLayout({ setAdminToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken('');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/users', name: 'Users', icon: '👥' },
    { path: '/donors', name: 'Donors', icon: '🩸' },
    { path: '/requests', name: 'Requests', icon: '📋' },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navbar */}
      <div className='flex items-center justify-between py-4 px-6 border-b bg-white'>
        <img className='w-28 cursor-pointer' src={assets.logo} alt="LifeLink" onClick={() => navigate('/dashboard')} />
        <button 
          onClick={handleLogout}
          className='bg-red-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition'
        >
          Logout
        </button>
      </div>

      <div className='flex'>
        {/* Sidebar */}
        <div className='w-56 min-h-[calc(100vh-65px)] border-r bg-white'>
          <div className='flex flex-col pt-5'>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-sm transition ${
                    isActive 
                      ? 'bg-red-50 text-red-600 border-r-2 border-red-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1 p-6'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}