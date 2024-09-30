import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp,FaPinterest  } from 'react-icons/fa';
import { Link } from 'react-router-dom'


const Footer = () => {
  return (
    <div className="relative bg-white py-8 px-4 md:px-8">
    {/* Footer Content */}
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* First Column */}
      <div className="space-y-2 text-sm text-gray-800  md:text-left">
      <Link to="/aboutus">  <p className="hover:underline">CANCELLATION & RETURNS</p></Link>
      <Link to="/aboutus">   <p className="hover:underline">SHIPPING & EXCHANGE</p></Link>
      <Link to="/aboutus">   <p className="hover:underline">PRIVACY POLICY</p></Link>
      <Link to="/aboutus">  <p className="hover:underline">TERM & CONDITIONS</p></Link>
      </div>
  
      {/* Second Column */}
      <div className="space-y-2 text-sm text-gray-800 md:text-left">
      <Link to="/aboutus"><p className="hover:underline">ABOUT US</p></Link>  
      <Link to="/contactus"> <p className="hover:underline">CONTACT US</p></Link>
      <Link to="/contactus"> <p className="hover:underline">FOR BUSINESS ENQUIRY -</p></Link>
      <Link to="/contactus"> <p className="hover:underline">+91 99999 99999</p></Link>
      </div>
  
      {/* Third Column */}
      <div className="flex flex-wrap justify-center md:justify-start space-x-6 md:space-x-4 lg:space-x-12 items-start">
        <div className="text-center">
          <img src="../img/home/1.png" alt="Fast Delivery" className="md:mx-auto mb-2 h-[40px]" />
          <p className="text-yellow-600 text-sm">FAST<br />DELIVERY</p>
        </div>
        <div className="text-center">
          <img src="../img/home/2.png" alt="Secure Payment" className="md:mx-auto mb-2 h-[40px]" />
          <p className="text-yellow-600 text-sm">SECURE<br />PAYMENT</p>
        </div>
        <div className="text-center">
          <img src="../img/home/3.png" alt="Customer Support" className="md:mx-auto mb-2 h-[40px]" />
          <p className="text-yellow-600 text-sm">CUSTOMER<br />SUPPORT</p>
        </div>
        <div className="text-center">
          <img src="../img/home/fssai.png" alt="FSSAI Certified" className="md:mx-auto mb-2 h-[40px]" />
          <p className="text-yellow-600 text-sm">FSSAI<br />CERTIFIED</p>
        </div>
      </div>
    </div>
  
    {/* Social Media Icons */}
    <div className="mt-8 flex justify-center space-x-4 text-3xl text-blue-500">
    <a href="https://www.facebook.com/Snaxup/" target="_blank">   <FaFacebook className="hover:text-yellow-600 cursor-pointer" /></a>
      <a href="https://www.instagram.com/snaxup/?hl=en" target="_blank"><FaInstagram className="hover:text-yellow-600 cursor-pointer text-[#E60023]" /></a>
      <a href="https://in.linkedin.com/company/snaxup-healthy-foods-india-pvt-ltd" target="_blank"><FaLinkedin className="hover:text-yellow-600 cursor-pointer" /></a>
      <a href="https://www.instagram.com/snaxup/?hl=en" target="_blank"><FaPinterest className="hover:text-yellow-600 cursor-pointer text-[#E60023]" /></a>
    </div>
  
    {/* WhatsApp Floating Icon */}
    <a
      href="https://wa.me/8929446677"
      className="fixed bottom-4 right-4 bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaWhatsapp className="text-white text-2xl" />
    </a>
  </div>
  
  );
};

export default Footer;
