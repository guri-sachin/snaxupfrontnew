import React from 'react';
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


const Premium = () => {
  const navigate = useNavigate();

  function Handelsubmit(){
    // navigate(`/RentProperty/${property.slug}`, { state: { property, id: property.id } });
    navigate("/Gifthamper")
  }
  return (
    <div className="bg-white py-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-red-800">PREMIUM HAMPER</h2>
      </div>
      <div className="flex flex-wrap justify-center mx-4 md:mx-10">
        {/* Card 1 */}
        <div className="w-full sm:w-1/2 lg:w-1/3 p-4" onClick={Handelsubmit}>
  <div className="bg-gray-100 p-4 rounded-lg shadow-lg hover:bg-white">
    <img
      className="h-80 w-full object-contain mb-2"
      src="../img/home/home2.webp"
      alt="Corporate Gift Hamper"
    />
  </div>
  <div className="flex items-center justify-between mt-2">
    <div className="flex-grow text-center">
      <div className="inline-block border rounded-full p-1 px-3 hover:bg-orange-600 hover:text-white">
        <h3 className="text-lg font-medium">CORPORATE GIFT HAMPER</h3>
      </div>
    </div>
    <FaPlus className="ml-2 text-gray-600" />
  </div>
</div>
     

        {/* Card 2 */}
        <div className="w-full sm:w-1/2 lg:w-1/3 p-4" onClick={Handelsubmit}>
  <div className="bg-gray-100 p-4 rounded-lg shadow-lg hover:bg-white">
    <img
      className="h-80 w-full object-contain mb-2"
      src="../img/home/home1.jpg"
      alt="Corporate Gift Hamper"
    />
  </div>
  <div className="flex items-center justify-between mt-2">
    <div className="flex-grow text-center">
      <div className="inline-block border rounded-full p-1 px-3 hover:bg-orange-600 hover:text-white">
        <h3 className="text-lg font-medium">CORPORATE GIFT HAMPER</h3>
      </div>
    </div>
    <FaPlus className="ml-2 text-gray-600" />
  </div>
</div>
      

        {/* Card 3 */}
        <div className="w-full sm:w-1/2 lg:w-1/3 p-4" onClick={Handelsubmit}>
  <div className="bg-gray-100 p-4 rounded-lg shadow-lg hover:bg-white">
    <img
      className="h-80 w-full object-contain mb-2"
      src="../img/home/CC2.jpg"
      alt="Corporate Gift Hamper"
    />
  </div>
  <div className="flex items-center justify-between mt-2">
    <div className="flex-grow text-center">
      <div className="inline-block border rounded-full p-1 px-3 hover:bg-orange-600 hover:text-white">
        <h3 className="text-lg font-medium">CORPORATE GIFT HAMPER</h3>
      </div>
    </div>
    <FaPlus className="ml-2 text-gray-600" />
  </div>
</div>

      </div>
      <div className="text-center mt-8">
        <button className="hover:bg-orange-600 hover:text-white bg-white text-black py-2 px-8 rounded-full text-lg border border-orange-600 transition duration-300"  onClick={Handelsubmit}>
          VIEW ALL
        </button>
        
      </div>
    </div>
  );
};

export default Premium;
