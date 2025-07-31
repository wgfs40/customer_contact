"use client";

const ServicesGrid = () => {
  return (
    <div>
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
            Estrategias SEO, SEM y optimización web para aumentar tu visibilidad
            online y generar más leads cualificados.
          </p>
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
        </div>
      </div>
    </div>
  );
};

export default ServicesGrid;
