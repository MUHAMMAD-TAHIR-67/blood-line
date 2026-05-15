// pages/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    Droplet, 
    LogOut, 
    Menu, 
    X,
    Activity,
    Settings
} from 'lucide-react';

export default function AdminLayout({ adminToken, setAdminToken }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setAdminToken('');
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin/dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/users', name: 'Users', icon: Users },
        { path: '/admin/requests', name: 'Blood Requests', icon: Droplet },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className='min-h-screen bg-gray-100'>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className='lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md'
            >
                {sidebarOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
            </button>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className='flex flex-col h-full'>
                    {/* Logo */}
                    <div className='p-6 border-b'>
                        <div className='flex items-center gap-2'>
                            <div className='w-8 h-8 bg-red-600 rounded-full flex items-center justify-center'>
                                <span className='text-white text-lg'>🩸</span>
                            </div>
                            <div>
                                <h1 className='font-bold text-gray-800'>LifeLink</h1>
                                <p className='text-xs text-gray-500'>Admin Panel</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className='flex-1 p-4 space-y-1'>
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                                    isActive(item.path)
                                        ? 'bg-red-50 text-red-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <item.icon className='w-5 h-5' />
                                <span className='font-medium'>{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className='p-4 border-t'>
                        <button
                            onClick={handleLogout}
                            className='flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition'
                        >
                            <LogOut className='w-5 h-5' />
                            <span className='font-medium'>Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='lg:ml-64 min-h-screen'>
                <main className='p-4 lg:p-6'>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}