// context/BloodContext.jsx
import React, { createContext, useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import axios from "axios";

export const BloodContext = createContext();
export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function BloodContextProvider({ children }) {
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [bloodRequests, setBloodRequests] = useState({});
  const [donors, setDonors] = useState([]);
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [urgentRequests, setUrgentRequests] = useState([]);
  const [featuredDonors, setFeaturedDonors] = useState([]);
  
  const hasFetchedDonors = useRef(false);
  const hasFetchedUrgent = useRef(false);

  // Get user profile - memoized
  const getUser = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/profile",
        {},
        { headers: { token } }
      );
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.log("Get user error:", error.message);
    }
  }, [token]); // Only depends on token (string, stable)

  // Add blood request
  const addBloodRequest = useCallback((donorId, bloodGroup, donorName) => {
    setBloodRequests(prev => {
      const requestData = { ...prev };
      if (requestData[donorId]) {
        requestData[donorId].quantity += 1;
      } else {
        requestData[donorId] = { donorId, bloodGroup, donorName, quantity: 1 };
      }
      localStorage.setItem('bloodRequests', JSON.stringify(requestData));
      return requestData;
    });
    toast.success(`${donorName} your request is added to card plaese went there to fill the form  and submit the request  `);
  }, []);

  const getTotalRequests = useCallback(() => {
    let totalCount = 0;
    for (const donorId in bloodRequests) {
      totalCount += bloodRequests[donorId].quantity;
    }
    return totalCount;
  }, [bloodRequests]);

  const updateRequestQuantity = useCallback((donorId, quantity) => {
    setBloodRequests(prev => {
      const requestData = { ...prev };
      if (quantity <= 0) {
        delete requestData[donorId];
      } else if (requestData[donorId]) {
        requestData[donorId].quantity = quantity;
      }
      localStorage.setItem('bloodRequests', JSON.stringify(requestData));
      return requestData;
    });
  }, []);

  const clearRequests = useCallback(() => {
    setBloodRequests({});
    localStorage.removeItem('bloodRequests');
  }, []);

  // Fetch donors - memoized, depends only on user ID
  const fetchDonors = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (user?._id) {
        queryParams.append('excludeUserId', user._id);
      }
      
      const { data } = await axios.get(`${backendUrl}/api/user/donors?${queryParams.toString()}`);
      
      if (data.success) {
        setDonors(data.donors || []);
        const featured = (data.donors || [])
          .filter(d => d.donorInfo?.featured && d.donorInfo?.available)
          .slice(0, 8);
        setFeaturedDonors(featured);
      }
      hasFetchedDonors.current = true;
    } catch (error) {
      console.error('Error fetching donors:', error.message);
    } finally {
      setLoading(false);
    }
  }, [user?._id]); // Only depends on user ID (string, stable)

  const fetchUrgentRequests = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/requests/urgent`);
      if (data.success) {
        setUrgentRequests(data.requests || []);
      }
      hasFetchedUrgent.current = true;
    } catch (error) {
      console.log("Urgent requests fetch failed:", error.message);
    }
  }, []); // No dependencies - stable

  // Load saved requests (runs once on mount)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bloodRequests');
      if (saved) setBloodRequests(JSON.parse(saved));
    } catch (e) {
      localStorage.removeItem('bloodRequests');
    }
  }, []); // Empty array = runs once

  // Load token (runs once on mount)
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, []); // Empty array = runs once

  // Fetch data on mount (runs once)
  useEffect(() => {
    fetchDonors();
    fetchUrgentRequests();
  }, [fetchDonors, fetchUrgentRequests]); // Stable function references

  // Get user when token changes
  useEffect(() => {
    if (token) {
      getUser();
    }
  }, [token, getUser]); // getUser is memoized with token dependency

  // Refetch donors when user ID loads
  useEffect(() => {
    if (user?._id && !hasFetchedDonors.current) {
      fetchDonors();
    }
  }, [user?._id, fetchDonors]);

  const value = {
    user, setUser,
    donors, setDonors,
    bloodRequests, setBloodRequests,
    search, setSearch,
    showSearch, setShowSearch,
    token, setToken,
    loading,
    urgentRequests,
    featuredDonors,
    backendUrl,
    addBloodRequest,
    updateRequestQuantity,
    getTotalRequests,
    clearRequests,
    fetchDonors,
    fetchUrgentRequests
  };

  return (
    <BloodContext.Provider value={value}>
      {children}
    </BloodContext.Provider>
  );
}