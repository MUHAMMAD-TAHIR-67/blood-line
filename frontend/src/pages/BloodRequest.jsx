// pages/BloodRequest.jsx
import React, { useContext, useEffect, useState } from 'react';
import { BloodContext } from '../context/BloodContext';
import Title from '../components/Title';
import RequestSummary from '../components/RequestSummary';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

export default function BloodRequest() {
  const { donors, bloodRequests, updateRequestQuantity, token } = useContext(BloodContext);
  const [requestData, setRequestData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    const tempData = [];
    for (const donorId in bloodRequests) {
      const donor = donors.find(d => d._id === donorId);
      if (donor) {
        tempData.push({
          _id: donorId,
          name: donor.name,
          bloodGroup: donor.bloodGroup,
          // FIXED: Use address.city instead of city
          city: donor.address?.city || 'N/A',
          phone: donor.phone,
          quantity: bloodRequests[donorId].quantity,
          // FIXED: Get image from donorInfo
          image: donor.donorInfo?.image || []
        });
      }
    }
    setRequestData(tempData);
  }, [bloodRequests, donors, token, navigate]);

  return (
    <div className="pt-14 px-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <Title text1={'BLOOD'} text2={'REQUESTS'} />
        <p className="text-gray-600 mt-2">Review your blood requests before submitting</p>
      </div>

      {requestData.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">🩸</div>
          <p className="text-gray-500 text-lg">No blood requests added yet.</p>
          <button 
            onClick={() => navigate('/donors')}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
          >
            Browse Donors
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {requestData.map((request) => (
              <div
                key={request._id}
                className="py-5 px-4 border-t border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <img 
                    className="w-16 h-16 rounded-full object-cover" 
                    src={request.image?.[0] || assets.profile_icon} 
                    alt={request.name} 
                  />
                  <div>
                    <p className="font-semibold text-lg">{request.name}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        request.bloodGroup === 'O-' ? 'bg-red-100 text-red-700' :
                        request.bloodGroup === 'A+' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {request.bloodGroup}
                      </span>
                      <span>📍 {request.city}</span>
                      <span>📞 {request.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Units:</label>
                    <input
                      onChange={(e) => updateRequestQuantity(request._id, parseInt(e.target.value) || 0)}
                      className='border rounded-md w-20 px-3 py-1 text-center'
                      type="number"
                      min={1}
                      max={10}
                      value={request.quantity}
                    />
                  </div>
                  <button
                    onClick={() => updateRequestQuantity(request._id, 0)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <img className='w-5' src={assets.bin_icon} alt="Remove" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className='flex justify-end mt-8'>
            <div className='w-full sm:w-96'>
              <RequestSummary />
              <div className='w-full text-end mt-6'>
                <button
                  onClick={() => navigate('/request-form')}
                  className='w-full bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 transition font-semibold'
                >
                  Proceed to Request Details
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}