"use client";

import ImageCarousel from "@/Components/customs/ImageCarousel";

const Hero = () => {
  return (
    <section className="relative flex w-full h-screen bg-gray-100 text-black">
      <ImageCarousel
        images={[
          "/images/hero/hero1.jpg",
          "/images/hero/hero2.jpg",
          "/images/hero/hero3.jpg",
        ]}
        className="w-full h-full object-cover relative"
      />
    </section>
  );
};

export default Hero;
