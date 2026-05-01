import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
 import { ToastContainer, toast } from 'react-toastify';
export default function Login({setToken}) {
const [email,setEmail]=useState('')
const [password,setPassword]=useState('')
const handleLogin = async (e) => {
  e.preventDefault(); 

  try {
    const { data } = await axios.post(`${backendUrl}/api/user/admin`, {
      email,
      password,
    });

    if (data.token) {
      // console.log(data.token)
      setToken(data.token);
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
    console.error("Login error:", error);
  }
};

    return (
    <div className='min-h-screen  flex items-center justify-center w-full'>
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">

        <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
        <form onSubmit={handleLogin}>
            <div className='mb-3 min-w-72'>
                <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                <input onChange={(e)=>setEmail(e.target.value)} required className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="text" placeholder='Email' />

            </div>
              <div className='mb-3 min-w-72'>
                <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                <input onChange={(e)=>setPassword(e.target.value)} required className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" placeholder='Password' />

            </div>
            <button type='submit' className='w-full bg-black text-white py-2 px-3 rounded-md '>Login</button>
        </form>
      </div>
    </div>
  )
}
