// components/UrgentRequests.jsx
import React, { useContext, useState } from 'react';
import { BloodContext, backendUrl } from '../context/BloodContext';
import Title from './Title';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function UrgentRequests() {
  const { urgentRequests, token, user } = useContext(BloodContext);
  const navigate = useNavigate();
  const [helpingId, setHelpingId] = useState(null); // Track which request is being processed

  // Return null if no urgent requests
  if (!urgentRequests || urgentRequests.length === 0) {
    return null;
  }

  const handleHelpPatient = async (request) => {
    // Check if user is logged in
    if (!token) {
      toast.info('Please login to help patients');
      navigate('/login');
      return;
    }

    // Check if user is a donor
    if (!user?.isDonor) {
      toast.info('You need to be a donor to help. Please register as a donor first.');
      navigate('/become-donor');
      return;
    }

    // Check if user already volunteered
    const alreadyVolunteered = request.requests?.some(
      r => r.donorId === user._id
    );

    if (alreadyVolunteered) {
      toast.info('You already volunteered for this request');
      navigate('/incoming-requests');
      return;
    }

    try {
      setHelpingId(request._id);
      
      // Call API to add donor to this request
      const { data } = await axios.post(
        `${backendUrl}/api/requests/volunteer`,
        { requestId: request._id },
        { headers: { token } }
      );

      if (data.success) {
        toast.success('You volunteered! Check your incoming requests.');
        navigate('/incoming-requests');
      } else {
        toast.error(data.message || 'Failed to volunteer');
      }
    } catch (error) {
      console.error('Volunteer error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setHelpingId(null);
    }
  };

  // Check if user already helped a request
  const hasUserVolunteered = (request) => {
    return request.requests?.some(r => r.donorId === user?._id);
  };

  return (
    <div className='my-16'>
      <div className='text-center mb-8'>
        <Title text1={"URGENT"} text2={"BLOOD REQUESTS"} />
        <p className='text-red-600 font-semibold mt-2 animate-pulse'>
          These patients need blood immediately
        </p>
        {user?.isDonor && (
          <p className='text-sm text-gray-500 mt-1'>
            Click "Help" to add a request to your incoming requests
          </p>
        )}
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {urgentRequests.map((request) => {
          const alreadyHelping = hasUserVolunteered(request);
          const isProcessing = helpingId === request._id;

          return (
            <div key={request._id} className='bg-red-50 border-l-4 border-red-600 rounded-lg p-5 shadow-md hover:shadow-lg transition-all'>
              <div className='flex justify-between items-start mb-3'>
                <div>
                  <h3 className='font-bold text-lg text-gray-800'>
                    {request.patientInfo?.name || 'Unknown Patient'}
                  </h3>
                  <p className='text-sm text-gray-600'>
                  {request.patientInfo?.hospital || 'Hospital not specified'}
                  </p>
                  {request.patientInfo?.city && (
                    <p className='text-xs text-gray-500'>
                    {request.patientInfo.city}
                    </p>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  request.urgency === 'critical' ? 'bg-red-600 text-white animate-pulse' : 'bg-orange-500 text-white'
                }`}>
                  {request.urgency === 'critical' ? 'CRITICAL' : 'HIGH PRIORITY'}
                </span>
              </div>
              
              <div className='space-y-2 mb-4'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Blood Group Needed:</span>
                  <span className='font-bold text-red-600 text-lg'>
                    {request.patientInfo?.bloodGroup || 'N/A'}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Units Required:</span>
                  <span className='font-bold'>{request.totalUnits || 1}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Volunteers:</span>
                  <span className='font-bold'>{request.requests?.length || 0}</span>
                </div>
                {request.patientInfo?.reason && (
                  <div className='text-sm mt-2 p-2 bg-white rounded'>
                    <span className='text-gray-500'>Reason: </span>
                    <span className='text-gray-700'>{request.patientInfo.reason}</span>
                  </div>
                )}
              </div>
              
              {alreadyHelping ? (
                <button 
                  onClick={() => navigate('/incoming-requests')}
                  className='w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2'
                >
                  
                  View in My Requests
                </button>
              ) : (
                <button 
                  onClick={() => handleHelpPatient(request)}
                  disabled={isProcessing}
                  className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    isProcessing 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  
                  {isProcessing ? 'Processing...' : 'Help This Patient'}
                </button>
              )}
              
              <p className='text-xs text-gray-400 text-center mt-2'>
                {alreadyHelping 
                  ? 'You already volunteered! Check your incoming requests.' 
                  : 'Click to add this to your incoming requests'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}