import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Center } from "@chakra-ui/react";


const images = [
  "https://www.w3schools.com/w3images/mountains.jpg",  // Mountain scenery
  "https://www.w3schools.com/w3images/ocean.jpg",     // Ocean view
  "https://www.w3schools.com/w3images/forest.jpg",    // Forest view
  "https://www.w3schools.com/w3images/snow.jpg",      // Snowy landscape
];

const ImageCarousel = () => {
  return (
    <div style={{ width: "100%", paddingLeft:"10px", paddingRight:"10px" }}>
      <Center>
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`Carousel image ${index + 1}`}
                style={{ width: "100%", height: "auto", borderRadius: "5px" }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Center>
    </div>
  );
};

export default ImageCarousel;
