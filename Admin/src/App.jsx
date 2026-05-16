
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Donors from './pages/Donors';
import Requests from './pages/Requests';

function App() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');

  useEffect(() => {
    localStorage.setItem('adminToken', adminToken);
  }, [adminToken]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<AdminLogin setAdminToken={setAdminToken} />} />
        <Route path="/" element={adminToken ? <AdminLayout setAdminToken={setAdminToken} /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard adminToken={adminToken} />} />
          <Route path="users" element={<Users adminToken={adminToken} />} />
          <Route path="donors" element={<Donors adminToken={adminToken} />} />
          <Route path="requests" element={<Requests adminToken={adminToken} />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;