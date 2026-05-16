
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function Users({ adminToken }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/users?search=${search}`, {
        headers: { token: adminToken }
      });
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete ${name}? This cannot be undone.`)) {
      try {
        await axios.delete(`${BACKEND_URL}/api/admin/users/${id}`, {
          headers: { token: adminToken }
        });
        toast.success('User deleted');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleVerify = async (id) => {
    try {
      await axios.post(`${BACKEND_URL}/api/admin/donors/${id}/verify`, {}, {
        headers: { token: adminToken }
      });
      toast.success('Donor verified');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to verify');
    }
  };

  return (
    <div>
      <h1 className='text-xl font-semibold text-gray-800 mb-5'>Users</h1>
      
      <div className='mb-4'>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full md:w-80 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-500'
        />
      </div>

      <div className='bg-white rounded-lg border overflow-hidden'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-50 border-b'>
            <tr>
              <th className='text-left p-3 font-medium text-gray-600'>User</th>
              <th className='text-left p-3 font-medium text-gray-600'>Contact</th>
              <th className='text-left p-3 font-medium text-gray-600'>Blood</th>
              <th className='text-left p-3 font-medium text-gray-600'>Role</th>
              <th className='text-left p-3 font-medium text-gray-600'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className='text-center p-8'>Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" className='text-center p-8 text-gray-500'>No users found</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className='border-b hover:bg-gray-50'>
                  <td className='p-3'>
                    <p className='font-medium'>{user.name}</p>
                    <p className='text-xs text-gray-500'>{user.email}</p>
                   </td>
                  <td className='p-3'>
                    <p>{user.phone || '-'}</p>
                    <p className='text-xs text-gray-500'>{user.address?.city || '-'}</p>
                   </td>
                  <td className='p-3'>
                    {user.isDonor ? (
                      <span className='px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700'>
                        {user.bloodGroup || 'N/A'}
                      </span>
                    ) : '-'}
                   </td>
                  <td className='p-3'>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'}`}>
                      {user.role || 'user'}
                    </span>
                   </td>
                  <td className='p-3'>
                    <div className='flex gap-2'>
                      {user.isDonor && !user.donorInfo?.verified && (
                        <button onClick={() => handleVerify(user._id)} className='text-green-600 text-xs hover:underline'>
                          Verify
                        </button>
                      )}
                      <button onClick={() => handleDelete(user._id, user.name)} className='text-red-600 text-xs hover:underline'>
                        Delete
                      </button>
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