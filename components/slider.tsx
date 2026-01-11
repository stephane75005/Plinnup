import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, Navigation } from "swiper/modules";
import ContinueButton2 from "@/components/ContinueButton2";

// Import styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Slider() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Swiper
      direction="horizontal"
      slidesPerView={1}
      pagination={{ clickable: true }}
      navigation={isDesktop}
      modules={[Pagination, Mousewheel, Navigation]}
      className="h-screen"
      breakpoints={{
        768: {
          direction: "horizontal",
          mousewheel: true,
        },
      }}
    >
      <SwiperSlide>
        <div className="relative w-full h-screen">
          <Image
            src="/images/slide1-mobile.jpg"
            alt="Slide 1 Mobile"
            fill
            className="object-cover md:hidden"
            priority
          />
          <Image
            src="/images/slide1-desktop.jpg"
            alt="Slide 1 Desktop"
            fill
            className="object-cover hidden md:block"
            priority
          />
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="relative w-full h-screen">
          <Image
            src="/images/slide2-mobile.jpg"
            alt="Slide 2 Mobile"
            fill
            className="object-cover md:hidden"
          />
          <Image
            src="/images/slide2-desktop.jpg"
            alt="Slide 2 Desktop"
            fill
            className="object-cover hidden md:block"
          />
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="relative w-full h-screen">
          <Image
            src="/images/slide3-mobile.jpg"
            alt="Slide 3 Mobile"
            fill
            className="object-cover md:hidden"
          />
          <Image
            src="/images/slide3-desktop.jpg"
            alt="Slide 3 Desktop"
            fill
            className="object-cover hidden md:block"
          />
        </div>
      </SwiperSlide>

      {/* Dernier slide avec bouton */}
      <SwiperSlide>
        <div className="relative w-full h-screen">
          <Image
            src="/images/slide4-mobile.jpg"
            alt="Slide 4 Mobile"
            fill
            className="object-cover md:hidden"
          />
          <Image
            src="/images/slide4-desktop.jpg"
            alt="Slide 4 Desktop"
            fill
            className="object-cover hidden md:block"
          />

          <div
            className="absolute bottom-10 w-full flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <ContinueButton2 />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
