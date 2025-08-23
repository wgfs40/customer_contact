"use client";

import PageLoader from "@/components/customs/loading/PageLoader";
import { useService } from "@/hooks/useService";
import Service from "@/types/home/service";
import ServicesHero from "./services-hero";
import ServicesFilterCategories from "./services-filter-categories";
import ServicesGrid from "./services-grid";
import { getServiceCategoriesAction } from "@/actions/services_actions";

const Services = () => {
  const {
    categories,
    services,
    isLoadingCategories,
    isLoadingServices,
    isInitialLoad,
    selectedCategory,
    setSelectedCategory,
    selectedService,
    setSelectedService,
  } = useService();

  const filteredServices = services;

  const openServiceModal = (service: Service) => {
    setSelectedService(service);
    document.body.style.overflow = "hidden";
  };

  const closeServiceModal = () => {
    setSelectedService(null);
    document.body.style.overflow = "unset";
  };

  // Mostrar loading completo en la carga inicial
  if (isInitialLoad) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ServicesHero />

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* <ServicesFilterCategories
          categories={categories}
          selectedCategoryId={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isLoadingCategories={isLoadingCategories}
          isLoadingServices={isLoadingServices}
        /> */}

        {/* <ServicesGrid
          filteredServices={filteredServices}
          isLoadingServices={isLoadingServices}
          openServiceModal={openServiceModal}
        /> */}

        {/* Empty State */}
        {!isLoadingServices && filteredServices.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No hay servicios en esta categoría
            </h3>
            <p className="text-gray-500 mb-6">
              Selecciona otra categoría para ver más servicios
            </p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Ver todos los servicios
            </button>
          </div>
        )}
      </div>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿No encuentras lo que necesitas?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Creamos soluciones personalizadas para cada cliente. Cuéntanos tu
            proyecto y desarrollaremos la estrategia perfecta para ti.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#F9A825] font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg">
              Solicitar Propuesta Personalizada
            </button>
            <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-[#F9A825] transition-all duration-300">
              Agendar Llamada
            </button>
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full animate-scale-in">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{selectedService.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedService.title}
                  </h2>
                  <p className="text-[#F9A825] font-semibold">
                    {selectedService.price_text} • {selectedService.duration}
                  </p>
                </div>
              </div>
              <button
                onClick={closeServiceModal}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Descripción del Servicio
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {selectedService.description}
                  </p>

                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    ¿Qué incluye?
                  </h4>
                  <ul className="space-y-3">
                    {selectedService.features?.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-[#F9A825] mr-3 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">
                          {typeof feature === "object"
                            ? feature.feature_text
                            : String(feature)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Información del Servicio
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Precio:</span>
                      <span className="font-semibold text-[#F9A825]">
                        {selectedService.price_text}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duración:</span>
                      <span className="font-semibold">
                        {selectedService.duration}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Categoría:</span>
                      <span className="font-semibold capitalize">
                        {selectedService.category?.name}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button className="w-full bg-[#F9A825] hover:bg-[#FF8F00] text-white py-3 rounded-lg font-semibold transition-colors">
                      Solicitar Cotización
                    </button>
                    <button className="w-full border-2 border-[#F9A825] text-[#F9A825] hover:bg-[#F9A825] hover:text-white py-3 rounded-lg font-semibold transition-colors">
                      Agendar Consulta
                    </button>
                  </div>

                  <div className="mt-6 p-4 bg-[#F9A825]/10 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-2">
                      💡 ¿Necesitas ayuda?
                    </h5>
                    <p className="text-sm text-gray-600">
                      Agenda una consulta gratuita de 30 minutos para discutir
                      tus necesidades específicas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Keyframes globales */}
          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default Services;
