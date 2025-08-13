import React from "react";
import ServicesHero from "./services-hero";
import ServicesFilterCategories from "./services-filter-categories";
import {
  getServiceCategoriesAction,
  getServicesAction,
} from "@/actions/services_actions";
import ServiceCard from "./service-card";

interface ServiceContentProps {
  searchParams: Promise<{ category?: string }> | { category?: string };
}

const ServicesContent = async ({ searchParams }: ServiceContentProps) => {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const categoryFromUrl = resolvedSearchParams.category || undefined;

  // Obtener categorías
  const categories = await getServiceCategoriesAction();

  // Obtener servicios filtrados por categoría si existe
  const services = await getServicesAction({
    category: categoryFromUrl,
    limit: 50,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <div className="min-h-screen bg-gray-50">
        <ServicesHero />

        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Filtros de categorías */}
          <ServicesFilterCategories
            categories={categories}
            selectedCategoryId={categoryFromUrl}
            currentPath="/services"
          />

          {/* Mensaje de filtro activo */}
          {categoryFromUrl && (
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 bg-[#F9A825]/10 text-[#F9A825] px-4 py-2 rounded-lg">
                <span>Mostrando servicios de:</span>
                <span className="font-semibold">
                  {categories.find((cat) => cat.id === categoryFromUrl)?.name ||
                    "Categoría"}
                </span>
                <a
                  href="/services"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  title="Limpiar filtro"
                >
                  ✕
                </a>
              </div>
            </div>
          )}

          {/* Grid de servicios */}
          {services.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            // Estado vacío
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No se encontraron servicios
              </h3>
              <p className="text-gray-500 mb-6">
                {categoryFromUrl
                  ? "No hay servicios disponibles en esta categoría."
                  : "No hay servicios disponibles en este momento."}
              </p>
              {categoryFromUrl && (
                <a
                  href="/services"
                  className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Ver todos los servicios
                </a>
              )}
            </div>
          )}

          {/* Información adicional */}
          <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                ¿No encuentras lo que buscas?
              </h3>
              <p className="text-gray-600 mb-6">
                Contáctanos y creemos una solución personalizada para tu negocio
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Solicitar Cotización
                </a>
                <a
                  href="/contact"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Hablar con un Especialista
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesContent;
