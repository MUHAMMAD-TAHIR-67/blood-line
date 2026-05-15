// pages/admin/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Search, Edit2, Trash2, CheckCircle, XCircle, Star, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminUsers({ adminToken }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterDonor, setFilterDonor] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [search, filterRole, filterDonor]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (filterRole !== 'all') params.append('role', filterRole);
            if (filterDonor !== 'all') params.append('isDonor', filterDonor);
            
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users?${params}`, {
                headers: { token: adminToken }
            });
            
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyDonor = async (userId, verified) => {
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/donors/${userId}/verify`,
                {},
                { headers: { token: adminToken } }
            );
            
            if (data.success) {
                toast.success(data.message);
                fetchUsers();
            }
        } catch (error) {
            toast.error('Failed to update donor status');
        }
    };

    const handleUrgentToggle = async (userId) => {
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/donors/${userId}/urgent`,
                {},
                { headers: { token: adminToken } }
            );
            
            if (data.success) {
                toast.success(data.message);
                fetchUsers();
            }
        } catch (error) {
            toast.error('Failed to update urgent status');
        }
    };

    const handleFeaturedToggle = async (userId) => {
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/donors/${userId}/featured`,
                {},
                { headers: { token: adminToken } }
            );
            
            if (data.success) {
                toast.success(data.message);
                fetchUsers();
            }
        } catch (error) {
            toast.error('Failed to update featured status');
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
            try {
                const { data } = await axios.delete(
                    `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${userId}`,
                    { headers: { token: adminToken } }
                );
                
                if (data.success) {
                    toast.success('User deleted successfully');
                    fetchUsers();
                }
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

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

    return (
        <div className='p-6'>
            <div className='mb-6'>
                <h1 className='text-2xl font-bold text-gray-800'>User Management</h1>
                <p className='text-gray-500'>Manage all users, donors, and their permissions</p>
            </div>

            {/* Filters */}
            <div className='bg-white rounded-xl shadow-sm border p-4 mb-6'>
                <div className='flex flex-wrap gap-4 items-center'>
                    <div className='flex-1 min-w-[200px]'>
                        <div className='relative'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                            />
                        </div>
                    </div>
                    
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                    >
                        <option value="all">All Roles</option>
                        <option value="user">Users</option>
                        <option value="admin">Admins</option>
                    </select>
                    
                    <select
                        value={filterDonor}
                        onChange={(e) => setFilterDonor(e.target.value)}
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                    >
                        <option value="all">All Users</option>
                        <option value="true">Donors Only</option>
                        <option value="false">Non-Donors</option>
                    </select>
                    
                    <button
                        onClick={fetchUsers}
                        className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2'
                    >
                        <RefreshCw className='w-4 h-4' />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className='bg-white rounded-xl shadow-sm border overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50 border-b'>
                            <tr>
                                <th className='text-left p-4 font-semibold text-gray-600'>User</th>
                                <th className='text-left p-4 font-semibold text-gray-600'>Contact</th>
                                <th className='text-left p-4 font-semibold text-gray-600'>Blood Group</th>
                                <th className='text-left p-4 font-semibold text-gray-600'>Role</th>
                                <th className='text-left p-4 font-semibold text-gray-600'>Status</th>
                                <th className='text-left p-4 font-semibold text-gray-600'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className='text-center py-12'>
                                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto'></div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className='text-center py-12 text-gray-500'>
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className='border-b hover:bg-gray-50 transition'>
                                        <td className='p-4'>
                                            <div>
                                                <p className='font-medium text-gray-800'>{user.name}</p>
                                                <p className='text-xs text-gray-500'>{user.email}</p>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <p className='text-sm'>{user.phone || 'N/A'}</p>
                                            <p className='text-xs text-gray-500'>{user.address?.city || 'No city'}</p>
                                        </td>
                                        <td className='p-4'>
                                            {user.isDonor ? (
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getBloodGroupColor(user.bloodGroup)}`}>
                                                    {user.bloodGroup || 'Not set'}
                                                </span>
                                            ) : (
                                                <span className='text-xs text-gray-400'>Not a donor</span>
                                            )}
                                        </td>
                                        <td className='p-4'>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {user.role || 'user'}
                                            </span>
                                        </td>
                                        <td className='p-4'>
                                            <div className='space-y-1'>
                                                {user.isDonor && (
                                                    <>
                                                        {user.donorInfo?.verified ? (
                                                            <span className='inline-flex items-center gap-1 text-xs text-green-600'>
                                                                <CheckCircle className='w-3 h-3' /> Verified
                                                            </span>
                                                        ) : (
                                                            <span className='inline-flex items-center gap-1 text-xs text-gray-500'>
                                                                <XCircle className='w-3 h-3' /> Unverified
                                                            </span>
                                                        )}
                                                        {user.donorInfo?.urgent && (
                                                            <span className='inline-flex items-center gap-1 text-xs text-orange-600 ml-2'>
                                                                <AlertCircle className='w-3 h-3' /> Urgent
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <div className='flex gap-2'>
                                                {user.isDonor && (
                                                    <>
                                                        <button
                                                            onClick={() => handleVerifyDonor(user._id, !user.donorInfo?.verified)}
                                                            className={`p-1.5 rounded-lg transition ${
                                                                user.donorInfo?.verified ? 'text-gray-400 hover:text-green-600' : 'text-gray-400 hover:text-green-600'
                                                            }`}
                                                            title={user.donorInfo?.verified ? 'Unverify Donor' : 'Verify Donor'}
                                                        >
                                                            <CheckCircle className='w-4 h-4' />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUrgentToggle(user._id)}
                                                            className={`p-1.5 rounded-lg transition ${
                                                                user.donorInfo?.urgent ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'
                                                            }`}
                                                            title="Toggle Urgent Status"
                                                        >
                                                            <AlertCircle className='w-4 h-4' />
                                                        </button>
                                                        <button
                                                            onClick={() => handleFeaturedToggle(user._id)}
                                                            className={`p-1.5 rounded-lg transition ${
                                                                user.donorInfo?.featured ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                                                            }`}
                                                            title="Toggle Featured"
                                                        >
                                                            <Star className='w-4 h-4' />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteUser(user._id, user.name)}
                                                    className='p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition'
                                                    title="Delete User"
                                                >
                                                    <Trash2 className='w-4 h-4' />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}