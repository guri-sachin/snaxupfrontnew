import React, { useState,useEffect } from 'react';
import Footer from '../../component/Footer';
import Navbar from '../../component/Navbar'
import axios from 'axios';
import { useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import { useCart } from '../../CartContext'; 
import { useNavigate } from 'react-router-dom';
import SecureStorage from 'react-secure-storage';

const ProductGrid = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const { clearCart } = useCart(); // Get the clearCart function from the context
  const navigate = useNavigate();

  const [box, setBox] = useState([]);
  const [titlebox, setTitleBox] = useState();
  const [space, setSpace] = useState();
  const [priceBox, setPriceBox] = useState(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState('');
  const [error, setError] = useState(''); 
  const [product_id, setProduct_id] = useState('');
  const [sizes, setSizes] = useState([]);
  const [size, setSize] = useState(sizes[0]); 

  const [selectedButton, setSelectedButton] = useState(0);

  const location = useLocation();

  const [id, setId] = useState(location.state?.id || SecureStorage.getItem('id') || null);
  // Automatically select the first size and price on initial render

// Render loading state, error state, or product data

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


        console.log("fssf",box)

useEffect(() => {
  const fetchProperty = async () => {
    try {
      const response = await axios.get(`${apiUrl}gifts_box/${id}`);
      const fetchedProperty = response.data;
      setBox(fetchedProperty);
      setTitleBox(fetchedProperty.title);
      setSpace(fetchedProperty.space);
      setPriceBox(fetchedProperty.box_price);
setImg(fetchedProperty.img);
setProduct_id(fetchedProperty.id);


    } catch (error) {
      console.error("Error fetching property data:", error);
    }
  };
  fetchProperty();

}, [ ]);



      


      const handleButtonClick = (buttonIndex,label) => {
          setSelectedButton(buttonIndex);
          setSize(label)
          // setPriceBox(prices[buttonIndex]);
      
        };


        

      

  const boxPrice = 500; // Dynamic additional box price
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Function to handle click event on left side product
  const handleAddToRight = (product) => {
    const totalItems = selectedProducts.reduce((acc, item) => acc + item.quantity, 0);
    if (totalItems >= space) {
          Swal.fire({
            icon: 'error',
            title: 'Limit Exceeded',
            text: `You can add a maximum of ${space} items.`,
            confirmButtonText: 'OK',
            confirmButtonColor: '#8A0404' // Optional: Customize button color
          });
          return;
        }
    const existingProduct = selectedProducts.find((p) => p.product_id === product.product_id);
    if (existingProduct) {
      const updatedProducts = selectedProducts.map((p) =>
        p.product_id === product.product_id ? { ...p, quantity: p.quantity + 1 } : p
      );
      setSelectedProducts(updatedProducts);
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  // Function to handle click event on right side product to remove it
  const handleRemoveFromRight = (id) => {
    const updatedProducts = selectedProducts
      .map((product) => (product.product_id === id ? { ...product, quantity: product.quantity - 1 } : product))
      .filter((product) => product.quantity > 0);

    setSelectedProducts(updatedProducts);
  };

  // Calculate the total price of the selected products
  const totalPrice = selectedProducts.reduce((acc, product) => acc + product.gifts_price.split(',')[0] * product.quantity, 0);
  // Convert totalPrice to a number and then add
  const combinedPrice = `${parseInt(priceBox) +  totalPrice}`;

  const [selectedSizes, setSelectedSizes] = useState({});

  // Filter products based on selected category
  const filteredProducts =
  selectedCategory === 'All Categories'
    ? products
    : products.filter((product) => product.product_categores     === selectedCategory);

    const handleBuynow = () => {
    
      // Construct the product data
      const productData = {
        ...selectedProducts,   // Spread the selected product details
        priceBox: priceBox,    // Add additional properties
        product_id: product_id,
        img: img,
        space: space,
        totalAmount:combinedPrice
      };
    
      // Pass the productData to the checkout page using state
      navigate('/checkout', { state: productData });
   // Call clearCart to empty the cart after navigating to the checkout page
  clearCart();
    };

  return (
          <>
          <Navbar/>
    <div className="container mx-auto p-6 px-[50px]">
      <div className="flex">
    
        {/* Left Section: 65% */}
        <div className="w-full md:w-2/3">
          {/* Dropdown to select category */}
          <div  className="mb-2 mt-6">
          <h1 className='text-[#8A0404]'>{titlebox} | Add Max {space} Items  | {priceBox} Only
          </h1>
          <p className='text-gray-500'>Click on Any item in left side you wanted to add in your gift box</p>
          </div>
          <div className="mb-6 mt-6">
          <select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="w-full border rounded-md border-gray-300 p-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
>
  <option value="All Categories" className="text-gray-600">All Categories</option>
  <option value="Cookies">Cookies</option>
  <option value="Beverages">Beverages</option>
  <option value="Instant Premix">Instant Premix</option>  {/* Removed extra < */}
  <option value="Masala & Seasoning">Masala & Seasoning</option>
  <option value="Natural Green Tea">Natural Green Tea</option>
  <option value="Ready Snacks">Ready Snacks</option>
  <option value="Chocolate">Chocolate</option> {/* Ensure consistency with capital "C" */}
</select>
</div>


          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border p-4 rounded-lg shadow-lg text-center cursor-pointer hover:shadow-xl"
                onClick={() => handleAddToRight(product)}
              >
                <img
                  src={product.product_feature_img}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4"
                />
                <h3 className="text-md font-semibold">{product.product_short}</h3>
                <p className="text-gray-600">₹{product.gifts_price ? product.gifts_price.split(',')[0] : 'N/A'}</p>
                <p className="text-gray-600">{product.actualp_piece ? product.actualp_piece.split(',')[0] : 'N/A'}</p>

                 <div className="flex space-x-2 pl-6">
        {sizes.map((label, index) => (
        <button
          key={index}
          className={`px-4 py-2 rounded-full border border-gray-300 ${
            selectedButton === index ? 'bg-orange-600 text-white' : ''
          }`}
          onClick={() => handleButtonClick(index, label)}
          value={label}
        >
          {label}
        </button>
      ))}
        </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: 35% */}
        <div className="w-full md:w-1/3 grid grid-cols-1 gap-4 ml-6">
          {selectedProducts.length > 0 ? (
            selectedProducts.map((product) => (
              <div
                key={product.id}
                className="border p-4 rounded-lg shadow-lg text-center cursor-pointer hover:shadow-xl"
                onClick={() => handleRemoveFromRight(product.product_id)}
              >
                <img
                  src={product.product_feature_img}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4"
                />
                <h3 className="text-md font-semibold">{product.product_short}</h3>
                <p className="text-gray-600">₹{product.gifts_price ? product.gifts_price.split(',')[0] : 'N/A'} x {product.quantity}</p>
                <p className="text-gray-500">{product.actualp_piece ? product.actualp_piece.split(',')[0] : 'N/A'}</p>
                <p className="text-red-600 mt-2">Click to remove 1 item</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No products added yet</p>
          )}

          {/* Display the total price with the box price */}
          <div className="border p-4 rounded-lg shadow-lg mt-4 text-center">
            <h3 className="text-lg font-bold">Total Price</h3>
            <p className="text-gray-600">Items Price: ₹{totalPrice}</p>
            <p className="text-gray-600">Box Price: ₹{priceBox}</p>
            <p className="text-xl font-semibold mt-2">Total: {combinedPrice}</p>

            <div className="">
        <button className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500" onClick={handleBuynow}>
          CHECKOUT
        </button>
      </div>
          </div>
        </div>
        
      </div>
      
    </div>
    <Footer/>
    </>
  );
};

export default ProductGrid;
