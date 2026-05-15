// admin-frontend/src/pages/Requests.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function Requests({ adminToken }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/requests`, {
        headers: { token: adminToken }
      });
      if (data.success) setRequests(data.requests);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${BACKEND_URL}/api/admin/requests/${id}/status`, { status }, {
        headers: { token: adminToken }
      });
      toast.success(`Request ${status}`);
      fetchRequests();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const getStatusClass = (status) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-700',
      matched: 'bg-blue-100 text-blue-700',
      fulfilled: 'bg-green-100 text-green-700',
      cancelled: 'bg-gray-100 text-gray-700'
    };
    return classes[status] || 'bg-gray-100';
  };

  return (
    <div>
      <h1 className='text-xl font-semibold text-gray-800 mb-5'>Blood Requests</h1>

      <div className='space-y-3'>
        {loading ? (
          <div className='text-center py-10'>Loading...</div>
        ) : requests.length === 0 ? (
          <div className='text-center py-10 text-gray-500 bg-white rounded-lg border'>No requests found</div>
        ) : (
          requests.map((request) => (
            <div key={request._id} className='bg-white rounded-lg border p-4'>
              <div className='flex justify-between items-start flex-wrap gap-2 mb-3'>
                <div className='flex gap-2'>
                  <span className='font-mono text-xs text-gray-500'>{request.requestNumber}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(request.status)}`}>
                    {request.status}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    request.urgency === 'critical' ? 'bg-red-100 text-red-700' : 'bg-gray-100'
                  }`}>
                    {request.urgency}
                  </span>
                </div>
                <div className='flex gap-2'>
                  {request.status === 'pending' && (
                    <button onClick={() => updateStatus(request._id, 'matched')} className='px-3 py-1 bg-blue-600 text-white rounded text-xs'>
                      Match
                    </button>
                  )}
                  {request.status === 'matched' && (
                    <button onClick={() => updateStatus(request._id, 'fulfilled')} className='px-3 py-1 bg-green-600 text-white rounded text-xs'>
                      Complete
                    </button>
                  )}
                </div>
              </div>
              
              <div className='grid grid-cols-2 md:grid-cols-4 gap-3 text-sm'>
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
                  <p className='text-sm'>{request.patientInfo?.hospital}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500'>Requester</p>
                  <p className='text-sm'>{request.requesterName}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}