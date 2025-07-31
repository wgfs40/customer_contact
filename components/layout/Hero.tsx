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

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1: Marketing Digital */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-lg mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Marketing Digital
              </h3>
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                Estrategias SEO, SEM y optimización web para aumentar tu
                visibilidad online y generar más leads cualificados.
              </p>
              <div className="text-center">
                <button className="bg-[#F9A825] hover:bg-[#FF8F00] text-white font-medium px-6 py-2 rounded-lg transition-colors duration-300">
                  Más Información
                </button>
              </div>
            </div>

            {/* Service 2: Redes Sociales */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-lg mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 3v10a2 2 0 002 2h6a2 2 0 002-2V7M7 7h10M10 11h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Redes Sociales
              </h3>
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                Gestión profesional de redes sociales, creación de contenido y
                estrategias para conectar con tu audiencia.
              </p>
              <div className="text-center">
                <button className="bg-[#F9A825] hover:bg-[#FF8F00] text-white font-medium px-6 py-2 rounded-lg transition-colors duration-300">
                  Más Información
                </button>
              </div>
            </div>

            {/* Service 3: Consultoría */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-lg mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Consultoría
              </h3>
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                Análisis personalizado de tu negocio y estrategias a medida para
                optimizar tu crecimiento y rentabilidad.
              </p>
              <div className="text-center">
                <button className="bg-[#F9A825] hover:bg-[#FF8F00] text-white font-medium px-6 py-2 rounded-lg transition-colors duration-300">
                  Más Información
                </button>
              </div>
            </div>
          </div>

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
