// pages/DonationHistory.jsx
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { BloodContext, backendUrl } from '../context/BloodContext';
import Title from '../components/Title';
import { useNavigate } from 'react-router-dom';

export default function DonationHistory() {
  const { token, user } = useContext(BloodContext);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (!user?.isDonor) {
      navigate('/become-donor');
      return;
    }
    
    fetchDonationHistory();
  }, [token, user]);

  const fetchDonationHistory = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/donation-history`,
        { headers: { token } }
      );
      
      if (data.success) {
        setHistory(data.donationHistory || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch donation history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center py-20'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-600'></div>
      </div>
    );
  }

  return (
    <div className='border-t pt-10 px-4 max-w-5xl mx-auto pb-20'>
      <div className='mb-6'>
        <Title text1={'DONATION'} text2={'HISTORY'} />
        <p className='text-gray-500 text-sm mt-1'>
          Track your blood donation journey and impact
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
          <div className='bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white'>
            <p className='text-sm opacity-90'>Total Donations</p>
            <p className='text-2xl font-bold'>{stats.totalDonations || 0}</p>
          </div>
          
          <div className='bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white'>
            <p className='text-sm opacity-90'>Units Donated</p>
            <p className='text-2xl font-bold'>{stats.totalUnitsDonated || 0}</p>
          </div>
          
          <div className={`rounded-lg p-4 text-white ${
            stats.isEligible 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
              : 'bg-gradient-to-r from-gray-500 to-gray-600'
          }`}>
            <p className='text-sm opacity-90'>Next Eligible</p>
            <p className='text-lg font-bold'>
              {stats.isEligible 
                ? 'Eligible Now!' 
                : stats.daysUntilEligible > 0 
                    ? `${stats.daysUntilEligible} days` 
                    : 'Eligible Now!'}
            </p>
          </div>
          
          <div className='bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white'>
            <p className='text-sm opacity-90'>Last Donation</p>
            <p className='text-sm font-medium'>
              {stats.lastDonationDate 
                ? new Date(stats.lastDonationDate).toLocaleDateString() 
                : 'Never'}
            </p>
          </div>
        </div>
      )}

      {/* Donation History List */}
      {history.length === 0 ? (
        <div className='text-center py-12 bg-gray-50 rounded-lg'>
          <div className='text-5xl mb-3'>🩸</div>
          <p className='text-gray-500'>No donation history yet.</p>
          <p className='text-gray-400 text-sm mt-1'>
            When you donate blood, your contributions will appear here.
          </p>
          <button 
            onClick={() => navigate('/incoming-requests')}
            className='mt-4 bg-red-600 text-white px-5 py-2 rounded-md text-sm hover:bg-red-700 transition'
          >
            View Incoming Requests
          </button>
        </div>
      ) : (
        <div className='space-y-3'>
          {history.map((donation) => (
            <div key={donation.requestId} className='bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition'>
              <div className='flex flex-wrap justify-between items-start gap-3'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='font-mono text-xs text-gray-400'>{donation.requestNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      donation.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                      donation.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {donation.urgency}
                    </span>
                  </div>
                  
                  <p className='font-semibold text-gray-800'>{donation.patientName}</p>
                  
                  <div className='flex flex-wrap gap-4 mt-2 text-sm text-gray-500'>
                    <span className='flex items-center gap-1'>🏥 {donation.hospital}</span>
                    <span className='flex items-center gap-1'>🩸 {donation.bloodGroup}</span>
                    <span className='flex items-center gap-1'>📦 {donation.units} unit(s)</span>
                  </div>
                </div>
                
                <div className='text-right'>
                  <p className='text-sm text-gray-500'>
                    {donation.fulfilledDate 
                      ? new Date(donation.fulfilledDate).toLocaleDateString() 
                      : 'Date not available'}
                  </p>
                  <span className='inline-flex items-center gap-1 text-xs text-green-600 mt-1'>
                    ✅ Completed
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}