// pages/admin/AdminLogin.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin({ setAdminToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/admin-login`, {
                email, password
            });
            
            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                setAdminToken(data.token);
                toast.success('Admin login successful!');
                navigate('/admin/dashboard');
            } else {
                toast.error(data.message || 'Invalid credentials');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100'>
            <div className='bg-white rounded-2xl shadow-xl p-8 max-w-md w-full'>
                <div className='text-center mb-8'>
                    <div className='text-5xl mb-3'>🩸</div>
                    <h1 className='text-2xl font-bold text-gray-800'>Admin Panel</h1>
                    <p className='text-gray-500 text-sm'>LifeLink Blood Donation Platform</p>
                </div>
                
                <form onSubmit={handleSubmit} className='space-y-5'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Admin Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                            placeholder="admin@lifelink.com"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-red-600 text-white py-3 rounded-lg font-semibold transition ${
                            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                        }`}
                    >
                        {loading ? 'Logging in...' : 'Login to Admin Panel'}
                    </button>
                </form>
                
                <div className='mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200'>
                    <p className='text-xs text-yellow-800 text-center'>
                        ⚠️ Default Admin Credentials:<br />
                        Email: admin@lifelink.com<br />
                        Password: admin123<br />
                        <span className='text-yellow-600'>(Update these in production!)</span>
                    </p>
                </div>
            </div>
        </div>
    );
}