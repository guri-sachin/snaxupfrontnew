import React, { useState,useEffect } from 'react';
import Footer from '../../component/Footer';
import Navbar from '../../component/Navbar'
import axios from 'axios';
import { useLocation } from "react-router-dom";
import Swal from 'sweetalert2';


const ProductGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const [box, setBox] = useState([]);
  const [titlebox, setTitleBox] = useState();
  const [space, setSpace] = useState();
  const [priceBox, setPriceBox] = useState(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pricez, setPricesz] = useState('');
  const [error, setError] = useState(''); 
  const [prices, setPrices] = useState([]);
  const [sizes, setSizes] = useState([]);

  const location = useLocation();

  const [id, setId] = useState(location.state?.id || localStorage.getItem('id') || null);
console.log("gv",id)
  // Automatically select the first size and price on initial render

// Render loading state, error state, or product data

useEffect(() => {
  const fetchProperty = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/gifts_box/${id}`);
      const fetchedProperty = response.data;
      setBox(fetchedProperty);
      setTitleBox(fetchedProperty.title);
      setSpace(fetchedProperty.space);
      setPriceBox(fetchedProperty.box_price);


    } catch (error) {
      console.error("Error fetching property data:", error);
    }
  };
  fetchProperty();

}, [ ]);

useEffect(() => {
          // Function to fetch products
          const fetchProducts = async () => {
            setLoading(true); // Start loading
            setError(''); // Reset error message
      
            try {
              // Make the API call
              const response = await axios.get('http://localhost:4000/api/products'); // Adjust the URL if necessary
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
      
        
  useEffect(() => {
          if ( products.product_p_pice  || products.gifts_price) {
      const sizon = products.product_p_pice.split(',');
      const priceson = products.gifts_price.split(',');
    
      
              setPrices(priceson)
               setSizes(sizon)
     
          }
        }, [products.product_p_pice,products.gifts_price ]);
      
      
      console.log("s",products)


  
  // Example product data for left side
  const leftSideProducts = [
    { id: 1, name: '24 Mantra Organic Honey 250g', price: 150, imgSrc: 'image-link-1', size: '250g', category: 'Honey' },
    { id: 2, name: '4700 BC Gourmet Nutty Tuxedo Chocolate Popcorn', price: 225, imgSrc: 'image-link-2', size: '100g', category: 'Chocolates' },
    { id: 3, name: 'Almond Brittle Handmade Praline Chocolate 204g', price: 420, imgSrc: 'image-link-3', size: '204g', category: 'Chocolates' },
    { id: 4, name: 'Davidoff Instant Ground Coffee 100g', price: 750, imgSrc: 'image-link-4', size: '100g', category: 'Coffee' }
  ];

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

    const existingProduct = selectedProducts.find((p) => p.id === product.id);
    if (existingProduct) {
      const updatedProducts = selectedProducts.map((p) =>
        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
      );
      setSelectedProducts(updatedProducts);
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  // Function to handle click event on right side product to remove it
  const handleRemoveFromRight = (id) => {
    const updatedProducts = selectedProducts
      .map((product) => (product.id === id ? { ...product, quantity: product.quantity - 1 } : product))
      .filter((product) => product.quantity > 0);

    setSelectedProducts(updatedProducts);
  };

  // Calculate the total price of the selected products
  const totalPrice = selectedProducts.reduce((acc, product) => acc + product.price * product.quantity, 0);

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === 'All Categories'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
          <>
          <Navbar/>
    <div className="container mx-auto p-6">
      <div className="flex">
         
        {/* Left Section: 65% */}
        <div className="w-full md:w-2/3">
          {/* Dropdown to select category */}
          <div  className="mb-2 mt-6">
          <h1>{titlebox} | Add Max {space} Items  | {priceBox} Only
          </h1>
          <p>Click on Any item in left side you wanted to add in your gift box</p>
          </div>
          <div className="mb-6 mt-6">
  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="w-full border rounded-md border-gray-300 p-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
  >
    <option value="All Categories" className="text-gray-600">All Categories</option>
    <option value="Chocolates" className="text-gray-600">Chocolates</option>
    <option value="Honey" className="text-gray-600">Honey</option>
    <option value="Coffee" className="text-gray-600">Coffee</option>
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
                <h3 className="text-md font-semibold">{product.product_short
                }</h3>
                <p className="text-gray-600">₹{product.gifts_price
                }</p>
                <p className="text-gray-500">{product.size}</p>
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
                onClick={() => handleRemoveFromRight(product.id)}
              >
                <img
                  src={product.product_feature_img}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4"
                />
                <h3 className="text-md font-semibold">{product.product_short}</h3>
                <p className="text-gray-600">₹{product.price} x {product.quantity}</p>
                <p className="text-gray-500">{product.size}</p>
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
            <p className="text-xl font-semibold mt-2">Total: ₹{totalPrice + priceBox}</p>
          </div>
        </div>
        
      </div>
      
    </div>
    <Footer/>
    </>
  );
};

export default ProductGrid;