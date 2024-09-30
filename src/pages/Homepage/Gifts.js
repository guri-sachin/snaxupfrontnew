import React, { useState,useEffect } from 'react';
import { useCart } from '../../CartContext'; 
import Navbar from '../../component/Navbar';
import Slider from '../../component/Slider';
import Customise from '../../component/Customise';
import Newsletter from '../../component/Newsletter';
import Footer from '../../component/Footer';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


import SecureStorage from 'react-secure-storage';






const ProductDetail = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedButton, setSelectedButton] = useState(0);
  const [product, setProduct] = useState([]);
  const location = useLocation();
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState();
  const [sku, setSKU] = useState();



  const [editor, setEditorText] = useState([]); 
  const { addToCart } = useCart();
  const [sizes, setSizes] = useState([]);

  const [size, setSize] = useState(sizes[0]); 
  const [price, setPrice] = useState([0]); 
  const [featureimg, setFeatureimg] = useState(''); 

  const [mrp, setMRP] = useState(); 

  const [prices, setPrices] = useState([]);
  
  const [productmrp, setMRPofproduct] = useState([]); // Assuming product.sizes is an array of sizes
  
  // Assuming product.sizes is an array of sizes



  const [id, setId] = useState(location.state?.id || SecureStorage.getItem('id') || null);
console.log("gv",id)
  // Automatically select the first size and price on initial render

// Render loading state, error state, or product data


useEffect(() => {
  const fetchProperty = async () => {
    try {
      const response = await axios.get(`${apiUrl}gifts/${id}`);
      const fetchedProperty = response.data;
      setProduct(fetchedProperty);
      setTitle(fetchedProperty.title)
      setMRP(fetchedProperty.mrp) 
      setEditorText(fetchedProperty.detaildes)
      

  setPrice(fetchedProperty.price);

//   const firstPice = fetchedProperty.product_p_pice.split(',')[0]; // Get the first price before the comma

  // Convert it to a number (remove commas and ensure it's a valid number)
//   const numericPice = parseFloat(firstPice.replace(/,/g, '')) || 0;

  // Set the extracted price
//   setSize(numericPice);
    } catch (error) {
      console.error("Error fetching property data:", error);
    }
  };
  fetchProperty();

}, [ ]);

useEffect(() => {


}, []); // Empty dependency array ensures this runs only once


console.log("sa",product)
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // const increaseQuantity = () => {
  //   setQuantity((prevQuantity) => prevQuantity + 1);
  // };

  // const decreaseQuantity = () => {
  //   setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  // };

  // const handleInputChange = (e) => {
  //   const value = Math.max(1, parseInt(e.target.value)); // Ensure quantity is at least 1
  //   setQuantity(isNaN(value) ? 1 : value);
  // };


//   const handleButtonClick = (buttonIndex,label) => {
//     setSelectedButton(buttonIndex);
//     setSize(label)
//     setPrice(prices[buttonIndex]);

//     console.log("label",label,buttonIndex)
//   };

  //mouse zoom in
  const [zoom, setZoom] = useState(false); // Whether to zoom
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Mouse position

  // Handle mouse movement to track the position
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100; // Get X position as percentage
    const y = ((e.pageY - top) / height) * 100; // Get Y position as percentage
    setPosition({ x, y });
  };

  // Handle mouse enter event to enable zoom
  const handleMouseEnter = () => {
    setZoom(true);
  };

  // Handle mouse leave event to disable zoom
  const handleMouseLeave = () => {
    setZoom(false);
  };


  useEffect(() => {
    if (product.img ) {
      // Parse the product_img JSON string into an array
      const parsedImages = JSON.parse(product.img);
//       const descriptionArray = product.actualp_editor.split(',');
console.log("df",parsedImages)

//         setPrices(priceson)
//          setSizes(sizon)
      setImages(parsedImages);
//       setMRPofproduct(MRPprice)
      // Set the first image as the selected one initially
      setSelectedImage(parsedImages[0]);
    }
  }, [product.img]);


  const handleQuantityChange = (e) => {
    const newQuantity = Number(e.target.value);
    setQuantity(newQuantity);

    // Show SweetAlert when quantity is 2 or 6
    if (newQuantity === 2) {
      Swal.fire({
        title: 'Get a Discount!',
        text: 'Add 2 more to get a 10% discount!',
        iconHtml: '🎊', 
        icon: 'success',
        timer: 7000, // Auto-close after 7 seconds
        timerProgressBar: true, // Show progress bar
        customClass: {
          popup: 'animate__animated animate__fadeInDown', // Slow fade-in animation
        },
        showConfirmButton: false,
      });
    } else if (newQuantity === 6) {
      Swal.fire({
        title: 'Get a Bigger Discount!',
        text: 'Add 1 more to get a 15% discount!',
        iconHtml: '🎊', 
        icon: 'success',
        timer: 7000, // Auto-close after 7 seconds
        timerProgressBar: true, // Show progress bar
        showConfirmButton: false,
      });
    }
  };

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;
      handleQuantityChange({ target: { value: newQuantity } });
      return newQuantity;
    });
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity > 1 ? prevQuantity - 1 : 1;
      handleQuantityChange({ target: { value: newQuantity } });
      return newQuantity;
    });
  };



  const handleAddToCart = () => {
    addToCart({ ...product, size, quantity, price, title, sku, id});
  };

  const handleBuynow = () => {
    addToCart({ ...product, size, quantity, price, title, sku, id});
    navigate('/Checkouts'); // Navigate to Login page

  };


  
  return (
    <>
      <Navbar />
      <h2 className="text-2xl font-semibold text-red-800 mt-10 text-center">PRODUCTS INFORMATION</h2>
      <div className="flex justify-between items-center border-b pb-2 mb-4 mt-4 max-w-5xl mx-auto ">
      </div>
    
      <div className="container mx-auto lg:flex lg:space-x-6 mt-10">
      {/* Left Image Gallery */}
      <div className="lg:w-1/2">
  <div className="grid grid-cols-4 gap-2 mx-16">
  <div
      className="col-span-4 w-full md:h-[400px] rounded-lg shadow-lg mb-4 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={selectedImage}
        alt="Selected"
        className={`w-full h-full object-contain transform transition-transform duration-300 ${
          zoom ? "scale-150" : "scale-100"
        }`}
        style={{
          transformOrigin: `${position.x}% ${position.y}%`, // Zoom at the cursor position
        }}
      />
    </div>
    {images.map((image) => (
      <img
        key={image}
        src={image}
        alt="Thumbnail"
        className="cursor-pointer rounded-lg shadow-sm hover:shadow-lg"
        onClick={() => handleImageClick(image)}
      />
    ))}
  </div>
      </div>


        {/* Right Product Info */}
        <div className="px-4 lg:px-8 lg:w-1/2">
  <h2 className="text-3xl font-bold mb-4 mt-5 md:mt-0">
    {product.title}
  </h2>

  <p className="text-gray-700 mb-4">
    {product.des}
  </p>



  {/* Icons Section */}
  {/* <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-6">
    {[
      { icon: '🍃', title: 'No Artificial Flavours' },
      { icon: '💪', title: 'High Protein' },
      { icon: '🚫', title: 'Gluten Free' },
      { icon: '🌾', title: 'High Fibre' },
    ].map(({ icon, title }) => (
      <div key={title} className="flex flex-col items-center">
        <span className="text-3xl">{icon}</span>
        <span className="mt-2 text-gray-700 text-center text-[12px] md:text-[18px]">{title}</span>
      </div>
    ))}
  </div> */}


  <div className="mb-6">
    <div className="flex items-center space-x-6">
      {/* Quantity Section */}
      <div className="flex items-center space-x-2">
        <span className="text-xl text-[#8A0404]">QUANTITY:</span>
        <div className="flex items-center">
          <button
            onClick={decreaseQuantity}
            className="px-4 h-10 py-2 border border-gray-300 rounded-l-lg bg-gray-100 hover:bg-gray-200"
          >
            -
          </button>
          <input
            type="number"
            className="w-12 h-10 text-center border-t border-b border-gray-300"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
          />
          <button
            onClick={increaseQuantity}
            className="px-4 h-10 py-2 border border-gray-300 rounded-r-lg bg-gray-100 hover:bg-gray-200"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* Price Section */}
  <div className="mb-6">
    <div className="relative flex items-center ">
      <span className="text-xl text-[#8A0404]">PRICE:</span>

      {/* Original Price with Strikethrough */}
      <span className="text-xl text-gray-500 line-through mr-2 pl-10">
        ₹{mrp}
      </span>

      {/* Arrow Symbol */}
      <span className="text-gray-500 mx-2">
        &rarr;
      </span>

      {/* Discounted Price */}
      <span className="text-2xl text-red-600 font-bold">
   
      ₹{price}
   
        </span>
    </div>
  </div>
  <div className="flex items-center mb-4">
    {/* <span className="text-yellow-500 text-2xl mr-2">★★★★★</span> */}
    {/* <span className="text-gray-500">(4.5/5)</span> */}
    <span className="text-gray-500">    Tax included. Shipping FREE .
    </span>


  </div>
  {/* Action Buttons */}
  <div className="flex space-x-4">
    <button className="hover:bg-orange-600 hover:text-white bg-white text-black py-2 px-8 rounded-full text-lg border border-orange-600 transition duration-300" onClick={handleAddToCart}>
      ADD TO CART
    </button>
    <button className="hover:bg-orange-600 hover:text-white bg-white text-black py-2 px-8 rounded-full text-lg border border-orange-600 transition duration-300" onClick={handleBuynow}>
      BUY NOW
    </button>
  </div>
</div>


      </div>
      <div className="container mx-auto lg:flex lg:space-x-6 mt-10  border-gray-200 rounded-lg p-4 px-8 lg:px-12">
  {/* Left Section: Product Specifications */}
  <div className="md:w-1/3 p-4">
    <h2 className="text-lg font-bold mb-4">Items in this Gift</h2>
    <ul className="space-y-2">
      <li><strong>Brand:</strong> SnaXup</li>
      <li>   {[product.items].map((label, index) => (
        <button
          key={index}
         
        >
          {label}
        </button>
      ))}</li>
    
      <li className="flex items-center">
      <div className="flex items-center mb-4">
  <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
  <span className="text-gray-700">
    This is a <strong className="mx-2">Vegetarian</strong> product.
  </span>
</div>
      </li>
    </ul>
  </div>

  {/* Right Section: About the Item */}
  <div className="md:w-2/3 p-4">
    <h2 className="text-lg font-bold mb-4">Product Details</h2>
    <ul className="list-disc pl-5 space-y-2">
        {editor}
      </ul>
 
  </div>


      {/* <div dangerouslySetInnerHTML={{ __html: product.translatedContent || product.actualp_editor}} /> */}

    </div>
      <Slider />
    
      <Newsletter></Newsletter>
      <Customise></Customise>
      <Footer/>
    </>
  );
};

export default ProductDetail;

