import React, { useState,useEffect } from 'react';
import Navbar from '../../component/Navbar';
import { useLocation,Link } from 'react-router-dom';

import { useCart } from '../../CartContext'; // Adjust the path as necessary
import Swal from 'sweetalert2'; // Import SweetAlert
import SecureStorage from 'react-secure-storage';

const CheckoutPage = () => {
  const { cart } = useCart();
  const apiUrl = process.env.REACT_APP_API_URL;

    const location = useLocation();
    // New loading state
    const [loading, setLoading] = useState(false);

  
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
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [discount, setDiscount] = useState(0);

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

  // const handleCheckout = async () => {
  //   setError('');
    
  //   // Show loader when form is submitted
  //   if (!validateForm()) return;
  //   setLoading(true);
  
  //   // Construct the payload
  //   const payload = {
  //     email,
  //     phone,
  //     totalAmount: calculateTotal(),
  //     discount: discount, // Set discount as 0 for now
  //     paymentMethod,
  //     address,
  //     afterdiscount: discountedPrice,
  //     items: cart.map(item => ({
  //       productId: item.id,
  //       quantity: item.quantity,
  //       size: item.size || 'N/A', // Default size to N/A if not present
  //       price: parseFloat(item.price),
  //       img: item.feature_img,
  //       title: item.product_short,
  //     })),
  //   };

  //   try {
  //     console.log('Payload being sent for order creation:', payload);
      
  //     // Step 1: Create order
  //     const orderResponse = await fetch(`${apiUrl}orders`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(payload),
  //     });
  
  //     if (!orderResponse.ok) {
  //       const errorDetails = await orderResponse.text();
  //       throw new Error(`Error creating order: ${errorDetails}`);
  //     }
  
  //     const orderData = await orderResponse.json();
  //     console.log('Order created successfully:', orderData);
  
  //     // Step 2: Initiate payment
  //     const paymentPayload = {
  //       amount: calculateTotal(),
  //       order_id: orderData.orderId, // Assuming the response contains orderId
  //       redirect_url: 'https://33e0-43-255-166-218.ngrok-free.app/payment-success',
  //       cancel_url: 'https://33e0-43-255-166-218.ngrok-free.app/payment-cancel',
  //     };
  
  //     console.log('Payment payload:', paymentPayload);

  //     const paymentResponse = await fetch(`${apiUrl}payment`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(paymentPayload),
  //     });
  
  //     if (!paymentResponse.ok) {
  //       const errorDetails = await paymentResponse.text();
  //       throw new Error(`Error initiating payment: ${errorDetails}`);
  //     }
  
  //     const paymentData = await paymentResponse.json();
  //     console.log('Payment initiation successful:', paymentData);
  
  //     // Check if encrypted data and access code are valid
  //     if (!paymentData.encryptedData || !paymentData.accessCode) {
  //       throw new Error('Missing encrypted data or access code');
  //     }
  
  //     // Step 3: Redirect to CCAvenue payment page
  //     const paymentUrl = `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${paymentData.encryptedData}&access_code=${paymentData.accessCode}`;
  //     console.log('Redirecting to payment URL:', paymentUrl);
      
  //     window.location.href = paymentUrl;
  
  //   } catch (err) {
  //     console.error('Error during checkout:', err.message);
  
  //     // Show error message to the user
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Checkout Error',
  //       text: err.message || 'Something went wrong. Please try again.',
  //     });
  
  //     setError(err.message || 'Something went wrong. Please try again.');
  //   } finally {
  //     setLoading(false);  // Hide loader once form submission is complete
  //   }
  // };
  
 // Safeguard against null or undefined productData
//  if (!productData) {
//   return <p>No product data available</p>;
// }

// // If productData is an array, map over it directly
  
const handleCheckout = async () => {
  setError('');

  if (!validateForm()) return;
  setLoading(true);

  const payload = {
    email,
    phone,
    totalAmount: calculateTotal(),
    discount: discount,
    paymentMethod,
    address,
    afterdiscount: discountedPrice,
    items: cart.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      size: item.size || 'N/A',
      price: parseFloat(item.price),
      img: item.feature_img,
      title: item.product_short,
    })),
  };

  try {
    console.log('Payload being sent for order creation:', payload);

    // Step 1: Create order
    const orderResponse = await fetch(`${apiUrl}orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!orderResponse.ok) {
      const errorDetails = await orderResponse.text();
      throw new Error(`Error creating order: ${errorDetails}`);
    }

    const orderData = await orderResponse.json();
    console.log('Order created successfully:', orderData);

    // Step 2: Initiate payment
    const paymentPayload = {
      amount: calculateTotal(),
      order_id: orderData.orderId,
      redirect_url: 'https://your-success-url',
      cancel_url: 'https://your-cancel-url',
    };

    const paymentResponse = await fetch(`${apiUrl}payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentPayload),
    });

    if (!paymentResponse.ok) {
      const errorDetails = await paymentResponse.text();
      throw new Error(`Error initiating payment: ${errorDetails}`);
    }

    const paymentData = await paymentResponse.json();
    if (!paymentData.encryptedData || !paymentData.accessCode) {
      throw new Error('Missing encrypted data or access code');
    }

    // Step 3: Redirect to CCAvenue payment page
    const paymentUrl = `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${paymentData.encryptedData}&access_code=${paymentData.accessCode}`;
    console.log('Redirecting to payment URL:', paymentUrl);
    window.location.href = paymentUrl;

  } catch (err) {
    console.error('Error during checkout:', err.message);

    Swal.fire({
      icon: 'error',
      title: 'Checkout Error',
      text: err.message || 'Something went wrong. Please try again.',
    });

    setError(err.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
  handlePaymentSuccess()
};

// Payment Success Handler
const handlePaymentSuccess = async (orderData) => {
  try {
    // Shiprocket order data
    const shiprocketPayload = {
      order_id: orderData.orderId,
      order_date: new Date().toISOString(),
      pickup_location: 'Primary Location',
      billing_customer_name: orderData.billing_customer_name,
      billing_last_name: orderData.billing_last_name,
      billing_address: orderData.billing_address,
      billing_city: orderData.billing_city,
      billing_pincode: orderData.billing_pincode,
      billing_state: orderData.billing_state,
      billing_country: orderData.billing_country,
      billing_email: orderData.billing_email,
      billing_phone: orderData.billing_phone,
      shipping_is_billing: true,
      order_items: cart.map(item => ({
        name: item.title,
        sku: item.productId,
        units: item.quantity,
        selling_price: item.price,
        length: 10, // Assuming values
        breadth: 10,
        height: 10,
        weight: 1,
      })),
      payment_method: 'Prepaid',
      sub_total: calculateTotal(),
      length: 10,
      breadth: 10,
      height: 10,
      weight: 1,
    };

    console.log('Shiprocket Payload:', shiprocketPayload);

    const shiprocketResponse = await fetch(`${apiUrl}shiprocket/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shiprocketPayload),
    });

    if (!shiprocketResponse.ok) {
      const errorDetails = await shiprocketResponse.text();
      throw new Error(`Error creating Shiprocket order: ${errorDetails}`);
    }

    const shiprocketData = await shiprocketResponse.json();
    console.log('Shiprocket order created successfully:', shiprocketData);

  } catch (err) {
    console.error('Error during Shiprocket order creation:', err.message);
    Swal.fire({
      icon: 'error',
      title: 'Shiprocket Error',
      text: err.message || 'Failed to create shipping order. Please try again.',
    });
  }
};

  const [couponCode, setCouponCode] = useState(''); // Store the coupon code entered by the user
  const handleApplyCoupon = async () => {
    try {
      const orderAmount = calculateTotal();
      const response = await fetch(`${apiUrl}validate-coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode,
          category: "any",
          orderAmount: orderAmount,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setDiscount(data.discount);
        const discountPercentage = data.discount;
        const discountAmount = (orderAmount * parseFloat(discountPercentage)) / 100;
        setDiscountedPrice(orderAmount - discountAmount);
  
        Swal.fire({
          title: 'Coupon Applied!',
          text: `You get a ${discountPercentage}% discount. Your final amount is ${discountedPrice.toFixed(2)}.`,
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: data.error || 'An unknown error occurred.',
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'An error occurred!',
        text: 'An error occurred while applying the coupon. Please try again later.',
        icon: 'error',
      });
    }

  };
  

   // Initial total amount (without coupon)
   const initialTotal = calculateTotal();


  return (
          <>
          <Navbar/>
          {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <img src="../../img/home/loader.gif" alt="Loading..." className="w-32 h-32" />
        </div>
      )}
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
    

    {/* actual card */}
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

          <div>
  {cart.length > 0 ? (
    
    <>
    
    <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600">Discount code</label>
            <div className="flex space-x-4 mt-2">
              <input type="text"    value={couponCode}                       // Bind the input value to the state
          onChange={(e) => setCouponCode(e.target.value)}  className="w-full p-3 border border-orange-600 rounded " placeholder="Discount code" />
              <button onClick={handleApplyCoupon} className="hover:bg-orange-600 hover:text-white bg-white text-black py-2 px-8 rounded-full text-lg border border-orange-600 transition duration-300">Apply</button>
            </div>
          </div>
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center">
          <p>Subtotal ({cart.length} ITEMS)</p>
          <p>₹{calculateTotal().toFixed(2)}</p>
        </div>
        {discount ? (
  <p className="text-green-600 font-semibold">You saved Rs. {discount}!</p>
) : null}      </div>

      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center font-bold text-lg">
          <p className='text-[#8A0404]'>Total</p>
          <p>
         
            INR ₹ {discountedPrice > 0 ? discountedPrice.toFixed(2) : initialTotal.toFixed(2)}



          </p>
        </div>
      </div>
    </>
  ) : (
    <div className="mt-6 border-t pt-4 text-center">


    </div>
  )}
</div>

       
<button
  type="button"
  onClick={handleCheckout}
  className="w-full bg-orange-600 text-white p-3 rounded mt-4"
  disabled={(!discountedPrice && !initialTotal) || (discountedPrice <= 0 && initialTotal <= 0) || loading}
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
