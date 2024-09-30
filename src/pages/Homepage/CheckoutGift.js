import React, { useState,useEffect } from 'react';
import Navbar from '../../component/Navbar';
import { useLocation,Link } from 'react-router-dom';

import { useCart } from '../../CartContext'; // Adjust the path as necessary
import Swal from 'sweetalert2'; // Import SweetAlert
import SecureStorage from 'react-secure-storage';

const CheckoutPage = () => {
  const { cart } = useCart();
    const location = useLocation();
    const apiUrl = process.env.REACT_APP_API_URL;

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // const { userIdentifier } = location.state || {}; // Retrieve userEmail from navigation state

  useEffect(() => {
    const userIdentifier = SecureStorage.getItem('userIdentifier');

    if (userIdentifier) {
      if (userIdentifier.includes('@')) {
        // If the identifier contains '@', it's an email
        setEmail(userIdentifier);
      } else {
        // Otherwise, it's considered a phone number
        setPhone(userIdentifier);
      }
    }
  }, []);
  const [address, setAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    provience: '',
    postalCode: '', 
    country: 'India',
    address_type: 'Home',
  });
  const [paymentMethod, setPaymentMethod] = useState('online'); // COD for example
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const calculateTotal = () => {
    return cart.reduce((total, product) => {
      const price = parseFloat(product.price) || 0;
      return total + (price * product.quantity);
    }, 0);
  };

  // Form validation for email, phone, and address fields
  const validateForm = () => {
    if (!email || !phone || !address.addressLine1 || !address.city || !address.provience || !address.postalCode) {
      console.log("formdata",email,phone,address.addressLine1,address.city,address.provience,address.postalCode)
      setError('Please fill out all required fields');
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill out all required fields!',
      });
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    setError('');

    // Validate form before making the API call
    if (!validateForm()) return;

    // Construct the payload
    const payload = {
      email,
      phone,
      totalAmount: calculateTotal(),
      discount: 0, // Set discount as 0 for now
      paymentMethod,
      address,
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        size: item.size || 'N/A', // Default size to N/A if not present
        price: parseFloat(item.price),
        img:item.feature_img,
      })),
    };

    try {
      const response = await fetch(`${apiUrl}orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error creating order. Please try again.');
      }

      const data = await response.json();

      // SweetAlert success notification
      Swal.fire({
        icon: 'success',
        title: 'Order Created',
        text: `Order created successfully! Order ID: ${data.orderId}`,
      });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      Swal.fire({
        icon: 'error',
        title: 'Order Error',
        text: err.message || 'Something went wrong. Please try again.',
      });
    }
  };
  

  console.log("Card",cart)
  return (
          <>
          <Navbar/>
    <div className="bg-gray-100 min-h-screen py-10 px-5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Left Section - Contact & Delivery */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-[#8A0404]">Contact</h2>
          <form className="space-y-4">
            <div>
            <input
        type="text"
        className="w-full p-3 border border-gray-300 rounded"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {/* Conditional message based on phone presence */}
      {phone ? (
        <p className="text-sm text-green-600 mt-2">Happy shopping!</p>
      ) : (
        <p className="text-sm text-gray-600 mt-2">
          We are using this number to create your account. You will use this number for login.
        </p>
      )}

      {/* <div className="flex items-center mt-2">
        <input type="checkbox" id="offers" className="mr-2" />
        <label htmlFor="offers" className="text-sm">Email me with news and offers</label>
      </div> */}
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-6 text-[#8A0404]">Delivery</h2>

            <div>
              <label className="block text-sm font-medium text-gray-600">Country/Region</label>
              <select className="w-full p-3 border border-gray-300 rounded">
                <option>India</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">First name</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded" placeholder="First name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Last name</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded" placeholder="Last name" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Address</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded" placeholder="Address" 
                                value={address.addressLine1}
                                onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Apartment, suite, etc. (optional)</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded" placeholder="Apartment, suite, etc." 
                 onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">City</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded" placeholder="City"
                                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                  />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">State</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded" placeholder="City"
                                  onChange={(e) => setAddress({ ...address, provience: e.target.value })}
                                  />
                {/* <select className="w-full p-3 border border-gray-300 rounded">
                  <option>Delhi</option>
                </select> */}

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">PIN code</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded" placeholder="PIN code"
                                                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}

                 />
              </div>
            </div>

            <div>
            
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input type="email" className="w-full p-3 border border-gray-300 rounded" placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}/>
             
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="text-offers" className="mr-2" />
              <label htmlFor="offers" className="text-sm">Email me with news and offers</label>

              </div>
              
             <div className="flex items-center space-x-2 mt-4">
              <input type="checkbox" id="save" className="mr-2" />
              <label htmlFor="save" className="text-sm">T&C Apply</label>
            </div> 
          </form>
        </div>

        {/* Right Section - Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-[#8A0404]">Order Summary</h2>
          {cart.map((product, index) => (
          <div  key={index}  className="flex justify-between items-center border-b pb-4">
          
            <div
           className="flex items-center space-x-4">
              <img src={product.feature_img} alt="product" className="w-20 h-20 object-cover rounded" />
              <div>
                <p>{product.title}</p>
                <p className="text-sm text-gray-600">Delivery Date: September 22, 2024</p>
              </div>
            </div>
          
            <p> ₹{(parseFloat(product.price) * product.quantity).toFixed(2)}
            </p>
          </div>
  ) )}
          <div className="flex justify-between items-center mt-4">
            <p>Delivery</p>
            <p className='text-[#8A0404]'>FREE</p>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600">Discount code</label>
            <div className="flex space-x-4 mt-2">
              <input type="text" className="w-full p-3 border border-orange-600 rounded " placeholder="Discount code" />
              <button className="hover:bg-orange-600 hover:text-white bg-white text-black py-2 px-8 rounded-full text-lg border border-orange-600 transition duration-300">Apply</button>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center">
              <p>Subtotal ({cart.length} ITEMS)</p>
              <p>₹{calculateTotal().toFixed(2)}</p>
            </div>
            <p className="mt-2 text-gray-600">Enter shipping address</p>
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center font-bold text-lg">
              <p className='text-[#8A0404]'>Total</p>
              <p>INR  ₹{calculateTotal().toFixed(2)}</p>
            </div>
          </div>
          <button
                type="button"
                onClick={handleCheckout}
                className="w-full bg-orange-600 text-white p-3 rounded mt-4"
              >
                Place Order
              </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default CheckoutPage;
