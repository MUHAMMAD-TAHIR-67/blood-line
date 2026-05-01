// pages/About.jsx
import React from 'react';
import Title from "../components/Title";
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={"ABOUT  "} text2={"US"}/>
      </div>
      
      {/* Mission Section */}
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <div className='w-full md:max-w-[450px] bg-gradient-to-r from-red-800 to-red-900 rounded-2xl flex items-center justify-center p-8'>
          <div className='text-center text-white'>
            <div className='text-8xl mb-4'>🩸</div>
            <p className='text-2xl font-bold'>BloodLine</p>
            <p className='text-red-200 mt-2'>Connecting Donors & Patients</p>
          </div>
        </div>
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p className='text-lg leading-relaxed'>
            <strong className='text-red-600'>BloodLine</strong> is a community-driven platform that connects blood donors with patients in urgent need. 
            We believe that no one should lose their life due to lack of blood. Our mission is to make blood donation accessible, 
            quick, and hassle-free for everyone.
          </p>
          <p className='leading-relaxed'>
            Every day, thousands of patients need blood transfusions for surgeries, accidents, cancer treatments, and other medical conditions. 
            One donation can save up to <strong className='text-red-600'>three lives</strong>. We've built this platform to bridge the gap between 
            generous donors and those fighting for their lives.
          </p>
          <b className='text-gray-800 text-xl'>🎯 OUR MISSION</b>
          <p className='leading-relaxed'>
            To create a world where no patient suffers due to blood shortage. We aim to build the largest network of voluntary blood donors 
            across Pakistan, making it easy for anyone to find a matching donor in minutes.
          </p>
        </div>
      </div>
      
      {/* Why Choose Us */}
      <div className='text-xl py-4'>
        <Title text1={"WHY "} text2={"CHOOSE US"}/>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-20'>
        {/* Feature 1 */}
        <div className='bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition border border-gray-100'>
          <div className='w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4'>
            <span className='text-2xl'>⚡</span>
          </div>
          <b className='text-lg text-gray-800 block mb-2'>Fast Response</b>
          <p className='text-gray-600 leading-relaxed'>
            Find matching blood donors instantly based on blood group and location. 
            Our platform shows available donors near you, making it quick to get help in emergencies.
          </p>
        </div>
        
        {/* Feature 2 */}
        <div className='bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition border border-gray-100'>
          <div className='w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4'>
            <span className='text-2xl'>✅</span>
          </div>
          <b className='text-lg text-gray-800 block mb-2'>Verified Donors</b>
          <p className='text-gray-600 leading-relaxed'>
            All donors are verified with complete profiles including blood group, medical history, and contact information. 
            You can trust the information you see.
          </p>
        </div>
        
        {/* Feature 3 */}
        <div className='bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition border border-gray-100'>
          <div className='w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
            <span className='text-2xl'>🔔</span>
          </div>
          <b className='text-lg text-gray-800 block mb-2'>Real-Time Notifications</b>
          <p className='text-gray-600 leading-relaxed'>
            Donors get instant notifications when someone needs their blood type. 
            Patients get notified when a donor accepts their request. Stay updated in real-time.
          </p>
        </div>
        
        {/* Feature 4 */}
        <div className='bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition border border-gray-100'>
          <div className='w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4'>
            <span className='text-2xl'>🔒</span>
          </div>
          <b className='text-lg text-gray-800 block mb-2'>Privacy Protected</b>
          <p className='text-gray-600 leading-relaxed'>
            Your personal information is safe. Donor contact details are only shared with verified requesters. 
            You control your availability and visibility.
          </p>
        </div>
        
        {/* Feature 5 */}
        <div className='bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition border border-gray-100'>
          <div className='w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4'>
            <span className='text-2xl'>📱</span>
          </div>
          <b className='text-lg text-gray-800 block mb-2'>Easy to Use</b>
          <p className='text-gray-600 leading-relaxed'>
            Simple registration process. Create an account, add your blood group, and you're ready to save lives. 
            Works on mobile and desktop seamlessly.
          </p>
        </div>
        
        {/* Feature 6 */}
        <div className='bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition border border-gray-100'>
          <div className='w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-4'>
            <span className='text-2xl'>🤝</span>
          </div>
          <b className='text-lg text-gray-800 block mb-2'>Community Driven</b>
          <p className='text-gray-600 leading-relaxed'>
            Join thousands of life-savers across Pakistan. Every donor in our community is a hero. 
            Together, we ensure no one goes without blood when they need it most.
          </p>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className='bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 md:p-12 text-white mb-20'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
          <div>
            <div className='text-4xl font-bold mb-2'>500+</div>
            <p className='text-red-200 text-sm'>Lives Impacted</p>
          </div>
          <div>
            <div className='text-4xl font-bold mb-2'>200+</div>
            <p className='text-red-200 text-sm'>Active Donors</p>
          </div>
          <div>
            <div className='text-4xl font-bold mb-2'>10+</div>
            <p className='text-red-200 text-sm'>Cities Covered</p>
          </div>
          <div>
            <div className='text-4xl font-bold mb-2'>24/7</div>
            <p className='text-red-200 text-sm'>Emergency Support</p>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className='text-center mb-20'>
        <h2 className='text-3xl font-bold text-gray-800 mb-4'>Ready to Save Lives?</h2>
        <p className='text-gray-600 mb-8 max-w-xl mx-auto'>
          Join our community of blood donors today. Your donation can give someone another chance at life.
        </p>
        <div className='flex gap-4 justify-center'>
          <Link to='/donors' className='bg-red-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition'>
            Find Donors
          </Link>
          <Link to='/become-donor' className='border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition'>
            Become a Donor
          </Link>
        </div>
      </div>
    </div>
  );
}