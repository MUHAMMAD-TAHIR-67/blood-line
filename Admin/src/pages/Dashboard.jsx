// admin-frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function Dashboard({ adminToken }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/dashboard`, {
        headers: { token: adminToken }
      });
      if (data.success) setStats(data.stats.stats);
    } catch (error) {
      console.error(error);
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
    { label: 'Total Users', value: stats?.users?.total || 0, color: 'blue' },
    { label: 'Blood Donors', value: stats?.users?.donors || 0, color: 'red' },
    { label: 'Verified Donors', value: stats?.users?.verified || 0, color: 'green' },
    { label: 'Total Requests', value: stats?.requests?.total || 0, color: 'purple' },
    { label: 'Pending', value: stats?.requests?.pending || 0, color: 'orange' },
    { label: 'Fulfilled', value: stats?.requests?.fulfilled || 0, color: 'teal' },
  ];

  return (
    <div>
      <h1 className='text-xl font-semibold text-gray-800 mb-5'>Dashboard</h1>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        {cards.map((card, i) => (
          <div key={i} className='bg-white rounded-lg shadow-sm border p-5'>
            <p className='text-sm text-gray-500'>{card.label}</p>
            <p className='text-2xl font-bold text-gray-800 mt-1'>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}