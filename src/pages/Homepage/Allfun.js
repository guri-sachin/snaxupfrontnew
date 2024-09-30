import React, { useState } from 'react';
import Swal from 'sweetalert2';

const sizes = ['50g', '100g', '250g', '500g'];
const prices = [50, 90, 395, 350];  // Corresponding prices for the sizes

const calculatePrice = (quantity, pricePerUnit) => {
  // Apply discount based on quantity
  let discount = 0;
  if (quantity >= 4 && quantity <= 6) {
    discount = 0.10; // 10% discount
  } else if (quantity >= 7 && quantity <= 10) {
    discount = 0.15; // 15% discount
  }

  // Calculate the total price before and after discount
  const totalPrice = quantity * pricePerUnit;
  const discountedPrice = totalPrice - (totalPrice * discount);

  return { totalPrice, discountedPrice };
};

const ProductComponent = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(sizes[0]); // Default size
  const [pricePerUnit, setPricePerUnit] = useState(prices[0]); // Default price

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

  const handleSizeChange = (e) => {
    const selectedSizeIndex = sizes.indexOf(e.target.value); // Find the index of the selected size
    setSelectedSize(sizes[selectedSizeIndex]); // Update selected size
    setPricePerUnit(prices[selectedSizeIndex]); // Update price based on the index
  };

  // Calculate price and discount savings
  const { totalPrice, discountedPrice } = calculatePrice(quantity, pricePerUnit);
  const savings = totalPrice - discountedPrice;

  return (
    <div>
      <h1>Product Price Calculator</h1>
      <label>
        Quantity:
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
        />
      </label>
      <br />
      <label>
        Size:
        <select value={selectedSize} onChange={handleSizeChange}>
          {sizes.map((size, index) => (
            <option key={index} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
      <br />
      <p>Total Price Before Discount: ₹{totalPrice.toFixed(2)}</p>
      <p>Discounted Price: ₹{discountedPrice.toFixed(2)}</p>
      <p>You Save: ₹{savings.toFixed(2)}</p>
    </div>
  );
};

export default ProductComponent;
