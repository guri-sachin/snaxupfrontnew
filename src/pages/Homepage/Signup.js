import React, { useState } from 'react';
import Navbar from '../../component/Navbar';
import Footer from '../../component/Footer';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import SecureStorage from 'react-secure-storage';


const SignUpForm = () => {
  // State to store form inputs
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [fullname, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);  // State for password visibility

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      fullname: fullname,
      phone: phone,
      email: email,
      password: password,
    };

    try {
      const response = await fetch(`${apiUrl}signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
              // Store user's email in sessionStorage
              SecureStorage.setItem('userEmail', email);
              SecureStorage.setItem('userId', data.userId);


        // Success alert using SweetAlert2
        Swal.fire({
          title: 'Success!',
          text: 'User registered successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        navigate('/');

        console.log('User registered:', data);
      } else {
        // Error alert using SweetAlert2
        Swal.fire({
          title: 'Error!',
          text: data.message || 'Something went wrong!',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
        console.error('Error:', data.message);
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Network or server error occurred!',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
      console.error('Signup error:', error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Create my account
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Please fill in the information below:
          </p>

          {/* Form Fields */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Full name"
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A0404]"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A0404]"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A0404]"
                required
              />
            </div>
            <div className="mb-6 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A0404]"
                required
              />
              {/* Toggle Password Visibility */}
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 top-3 cursor-pointer text-gray-500"
              >
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#8A0404] text-white font-bold py-2 px-4 rounded-lg hover:bg-white hover:text-black border transition duration-200"
            >
              Create my account
            </button>
          </form>

          {/* Captcha and Terms */}
          <p className="text-center text-gray-500 text-xs mt-6">
            This site is protected by hCaptcha and the hCaptcha Privacy Policy and
            Terms of Service apply.
          </p>

          {/* Already have account */}
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-[#8A0404] hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SignUpForm;
