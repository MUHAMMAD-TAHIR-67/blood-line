// pages/Login.jsx
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { backendUrl, BloodContext } from '../context/BloodContext';
import BMICalculator from '../components/BMICalculator';

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
  
  // Donor fields
  const [wantToBeDonor, setWantToBeDonor] = useState(false);
  const [bloodGroup, setBloodGroup] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [description, setDescription] = useState('');
  
  // BMI Calculator state (age, weight, height are managed inside BMI Calculator)
  const [eligibility, setEligibility] = useState({ eligible: false, age: '', weight: '', height: '' });
  const [showBMICalculator, setShowBMICalculator] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleEligibilityChange = (result) => {
    setEligibility(result);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    // Check eligibility if trying to register as donor
    if (currentState !== 'login' && wantToBeDonor && !eligibility.eligible) {
      toast.error('You do not meet the eligibility requirements to become a donor');
      return;
    }
    
    try {
      if (currentState === 'login') {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (data.success) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
          toast.success("Login successful!");
          navigate('/');
        } else {
          toast.error(data.message || "Login failed");
        }
      } else {
        const registerData = {
          name,
          email,
          password,
          phone,
          address: { street, city },
          wantToBeDonor,
          bloodGroup: wantToBeDonor ? bloodGroup : undefined,
          age: wantToBeDonor ? Number(eligibility.age) : undefined,
          weight: wantToBeDonor ? Number(eligibility.weight) : undefined,
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
                onChange={(e) => {
                  setWantToBeDonor(e.target.checked);
                  setShowBMICalculator(e.target.checked);
                }}
                className='w-5 h-5 accent-red-600'
              />
              <span className='font-semibold text-red-700'>
                I want to register as a Blood Donor
              </span>
            </label>
            <p className='text-xs text-gray-500 mt-1 ml-8'>
              You can also become a donor later from your profile
            </p>
          </div>

          {/* Donor Fields - Combined with BMI Calculator */}
          {wantToBeDonor && (
            <div className='w-full space-y-4 border border-gray-200 rounded-lg p-4 bg-white'>
              <p className='font-semibold text-gray-700 border-b pb-2'>Donor Information & Eligibility Check</p>
              
              {/* Blood Group Selection */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Blood Group *</label>
                <select
                  onChange={(e) => setBloodGroup(e.target.value)}
                  value={bloodGroup}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                  required={wantToBeDonor}
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              {/* BMI Calculator - Includes Age, Weight, Height, Health Conditions, Medications */}
              <div className='mt-2'>
                <BMICalculator 
                  onEligibilityChange={handleEligibilityChange} 
                  embedded={false}
                />
              </div>

              {/* Medical Conditions (Additional) */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Additional Medical Conditions (if any)</label>
                <input
                  onChange={(e) => setMedicalConditions(e.target.value)}
                  value={medicalConditions}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                  type="text"
                  placeholder='e.g., None,...'
                />
              </div>

              {/* About You */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>About You (optional)</label>
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

      {/* Common Fields */}
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
        disabled={wantToBeDonor && !eligibility.eligible}
        className={`w-full py-3 rounded-md font-semibold transition text-lg ${
          wantToBeDonor && !eligibility.eligible
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        {currentState === 'login' ? "Sign In" : "Create Account"}
      </button>

      {wantToBeDonor && !eligibility.eligible && (
        <p className='text-xs text-red-500 text-center'>
          Please fill in your Age, Weight, and Height in the BMI Calculator above to check eligibility
        </p>
      )}
    </form>
  );
}