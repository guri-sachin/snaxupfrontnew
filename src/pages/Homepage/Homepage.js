import React from 'react'
import Navbar from '../../component/Navbar'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Premium from '../../component/Premium';
import Collection from '../../component/Collection';
import { useNavigate } from 'react-router-dom';

import Sugarfree from '../../component/SugarFree';
import Customise from '../../component/Customise';
import Newsletter from '../../component/Newsletter';
import SliderForHome from '../../component/Slider';

import Footer from '../../component/Footer';
import { Navigate } from 'react-router-dom';
const Homepage = () => {
  const settings = {
    dots: false,            // No indicators
    infinite: true,         // Infinite looping
    speed: 500,             // Speed of the fade transition
    fade: true,             // Enable fade effect
    autoplay: true,         // Enable autoplay
    autoplaySpeed: 3000,    // Change image every 3 seconds
    arrows: false,  
          
  };
  const navigate = useNavigate();


  function homeHandle(){
    navigate("productlist")
  }
  return (
    <div className=''>
      <Navbar />
   {/* slider */}
   <div className="slider-container w-[100%]">
      <Slider {...settings}>
        <div>
        <div class="image-container" onClick={homeHandle}>
  <img 
    src="../img/home/1.webp" 
    alt="Image 1" 
    class="w-[100vw] md:h-[700px] object-cover"
  />
</div>

        </div>
        <div onClick={homeHandle}>
          <img 
            src="../img/home/2.webp" 
            alt="Image 2" 
            class="w-[100vw]  object-contain"          />
        </div>
        <div onClick={homeHandle}> 
          <img 
            src="../img/home/3.webp" 
            alt="Image 3" 
            class="w-[100vw]  object-contain"          />
        </div>

      </Slider>
    </div>
    {/* collection */}
    <Collection/>
    {/* premium */}
    <Premium/>
    {/* sugar */}
    <Sugarfree/>
<SliderForHome/>
    {/* Newsletter */}
    <Newsletter/>
    {/* customise */}
    <Customise/>
    {/* footer */}
    <Footer/>
    </div>
  )
}

export default Homepage
