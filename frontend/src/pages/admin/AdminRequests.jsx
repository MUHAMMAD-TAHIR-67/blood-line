// pages/admin/AdminRequests.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Search, Filter, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';

export default function AdminRequests({ adminToken }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterUrgency, setFilterUrgency] = useState('all');

    useEffect(() => {
        fetchRequests();
    }, [search, filterStatus, filterUrgency]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (filterStatus !== 'all') params.append('status', filterStatus);
            if (filterUrgency !== 'all') params.append('urgency', filterUrgency);
            
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/requests?${params}`, {
                headers: { token: adminToken }
            });
            
            if (data.success) {
                setRequests(data.requests);
            }
        } catch (error) {
            toast.error('Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (requestId, status) => {
        try {
            const { data } = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/requests/${requestId}/status`,
                { status },
                { headers: { token: adminToken } }
            );
            
            if (data.success) {
                toast.success(`Request marked as ${status}`);
                fetchRequests();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteRequest = async (requestId) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                const { data } = await axios.delete(
                    `${import.meta.env.VITE_BACKEND_URL}/api/admin/requests/${requestId}`,
                    { headers: { token: adminToken } }
                );
                
                if (data.success) {
                    toast.success('Request deleted successfully');
                    fetchRequests();
                }
            } catch (error) {
                toast.error('Failed to delete request');
            }
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-700',
            matched: 'bg-blue-100 text-blue-700',
            fulfilled: 'bg-green-100 text-green-700',
            cancelled: 'bg-gray-100 text-gray-700',
            expired: 'bg-red-100 text-red-700'
        };
        return badges[status] || 'bg-gray-100 text-gray-700';
    };

    const getUrgencyBadge = (urgency) => {
        const badges = {
            normal: 'bg-gray-100 text-gray-700',
            high: 'bg-orange-100 text-orange-700',
            critical: 'bg-red-100 text-red-700 animate-pulse'
        };
        return badges[urgency] || 'bg-gray-100 text-gray-700';
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending', icon: Clock },
        { value: 'matched', label: 'Matched', icon: CheckCircle },
        { value: 'fulfilled', label: 'Fulfilled', icon: CheckCircle },
        { value: 'cancelled', label: 'Cancelled', icon: XCircle }
    ];

    return (
        <div className='p-6'>
            <div className='mb-6'>
                <h1 className='text-2xl font-bold text-gray-800'>Blood Requests Management</h1>
                <p className='text-gray-500'>View and manage all blood donation requests</p>
            </div>

            {/* Filters */}
            <div className='bg-white rounded-xl shadow-sm border p-4 mb-6'>
                <div className='flex flex-wrap gap-4 items-center'>
                    <div className='flex-1 min-w-[200px]'>
                        <div className='relative'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                            <input
                                type="text"
                                placeholder="Search by request number, patient name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                            />
                        </div>
                    </div>
                    
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="matched">Matched</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="expired">Expired</option>
                    </select>
                    
                    <select
                        value={filterUrgency}
                        onChange={(e) => setFilterUrgency(e.target.value)}
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                    >
                        <option value="all">All Urgency</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
            </div>

            {/* Requests List */}
            <div className='space-y-4'>
                {loading ? (
                    <div className='flex justify-center py-12'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-red-600'></div>
                    </div>
                ) : requests.length === 0 ? (
                    <div className='bg-white rounded-xl shadow-sm border p-12 text-center'>
                        <p className='text-gray-500'>No blood requests found</p>
                    </div>
                ) : (
                    requests.map((request) => (
                        <div key={request._id} className='bg-white rounded-xl shadow-sm border overflow-hidden'>
                            <div className='p-4 border-b bg-gray-50 flex flex-wrap justify-between items-center gap-2'>
                                <div className='flex items-center gap-3'>
                                    <span className='font-mono text-sm font-bold'>{request.requestNumber}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getStatusBadge(request.status)}`}>
                                        {request.status.toUpperCase()}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getUrgencyBadge(request.urgency)}`}>
                                        {request.urgency.toUpperCase()}
                                    </span>
                                </div>
                                <div className='flex gap-2'>
                                    {request.status === 'pending' && (
                                        <button
                                            onClick={() => handleStatusUpdate(request._id, 'matched')}
                                            className='px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition'
                                        >
                                            Mark as Matched
                                        </button>
                                    )}
                                    {request.status === 'matched' && (
                                        <button
                                            onClick={() => handleStatusUpdate(request._id, 'fulfilled')}
                                            className='px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition'
                                        >
                                            Mark as Fulfilled
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteRequest(request._id)}
                                        className='px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition flex items-center gap-1'
                                    >
                                        <Trash2 className='w-3 h-3' />
                                        Delete
                                    </button>
                                </div>
                            </div>
                            
                            <div className='p-4'>
                                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                                    <div>
                                        <p className='text-xs text-gray-500'>Requester</p>
                                        <p className='font-medium'>{request.requesterName}</p>
                                        <p className='text-xs text-gray-400'>{request.requesterPhone}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-500'>Patient</p>
                                        <p className='font-medium'>{request.patientInfo?.name}</p>
                                        <p className='text-xs'>{request.patientInfo?.age} years</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-500'>Blood Group / Hospital</p>
                                        <p className='font-bold text-red-600'>{request.patientInfo?.bloodGroup}</p>
                                        <p className='text-xs'>{request.patientInfo?.hospital}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-500'>Units / Created</p>
                                        <p className='font-medium'>{request.totalUnits} units</p>
                                        <p className='text-xs'>{new Date(request.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                
                                {request.matchedDonorId && (
                                    <div className='mt-3 p-3 bg-blue-50 rounded-lg'>
                                        <p className='text-sm text-blue-700'>Matched Donor: {request.matchedDonorId?.name || 'Donor ID'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}