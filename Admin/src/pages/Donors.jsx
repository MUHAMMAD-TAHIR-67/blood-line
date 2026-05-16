// admin-frontend/src/pages/Donors.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function Donors({ adminToken }) {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/users?isDonor=true`, {
        headers: { token: adminToken }
      });
      if (data.success) {
        setDonors(data.users);
      }
    } catch (error) {
      toast.error('Failed to fetch donors');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className='text-xl font-semibold text-gray-800 mb-5'>Donors</h1>

      <div className='bg-white rounded-lg border overflow-hidden'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-50 border-b'>
            <tr>
              <th className='text-left p-3 font-medium text-gray-600'>Donor</th>
              <th className='text-left p-3 font-medium text-gray-600'>Blood</th>
              <th className='text-left p-3 font-medium text-gray-600'>City</th>
              <th className='text-left p-3 font-medium text-gray-600'>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className='text-center p-8'>Loading...</td>
              </tr>
            ) : donors.length === 0 ? (
              <tr>
                <td colSpan="4" className='text-center p-8 text-gray-500'>No donors found</td>
              </tr>
            ) : (
              donors.map((donor) => (
                <tr key={donor._id} className='border-b hover:bg-gray-50'>
                  <td className='p-3'>
                    <p className='font-medium'>{donor.name}</p>
                    <p className='text-xs text-gray-500'>{donor.email}</p>
                  </td>
                  <td className='p-3'>
                    <span className='px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700'>
                      {donor.bloodGroup}
                    </span>
                  </td>
                  <td className='p-3'>{donor.address?.city || '-'}</td>
                  <td className='p-3'>
                    <div className='flex gap-2 flex-wrap'>
                      {donor.donorInfo?.verified && <span className='text-green-600 text-xs'>✓ Verified</span>}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}