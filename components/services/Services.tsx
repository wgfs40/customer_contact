"use client";

import { useState } from "react";

interface Service {
  id: number;
  title: string;
  description: string;
  features: string[];
  icon: string;
  price: string;
  duration: string;
  category: string;
  popular?: boolean;
}

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const services: Service[] = [
    {
      id: 1,
      title: "Marketing Digital Integral",
      description:
        "Estrategia completa de marketing digital para impulsar tu presencia online y generar leads cualificados.",
      features: [
        "Auditoría digital completa",
        "Estrategia SEO/SEM",
        "Gestión de campañas publicitarias",
        "Análisis de competencia",
        "Reportes mensuales detallados",
        "Optimización continua",
      ],
      icon: "📈",
      price: "Desde $800/mes",
      duration: "3-6 meses",
      category: "marketing",
      popular: true,
    },
    {
      id: 2,
      title: "Gestión de Redes Sociales",
      description:
        "Administración profesional de tus redes sociales con contenido de calidad y estrategias de engagement.",
      features: [
        "Gestión de 3-5 plataformas",
        "Creación de contenido visual",
        "Copywriting especializado",
        "Community management",
        "Programación de publicaciones",
        "Análisis de métricas",
      ],
      icon: "📱",
      price: "Desde $500/mes",
      duration: "Mensual",
      category: "social",
    },
    {
      id: 3,
      title: "Branding & Identidad Visual",
      description:
        "Desarrollo de identidad de marca completa que conecte emocionalmente con tu audiencia target.",
      features: [
        "Diseño de logotipo",
        "Manual de identidad corporativa",
        "Paleta de colores y tipografías",
        "Aplicaciones de marca",
        "Papelería corporativa",
        "Guía de uso de marca",
      ],
      icon: "🎨",
      price: "Desde $1,200",
      duration: "4-6 semanas",
      category: "branding",
      popular: true,
    },
    {
      id: 4,
      title: "Desarrollo Web Profesional",
      description:
        "Sitios web responsive y optimizados para conversión con diseño moderno y funcionalidades avanzadas.",
      features: [
        "Diseño responsive",
        "Optimización SEO técnico",
        "Integración con Analytics",
        "Formularios de contacto",
        "Optimización de velocidad",
        "SSL y seguridad",
      ],
      icon: "💻",
      price: "Desde $1,500",
      duration: "6-8 semanas",
      category: "web",
    },
    {
      id: 5,
      title: "Consultoría Estratégica",
      description:
        "Asesoramiento personalizado para optimizar tu estrategia digital y maximizar el retorno de inversión.",
      features: [
        "Análisis FODA digital",
        "Plan estratégico personalizado",
        "Definición de KPIs",
        "Roadmap de implementación",
        "Sesiones de mentoría",
        "Seguimiento de resultados",
      ],
      icon: "🎯",
      price: "Desde $200/hora",
      duration: "Flexible",
      category: "consulting",
    },
    {
      id: 6,
      title: "E-commerce & Tiendas Online",
      description:
        "Desarrollo y optimización de tiendas online con enfoque en conversión y experiencia de usuario.",
      features: [
        "Plataforma e-commerce",
        "Catálogo de productos",
        "Pasarela de pagos",
        "Gestión de inventario",
        "Marketing automation",
        "Análisis de ventas",
      ],
      icon: "🛒",
      price: "Desde $2,000",
      duration: "8-12 semanas",
      category: "web",
      popular: true,
    },
    {
      id: 7,
      title: "Email Marketing Automation",
      description:
        "Campañas de email marketing automatizadas que nutren leads y aumentan las conversiones.",
      features: [
        "Configuración de automatizaciones",
        "Diseño de templates",
        "Segmentación de audiencias",
        "A/B testing",
        "Análisis de performance",
        "Integración con CRM",
      ],
      icon: "📧",
      price: "Desde $400/mes",
      duration: "2-4 semanas setup",
      category: "marketing",
    },
    {
      id: 8,
      title: "Análisis y Reportes",
      description:
        "Análisis profundo de datos digitales con reportes personalizados y recomendaciones estratégicas.",
      features: [
        "Google Analytics avanzado",
        "Dashboards personalizados",
        "Reportes automatizados",
        "Análisis de ROI",
        "Recomendaciones estratégicas",
        "Reuniones de seguimiento",
      ],
      icon: "📊",
      price: "Desde $300/mes",
      duration: "Mensual",
      category: "analytics",
    },
  ];

  const categories = [
    { id: "all", name: "Todos los Servicios", count: services.length },
    {
      id: "marketing",
      name: "Marketing Digital",
      count: services.filter((s) => s.category === "marketing").length,
    },
    {
      id: "social",
      name: "Redes Sociales",
      count: services.filter((s) => s.category === "social").length,
    },
    {
      id: "branding",
      name: "Branding",
      count: services.filter((s) => s.category === "branding").length,
    },
    {
      id: "web",
      name: "Desarrollo Web",
      count: services.filter((s) => s.category === "web").length,
    },
    {
      id: "consulting",
      name: "Consultoría",
      count: services.filter((s) => s.category === "consulting").length,
    },
    {
      id: "analytics",
      name: "Analytics",
      count: services.filter((s) => s.category === "analytics").length,
    },
  ];

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((service) => service.category === selectedCategory);

  const openServiceModal = (service: Service) => {
    setSelectedService(service);
    document.body.style.overflow = "hidden";
  };

  const closeServiceModal = () => {
    setSelectedService(null);
    document.body.style.overflow = "unset";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#F9A825] via-[#FF8F00] to-[#F57C00] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Nuestros{" "}
              <span className="text-white drop-shadow-lg">Servicios</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Soluciones integrales de marketing digital diseñadas para hacer
              crecer tu negocio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? "bg-[#F9A825] text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-[#F9A825] hover:text-white shadow-md"
                }`}
              >
                <span>{category.name}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.id
                      ? "bg-white/20"
                      : "bg-gray-200"
                  }`}
                >
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer"
              onClick={() => openServiceModal(service)}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] text-white px-3 py-1 rounded-full text-xs font-semibold">
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
                  {service.features.slice(0, 3).map((feature, index) => (
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
                      {feature}
                    </li>
                  ))}
                  {service.features.length > 3 && (
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
                      {service.price}
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

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16">
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{selectedService.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedService.title}
                  </h2>
                  <p className="text-[#F9A825] font-semibold">
                    {selectedService.price} • {selectedService.duration}
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
                    {selectedService.features.map((feature, index) => (
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
                        <span className="text-gray-700">{feature}</span>
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
                        {selectedService.price}
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
                        {selectedService.category}
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
        </div>
      )}
    </div>
  );
};

export default Services;
