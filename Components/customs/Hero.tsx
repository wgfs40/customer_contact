"use client";

import ImageCarousel from "@/Components/customs/ImageCarousel";

const Hero = () => {
  return (
    <section className="relative flex w-full h-screen bg-gray-100 text-black">
      {/* Carousel Background Overlay */}
      <div className="absolute inset-0 z-0">
        <ImageCarousel
          images={[
            "/images/hero/hero1.jpg",
            "/images/hero/hero2.jpg",
            "/images/hero/hero3.jpg",
          ]}
        />
        <div />
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center text-white bg-black bg-opacity-50 p-8">
          <h1 className="mx-auto max-w-[800px] text-[2.5rem] font-bold leading-tight">
            Impulsamos tu marca con estrategias digitales efectivas.
          </h1>
          <p className="mx-auto mt-2 max-w-[700px] text-base font-semibold text-orange-300">
            ¡Haz crecer tu negocio hoy y destaca frente a la competencia!
          </p>
          <button className="mt-6 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded">
            Contáctanos
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
