// pages/Profile.jsx
import React, { useContext, useEffect, useState } from 'react';
import { BloodContext, backendUrl } from '../context/BloodContext';
import Title from '../components/Title';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Profile() {
  const { token, user, setUser } = useContext(BloodContext);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    street: '',
    bloodGroup: '',
    age: '',
    weight: '',
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
          age: data.user.age || '',
          weight: data.user.weight || '',
          medicalConditions: data.user.donorInfo?.medicalConditions || '',
          description: data.user.donorInfo?.description || ''
        });
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
          age: Number(formData.age),
          weight: Number(formData.weight),
          medicalConditions: formData.medicalConditions,
          description: formData.description,
        },
        { headers: { token } }
      );

      if (data.success) {
        setUser(data.user);
        setEditing(false);
        toast.success('Profile updated successfully!');
        fetchProfile(); // Refresh to get updated donor status
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error('Failed to update profile');
    }
  };

  const handleBecomeDonor = async () => {
    // Validate required fields
    if (!formData.bloodGroup) {
      toast.error('Please select blood group');
      return;
    }
    if (!formData.age || formData.age < 18 || formData.age > 65) {
      toast.error('Age must be between 18 and 65');
      return;
    }
    if (!formData.weight || formData.weight < 50) {
      toast.error('Weight must be at least 50 kg');
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        {
          becomeDonor: true,
          bloodGroup: formData.bloodGroup,
          age: Number(formData.age),
          weight: Number(formData.weight),
          medicalConditions: formData.medicalConditions,
          description: formData.description,
        },
        { headers: { token } }
      );

      if (data.success) {
        setUser(data.user);
        setEditing(false);
        toast.success('You are now registered as a donor! 🩸');
        fetchProfile(); // Refresh to show donor features
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
        {/* Left Column - Avatar & Basic Info */}
        <div className='md:col-span-1'>
          <div className='bg-white rounded-xl shadow-md border p-6 text-center'>
            <div className='w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4'>
              <span className='text-4xl font-bold text-red-600'>
                {user.name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
            <h2 className='text-xl font-bold text-gray-800'>{user.name}</h2>
            <p className='text-gray-500 text-sm'>{user.email}</p>
            
            {/* Donor Badge */}
            {user.isDonor ? (
              <div className='mt-3'>
                <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium'>
                  🩸 Blood Donor
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

            {/* Donor Stats - Only show if donor */}
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

            {/* Actions */}
            <div className='mt-4 space-y-2'>
              {!user.isDonor ? (
                // Show Become Donor Button
                <button
                  onClick={() => setEditing(true)}
                  className='w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition'
                >
                  🩸 Become a Donor
                </button>
              ) : (
                // Show Donor Actions
                <>
                  <button
                    onClick={handleToggleAvailability}
                    className={`w-full py-2 rounded-lg font-semibold transition ${
                      user.donorInfo?.available
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    {user.donorInfo?.available ? '✅ Available for Donation' : '❌ Set as Available'}
                  </button>
                  
                  {/* DONATION HISTORY BUTTON - This will show for donors */}
                  <button
                    onClick={() => navigate('/donation-history')}
                    className='w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2'
                  >
                    📜 View Donation History
                  </button>
                </>
              )}
              
              <button
                onClick={() => setEditing(!editing)}
                className='w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition'
              >
                ✏️ Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className='md:col-span-2'>
          {editing ? (
            /* EDIT MODE - Includes Donor Registration Form */
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

              {/* Donor Fields - Required for registration */}
              <div className='border-t pt-4'>
                <p className='font-semibold text-gray-700 mb-3'>Donor Information {!user.isDonor && <span className='text-red-500'>*</span>}</p>
                <div className='grid grid-cols-3 gap-4'>
                  <div>
                    <label className='block text-sm text-gray-500 mb-1'>Blood Group {!user.isDonor && '*'}</label>
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
                  <div>
                    <label className='block text-sm text-gray-500 mb-1'>Age {!user.isDonor && '* (18-65)'}</label>
                    <input
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500'
                      type="number"
                      min="18"
                      max="65"
                      required={!user.isDonor}
                    />
                  </div>
                  <div>
                    <label className='block text-sm text-gray-500 mb-1'>Weight (kg) {!user.isDonor && '* (min 50)'}</label>
                    <input
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                      className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500'
                      type="number"
                      min="50"
                      required={!user.isDonor}
                    />
                  </div>
                </div>
                <div className='mt-3'>
                  <label className='block text-sm text-gray-500 mb-1'>Medical Conditions (if any)</label>
                  <input
                    value={formData.medicalConditions}
                    onChange={(e) => setFormData(prev => ({ ...prev, medicalConditions: e.target.value }))}
                    className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500'
                    type="text"
                    placeholder="e.g., None, Diabetes, Blood Pressure"
                  />
                </div>
                <div className='mt-3'>
                  <label className='block text-sm text-gray-500 mb-1'>About You</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500'
                    rows="2"
                    placeholder="Tell us why you want to donate blood..."
                  />
                </div>
              </div>

              <div className='flex gap-3 pt-2'>
                <button type='submit' className='flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700'>
                  {user.isDonor ? 'Save Changes' : 'Register as Donor 🩸'}
                </button>
                <button type='button' onClick={() => setEditing(false)} className='flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50'>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* VIEW MODE */
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

              {/* Donor Info - Only show if donor */}
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
                  {user.donorInfo?.lastDonationDate && (
                    <div className='mt-3'>
                      <p className='text-sm text-gray-500'>Last Donation</p>
                      <p className='font-medium'>{new Date(user.donorInfo.lastDonationDate).toLocaleDateString()}</p>
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