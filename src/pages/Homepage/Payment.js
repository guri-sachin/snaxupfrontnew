import React, { useState } from "react"; 
import axios from "axios";

function PaymentForm() {
  const [amount, setAmount] = useState("");
  const [orderId] = useState("ORDER001");  // Fixed order ID
  const [customerId] = useState("CUST001"); // Fixed customer ID

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      // Call the backend API to get encrypted data and access code
      const response = await axios.post("http://localhost:5000/api/payment", {
        amount: amount,
        order_id: orderId,
        customer_id: customerId,
        redirect_url: "http://localhost:3000/payment-success",
        cancel_url: "http://localhost:3000/payment-cancel",
      });

      const { encryptedData, accessCode } = response.data;

      // Create a form dynamically to submit to CC Avenue
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

      // Add access code and encrypted data as hidden form fields
      const encRequestField = document.createElement("input");
      encRequestField.type = "hidden";
      encRequestField.name = "encRequest";
      encRequestField.value = encryptedData;
      form.appendChild(encRequestField);

      const accessCodeField = document.createElement("input");
      accessCodeField.type = "hidden";
      accessCodeField.name = "access_code";
      accessCodeField.value = accessCode;
      form.appendChild(accessCodeField);

      // Append form to body and submit it
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Make a Payment</h2>
        <form onSubmit={handlePayment}>
          <label className="block mb-4">
            <span className="text-gray-700">Amount:</span>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter amount"
              required
            />
          </label>
          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200">
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaymentForm;
