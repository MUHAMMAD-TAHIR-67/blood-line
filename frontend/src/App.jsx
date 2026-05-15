// App.jsx
import React, { useState, useEffect } from 'react';
import Router from './Router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Searchbar from './components/Searchbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');

  useEffect(() => {
    localStorage.setItem('adminToken', adminToken);
  }, [adminToken]);

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <Searchbar />
      <Router adminToken={adminToken} setAdminToken={setAdminToken} />
      <Footer />
    </div>
  );
}