import React from 'react';
import { useNavigate } from 'react-router-dom';


const Customise = () => {
  const navigate = useNavigate();

  function handelShow(){
    navigate('/CustomizeGift'); // Navigate to Login page

  }
  // https://img.freepik.com/free-photo/cupcakes-gift-package-abstract-table_114579-45424.jpg
  return (
    <div  onClick={handelShow}
      className="relative bg-cover bg-center w-[100%] h-[700px] text-white"
      style={{ backgroundImage: `url('../img/home/gifthapper121.webp')` }}
    >
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 mt-[-400px]">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">CUSTOMISE</h2>
        <p className="text-lg md:text-2xl mb-2">BULK ORDERS</p>
        <p className="text-lg md:text-2xl mb-2">BUSINESS GIFTING, MARRIAGE, ENGAGEMENT</p>
      </div>

      {/* View All Button */}
      <div className="absolute bottom-16 inset-x-0 flex justify-center">
        <button className="hover:bg-orange-600 hover:text-white bg-white text-[#8A0404] py-2 px-8 rounded-full text-lg  transition duration-300" onClick={handelShow}>
          VIEW ALL
        </button>
      </div>
    </div>
  );
};

export default Customise;
