// pages/IncomingRequests.jsx
import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { BloodContext, backendUrl } from '../context/BloodContext';
import Title from '../components/Title';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function IncomingRequests() {
  const { token, user } = useContext(BloodContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchIncomingRequests = useCallback(async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (!user?.isDonor) {
      toast.info('Register as a donor to receive blood requests');
      navigate('/become-donor');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/requests/incoming`,
        {},
        { headers: { token } }
      );
      if (data.success) {
        // Sort: pending first, then accepted, then rejected
        const sorted = (data.requests || []).sort((a, b) => {
          const statusOrder = { pending: 0, accepted: 1, rejected: 2 };
          const aStatus = a.requests?.find(r => r.donorId === user._id)?.donorStatus || 'pending';
          const bStatus = b.requests?.find(r => r.donorId === user._id)?.donorStatus || 'pending';
          return (statusOrder[aStatus] || 0) - (statusOrder[bStatus] || 0);
        });
        setRequests(sorted);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [token, user?._id, user?.isDonor, navigate]);

  useEffect(() => {
    fetchIncomingRequests();
  }, [fetchIncomingRequests]);

  const handleRespond = async (requestId, donorStatus) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/requests/respond`,
        { requestId, donorStatus },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(
          donorStatus === 'accepted' 
            ? '✅ You accepted! Please contact the patient.' 
            : '❌ Request rejected'
        );
        fetchIncomingRequests();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const getDonorEntry = (request) => {
    if (!user?._id) return null;
    return request.requests?.find(r => r.donorId === user._id);
  };

  const getUrgencyBadge = (urgency) => {
    const styles = {
      normal: 'bg-gray-100 text-gray-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700 animate-pulse'
    };
    return styles[urgency] || styles.normal;
  };

  // Count requests by status
  const pendingCount = requests.filter(r => {
    const entry = getDonorEntry(r);
    return entry?.donorStatus === 'pending';
  }).length;
  
  const acceptedCount = requests.filter(r => {
    const entry = getDonorEntry(r);
    return entry?.donorStatus === 'accepted';
  }).length;
  
  const rejectedCount = requests.filter(r => {
    const entry = getDonorEntry(r);
    return entry?.donorStatus === 'rejected';
  }).length;

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
        <Title text1={'INCOMING'} text2={'BLOOD REQUESTS'} />
        <p className='text-gray-600 mt-2'>
          People who need your blood type ({user?.bloodGroup || 'N/A'}). Please respond quickly!
        </p>
        
        {/* Status Summary */}
        {requests.length > 0 && (
          <div className='flex gap-4 mt-4 flex-wrap'>
            {pendingCount > 0 && (
              <span className='px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium'>{pendingCount} Pending Action
              </span>
            )}
            {acceptedCount > 0 && (
              <span className='px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium'>
            {acceptedCount} Accepted
              </span>
            )}
            {rejectedCount > 0 && (
              <span className='px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium'>
            {rejectedCount} Rejected
              </span>
            )}
          </div>
        )}
      </div>

      {requests.length === 0 ? (
        <div className='text-center py-16 bg-gray-50 rounded-lg'>
          {/* <div className='text-6xl mb-4'>📭</div> */}
          <p className='text-gray-500 text-lg'>No incoming blood requests yet.</p>
          <p className='text-gray-400 text-sm mt-2'>
            When someone needs your blood type, their request will appear here.
          </p>
          <button
            onClick={() => navigate('/')}
            className='mt-4 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition'
          >
            View Urgent Requests
          </button>
        </div>
      ) : (
        <div className='space-y-4'>
          {/* PENDING REQUESTS - Show FIRST */}
          {requests.map((request) => {
            const donorEntry = getDonorEntry(request);
            const isPending = donorEntry?.donorStatus === 'pending';
            const isAccepted = donorEntry?.donorStatus === 'accepted';
            const isRejected = donorEntry?.donorStatus === 'rejected';

            // If we want to separate sections, we could do that here
            // But since we already sorted, they'll appear in order

            return (
              <div 
                key={request._id} 
                className={`bg-white rounded-lg shadow-sm border-2 overflow-hidden transition-all duration-300 ${
                  isPending 
                    ? 'border-yellow-400 shadow-yellow-50 ring-2 ring-yellow-100' 
                    : isAccepted 
                      ? 'border-green-300 opacity-90' 
                      : 'border-gray-200 opacity-75'
                }`}
              >
                {/* Header */}
                <div className={`p-4 border-b flex justify-between items-center flex-wrap gap-2 ${
                  isPending ? 'bg-yellow-50' : isAccepted ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  <div className='flex items-center gap-3 flex-wrap'>
                    <span className='font-mono text-sm font-bold'>{request.requestNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getUrgencyBadge(request.urgency)}`}>
                      {request.urgency.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isPending 
                        ? 'bg-yellow-200 text-yellow-900 animate-pulse' 
                        : isAccepted 
                          ? 'bg-green-200 text-green-900' 
                          : 'bg-red-200 text-red-900'
                    }`}>
                      {isPending ? 'NEEDS YOUR RESPONSE' : isAccepted ? 'ACCEPTED' : 'REJECTED'}
                    </span>
                  </div>
                  <span className='text-sm text-gray-500'>
                    {new Date(request.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>

                {/* Content */}
                <div className='p-4'>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                    <div>
                      <p className='text-xs text-gray-500 uppercase tracking-wide'>Patient</p>
                      <p className='font-semibold text-gray-800 text-lg'>{request.patientInfo?.name}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-500 uppercase tracking-wide'>Blood Group</p>
                      <p className='font-bold text-red-600 text-xl'>{request.patientInfo?.bloodGroup}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-500 uppercase tracking-wide'>Hospital</p>
                      <p className='font-medium'>{request.patientInfo?.hospital}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-500 uppercase tracking-wide'>Units from You</p>
                      <p className='font-bold text-xl text-red-600'>{donorEntry?.units || 1}</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-4'>
                    <div>
                      <p className='text-xs text-gray-500'>Requested By</p>
                      <p className='font-medium flex items-center gap-1'>
                        {request.requesterName}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-500'>Contact</p>
                      <p className='font-medium flex items-center gap-1'>
                        {request.requesterPhone}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-500'>Location</p>
                      <p className='font-medium flex items-center gap-1'>
                     {request.patientInfo?.city || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Reason */}
                  {request.patientInfo?.reason && (
                    <div className='p-3 bg-white border rounded-lg mb-4'>
                      <p className='text-xs text-gray-500 uppercase mb-1'>Reason</p>
                      <p className='text-gray-700 italic'>"{request.patientInfo.reason}"</p>
                    </div>
                  )}

                  {/* ACTION BUTTONS - Only for PENDING */}
                  {isPending && (
                    <div className='flex gap-3 mt-4 pt-4 border-t border-yellow-200'>
                      <button
                        onClick={() => handleRespond(request._id, 'accepted')}
                        className='flex-1 bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2'
                      >
                         ACCEPT
                      </button>
                      <button
                        onClick={() => handleRespond(request._id, 'rejected')}
                        className='flex-1 bg-white text-gray-600 py-4 rounded-lg font-semibold hover:bg-gray-100 transition border-2 border-gray-300 flex items-center justify-center gap-2'
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {/* ACCEPTED Status */}
                  {isAccepted && (
                    <div className='mt-4 pt-4 border-t border-green-200'>
                      <div className='p-4 bg-green-50 rounded-lg border border-green-200'>
                        <p className='font-bold text-lg text-green-700 flex items-center gap-2'>
                         You Accepted This Request
                        </p>
                        <div className='mt-3 p-4 bg-white rounded-lg border border-green-200'>
                          <p className='text-lg font-semibold text-green-800 mb-2'>Contact Information:</p>
                          <p className='text-base'>
                        <strong>Phone:</strong> {request.requesterPhone}
                          </p>
                          <p className='text-base mt-1'>
                            <strong>Hospital:</strong> {request.patientInfo?.hospital}
                          </p>
                          <p className='text-base mt-1'>
                        <strong>Patient:</strong> {request.patientInfo?.name}
                          </p>
                        </div>
                        <p className='text-sm text-green-600 mt-2'>
                          Responded: {new Date(donorEntry?.donorResponseDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* REJECTED Status */}
                  {isRejected && (
                    <div className='mt-4 pt-4 border-t border-gray-200'>
                      <div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
                        <p className='font-bold text-lg text-gray-600 flex items-center gap-2'>
                          You Rejected This Request
                        </p>
                        <p className='text-sm text-gray-500 mt-1'>
                          Responded: {new Date(donorEntry?.donorResponseDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}