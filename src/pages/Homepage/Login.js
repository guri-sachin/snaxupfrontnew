
import React, { useState } from 'react';
import Navbar from '../../component/Navbar';
import Footer from '../../component/Footer';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import SecureStorage from 'react-secure-storage';

const LoginForm = () => {
  const [identifier, setIdentifier] = useState(''); // Updated to handle email or phone number
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter your email/phone and password',
      });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }), // Send identifier instead of email
      });

      const data = await response.json();
      if (response.ok) {
        SecureStorage.setItem('userIdentifier', identifier);
    
        SecureStorage.setItem('userId', data.userId);
    

        Swal.fire({
          icon: 'success',
          title: 'Login successful',
          text: `Welcome back!`,
        });
        navigate('/');

        // You can store user data or navigate to another page here
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: data.error,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again later.',
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Login to my account
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Please fill in the information below:
          </p>

          {/* Form Fields */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Email or Phone"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A0404]"
                required
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A0404]"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#8A0404] text-white font-bold py-2 px-4 rounded-lg hover:bg-white hover:text-black border transition duration-200"
            >
              Login
            </button>
          </form>

          {/* Additional Links */}
          <p className="text-center text-gray-500 text-xs mt-6">
            This site is protected by hCaptcha and the hCaptcha Privacy Policy and Terms of Service apply.
          </p>

          <p className="text-center text-gray-600 mt-3">
            Lost password?{' '}
            <a href="/loginotp" className="text-[#8A0404] hover:underline">
              Login with OTP
            </a>
          </p>
          <p className="text-center text-gray-600 mt-2">
            New customer?{' '}
            <a href="/signup" className="text-[#8A0404] hover:underline">
              Create your account
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginForm;
