// pages/RequestForm.jsx
import React, { useState, useContext, useEffect, useMemo } from 'react';
import Title from '../components/Title';
import RequestSummary from '../components/RequestSummary';
import { useNavigate } from 'react-router-dom';
import { BloodContext, backendUrl } from '../context/BloodContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function RequestForm() {
  const { bloodRequests, clearRequests, token, donors } = useContext(BloodContext);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // Get the blood group from requested donors
  const donorBloodGroup = useMemo(() => {
    const donorIds = Object.keys(bloodRequests);
    if (donorIds.length > 0) {
      const firstDonor = donors.find(d => d._id === donorIds[0]);
      return firstDonor?.bloodGroup || '';
    }
    return '';
  }, [bloodRequests, donors]);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bloodGroup: '', // Will be auto-set
    hospital: '',
    doctorName: '',
    reason: '',
    city: '',
    urgency: 'normal',
    additionalNotes: ''
  });

  // Auto-set blood group from donor
  useEffect(() => {
    if (donorBloodGroup) {
      setFormData(prev => ({ ...prev, bloodGroup: donorBloodGroup }));
    }
  }, [donorBloodGroup]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (Object.keys(bloodRequests).length === 0) {
      navigate('/blood-request');
    }
  }, [bloodRequests, token, navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (Object.keys(bloodRequests).length === 0) {
      toast.error('No blood requests added');
      navigate('/blood-request');
      return;
    }

    setSubmitting(true);

    try {
      const requestItems = [];
      for (const donorId in bloodRequests) {
        const donor = donors.find(d => d._id === donorId);
        requestItems.push({
          donorId,
          units: bloodRequests[donorId].quantity,
          bloodGroup: donor?.bloodGroup || donorBloodGroup
        });
      }

      const requestData = {
        patientInfo: {
          ...formData,
          age: Number(formData.age),
          bloodGroup: donorBloodGroup // Use donor's blood group
        },
        requests: requestItems,
        totalUnits: Object.values(bloodRequests).reduce((sum, item) => sum + item.quantity, 0)
      };

      const { data } = await axios.post(
        `${backendUrl}/api/requests/create`,
        requestData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success('Blood request submitted successfully!');
        clearRequests();
        navigate('/my-requests');
      } else {
        toast.error(data.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Request error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className='flex flex-col lg:flex-row justify-between gap-8 pt-5 sm:pt-14 min-h-[80vh] border-t px-4 max-w-7xl mx-auto'>
      {/* Patient Information */}
      <div className='flex flex-col gap-4 w-full lg:max-w-[600px]'>
        <div className='mb-4'>
          <Title text1={'PATIENT'} text2={'INFORMATION'} />
          <p className='text-sm text-gray-500 mt-1'>Please provide accurate patient details</p>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <input
            onChange={onChange}
            name='name'
            value={formData.name}
            className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500'
            type="text"
            placeholder="Patient's Full Name *"
            required
          />
          <input
            onChange={onChange}
            name='age'
            value={formData.age}
            className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500'
            type="number"
            placeholder="Age *"
            required
          />
        </div>

        {/* Blood Group - AUTO-SET from donor, READ ONLY */}
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <div className='relative'>
              <input
                type="text"
                value={donorBloodGroup || 'N/A'}
                readOnly
                className='w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md text-gray-700 font-bold text-lg cursor-not-allowed'
              />
              <span className='absolute right-2 top-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium'>
                ✓ From Donor
              </span>
            </div>
           
          </div>
          <input
            onChange={onChange}
            name='city'
            value={formData.city}
            className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500'
            type="text"
            placeholder="City *"
            required
          />
        </div>

        <input
          onChange={onChange}
          name='hospital'
          value={formData.hospital}
          className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500'
          type="text"
          placeholder="Hospital Name *"
          required
        />

        <div className='grid grid-cols-2 gap-4'>
          <input
            onChange={onChange}
            name='doctorName'
            value={formData.doctorName}
            className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500'
            type="text"
            placeholder="Doctor's Name (Optional)"
          />
          <select
            onChange={onChange}
            name='urgency'
            value={formData.urgency}
            className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500'
          >
            <option value="normal">Normal Priority</option>
            <option value="high">High Priority</option>
            <option value="critical">Critical - Emergency</option>
          </select>
        </div>

        <textarea
          onChange={onChange}
          name='reason'
          value={formData.reason}
          className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500'
          rows="3"
          placeholder="Reason for blood requirement (e.g., surgery, accident) *"
          required
        />

        <textarea
          onChange={onChange}
          name='additionalNotes'
          value={formData.additionalNotes}
          className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500'
          rows="2"
          placeholder="Additional notes or special requirements"
        />

        {formData.urgency === 'critical' && (
          <div className='bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm'>
          Critical emergency! We'll prioritize and notify donors immediately.
          </div>
        )}

        {/* Show selected donor info */}
        <div className='bg-gray-50 rounded-lg p-4'>
          <p className='font-semibold text-gray-700 mb-2'>Selected Donor(s):</p>
          <div className='flex flex-wrap gap-2'>
            {Object.keys(bloodRequests).map(donorId => {
              const donor = donors.find(d => d._id === donorId);
              return (
                <span key={donorId} className='inline-flex items-center gap-2 bg-white border px-3 py-2 rounded-lg text-sm shadow-sm'>
                  <span className='w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold'>
                    {donor?.name?.charAt(0) || '?'}
                  </span>
                  <div>
                    <p className='font-medium'>{donor?.name || 'Donor'}</p>
                    <p className='text-xs text-gray-500'>
                      {donor?.bloodGroup} • {donor?.address?.city}
                    </p>
                  </div>
                  <span className='ml-auto bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold'>
                    ×{bloodRequests[donorId]?.quantity}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Request Summary */}
      <div className='lg:w-96'>
        <RequestSummary />
        <div className='mt-8'>
          <Title text1={'SUBMIT'} text2={'REQUEST'} />
          <div className='mt-4'>
            <button
              type='submit'
              disabled={submitting}
              className={`w-full bg-red-600 text-white py-3 rounded-md font-semibold transition ${
                submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit Blood Request'}
            </button>
          </div>
        
        </div>
      </div>
    </form>
  );
}