"use client";

import ImageCarousel from "@/components/layout/ImageCarousel";

const Hero = () => {
  return (
    <section className="relative w-full bg-gray-100">
      {/* Banner Section - Mejorado para mayor visibilidad */}
      <div className="relative h-[500px] md:h-[600px] lg:h-[650px] w-full overflow-hidden">
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
          className="w-full h-full object-cover"
        />

        {/* Overlay mejorado - menos opaco para mejor visibilidad de la imagen */}
        <div className="absolute inset-0  bg-gradient-to-b from-black/20 via-black/30 to-black/50"></div>

        {/* Contenido superpuesto mejorado */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
              Dosis de Marketing
            </h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-md opacity-90">
              Estrategias digitales que impulsan tu crecimiento
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#F9A825] hover:bg-[#FF8F00] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                Comenzar Ahora
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-gray-800 font-semibold px-8 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm">
                Ver Servicios
              </button>
            </div>
          </div>
        </div>

        {/* Indicadores de navegación del carrusel */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-3 h-3 bg-white/50 rounded-full cursor-pointer hover:bg-white/80 transition-colors"></div>
          <div className="w-3 h-3 bg-white/50 rounded-full cursor-pointer hover:bg-white/80 transition-colors"></div>
          <div className="w-3 h-3 bg-white/50 rounded-full cursor-pointer hover:bg-white/80 transition-colors"></div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ofrecemos soluciones integrales de marketing digital para hacer
              crecer tu negocio
            </p>
          </div>

          {/* <ServicesGrid
            services={filteredServices}
            isLoading={isLoadingServices}
            openServiceModal={openServiceModal}
          /> */}

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-6">
              ¿Listo para llevar tu negocio al siguiente nivel?
            </p>
            <button className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] hover:from-[#FF8F00] hover:to-[#F57C00] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
              Solicitar Consulta Gratuita
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
