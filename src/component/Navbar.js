import React, { useState } from 'react';
import { FaUser } from "react-icons/fa";
import { BsCart } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext'; // Adjust the path as necessary
import SecureStorage from 'react-secure-storage';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { cart } = useCart();

    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
  
    // Handle search icon click
    const toggleSearchPopover = () => {
      setShowSearch(!showSearch); // Toggle search popover visibility
    };
  
    // Handle search input change
    const handleSearchInputChange = (e) => {
      setSearchTerm(e.target.value); // Update search term state
    };
  
    // Handle search functionality (mockup)
    const handleSearch = () => {
      console.log("Searching for:", searchTerm);
      // You can implement actual product search logic here
    };

    const checkUserEmail = () => {
      const userIdentifier = SecureStorage.getItem('userIdentifier');
    
      // Check if the email exists in sessionStorage
      if (userIdentifier) {
        console.log('User email:', userIdentifier);
        // Navigate to My Orders page and pass the email
        navigate('/Myorders', { state: { userIdentifier: userIdentifier } });
      } else {
        console.log('No user email found');
        navigate('/Login'); // Navigate to Login page
      }
    };
    const handleCartClick = () => {
      navigate('/card');
    };
    const ShowHandle = () => {
      navigate('/ProductList');
    };

    return (
        <nav className="bg-white shadow-lg md:h-[100px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 md:mt-4">
                <div className="flex items-center justify-between h-16 md:h-[80px]">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/">
                            <img className="h-10 md:h-[80px] md:w-auto" src="https://snaxup.in/wp-content/uploads/2021/09/logo-1-e1631967499766.png" alt="Logo" />
                        </Link>
                    </div>

                    {/* Navbar links */}
                    <div className="hidden md:block">
                    <div className="md:ml-[0px] lg:ml-[0px] xl:ml-[200px] flex items-end space-x-4">
  <Link to="/" className="text-gray-800 hover:text-[#8A0404] px-0 py-2 rounded-md text-sm font-medium capitalize md:uppercase">Home &nbsp;&nbsp;|</Link>
  <Link to="/aboutus" className="text-gray-800 hover:text-[#8A0404] px-0 py-2 rounded-md text-sm font-medium capitalize md:uppercase">About Us &nbsp;&nbsp;|</Link>
  <Link to="/ProductList" className="text-gray-800 hover:text-[#8A0404] px-0 py-2 rounded-md text-sm font-medium capitalize md:uppercase">Shop &nbsp;&nbsp;|</Link>
  <Link to="/gifthamper" className="text-gray-800 hover:text-[#8A0404] px-0 py-2 rounded-md text-sm font-medium capitalize md:uppercase"> Gifting &nbsp;&nbsp;|</Link>
  <Link to="/contactus" className="text-[#8A0404] hover:text-[#8A0404] px-0 py-2 rounded-md text-sm font-medium capitalize md:uppercase">Contact US &nbsp;&nbsp;</Link>
</div>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                         {/* Search Icon */}
                         <div className="relative">
  <a
    href="#"
    className="text-gray-800 hover:text-[#8A0404]"
    onClick={toggleSearchPopover}
  >
    <IoSearch className="text-xl " />
  </a>
  {/* Search Popover */}
  {showSearch && (
    <div className="absolute top-8 left-0 bg-white shadow-lg p-4 rounded-md z-50 w-72 sm:w-80 md:w-60">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2 w-full"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
        <button
          className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
          onClick={handleSearch}
        >
          <IoSearch onClick={ShowHandle}/>
        </button>
      </div>
    </div>
  )}
</div>

                        {/* <div className="cart-icon" onClick={handleCartClick} style={{ cursor: 'pointer' }}> */}
                        <a
      className="relative text-gray-800 hover:text-[#8A0404] flex items-center"
      onClick={handleCartClick}
    >
      {/* Cart Icon */}
      <BsCart className="text-xl" />

      {/* Cart Item Count Badge */}
      {cart.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
          {cart.length}
        </span>
      )}
    </a>
                        <a  onClick={checkUserEmail} className="text-[#8A0404] hover:text-gray-600">
                        < FaUser className="text-xl"></FaUser>
                        </a>
                    </div>

                    {/* Mobile menu button */}
                 {/* Mobile menu button */}
<div className="md:hidden">
  <div className="flex items-center space-x-4 mx-4 ">
   {/* Search Icon */}
   <div className="relative">
          <a
            href="#"
            className="text-gray-800 hover:text-[#8A0404]"
            onClick={toggleSearchPopover}
          >
            <IoSearch className="text-xl sm:text-2xl" />
          </a>
 {/* Search Popover */}
{showSearch && (
  <div className="absolute left-1/2 transform -translate-x-1/2  bg-white shadow-lg p-4 rounded-md z-50">
    <div className="flex items-center space-x-2">
      <input
        type="text"
        className="border border-gray-300 rounded-md p-2"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearchInputChange}
      />
      <button
        className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
        onClick={handleSearch}
      >
        <IoSearch onClick={ShowHandle} />
      </button>
    </div>
  </div>
)}

        </div>

    <a
      className="relative text-gray-800 hover:text-[#8A0404] flex items-center"
      onClick={handleCartClick}
    >
      {/* Cart Icon for Mobile */}
      <BsCart className="text-xl sm:text-2xl" /> {/* Smaller size for mobile */}

      {/* Cart Item Count Badge */}
      {cart.length > 0 && (
        <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-600 text-white rounded-full text-xs sm:text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
          {cart.length}
        </span>
      )}
    </a>
    <a onClick={checkUserEmail} className="text-gray-800 hover:text-gray-600">
      <FaUser className="text-xl sm:text-2xl"/>
    </a>
    <button onClick={() => setIsOpen(!isOpen)} type="button" className="text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600">
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  </div>
</div>

                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state. */}
            {isOpen && (
                <div className="md:hidden absolute z-10 w-full bg-white">
                   <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
    <Link to="/" className="text-gray-800 hover:text-[#8A0404] block px-3 py-2 rounded-md text-base font-medium">Home</Link>
    <Link to="/aboutus" className="text-gray-800 hover:text-[#8A0404] block px-3 py-2 rounded-md text-base font-medium">About Us</Link>
    <Link to="/ProductList" className="text-gray-800 hover:text-[#8A0404] block px-3 py-2 rounded-md text-base font-medium">Shop</Link>
    <Link to="/gifthamper" className="text-gray-800 hover:text-[#8A0404] block px-3 py-2 rounded-md text-base font-medium"> Gifting</Link>
    <Link to="/contactus" className="text-gray-800 hover:text-[#8A0404] block px-3 py-2 rounded-md text-base font-medium">Contact US</Link><br />
</div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
