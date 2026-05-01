// pages/MyRequests.jsx
import React, { useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import axios from 'axios';
import { backendUrl, BloodContext } from '../context/BloodContext';
import { useNavigate } from 'react-router-dom';

export default function MyRequests() {
  const { token } = useContext(BloodContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const { data } = await axios.post(
        backendUrl + '/api/requests/my-requests',
        {},
        { headers: { token } }
      );

      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Request fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      matched: 'bg-blue-100 text-blue-700',
      fulfilled: 'bg-green-100 text-green-700',
      cancelled: 'bg-gray-100 text-gray-700',
      expired: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      normal: 'bg-gray-100 text-gray-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700'
    };
    return colors[urgency] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className='flex justify-center py-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-600'></div>
      </div>
    );
  }

  return (
    <div className='border-t pt-16 px-4 max-w-6xl mx-auto'>
      <div className='mb-8'>
        <Title text1={'MY'} text2={'REQUESTS'} />
      </div>

      {requests.length === 0 ? (
        <div className='text-center py-16 bg-gray-50 rounded-lg'>
          <div className='text-6xl mb-4'>📋</div>
          <p className='text-gray-500 text-lg'>No blood requests yet.</p>
          <button 
            onClick={() => navigate('/donors')}
            className='mt-4 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition'
          >
            Find Donors
          </button>
        </div>
      ) : (
        <div className='space-y-4'>
          {requests.map((request) => (
            <div key={request._id} className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
              <div className='p-4 border-b bg-gray-50 flex justify-between items-center flex-wrap gap-2'>
                <div>
                  <span className='font-mono text-sm text-gray-600'>{request.requestNumber}</span>
                  <span className={`ml-3 px-2 py-0.5 rounded-full text-xs ${getStatusColor(request.status)}`}>
                    {request.status.toUpperCase()}
                  </span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getUrgencyColor(request.urgency)}`}>
                    {request.urgency.toUpperCase()}
                  </span>
                </div>
                <span className='text-sm text-gray-500'>
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className='p-4'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                  <div>
                    <p className='text-xs text-gray-500'>Patient</p>
                    <p className='font-medium'>{request.patientInfo?.name}</p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-500'>Blood Group</p>
                    <p className='font-medium text-red-600'>{request.patientInfo?.bloodGroup}</p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-500'>Hospital</p>
                    <p className='font-medium'>{request.patientInfo?.hospital}</p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-500'>Total Units</p>
                    <p className='font-medium'>{request.totalUnits}</p>
                  </div>
                </div>

                <div className='border-t pt-3'>
                  <p className='text-xs text-gray-500 mb-2'>Requested Donors</p>
                  <div className='flex flex-wrap gap-2'>
                    {request.requests?.map((req, idx) => (
                      <span key={idx} className='text-sm bg-gray-100 px-3 py-1 rounded-full'>
                        {req.donorName || 'Donor'}: {req.units} unit(s)
                      </span>
                    ))}
                  </div>
                </div>

                {request.status === 'matched' && request.matchedDonorId && (
                  <div className='mt-3 p-3 bg-green-50 rounded-md'>
                    <p className='text-sm text-green-700'>
                      ✅ Matched with a donor on {new Date(request.matchedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}