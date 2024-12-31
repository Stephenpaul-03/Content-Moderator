import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Center } from "@chakra-ui/react";

const images = [
  "https://via.placeholder.com/800x400?text=Image+1",
  "https://via.placeholder.com/800x400?text=Image+2",
  "https://via.placeholder.com/800x400?text=Image+3",
  "https://via.placeholder.com/800x400?text=Image+4",
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
