// admin-frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function Dashboard({ adminToken }) {
  const [stats, setStats] = useState({
    users: { total: 0, donors: 0, verified: 0, urgent: 0 },
    requests: { total: 0, pending: 0, matched: 0, fulfilled: 0, cancelled: 0, urgent: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      console.log("Fetching dashboard with token:", adminToken);
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/dashboard`, {
        headers: { token: adminToken }
      });
      console.log("Dashboard response:", data);
      
      if (data.success) {
        setStats(data.stats);
      } else {
        toast.error(data.message || 'Failed to load dashboard');
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center py-20'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-red-600'></div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Users', value: stats.users?.total || 0, icon: '👥', color: 'bg-blue-500' },
    { label: 'Blood Donors', value: stats.users?.donors || 0, icon: '🩸', color: 'bg-red-500' },
    { label: 'Verified Donors', value: stats.users?.verified || 0, icon: '✅', color: 'bg-green-500' },
    { label: 'Total Requests', value: stats.requests?.total || 0, icon: '📋', color: 'bg-purple-500' },
    { label: 'Pending Requests', value: stats.requests?.pending || 0, icon: '⏳', color: 'bg-yellow-500' },
    { label: 'Fulfilled', value: stats.requests?.fulfilled || 0, icon: '🎉', color: 'bg-teal-500' },
    { label: 'Matched', value: stats.requests?.matched || 0, icon: '🤝', color: 'bg-indigo-500' },
    { label: 'Urgent Requests', value: stats.requests?.urgent || 0, icon: '⚠️', color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className='text-xl font-semibold text-gray-800 mb-5'>Dashboard</h1>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
        {cards.map((card, i) => (
          <div key={i} className='bg-white rounded-lg shadow-sm border p-5'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500'>{card.label}</p>
                <p className='text-2xl font-bold text-gray-800 mt-1'>{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-full text-white text-xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blood Group Distribution */}
      {stats.bloodGroupDistribution && stats.bloodGroupDistribution.length > 0 && (
        <div className='mt-8 bg-white rounded-lg shadow-sm border p-5'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>Blood Group Distribution</h2>
          <div className='space-y-3'>
            {stats.bloodGroupDistribution.map((bg) => (
              <div key={bg._id} className='flex items-center justify-between'>
                <span className='px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 w-12 text-center'>
                  {bg._id}
                </span>
                <div className='flex-1 mx-4'>
                  <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                    <div 
                      className='h-full bg-red-500 rounded-full'
                      style={{ width: `${(bg.count / (stats.users?.donors || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className='text-sm font-medium text-gray-600 w-16 text-right'>{bg.count} donors</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Users */}
      {stats.recentUsers && stats.recentUsers.length > 0 && (
        <div className='mt-8 bg-white rounded-lg shadow-sm border p-5'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>Recent Users</h2>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='text-left p-2'>Name</th>
                  <th className='text-left p-2'>Email</th>
                  <th className='text-left p-2'>Blood</th>
                  <th className='text-left p-2'>Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.slice(0, 5).map((user) => (
                  <tr key={user._id} className='border-b'>
                    <td className='p-2 font-medium'>{user.name}</td>
                    <td className='p-2 text-gray-500'>{user.email}</td>
                    <td className='p-2'>
                      {user.isDonor ? (
                        <span className='px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700'>
                          {user.bloodGroup || 'N/A'}
                        </span>
                      ) : '-'}
                    </td>
                    <td className='p-2 text-gray-400 text-xs'>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}