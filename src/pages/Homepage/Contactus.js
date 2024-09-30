import React, { useState } from "react";
import Navbar from '../../component/Navbar';
import Footer from '../../component/Footer';
import Swal from "sweetalert2";
import SecureStorage from 'react-secure-storage';


function ContactForm() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    msg: "",
  
  });
  // New loading state
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Show loader when form is submitted

    try {
      const response = await fetch(`${apiUrl}send-contactus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Message Sent!',
          text: 'Your message has been sent successfully.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to send the message. Please try again later.',
        });
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'An error occurred while sending the message.',
      });
    }
    finally {
      setLoading(false);  // Hide loader once form submission is complete
    }
  };

  return (
          <>
          <Navbar/>
               {/* Full-screen loader overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <img src="../../img/home/loader.gif" alt="Loading..." className="w-32 h-32" />
        </div>
      )}
    <div className="flex justify-center items-center h-auto bg-white">
    <form className="w-full max-w-4xl p-8 mt-8 mb-8" onSubmit={handleSubmit}>
      <h2 className="text-3xl font-light tracking-wider mb-8 text-center">
        CONTACT US FOR ORDERS & QUERIES:
      </h2>
    
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <input 
            className="appearance-none block w-full bg-transparent border border-gray-300 rounded-md py-3 px-4 text-gray-800 focus:outline-none focus:border-gray-500" 
            type="text" 
            name="name" 
            placeholder="Name" 
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <input 
            className="appearance-none block w-full bg-transparent border border-gray-300 rounded-md py-3 px-4 text-gray-800 focus:outline-none focus:border-gray-500" 
            type="email" 
            name="email" 
            placeholder="E-mail" 
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="mb-6">
        <input 
          className="appearance-none block w-full bg-transparent border border-gray-300 rounded-md py-3 px-4 text-gray-800 focus:outline-none focus:border-gray-500" 
          type="tel" 
          name="phone"
          placeholder="Phone Number" 
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-6 ">
        <textarea 
          className="appearance-none block w-full bg-transparent border border-gray-300 rounded-md py-3 px-4 text-gray-800 focus:outline-none focus:border-gray-500" 
          rows="4" 
          name="msg"
          placeholder="Message"
          value={formData.msg}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <div className="px-3">
        <button 
          className="w-full bg-transparent border border-orange-600 text-orange-600 font-semibold py-3 rounded-full focus:outline-none hover:bg-orange-600 hover:text-white transition duration-300"
          type="submit"
          disabled={loading}  // Disable button while loading
>
          SEND MESSAGE
      
        </button>
      </div>
    </form>
      
    </div>
    <div className="bg-cover bg-center h-auto p-10" style={{ backgroundImage: 'url("/../img/home/building.webp")' }}>
      <div className="text-center mb-10">
        {/* <h1 className="text-white text-4xl font-bold">CONTACT US</h1> */}
        <p className="text-white bold">We are eagerly waiting to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Side */}
        <div className="text-white">
          <div className="flex items-center mb-4">
            <i className="fa fa-home "></i>
            <span>Services</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>serviceprovider@snaxup.com</span>
            <span>+91 8929 446 677</span>
          </div>

          <div className="flex items-center mb-4">
            <i className="fa fa-envelope "></i>
            <span>Claims</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>claims@snaxup.com</span>
            <span>+91 8929 446 677</span>
          </div>

          <div className="flex items-center mb-4">
            <i className="fa fa-briefcase "></i>
            <span>Marketing</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>info@snaxup.com</span>
            <span>+91 8929 446 677</span>
          </div>

          <div className="flex items-center mb-4">
            <i className="fa fa-users "></i>
            <span>HR</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>hr@snaxup.com</span>
            <span>+91 8929 446 677</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="text-white">
          <div className="border-l-2 pl-4">
            <h3 className="text-2xl font-bold mb-4">Head Office</h3>
            <div className="flex items-center mb-4">
              <i className="fa fa-map-marker mr-3"></i>
              <span>Delhi</span>
            </div>
            <div className="flex items-center mb-4">
              <i className="fa fa-envelope mr-3"></i>
              <span>contactus@snaxup.com</span>
            </div>
            <div className="flex items-center mb-4">
              <i className="fa fa-phone mr-3"></i>
              <span>+91 8929 446 677</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default ContactForm;
