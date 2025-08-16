import React from "react";
import ServicesHero from "./services-hero";
import ServicesFilterCategories from "./services-filter-categories";
import {
  getServiceCategoriesAction,
  getServicesAction,
} from "@/actions/services_actions";
import ServiceCard from "./service-card";
import { ServiceCategory, ServiceWithCategory } from "@/types/home/service";

interface ServiceContentProps {
  searchParams: Promise<{ category?: string }>;
}

// Tipos para las respuestas de las acciones
interface ActionResponse<T> {
  success?: boolean;
  value?: T;
  error?: string;
  message?: string;
  status?: string;
}

// Función helper para validar y extraer datos de forma segura

function extractActionData<T>(
  response: PromiseSettledResult<any>,
  isArray: boolean = false
): T | null {
  if (response.status !== "fulfilled") {
    console.warn("Action rejected:", response.reason);
    return null;
  }

  const rawValue = response as ActionResponse<T>;
  if (!rawValue.value) {
    console.warn("No data in response:", rawValue.value);
    return null;
  }

  if (isArray && !Array.isArray(rawValue.value)) {
    console.warn(
      "Se esperaba un arreglo pero no se obtuvo:",
      typeof rawValue.value,
      rawValue.value
    );
    return null;
  }

  return rawValue.value;
}

const ServicesContent = async ({ searchParams }: ServiceContentProps) => {
  try {
    // Resolver searchParams de forma segura
    const resolvedSearchParams = await Promise.resolve(searchParams);
    const selectedCategory = resolvedSearchParams?.category || undefined;

    // Obtener datos en paralelo con manejo de errores
    const [categoriesResponse, servicesResponse] = await Promise.allSettled([
      getServiceCategoriesAction(),
      getServicesAction({
        category: selectedCategory,
        limit: 50,
      }),
    ]);

    // Extraer datos de forma segura
    const categories =
      extractActionData<ServiceCategory[]>(categoriesResponse, true) || [];
    const services =
      extractActionData<ServiceWithCategory[]>(servicesResponse, true) || [];

    // Log para debugging (remover en producción)
    // console.log("Categories loaded:", categories.length);
    // console.log("Services loaded:", services.length);
    // console.log("Selected category:", selectedCategory);

    // Encontrar categoría seleccionada
    const selectedCategoryData = selectedCategory
      ? categories.find(
          (cat) => cat.slug === selectedCategory || cat.id === selectedCategory
        )
      : null;

    // Verificar si hubo errores en ambas llamadas
    const hasErrors =
      categoriesResponse.status === "rejected" &&
      servicesResponse.status === "rejected";

    const hasPartialErrors =
      categoriesResponse.status === "rejected" ||
      servicesResponse.status === "rejected";

    return (
      <div className="min-h-screen flex flex-col">
        <div className="min-h-screen bg-gray-50">
          <ServicesHero />

          <div className="max-w-7xl mx-auto px-4 py-16">
            {/* Mensaje de advertencia si hay errores parciales */}
            {hasPartialErrors && !hasErrors && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-yellow-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <p className="text-yellow-800 text-sm">
                    Algunos datos pueden no estar completamente actualizados. La
                    página funciona con normalidad.
                  </p>
                </div>
              </div>
            )}

            {/* Filtros de categorías */}
            <ServicesFilterCategories
              categories={categories}
              selectedCategoryId={selectedCategory}
              currentPath="/services"
            />

            {/* Mensaje de filtro activo */}
            {selectedCategory && selectedCategoryData && (
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 bg-[#F9A825]/10 text-[#F9A825] px-4 py-2 rounded-lg">
                  <span>Mostrando servicios de:</span>
                  <span className="font-semibold">
                    {selectedCategoryData.name}
                  </span>
                  <a
                    href="/services"
                    className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Limpiar filtro"
                    aria-label="Limpiar filtro"
                  >
                    ✕
                  </a>
                </div>
              </div>
            )}

            {/* Mensaje de error si no se pueden cargar datos */}
            {categoriesResponse.status === "rejected" &&
              servicesResponse.status === "rejected" && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                    Error al cargar los datos
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Hubo un problema al obtener la información de los servicios.
                  </p>
                  <a
                    href="/services"
                    className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-6 py-3 rounded-lg transition-colors inline-block"
                  >
                    Intentar nuevamente
                  </a>
                </div>
              )}

            {/* Grid de servicios */}
            {categoriesResponse.status === "fulfilled" &&
              servicesResponse.status === "fulfilled" && (
                <>
                  {services.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {services
                        .map((service) => {
                          // Validar que el servicio tenga los datos mínimos necesarios
                          if (!service.id) {
                            console.warn(
                              "Service missing required id:",
                              service
                            );
                            return null;
                          }

                          return (
                            <ServiceCard
                              key={`service-${service.id}`}
                              service={service}
                            />
                          );
                        })
                        .filter(Boolean)}
                    </div>
                  ) : (
                    // Estado vacío
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                        No se encontraron servicios
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {selectedCategory
                          ? "No hay servicios disponibles en esta categoría."
                          : "No hay servicios disponibles en este momento."}
                      </p>
                      {selectedCategory && (
                        <a
                          href="/services"
                          className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-6 py-3 rounded-lg transition-colors inline-block"
                        >
                          Ver todos los servicios
                        </a>
                      )}
                    </div>
                  )}
                </>
              )}

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

            {/* Stats de servicios */}
            {services.length > 0 && (
              <div className="mt-8 text-center text-sm text-gray-500">
                <p suppressHydrationWarning>
                  Mostrando {services.length} servicio
                  {services.length !== 1 ? "s" : ""}
                  {selectedCategory && selectedCategoryData && (
                    <> en {selectedCategoryData.name}</>
                  )}
                </p>
              </div>
            )}
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
          <a
            href="/services"
            className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-6 py-3 rounded-lg transition-colors inline-block"
          >
            Recargar página
          </a>
        </div>
      </div>
    );
  }
};

export default ServicesContent;
