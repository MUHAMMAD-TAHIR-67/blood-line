// pages/Contact.jsx
import React, { useState } from 'react';
import Title from '../components/Title';
import { toast } from 'react-toastify';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the message to your backend
    console.log('Contact form:', formData);
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      {/* Header */}
      <div className='text-2xl text-center pt-10 border-t'>
        <Title text1={"CONTACT "} text2={"US"}/>
      </div>

      <div className='flex flex-col lg:flex-row gap-10 mb-28 mt-10'>
        {/* Left Side - Contact Info */}
        <div className='lg:w-2/5'>
          <div className='bg-gradient-to-br from-red-800 to-red-900 rounded-2xl p-8 text-white h-full'>
            <h3 className='text-2xl font-bold mb-6'>Get In Touch</h3>
            <p className='text-red-100 mb-8 leading-relaxed'>
              Have questions? Need help finding a donor? We're here to assist you 24/7.
            </p>
            
            {/* Contact Details */}
            <div className='space-y-6'>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0'>
                  <span className='text-xl'>📞</span>
                </div>
                <div>
                  <p className='font-semibold'>Emergency Helpline</p>
                  <p className='text-red-100 text-sm'>+92 300 1234567</p>
                  <p className='text-red-100 text-sm'>+92 321 7654321</p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0'>
                  <span className='text-xl'>✉️</span>
                </div>
                <div>
                  <p className='font-semibold'>Email Us</p>
                  <p className='text-red-100 text-sm'>help@bloodline.com</p>
                  <p className='text-red-100 text-sm'>support@bloodline.com</p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0'>
                  <span className='text-xl'>📍</span>
                </div>
                <div>
                  <p className='font-semibold'>Our Office</p>
                  <p className='text-red-100 text-sm'>123 Health Street, Medical Complex</p>
                  <p className='text-red-100 text-sm'>Karachi, Pakistan</p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0'>
                  <span className='text-xl'>🕐</span>
                </div>
                <div>
                  <p className='font-semibold'>Working Hours</p>
                  <p className='text-red-100 text-sm'>24/7 Emergency Support</p>
                  <p className='text-red-100 text-sm'>Office: Mon - Sat, 9AM - 6PM</p>
                </div>
              </div>
            </div>

           
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className='lg:w-3/5'>
          <div className='bg-white rounded-2xl shadow-lg border p-8'>
            <h3 className='text-2xl font-bold text-gray-800 mb-2'>Send Us a Message</h3>
            <p className='text-gray-500 mb-6'>Fill the form below and we'll get back to you within 24 hours.</p>
            
            <form onSubmit={handleSubmit} className='space-y-5'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition'
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition'
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition'
                  placeholder="What's this about?"
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition resize-none'
                  placeholder="Write your message here..."
                  required
                />
              </div>

              <button
                type="submit"
                className='w-full bg-red-800 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition text-lg shadow-md hover:shadow-lg'
              >
               Send Message
              </button>
            </form>
          </div>

          {/* FAQ Quick Links */}
          <div className='mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div className='bg-red-50 rounded-lg p-4 text-center hover:bg-red-100 transition cursor-pointer'>
              <span className='text-2xl'>🩸</span>
              <p className='text-sm font-medium text-gray-700 mt-1'>How to Donate?</p>
            </div>
            <div className='bg-red-50 rounded-lg p-4 text-center hover:bg-red-100 transition cursor-pointer'>
              <span className='text-2xl'>🔍</span>
              <p className='text-sm font-medium text-gray-700 mt-1'>Find a Donor</p>
            </div>
            <div className='bg-red-50 rounded-lg p-4 text-center hover:bg-red-100 transition cursor-pointer'>
              <span className='text-2xl'>❓</span>
              <p className='text-sm font-medium text-gray-700 mt-1'>FAQ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}