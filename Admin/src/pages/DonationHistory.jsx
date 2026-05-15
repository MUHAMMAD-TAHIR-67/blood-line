// admin-frontend/src/pages/DonationHistory.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function DonationHistory({ adminToken }) {
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

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
    }
  };

  const fetchDonorHistory = async (donorId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/user/donation-history`, {
        headers: { token: adminToken }
      });
      if (data.success) {
        setHistory(data.donationHistory);
      }
    } catch (error) {
      toast.error('Failed to fetch donation history');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDonor = (donor) => {
    setSelectedDonor(donor);
    fetchDonorHistory(donor._id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Donation History</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donor List */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h2 className="font-bold text-gray-800 mb-4">Select Donor</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {donors.map((donor) => (
              <button
                key={donor._id}
                onClick={() => handleSelectDonor(donor)}
                className={`w-full text-left p-3 rounded-lg transition ${
                  selectedDonor?._id === donor._id
                    ? 'bg-red-50 border-red-500 border'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <p className="font-medium">{donor.name}</p>
                <p className="text-xs text-gray-500">{donor.email}</p>
                <p className="text-xs font-bold text-red-600 mt-1">{donor.bloodGroup}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Donation History */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-4">
          <h2 className="font-bold text-gray-800 mb-4">
            {selectedDonor ? `${selectedDonor.name}'s Donation History` : 'Select a donor'}
          </h2>
          
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : !selectedDonor ? (
            <div className="text-center py-8 text-gray-500">Select a donor from the list</div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No donation history for this donor</div>
          ) : (
            <div className="space-y-3">
              {history.map((donation) => (
                <div key={donation.requestId} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{donation.patientName}</p>
                      <p className="text-sm text-gray-500">{donation.hospital}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(donation.fulfilledDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span>🩸 {donation.bloodGroup}</span>
                    <span>📦 {donation.units} units</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}