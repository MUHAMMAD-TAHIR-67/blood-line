// pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
    Users, 
    Droplet, 
    CheckCircle, 
    AlertTriangle,
    TrendingUp,
    Clock,
    Activity,
    UserCheck,
    Heart,
    Calendar,
    MapPin
} from 'lucide-react';

export default function AdminDashboard({ adminToken }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentRequests, setRecentRequests] = useState([]);
    const [bloodGroupData, setBloodGroupData] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard`, {
                headers: { token: adminToken }
            });
            
            if (data.success) {
                setStats(data.stats.stats);
                setRecentUsers(data.stats.recentUsers);
                setRecentRequests(data.stats.recentRequests);
                setBloodGroupData(data.stats.bloodGroupDistribution);
            }
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='flex justify-center items-center h-96'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-600'></div>
            </div>
        );
    }

    const statCards = [
        { title: 'Total Users', value: stats?.users?.total || 0, icon: Users, color: 'bg-blue-500', textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
        { title: 'Blood Donors', value: stats?.users?.donors || 0, icon: Droplet, color: 'bg-red-500', textColor: 'text-red-600', bgColor: 'bg-red-50' },
        { title: 'Verified Donors', value: stats?.users?.verified || 0, icon: CheckCircle, color: 'bg-green-500', textColor: 'text-green-600', bgColor: 'bg-green-50' },
        { title: 'Urgent Donors', value: stats?.users?.urgent || 0, icon: AlertTriangle, color: 'bg-orange-500', textColor: 'text-orange-600', bgColor: 'bg-orange-50' },
        { title: 'Total Requests', value: stats?.requests?.total || 0, icon: Activity, color: 'bg-purple-500', textColor: 'text-purple-600', bgColor: 'bg-purple-50' },
        { title: 'Pending Requests', value: stats?.requests?.pending || 0, icon: Clock, color: 'bg-yellow-500', textColor: 'text-yellow-600', bgColor: 'bg-yellow-50' },
        { title: 'Matched', value: stats?.requests?.matched || 0, icon: UserCheck, color: 'bg-teal-500', textColor: 'text-teal-600', bgColor: 'bg-teal-50' },
        { title: 'Fulfilled', value: stats?.requests?.fulfilled || 0, icon: Heart, color: 'bg-pink-500', textColor: 'text-pink-600', bgColor: 'bg-pink-50' },
    ];

    return (
        <div className='p-6'>
            <div className='mb-8'>
                <h1 className='text-2xl font-bold text-gray-800'>Dashboard Overview</h1>
                <p className='text-gray-500'>Welcome back! Here's what's happening with your platform today.</p>
            </div>

            {/* Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                {statCards.map((stat, index) => (
                    <div key={index} className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-gray-500 text-sm'>{stat.title}</p>
                                <p className='text-3xl font-bold text-gray-800 mt-1'>{stat.value}</p>
                            </div>
                            <div className={`${stat.bgColor} p-3 rounded-full`}>
                                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Blood Group Distribution */}
                <div className='bg-white rounded-xl shadow-sm border p-6'>
                    <h2 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                        <Droplet className='w-5 h-5 text-red-500' />
                        Blood Group Distribution
                    </h2>
                    {bloodGroupData.length > 0 ? (
                        <div className='space-y-3'>
                            {bloodGroupData.map((bg) => (
                                <div key={bg._id} className='flex items-center justify-between'>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        bg._id === 'O-' ? 'bg-red-100 text-red-700' :
                                        bg._id.includes('A') ? 'bg-green-100 text-green-700' :
                                        bg._id.includes('B') ? 'bg-blue-100 text-blue-700' :
                                        'bg-purple-100 text-purple-700'
                                    }`}>
                                        {bg._id}
                                    </span>
                                    <div className='flex-1 mx-4'>
                                        <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                                            <div 
                                                className='h-full bg-red-500 rounded-full'
                                                style={{ width: `${(bg.count / stats?.users?.donors) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <span className='text-sm font-medium text-gray-600'>{bg.count} donors</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className='text-gray-500 text-center py-8'>No donor data available</p>
                    )}
                </div>

                {/* Urgent Alert */}
                <div className='bg-white rounded-xl shadow-sm border p-6'>
                    <h2 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                        <AlertTriangle className='w-5 h-5 text-orange-500' />
                        Urgent Needs
                    </h2>
                    <div className='space-y-4'>
                        <div className='bg-red-50 rounded-lg p-4 border-l-4 border-red-500'>
                            <p className='font-semibold text-red-700'>Urgent Blood Requests</p>
                            <p className='text-3xl font-bold text-red-600 mt-1'>{stats?.requests?.urgent || 0}</p>
                            <p className='text-sm text-red-500 mt-1'>Pending requests that need immediate attention</p>
                        </div>
                        <div className='bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500'>
                            <p className='font-semibold text-orange-700'>Urgent Donors Available</p>
                            <p className='text-3xl font-bold text-orange-600 mt-1'>{stats?.users?.urgent || 0}</p>
                            <p className='text-sm text-orange-500 mt-1'>Donors marked as urgent and available</p>
                        </div>
                    </div>
                </div>

                {/* Recent Users */}
                <div className='bg-white rounded-xl shadow-sm border p-6'>
                    <h2 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                        <Users className='w-5 h-5 text-blue-500' />
                        Recent Users
                    </h2>
                    <div className='space-y-3'>
                        {recentUsers.map((user) => (
                            <div key={user._id} className='flex items-center justify-between py-2 border-b last:border-0'>
                                <div>
                                    <p className='font-medium text-gray-800'>{user.name}</p>
                                    <p className='text-xs text-gray-500'>{user.email}</p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    {user.isDonor && (
                                        <span className='text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full'>
                                            {user.bloodGroup || 'Donor'}
                                        </span>
                                    )}
                                    <span className='text-xs text-gray-400'>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Requests */}
                <div className='bg-white rounded-xl shadow-sm border p-6'>
                    <h2 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                        <Activity className='w-5 h-5 text-purple-500' />
                        Recent Blood Requests
                    </h2>
                    <div className='space-y-3'>
                        {recentRequests.map((request) => (
                            <div key={request._id} className='flex items-center justify-between py-2 border-b last:border-0'>
                                <div>
                                    <p className='font-medium text-gray-800'>{request.patientInfo?.name}</p>
                                    <p className='text-xs text-gray-500'>{request.requesterName}</p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <span className='text-xs px-2 py-1 rounded-full font-bold' style={{
                                        backgroundColor: request.urgency === 'critical' ? '#fee2e2' : request.urgency === 'high' ? '#ffedd5' : '#f3f4f6',
                                        color: request.urgency === 'critical' ? '#991b1b' : request.urgency === 'high' ? '#9a3412' : '#374151'
                                    }}>
                                        {request.urgency}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        request.status === 'matched' ? 'bg-blue-100 text-blue-700' :
                                        request.status === 'fulfilled' ? 'bg-green-100 text-green-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {request.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}