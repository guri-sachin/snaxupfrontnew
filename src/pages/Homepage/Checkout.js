import React, { useState,useEffect } from 'react';
import Navbar from '../../component/Navbar';
import { useLocation,Link } from 'react-router-dom';

import { useCart } from '../../CartContext'; // Adjust the path as necessary
import Swal from 'sweetalert2'; // Import SweetAlert
import SecureStorage from 'react-secure-storage';


const CheckoutPage = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(false);

  const { cart } = useCart();
    const location = useLocation();
    const productData = location.state;  // Access the product data from the state
  
    console.log(productData.totalAmount);  // This will show the product data passed from the previous page
    const [total, setTotalamount] = useState(productData.totalAmount);

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

  //   // Validate form before making the API call
  //   if (!validateForm()) return;

  //   // Construct the payload
  //   const payload = {
  //     email,
  //     phone,
  //     totalAmount: total,
  //     discount: 0, // Set discount as 0 for now
  //     paymentMethod,
  //     address,
  //     afterdiscount:0,
  //     items: finalItems.map(item => ({
  //       productId: item.productId,
  //       quantity: item.quantity,
  //       size: item.size || 'N/A', // Default size to N/A if not present
  //       price: item.price,
  //       img:item.img,
  //     })),
  //   };

  //   try {
  //     const response = await fetch(`${apiUrl}orders`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Error creating order. Please try again.');
  //     }

  //     const data = await response.json();

  //     // SweetAlert success notification
  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Order Created',
  //       text: `Order created successfully! Order ID: ${data.orderId}`,
  //     });
  //   } catch (err) {
  //     setError(err.message || 'Something went wrong. Please try again.');
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Order Error',
  //       text: err.message || 'Something went wrong. Please try again.',
  //     });
  //   }
  // };
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
      items: finalItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              size: item.size || 'N/A', // Default size to N/A if not present
              price: item.price,
              img:item.img,
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
    // handlePaymentSuccess()
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


 // Safeguard against null or undefined productData
//  if (!productData) {
//   return <p>No product data available</p>;
// }

// // If productData is an array, map over it directly
const productArray = Array.isArray(productData) 
  ? productData 
  : (productData && typeof productData === 'object' ? Object.values(productData) : []);

  const [couponCode, setCouponCode] = useState(''); // Store the coupon code entered by the user

  const handleApplyCoupon = async () => {
    try {
      const orderAmount = calculateTotal(); // Get the total amount before applying coupon
      const response = await fetch(`${apiUrl}validate-coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode,
          categore: "any",
          orderAmount: orderAmount,
        }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        setDiscount(data.discount)
        const discountPercentage = data.discount;
        const discountAmount = (orderAmount * parseFloat(discountPercentage)) / 100; // Calculate discount amount
        setDiscountedPrice(orderAmount - discountAmount) // Calculate final amount after discount
  
        alert(`Coupon Applied! You get a ${discountPercentage} discount. Your final amount is ${discountedPrice.toFixed(2)}.`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while applying the coupon.');
    }
  };

   // Initial total amount (without coupon)
   const initialTotal = calculateTotal();


   
// 1. Extract the numeric-keyed items
const itemsArray = Object.keys(productData)
  .filter(key => !isNaN(key))  // Keep only numeric keys
  .map(key => productData[key]);  // Extract the corresponding product data

// 2. Extract non-numeric product data (assuming only the extra product-related data is required)
const additionalProductData = {
  productId: productData.product_id,
  quantity: 1,  // You can set default quantity or use an actual value if available
  size: 'N/A',  // Default size or use a real size if available
  price: parseFloat(productData.priceBox),  // Using priceBox as the price
  img: productData.img,  // Using img from the direct data
};

// 3. Merge the numeric-keyed items and the additional product data into a single array
const combinedArray = [...itemsArray, additionalProductData];

// 4. Process the array if needed (e.g., formatting the data, etc.)
const finalItems = combinedArray.map(item => {
  const sizes = item.actualp_piece ? item.actualp_piece.split(',') : ['N/A'];
  const prices = item.gifts_price  ? item.gifts_price.split(',') : ['N/A'];
  const featureImg = item.product_feature_img || item.img;  // Feature image or img

  return {
    productId: item.product_id || item.productId,
    quantity: item.quantity || 1,
    size: item.product_size || sizes[0] || 'N/A',
    price: parseFloat(item.priceBox || item.price || prices[0]),
    img: featureImg || '',
  };
});

console.log(finalItems);

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
          <div>
          {productArray && productArray.length > 0 ? (
  productArray.map((product, index) => {
    // If product is not an object, skip rendering
    if (typeof product !== 'object') {
      return null;
    }

    // Extract values safely from the product object
    const img = product.product_feature_img
    || product.img;
    const title = product.product_title || product.title;
    const price = product.gifts_price || product.price;
    const size = product.quantity || product.quantity;


    // Render the card only if key fields exist
    if (!img && !title && !price) {
      return null;
    }


    
    return (
      <div key={index} className="flex justify-between items-center border-b pb-4">
        <div className="flex items-center space-x-4">
          {img && <img src={img} alt="product" className="w-20 h-20 object-cover rounded" />}
          <div>
            {title && <p> {title}</p>}
                        {size && <p> QUANTITY:{size}</p>}

            <p className="text-sm text-gray-600"></p>
          </div>
        </div>

        {price && <p>₹{(parseFloat(price) * (product.quantity || 1)).toFixed(2)}</p>}
      </div>
    );
  })
) : null}

    </div>

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

<div
           className="flex items-center space-x-4">
                  {productData?.img && <img src={productData.img} alt={productData.product_title} className="w-20 h-20 object-cover rounded"  />}


              <div>
                <p>      {productData?.priceBox && <p>Price: {productData.priceBox}</p>}
                </p>
              </div>
            </div>
          <div className="flex justify-between items-center mt-4">
            <p>Delivery</p>
            <p className='text-[#8A0404]'>FREE</p>
          </div>

          <div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600">Discount code</label>
            <div className="flex space-x-4 mt-2">
              <input type="text"    value={couponCode}                       // Bind the input value to the state
          onChange={(e) => setCouponCode(e.target.value)}  className="w-full p-3 border border-orange-600 rounded " placeholder="Discount code" />
              <button onClick={handleApplyCoupon} className="hover:bg-orange-600 hover:text-white bg-white text-black py-2 px-8 rounded-full text-lg border border-orange-600 transition duration-300">Apply</button>
            </div>
          </div>
  {cart.length > 0 ? (
    
    <>
    
    
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
            INR ₹ 

  {discountedPrice > 0 ? discountedPrice.toFixed(2) : initialTotal.toFixed(2)}


            {/* {calculateTotal().toFixed(2)}{' '} */}
            {/* {productData?.totalAmount && <span>INR: {productData.totalAmount}</span>} */}
          </p>
        </div>
      </div>
    </>
  ) : (
    <div className="mt-6 border-t pt-4 text-center">
      
<div>
          <div className="mt-6 border-t pt-4">
            {/* <div className="flex justify-between items-center">
              <p>Subtotal ({cart.length} ITEMS)</p>
              <p>₹{calculateTotal().toFixed(2)}</p>
            </div> */}
            <p className="mt-2 text-gray-600">Enter shipping address</p>
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center font-bold text-lg">
              <p className='text-[#8A0404]'>Total</p>
           
              <p> {productData?.totalAmount && <p>INR: {productData.totalAmount}</p>}</p>
            </div>
          </div>
          </div>

    </div>
  )}
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
