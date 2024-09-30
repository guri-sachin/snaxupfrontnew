import React, { useEffect, useState } from 'react';
import Navbar from '../../component/Navbar';
import { useLocation,Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert
import SecureStorage from 'react-secure-storage';


const MyOrders = () => {
  const location = useLocation();
  const { userIdentifier } = location.state || {}; // Retrieve userEmail from navigation state
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const userId = sessionStorage.getItem('userId'); // Get the user ID from session storage
  const apiUrl = process.env.REACT_APP_API_URL;




  const [activeItem, setActiveItem] = useState('My account'); // Default active item

  const handleItemClick = (item) => {
    setActiveItem(item); // Update active item on click
  };

  const handleLogoutClick = () => {
    SecureStorage.removeItem('userIdentifier');

 // Show SweetAlert notification
 Swal.fire({
  title: 'You have been logged out',
  text: 'Click OK to return to the home page.',
  icon: 'info',
  confirmButtonText: 'OK',
}).then((result) => {
  if (result.isConfirmed) {
    // Redirect to the home page after clicking OK
    navigate('/');
  }
});
    console.log('Logout link clicked');
    // Add any other logout-related logic here
  };
  
  const handleLoginClick = () => {
    navigate('/');

    console.log('Login link clicked');
    // Add any other login-related logic here
  };

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${apiUrl}orders/user/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setOrders(data);
        } 
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Could not fetch your orders. Please try again later.',
        });
      }
    };
  
    fetchOrders();
  }, []);


  console.log("Sf",orders)
  
  return (
    <>
      <Navbar/>
      <div className="container mx-auto p-4 px-8 lg:flex lg:space-x-6 mt-10">
     {/* Sidebar Menu */}
     <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-300 w-full lg:w-1/4">
        <ul>
          <li
            className={` py-2 cursor-pointer ${
              activeItem === 'My account' ? 'font-bold text-black' : 'text-gray-600'
            }`}
            onClick={() => handleItemClick('My account')}
          >
            My account
          </li>
          <li
            className={`text-lg font-semibold py-2 cursor-pointer ${
              activeItem === 'My orders' ? 'font-bold text-black' : 'text-gray-600'
            }`}
            onClick={() => handleItemClick('My orders')}
          >
            My orders
          </li>
          <li
            className={`py-2 cursor-pointer ${
              activeItem === 'My addresses' ? 'font-bold text-black' : 'text-gray-600'
            }`}
            onClick={() => handleItemClick('My addresses')}
          >
            My Offers
          </li>
          <li
            className={`py-2 cursor-pointer ${
              activeItem === 'Logout' ? 'font-bold text-black' : 'text-gray-600'
            }`}
            onClick={() => handleItemClick('Logout')}
          >
            Logout
          </li>
        </ul>
      </div>

      {/* Content Section */}
      <div className="w-full lg:w-3/4 p-5">
        <div className="bg-white shadow-lg rounded-lg p-10 flex flex-col items-center justify-center border border-gray-300">
          {activeItem === 'My orders' && (
            <div className="text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3382/3382792.png"
                alt="No Orders"
                className="w-20 mx-auto"
              />
                <div>
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.length > 0 ? (
        orders.map((order, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4 shadow">
<div className="bg-white shadow-lg rounded-lg p-6 mt-4 w-full max-w-2xl mx-auto">
  <h2 className="text-xl font-bold mb-4 text-center">Order ID: {order.orderId}</h2>
  <div className="mt-6 text-ledt">{order.orderStatus}
    </div>
  <div className="border-t border-gray-200 pt-4">
    <ul>
      {order.items.split(',').map((item, idx) => {
        const [productId, quantity, size, price, img, title] = item.split(';');
        return (
          <li key={idx} className="flex items-center justify-between space-x-4 py-4 border-b border-gray-100">
            <img src={img} alt={title} className="w-20 h-20 object-cover rounded-md shadow" />
            <div className="flex-1">
              <p className="font-semibold text-lg">{title}</p>
              <p className="text-gray-500">
                <strong>Quantity:</strong> {quantity} | 
                <strong> Size:</strong> {size} | 
                <strong> Price:</strong> ₹{price}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
    
    <div className="mt-6 text-right">
    {order.afterdiscount != 0 && order.afterdiscount !== undefined ? (
  <>
    <p className="text-xl font-bold">Payable Amount: {order.afterdiscount}</p>
    <p className="text-xl font-bold">Total Amount: {order.totalAmount}</p>
  </>
) : (
  <p className="text-xl font-bold">Total Amount: {order.totalAmount}</p>
)}
    </div>
    
    <div className="mt-4">
      <h4 className="text-md font-semibold">Shipping Address:</h4>
      <p className="text-gray-600">{`${order.addressLine1}, ${order.city}, ${order.provience}, ${order.postalCode}, ${order.country}`}</p>
    </div>
  </div>
</div>

        
          </div>
        ))
      ) : (
        <div className="text-center">
        <h2 className="text-xl font-semibold mt-4">No orders yet</h2>
        <button  onClick={handleLoginClick} className="mt-6 bg-orange-600 text-white py-2 px-6 hover:bg-white hover:text-black border border-orange-600 transition duration-300">
          Make your first order
        </button>
      </div>
          )}
    </div>
         
            </div>
          )}
          {activeItem === 'My account' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold">Welcome to your account</h2>
              <p className="mt-4">   {userIdentifier ? (
        <p>Welcome, {userIdentifier}. Here are your orders:</p>
      ) : (
        <p>No user email found. Please log in.</p>
      )}.</p>
            </div>
          )}
          {activeItem === 'My addresses' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold">Your Offers</h2>
              <p className="mt-4">You have no any Offers yet.</p>
              <button  onClick={handleLoginClick} className="mt-6 bg-orange-600 text-white py-2 px-6 hover:bg-white hover:text-black border border-orange-600 transition duration-300">
               Shop Now and Get Exciting Offers
              </button>
            </div>
          )}
          {activeItem === 'Logout' && (
            <div className="text-center">
             <h2 className="text-xl font-semibold">
  You have been logged out by{' '}
  <Link 
    className="text-orange-600 hover:underline"
    onClick={handleLogoutClick}
  >
    Click Here
  </Link>
</h2>
<p className="mt-4">
  Please log in to access your account.{' '}
  <Link 
    className="text-orange-600 hover:underline"
    onClick={handleLoginClick}
  >
    Click Here
  </Link>
</p>
            </div>
          )}

          
        </div>
      </div>

      </div>
    </>
  );
};

export default MyOrders;
