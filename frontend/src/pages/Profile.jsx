// pages/Profile.jsx
import React, { useContext, useEffect, useState } from 'react';
import { BloodContext, backendUrl } from '../context/BloodContext';
import Title from '../components/Title';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BMICalculator from '../components/BMICalculator';

export default function Profile() {
  const { token, user, setUser } = useContext(BloodContext);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [eligibility, setEligibility] = useState({ eligible: false, age: '', weight: '', height: '' });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    street: '',
    bloodGroup: '',
    medicalConditions: '',
    description: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [token]);

  const handleEligibilityChange = (result) => {
    setEligibility(result);
  };

  const fetchProfile = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/profile`,
        {},
        { headers: { token } }
      );
      if (data.success) {
        setUser(data.user);
        setFormData({
          name: data.user.name || '',
          phone: data.user.phone || '',
          city: data.user.address?.city || '',
          street: data.user.address?.street || '',
          bloodGroup: data.user.bloodGroup || '',
          medicalConditions: data.user.donorInfo?.medicalConditions || '',
          description: data.user.donorInfo?.description || ''
        });
        // Set eligibility with existing age and weight if donor
        if (data.user.isDonor && data.user.age && data.user.weight) {
          setEligibility({
            eligible: true,
            age: data.user.age,
            weight: data.user.weight,
            height: data.user.height || 170
          });
        }
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        {
          name: formData.name,
          phone: formData.phone,
          address: {
            city: formData.city,
            street: formData.street
          },
          bloodGroup: formData.bloodGroup,
          age: user.isDonor ? user.age : Number(eligibility.age),
          weight: user.isDonor ? user.weight : Number(eligibility.weight),
          medicalConditions: formData.medicalConditions,
          description: formData.description,
        },
        { headers: { token } }
      );

      if (data.success) {
        setUser(data.user);
        setEditing(false);
        toast.success('Profile updated successfully!');
        fetchProfile();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error('Failed to update profile');
    }
  };

  const handleBecomeDonor = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.bloodGroup) {
      toast.error('Please select blood group');
      return;
    }
    if (!eligibility.eligible) {
      toast.error('You do not meet the eligibility requirements');
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        {
          becomeDonor: true,
          bloodGroup: formData.bloodGroup,
          age: Number(eligibility.age),
          weight: Number(eligibility.weight),
          medicalConditions: formData.medicalConditions,
          description: formData.description,
        },
        { headers: { token } }
      );

      if (data.success) {
        setUser(data.user);
        setEditing(false);
        toast.success('You are now registered as a donor! 🩸');
        fetchProfile();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to become donor');
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/toggle-availability`,
        {},
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchProfile();
      }
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center py-20'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-600'></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='text-center py-20'>
        <p className='text-gray-500'>Please login to view your profile</p>
        <button onClick={() => navigate('/login')} className='mt-4 bg-red-600 text-white px-6 py-2 rounded-md'>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className='border-t pt-10 px-4 max-w-4xl mx-auto pb-20'>
      <div className='mb-8'>
        <Title text1={'MY'} text2={'PROFILE'} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Left Column */}
        <div className='md:col-span-1'>
          <div className='bg-white rounded-xl shadow-md border p-6 text-center'>
            <div className='w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4'>
              <span className='text-4xl font-bold text-red-600'>
                {user.name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
            <h2 className='text-xl font-bold text-gray-800'>{user.name}</h2>
            <p className='text-gray-500 text-sm'>{user.email}</p>
            
            {user.isDonor ? (
              <div className='mt-3'>
                <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium'>
                  Blood Donor
                </span>
                {user.donorInfo?.verified && (
                  <span className='ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium'>
                    ✓ Verified
                  </span>
                )}
              </div>
            ) : (
              <div className='mt-3'>
                <span className='px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium'>
                  Not a Donor Yet
                </span>
              </div>
            )}

            {user.isDonor && (
              <div className='mt-4 grid grid-cols-2 gap-2 text-center'>
                <div className='bg-gray-50 rounded-lg p-3'>
                  <p className='text-2xl font-bold text-red-600'>{user.donorInfo?.donationCount || 0}</p>
                  <p className='text-xs text-gray-500'>Donations</p>
                </div>
                <div className='bg-gray-50 rounded-lg p-3'>
                  <p className='text-2xl font-bold text-green-600'>
                    {user.donorInfo?.available ? 'ON' : 'OFF'}
                  </p>
                  <p className='text-xs text-gray-500'>Available</p>
                </div>
              </div>
            )}

            <div className='mt-4 space-y-2'>
              {!user.isDonor ? (
                <button
                  onClick={() => setEditing(true)}
                  className='w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition'
                >
                  Become a Donor
                </button>
              ) : (
                <>
                  <button
                    onClick={handleToggleAvailability}
                    className={`w-full py-2 rounded-lg font-semibold transition ${
                      user.donorInfo?.available
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    {user.donorInfo?.available ? 'Available for Donation' : 'Set as Available'}
                  </button>
                  
                  
                </>
              )}
              
              <button
                onClick={() => setEditing(!editing)}
                className='w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition'
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className='md:col-span-2'>
          {editing ? (
            <form onSubmit={user.isDonor ? handleUpdate : handleBecomeDonor} className='bg-white rounded-xl shadow-md border p-6 space-y-4'>
              <h3 className='text-lg font-bold text-gray-800 mb-4'>
                {user.isDonor ? 'Edit Profile' : 'Register as a Donor'}
              </h3>
              
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm text-gray-500 mb-1'>Full Name</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500'
                    type="text"
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm text-gray-500 mb-1'>Phone</label>
                  <input
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500'
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm text-gray-500 mb-1'>City</label>
                  <input
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500'
                    type="text"
                  />
                </div>
                <div>
                  <label className='block text-sm text-gray-500 mb-1'>Street</label>
                  <input
                    value={formData.street}
                    onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                    className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500'
                    type="text"
                  />
                </div>
              </div>

              {/* Blood Group Selection */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Blood Group {!user.isDonor && '*'}</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                  className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500'
                  required={!user.isDonor}
                >
                  <option value="">Select Blood Group</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              {/* BMI Calculator - Combined with Age, Weight, Health Check */}
              {!user.isDonor && (
                <div className='mt-2'>
                  <BMICalculator onEligibilityChange={handleEligibilityChange} embedded={false} />
                </div>
              )}

              {/* Show existing donor info if already donor */}
              {user.isDonor && (
                <div className='bg-gray-50 rounded-lg p-4'>
                  <p className='text-sm text-gray-600'>Your donor information:</p>
                  <div className='grid grid-cols-2 gap-2 mt-2'>
                    <div>
                      <p className='text-xs text-gray-500'>Age</p>
                      <p className='font-medium'>{user.age} years</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-500'>Weight</p>
                      <p className='font-medium'>{user.weight} kg</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Medical Conditions */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Medical Conditions (if any)</label>
                <input
                  value={formData.medicalConditions}
                  onChange={(e) => setFormData(prev => ({ ...prev, medicalConditions: e.target.value }))}
                  className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500'
                  type="text"
                  placeholder="e.g., None, Diabetes, Blood Pressure"
                />
              </div>

              {/* About You */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>About You</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500'
                  rows="2"
                  placeholder="Tell us why you want to donate blood..."
                />
              </div>

              <div className='flex gap-3 pt-2'>
                <button 
                  type='submit' 
                  disabled={!user.isDonor && !eligibility.eligible}
                  className={`flex-1 py-2 rounded-lg font-semibold transition ${
                    !user.isDonor && !eligibility.eligible
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {user.isDonor ? 'Save Changes' : 'Register as Donor'}
                </button>
                <button type='button' onClick={() => setEditing(false)} className='flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50'>
                  Cancel
                </button>
              </div>

              {!user.isDonor && !eligibility.eligible && (
                <p className='text-xs text-red-500 text-center mt-2'>
                  Please fill in your Age, Weight, and Height in the BMI Calculator above to check eligibility
                </p>
              )}
            </form>
          ) : (
            <div className='bg-white rounded-xl shadow-md border p-6 space-y-6'>
              <h3 className='text-lg font-bold text-gray-800'>Personal Information</h3>
              
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-500'>Full Name</p>
                  <p className='font-medium text-gray-800'>{user.name || 'Not set'}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Phone</p>
                  <p className='font-medium text-gray-800'>{user.phone || 'Not set'}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Email</p>
                  <p className='font-medium text-gray-800'>{user.email || 'Not set'}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>City</p>
                  <p className='font-medium text-gray-800'>{user.address?.city || 'Not set'}</p>
                </div>
              </div>

              {user.isDonor && (
                <div className='border-t pt-4'>
                  <h3 className='text-lg font-bold text-gray-800 mb-4'>Donor Information</h3>
                  <div className='grid grid-cols-3 gap-4'>
                    <div>
                      <p className='text-sm text-gray-500'>Blood Group</p>
                      <p className='font-bold text-red-600 text-lg'>{user.bloodGroup || 'N/A'}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Age</p>
                      <p className='font-medium'>{user.age || 'N/A'}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Weight</p>
                      <p className='font-medium'>{user.weight ? `${user.weight} kg` : 'N/A'}</p>
                    </div>
                  </div>
                  {user.donorInfo?.medicalConditions && (
                    <div className='mt-3'>
                      <p className='text-sm text-gray-500'>Medical Conditions</p>
                      <p className='font-medium'>{user.donorInfo.medicalConditions}</p>
                    </div>
                  )}
                  {user.donorInfo?.description && (
                    <div className='mt-3'>
                      <p className='text-sm text-gray-500'>About</p>
                      <p className='text-gray-700'>{user.donorInfo.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}