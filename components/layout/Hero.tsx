"use client";

import ImageCarousel from "@/components/layout/ImageCarousel";

const Hero = () => {
  return (
    <section className="relative flex w-full h-screen bg-gray-100 text-black">
      <ImageCarousel
        images={[
          {
            src: "/images/hero/hero1.jpg",
            text: "Impulsa tu negocio con Dosis de Marketing",
          },
          {
            src: "/images/hero/hero2.jpg",
            text: "Estrategias digitales que generan resultados",
          },
          {
            src: "/images/hero/hero3.jpg",
            text: "Tu crecimiento, nuestra prioridad",
          },
        ]}
        className="w-full h-full object-cover relative"
      />
    </section>
  );
};

export default Hero;
