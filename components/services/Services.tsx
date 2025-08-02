"use client";

import {
  getServiceCategoriesAction,
  getServicesAction,
} from "@/actions/services_actions";
import Service, { ServiceCategory } from "@/types/home/service";
import { useState, useEffect } from "react";

import PageLoader from "@/components/customs/loading/PageLoader";
import CategoryButtonSkeleton from "../customs/loading/CategoryButtonSkeleton";
import ServiceCardSkeleton from "../customs/loading/ServiceCardSkeleton";

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // Estados de loading
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const data = await getServiceCategoriesAction();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    const fetchServices = async () => {
      try {
        setIsLoadingServices(true);
        const data = await getServicesAction({
          category: selectedCategory === "all" ? undefined : selectedCategory,
        });
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoadingServices(false);
        setIsInitialLoad(false);
      }
    };

    fetchCategories();
    fetchServices();
  }, [selectedCategory]);

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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#F9A825] via-[#FF8F00] to-[#F57C00] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              Nuestros{" "}
              <span className="text-white drop-shadow-lg">Servicios</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto animate-fade-in-delay">
              Soluciones integrales de marketing digital diseñadas para hacer
              crecer tu negocio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
              <button className="bg-white text-[#F9A825] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg">
                Consulta Gratuita
              </button>
              <button className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-[#F9A825] transition-all duration-300">
                Ver Portfolio
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Filter Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Encuentra el Servicio Perfecto para tu Negocio
          </h2>

          {/* Loading de categorías */}
          {isLoadingCategories ? (
            <div className="flex flex-wrap justify-center gap-4">
              <CategoryButtonSkeleton />
              {[1, 2, 3, 4, 5].map((item) => (
                <CategoryButtonSkeleton key={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {/* Botón "Todos" */}
              <button
                onClick={() => setSelectedCategory("all")}
                disabled={isLoadingServices}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === "all"
                    ? "bg-[#F9A825] text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-[#F9A825] hover:text-white shadow-md"
                } ${isLoadingServices ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span>Todos</span>
                {isLoadingServices && selectedCategory === "all" && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                )}
              </button>

              {/* Botones de categorías */}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  disabled={isLoadingServices}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === category.slug
                      ? "bg-[#F9A825] text-white shadow-lg transform scale-105"
                      : "bg-white text-gray-700 hover:bg-[#F9A825] hover:text-white shadow-md"
                  } ${
                    isLoadingServices ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                  {category.services_count && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        selectedCategory === category.slug
                          ? "bg-white/20"
                          : "bg-gray-200"
                      }`}
                    >
                      {category.services_count}
                    </span>
                  )}
                  {isLoadingServices && selectedCategory === category.slug && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin ml-1"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Services Grid */}
        {isLoadingServices ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <ServiceCardSkeleton key={item} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <div
                key={service.id}
                className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both",
                }}
                onClick={() => openServiceModal(service)}
              >
                {/* Popular Badge */}
                {service.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                      Más Popular
                    </span>
                  </div>
                )}

                {/* Service Icon */}
                <div className="p-6 pb-4">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#F9A825] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {service.description}
                  </p>
                </div>

                {/* Features Preview */}
                <div className="px-6 pb-4">
                  <ul className="space-y-1">
                    {service.features?.slice(0, 3).map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <svg
                          className="w-4 h-4 text-[#F9A825] mr-2 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {typeof feature === "object"
                          ? feature.feature_text
                          : String(feature)}
                      </li>
                    ))}
                    {service.features && service.features.length > 3 && (
                      <li className="text-xs text-[#F9A825] font-medium">
                        +{service.features.length - 3} características más
                      </li>
                    )}
                  </ul>
                </div>

                {/* Price and CTA */}
                <div className="px-6 pb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-lg font-bold text-[#F9A825]">
                        {service.price_text}
                      </div>
                      <div className="text-xs text-gray-500">
                        {service.duration}
                      </div>
                    </div>
                    <button className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Ver Detalles
                    </button>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#F9A825]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        )}

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
