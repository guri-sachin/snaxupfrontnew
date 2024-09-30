import React, { useState,useEffect } from 'react';

const Customise = () => {
   // Create state for form inputs
   const apiUrl = process.env.REACT_APP_API_URL;

   const [formData, setFormData] = useState({
    
    email: ''

  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  // Function to handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  // Send POST request to the API
  try {
    const response = await fetch(`${apiUrl}send-subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.status === 200) {
      // Success
      setSuccessMessage('Subscription successful! We will keep you updated.');
      setErrorMessage('');
      setFormData({ email: '' }); // Clear the form
    } else if (response.status === 409) {
      // Email already exists
      setErrorMessage('You are already subscribed.');
      setSuccessMessage('');
    } else {
      // Other errors
      setErrorMessage('Failed to subscribe. Please try again later.');
      setSuccessMessage('');
    }
  } catch (error) {
    console.error('Error:', error);
    setErrorMessage('An error occurred. Please try again.');
    setSuccessMessage('');
  }
};


  return (
    <div className="py-12 px-4  z-20 relative">
      <h2 className="text-center text-2xl font-semibold text-gray-700 mb-8">KEEP ME UPDATED</h2>

      <h1 className="text-center text-4xl font-semibold text-[#8A0404] tracking-widest">NEWSLETTER</h1>
      <p className="text-center font-semibold text-gray-700 mb-8 mt-2">
        A SHORT SENTENCE DESCRIBING WHAT SOMEONE WILL RECEIVE BY SUBSCRIBING.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 max-w-md mx-auto mt-8">

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="E-mail"
required
          className="border border-[#d4af37] rounded-full px-6 py-2 w-full outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
        />
        <button      type="submit"   className="bg-[#d4af37] text-black font-semibold rounded-full px-6 py-2 hover:bg-[#b9972e] transition-all duration-200">
          Subscribe
        </button>
      </form>

      {successMessage && <p className="text-green-600 text-center mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 text-center mt-4">{errorMessage}</p>}

    </div>
  );
};

export default Customise;
