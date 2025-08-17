import React, { Suspense } from "react";
import ServicesHero from "./services-hero";
import ServicesFilterCategories from "./services-filter-categories";
import { getServiceCategoriesAction } from "@/actions/services_actions";
import ServicesPageSkeleton from "../customs/loading/ServicesPageSkeleton";
import ServiceCard from "./service-card";

const ServicesContent = async ({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) => {
  try {
    const categories = await getServiceCategoriesAction();

    const selectedCategory = searchParams?.query || "";

    return (
      <div className="min-h-screen flex flex-col">
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-16">
            {/* Filtros de categorías */}
            <ServicesFilterCategories categories={categories} />
            

           

            {/* Información adicional */}
            <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  ¿No encuentras lo que buscas?
                </h3>
                <p className="text-gray-600 mb-6">
                  Contáctanos y creemos una solución personalizada para tu
                  negocio
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-8 py-3 rounded-lg font-medium transition-colors inline-block"
                  >
                    Solicitar Cotización
                  </a>
                  <a
                    href="/contact"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-medium transition-colors inline-block"
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
  } catch (error) {
    console.error("Error in ServicesContent:", error);

    // Fallback en caso de error
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Error al cargar los servicios
          </h2>
          <p className="text-gray-600 mb-6">
            Hubo un problema inesperado. Por favor, intenta nuevamente.
          </p>
          {/* <a
            href="/services"
            className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-6 py-3 rounded-lg transition-colors inline-block"
          >
            Recargar página
          </a> */}
        </div>
      </div>
    );
  }
};

export default ServicesContent;
