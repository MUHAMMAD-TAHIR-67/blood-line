// pages/Login.jsx
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { backendUrl, BloodContext } from '../context/BloodContext';

export default function Login() {
  const [currentState, setCurrentState] = useState('login');
  const { setToken, token } = useContext(BloodContext);
  const navigate = useNavigate();
  
  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Address fields
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  
  // Donor fields (optional)
  const [wantToBeDonor, setWantToBeDonor] = useState(false);
  const [bloodGroup, setBloodGroup] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [description, setDescription] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (currentState === 'login') {
        // Login
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { 
          email, password 
        });
        if (data.success) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
          toast.success("Login successful!");
          navigate('/');
        } else {
          toast.error(data.message || "Login failed");
        }
      } else {
        // Register
        const registerData = {
          name,
          email,
          password,
          phone,
          address: {
            street,
            city
          },
          wantToBeDonor,
          bloodGroup: wantToBeDonor ? bloodGroup : undefined,
          age: wantToBeDonor ? Number(age) : undefined,
          weight: wantToBeDonor ? Number(weight) : undefined,
          medicalConditions: wantToBeDonor ? medicalConditions : undefined,
          description: wantToBeDonor ? description : undefined,
        };

        const { data } = await axios.post(`${backendUrl}/api/user/register`, registerData);
        if (data.success) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
          toast.success(data.message || "Registration successful!");
          navigate('/');
        } else {
          toast.error(data.message || "Registration failed");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-lg m-auto mt-10 gap-4 text-gray-800 pb-20'>
      <div className='inline-flex items-center gap-2 mb-2'>
        <p className='prata-regular text-3xl'>
          {currentState === 'login' ? 'Login' : 'Create Account'}
        </p>
        <hr className='border-none h-[1.5px] w-8 bg-red-600' />
      </div>

      {/* Registration Fields */}
      {currentState !== "login" && (
        <>
          <div className='grid grid-cols-2 gap-4 w-full'>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
              type="text"
              placeholder='Full Name *'
              required
            />
            <input
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
              type="tel"
              placeholder='Phone Number *'
              required
            />
          </div>

          <div className='grid grid-cols-2 gap-4 w-full'>
            <input
              onChange={(e) => setCity(e.target.value)}
              value={city}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
              type="text"
              placeholder='City'
            />
            <input
              onChange={(e) => setStreet(e.target.value)}
              value={street}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
              type="text"
              placeholder='Street Address'
            />
          </div>

          {/* Become Donor Toggle */}
          <div className='w-full bg-red-50 border border-red-200 rounded-lg p-4'>
            <label className='flex items-center gap-3 cursor-pointer'>
              <input
                type="checkbox"
                checked={wantToBeDonor}
                onChange={(e) => setWantToBeDonor(e.target.checked)}
                className='w-5 h-5 accent-red-600'
              />
              <span className='font-semibold text-red-700'>
                🩸 I want to register as a Blood Donor
              </span>
            </label>
            <p className='text-xs text-gray-500 mt-1 ml-8'>
              You can also become a donor later from your profile
            </p>
          </div>

          {/* Donor Fields - Only show if user wants to be donor */}
          {wantToBeDonor && (
            <div className='w-full space-y-4 border border-gray-200 rounded-lg p-4 bg-white'>
              <p className='font-semibold text-gray-700 border-b pb-2'>Donor Information</p>
              
              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm text-gray-500 mb-1'>Blood Group *</label>
                  <select
                    onChange={(e) => setBloodGroup(e.target.value)}
                    value={bloodGroup}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                    required={wantToBeDonor}
                  >
                    <option value="">Select</option>
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm text-gray-500 mb-1'>Age *</label>
                  <input
                    onChange={(e) => setAge(e.target.value)}
                    value={age}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                    type="number"
                    placeholder='18-65'
                    min="18"
                    max="65"
                    required={wantToBeDonor}
                  />
                </div>
                <div>
                  <label className='block text-sm text-gray-500 mb-1'>Weight (kg) *</label>
                  <input
                    onChange={(e) => setWeight(e.target.value)}
                    value={weight}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                    type="number"
                    placeholder='Min 50'
                    min="50"
                    required={wantToBeDonor}
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm text-gray-500 mb-1'>Medical Conditions (if any)</label>
                <input
                  onChange={(e) => setMedicalConditions(e.target.value)}
                  value={medicalConditions}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                  type="text"
                  placeholder='e.g., None, Diabetes, etc.'
                />
              </div>

              <div>
                <label className='block text-sm text-gray-500 mb-1'>About You (optional)</label>
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                  rows="2"
                  placeholder='Tell us why you want to donate blood...'
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Common Fields for Login & Register */}
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
        type="email"
        placeholder='Email *'
        required
      />

      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
        type="password"
        placeholder='Password * (min 8 characters)'
        required
      />

      <div className='w-full flex justify-between text-sm'>
        <p className='cursor-pointer text-red-600 hover:underline'>Forgot Password?</p>
        {currentState === 'login' ? (
          <p onClick={() => setCurrentState("sign-up")} className='cursor-pointer text-red-600 hover:underline'>
            Create an account
          </p>
        ) : (
          <p onClick={() => setCurrentState("login")} className='cursor-pointer text-red-600 hover:underline'>
            Already have an account? Login
          </p>
        )}
      </div>

      <button 
        type="submit" 
        className='w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition text-lg'
      >
        {currentState === 'login' ? "Sign In" : "Create Account"}
      </button>
    </form>
  );
}