import React, {useRef, useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TrendingProductsSlider = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const sliderRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pricez, setPricesz] = useState('');
  const [error, setError] = useState(''); 
  const navigate = useNavigate();


  useEffect(() => {
    // Function to fetch products
    const fetchProducts = async () => {
      setLoading(true); // Start loading
      setError(''); // Reset error message

      try {
        // Make the API call
        const response = await axios.get(`${apiUrl}products`); // Adjust the URL if necessary
        setProducts(response.data); // Set the products data from API response
      } catch (err) {
        // If there is an error, set the error message
        if (err.response) {
          // Server responded with a status other than 200 range
          setError(`Error: ${err.response.data.error || 'Something went wrong'}`);
        } else if (err.request) {
          // Request was made, but no response was received
          setError('Error: No response from the server');
        } else {
          // Something happened while setting up the request
          setError('Error: Failed to make the request');
        }
      } finally {
        setLoading(false); // Stop loading after request is done
      }
    };

    // Call the function to fetch products
    fetchProducts();
  }, []);


console.log("s",products)

 
  const handleProductClick = (product) => {
    // Save the product details in localStorage
    localStorage.setItem('id',  product.product_id);

    navigate("/product", { state: { product, id: product.product_id } });

    // Navigate to the product details page (without showing the ID in the URL)
    // navigate('/product');
  };


  // Function to scroll left
  const scrollLeft = () => {
    sliderRef.current.scrollBy({
      left: -300, // Adjust the scroll speed
      behavior: "smooth", // Enable smooth scrolling
    });
  };

  // Function to scroll right
  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: 300, // Adjust the scroll speed
      behavior: "smooth", // Enable smooth scrolling
    });
  };

  return (
    <div className="container mx-auto py-8 relative">
      <h2 className="text-center text-2xl font-bold text-[#8A0404] mb-6">TRENDING PRODUCTS</h2>
      <div className="flex justify-between items-center border-b pb-2 mb-4 mt-4 max-w-5xl mx-auto ">
      </div>
      {/* Left Button */}
      {/* <button 
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-full z-10">
        &#8249;
      </button> */}

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex space-x-4 overflow-x-scroll scroll-smooth scrollbar-hide"
      >
        {products.map((product) => (
          <div
            key={product.id} onClick={() => handleProductClick(product)}
            className="flex-none w-64 bg-white rounded-lg  p-4 text-center"
          >
            <img
              src={product.
                product_feature_img}
              alt={product.name}
              className="mx-auto w-full h-48 object-contain mb-4"
            />
            <h3 className="font-semibold">{product.product_short
            }</h3>
            <p className="text-red-600 font-bold">₹{product.actualp_price ? product.actualp_price.split(',')[0] : 'N/A'} 
          </p>
          </div>
        ))}
      </div>

      {/* Right Button */}
      {/* <button 
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-full z-10">
        &#8250;
      </button> */}
    </div>
  );
};

export default TrendingProductsSlider;
