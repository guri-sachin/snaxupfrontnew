import React, { useState } from 'react';
import Navbar from '../../component/Navbar';
import { useCart } from '../../CartContext'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Swal from 'sweetalert2'; // Make sure to install and import SweetAlert
import Footer from '../../component/Footer';


const ShoppingCartItem = () => {
  const { cart, removeFromCart } = useCart();



  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate(); 
  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
 // Initialize navigation

  // Function to handle click event to navigate to the Cart page
  const handleCartClick = () => {
    navigate('/');
  };
console.log("b",cart)
  const calculateTotal = () => {
    return cart.reduce((total, product) => {
      console.log(product)
        const price = parseFloat(product.price) || 0; // Remove commas and convert to float
        return total + (price * product.quantity);
    }, 0);
};

const handleBuynow = () => {
  if (cart.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Cart is Empty',
      text: 'Please add some items to your cart before proceeding to checkout.',
    });
  } else {
    navigate('/Checkouts'); // Navigate to the Checkout page
  }
};

const handleShare = (product) => {
  const { product_name, product_url } = product; // Assuming product object contains these details
  
  if (navigator.share) {
    // Use the Web Share API if supported
    navigator.share({
      title: `Check out this product: ${product_name}`,
      text: `I found this amazing product: ${product_name}. You can check it out here!`,
      url: product_url,  // The product URL to share
    })
    .then(() => {
      console.log('Product shared successfully!');
    })
    .catch((error) => {
      console.error('Error sharing the product:', error);
    });
  } else {
    // Fallback if Web Share API is not supported (could copy the link to clipboard, show a modal, etc.)
    alert('Share not supported on this device. Please copy the URL manually.');
  }
};


  // Function to handle click event to navigate to the Cart page
  const handelHome = () => {
    navigate('/productlist');
  };
  return (
    <>
      <Navbar />
      {/* <ul>
        {cart.map((item, index) => (
          <li key={index} className="flex justify-between items-center mb-4">
            <div>
              {item.name} - {item.size} - Quantity: {item.quantity} {item.price} {item.title} {item.id} {item.sku}
            </div>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => removeFromCart(index)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul> */}
  <div className="container mx-auto px-8 lg:flex lg:space-x-6 mt-10">
  {/* Main Content Area */}
  <div className="w-full lg:w-3/4 mb-6 lg:mb-0 lg:mt-6">
    {/* Header */}
    <div className="flex justify-between items-center border-b pb-2 mb-4">
      <h2 className="text-lg font-semibold text-red-700">SHOPPING CART</h2>
      <p className="text-lg font-semibold text-red-700">TOTAL ({cart.length} ITEMS): ₹{calculateTotal().toFixed(2)}</p>
    </div>

    {/* Main Content */}
    <div className="flex flex-col space-y-6 lg:space-y-6">
      {cart.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          The cart is empty.
        </div>
      ) : (
        cart.map((product, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center md:items-start border p-4 rounded-md shadow-sm mb-6"
          >
            {/* Product Image */}
            <div className="w-24 mb-4 md:mb-0 flex justify-center">
              <img
                src={product.feature_img}
                alt={product.title}
                className="rounded-md border"
              />
            </div>

            {/* Product Info and Price */}
            <div className="flex-grow flex flex-col md:flex-row items-center md:items-start justify-between md:ml-4">
              {/* Product Info */}
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <div className="mt-2 flex justify-center md:justify-start items-center">
                <span className="text-gray-700 font-semibold mr-4">{product.size}</span>
                  <span className="text-gray-700 font-semibold mr-4">QUANTITY:</span>
                  <div className="flex items-center">
                    {/* <button
                      onClick={() => handleDecrease(index)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded-l-md focus:outline-none"
                    >
                      -
                    </button> */}
                    <input
                      type="text"
                      value={product.quantity}
                      readOnly
                      className="px-3 py-1 w-12 h-8 text-center border border-gray-300"
                    />
                    {/* <button
                      onClick={() => handleIncrease(index)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded-r-md focus:outline-none"
                    >
                      +
                    </button> */}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap justify-center md:justify-start space-x-4 text-sm text-gray-600">
                  <button
                    className="hover:underline"
                    onClick={() => removeFromCart(index)}
                  >
                    REMOVE
                  </button>
                  <span>|</span>
                  <button className="hover:underline">SAVE FOR LATER</button>
                  <span>|</span>
                  <button className="hover:underline" onClick={handelHome}>SEE MORE LIKE THIS</button>
                  <span>|</span>
                  <button className="hover:underline "   onClick={() => handleShare(product)}
                  >SHARE</button>
                </div>
              </div>

              {/* Price */}
              <div className="text-xl font-semibold text-red-700 mt-4 md:mt-0 md:ml-6 text-center md:text-right">
                ₹{(parseFloat(product.price) * product.quantity).toFixed(2)}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>

  {/* Calculation Area */}
  <div className="w-full lg:w-1/4 lg:mx-10 mt-6 lg:mt-0">
    {/* Summary Section */}
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Total and Price */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-gray-700">Total</span>
        <span className="text-xl font-bold text-gray-900">Rs. {calculateTotal().toFixed(2)}</span>
      </div>

      {/* Savings */}
      <div className="mb-4">
        <p className="text-gray-500 text-sm">Tax included. Discounts can be applied at checkout</p>
      </div>

      {/* Checkout Button */}
      <div className="mb-6">
        <button className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500" onClick={handleBuynow}>
          CHECKOUT
        </button>
      </div>

      {/* Additional Info */}
      <p className="text-gray-700 text-sm mb-4">
        Make sure to review your order before proceeding. You can add or remove items in the cart.
      </p>

      {/* Continue Shopping Button */}
      <button className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300" onClick={handleCartClick} >
        CONTINUE SHOPPING
      </button>
    </div>
  </div>
</div>

    </>
  );
};

export default ShoppingCartItem;
