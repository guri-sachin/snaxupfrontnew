import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../../component/Navbar';
import Footer from '../../component/Footer';
import { useNavigate } from 'react-router-dom';
import SecureStorage from 'react-secure-storage';


const LoginWithOTP = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  // New loading state
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);  // Show loader when form is submitted

    try {
      const response = await axios.post(`${apiUrl}send-otp`, { email });
      
      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'OTP Sent',
        text: response.data.message || 'The OTP has been sent to your email.',
      });
  
      // Proceed to the next step
      setStep(2);
      setMessage(response.data);
    } catch (error) {
      // Handle errors and show error alert
      const errorMsg = error.response?.data?.message || 'Failed to send OTP. Please try again later.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMsg,
      });
  
      setMessage(errorMsg);
    }
    finally {
      setLoading(false);  // Hide loader once form submission is complete
    }
  };
  
  const handleVerifyOtp = async () => {
    setLoading(true);  // Show loader when form is submitted

    try {
      const response = await axios.post('http://localhost:4000/api/verify-otp', { email, otp });
    
      Swal.fire({
        icon: 'success',
        title: 'OTP Verified',
        text: response.data.message || 'OTP verified successfully!',
      });
      SecureStorage.setItem('userIdentifier',email);

      navigate('/');
      SecureStorage.setItem('userId',response.data.userId);

      setMessage(response.data);
    } catch (error) {
      // Handle errors and show error alert
      const errorMsg = error.response?.data?.message || 'Invalid OTP. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: errorMsg,
      });
  
      setMessage(errorMsg);
    }
    finally {
      setLoading(false);  // Hide loader once form submission is complete
    }
  };
  return (
    
    <div>
           <Navbar />
                     {/* Full-screen loader overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <img src="../../img/home/loader.gif" alt="Loading..." className="w-32 h-32" />
        </div>
      )}
      {step === 1 ? (
        <div>
   
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Login with OTP
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Please fill in the information below:
          </p>

          {/* Form Fields */}
   
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A0404]"
                required
              />
            </div>
        

            {/* Submit Button */}
            <button
            onClick={handleSendOtp}
            disabled={loading}  
            className="w-full bg-[#8A0404] text-white font-bold py-2 px-4 rounded-lg hover:bg-white hover:text-black border transition duration-200"
            >
              Login
            </button>
      

          {/* Additional Links */}
          <p className="text-center text-gray-500 text-xs mt-6">
            This site is protected by hCaptcha and the hCaptcha Privacy Policy and Terms of Service apply.
          </p>

         
        </div>
      </div>
        </div>
      ) : (
        <div>
              <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2>Enter OTP</h2>

          {/* Form Fields */}
   
            <div className="mb-4">
              <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A0404]"
                required
              />
            </div>
        

            {/* Submit Button */}
            <button
                disabled={loading}
           onClick={handleVerifyOtp}
              className="w-full bg-[#8A0404] text-white font-bold py-2 px-4 rounded-lg hover:bg-white hover:text-black border transition duration-200"
            >
              OTP verification
            </button>
      

          {/* Additional Links */}
          <p className="text-center text-gray-500 text-xs mt-6">
            This site is protected by hCaptcha and the hCaptcha Privacy Policy and Terms of Service apply.
          </p>

         
        </div>

      </div>
      {message && <p>{message}</p>}  
        </div>
      )}
            <Footer />
    </div>
  );
};

export default LoginWithOTP;
