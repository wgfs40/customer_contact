import {  
  getServicesAction,
} from "@/actions/services_actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ServiceWithCategory } from "@/types/home/service";
import { Metadata } from "next";

interface ServicePageDetailProps {
  params: Promise<{ category: string }>;
}

// Generar metadata dinámica
export async function generateMetadata({
  params,
}: ServicePageDetailProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const categorySlug = resolvedParams.category;

  try {
    const serviceResponse = await getServicesAction({ category: categorySlug });

 

    if (!serviceResponse || serviceResponse.length === 0) {
      return {
        title: "Servicio no encontrado",
        description: "El servicio solicitado no está disponible.",
      };
    }

    const service = serviceResponse[0];

    return {
      title: `${service.title} | Dosis de Marketing`,
      description: service.description || "Descubre más sobre este servicio.",
      openGraph: {
        title: service.title || "Servicio",
        description: service.description || "Servicio de marketing digital",
        images:
          service.icon && service.icon.startsWith("http")
            ? [service.icon]
            : ["/images/logo.jpg"],
      },
    };
  } catch (error) {
    return {
      title: "Error | Dosis de Marketing",
      description: "Hubo un problema al cargar el servicio.",
    };
  }
}

const ServicePageDetail = async ({ params }: ServicePageDetailProps) => {
  try {
    const resolvedParams = await Promise.resolve(params);
    const categorySlug = resolvedParams.category;

    console.log("🔍 Buscando servicio con slug:", categorySlug);

    // Primero intentar obtener por ID/slug específico
    let serviceResponse = await getServicesAction({ category: categorySlug });
    let service: ServiceWithCategory | null = null;

    if (Array.isArray(serviceResponse) && serviceResponse.length > 0) {
      service = serviceResponse[0];
    } else {
      // Si no encuentra por ID, buscar en la lista general por categoría
      console.log("🔄 Buscando en lista de servicios...");
      const servicesListResponse = await getServicesAction({
        category: categorySlug,
        limit: 1,
      });

      if (
        Array.isArray(servicesListResponse) &&
        servicesListResponse.length > 0
      ) {
        service = servicesListResponse[0];
      }
    }

    if (!service) {
      console.log("❌ Servicio no encontrado");
      notFound();
    }

    console.log("✅ Servicio encontrado:", service.title);

    // Función para validar URLs de imágenes
    const isValidImageUrl = (url: string | null | undefined): boolean => {
      if (!url) return false;
      return (
        url.startsWith("/") ||
        url.startsWith("http://") ||
        url.startsWith("https://")
      );
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#F9A825] transition-colors">
                Inicio
              </Link>
              <span>/</span>
              <Link
                href="/services"
                className="hover:text-[#F9A825] transition-colors"
              >
                Servicios
              </Link>
              <span>/</span>
              {service.category_name && (
                <>
                  <Link
                    href={`/services?category=${service.category_slug || ""}`}
                    className="hover:text-[#F9A825] transition-colors"
                  >
                    {service.category_name}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="font-medium text-gray-900">
                {service.title || "Servicio"}
              </span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Columna izquierda - Imagen principal */}
            <div className="space-y-6">
              <div className="relative h-96 bg-gradient-to-br from-[#F9A825]/20 to-[#FF8F00]/20 rounded-lg overflow-hidden">
                {isValidImageUrl(service.icon) ? (
                  <Image
                    src={service.icon!}
                    alt={service.title || "Imagen del servicio"}
                    fill
                    className="object-cover"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-[#F9A825]">
                      {service.icon && !isValidImageUrl(service.icon) ? (
                        <div className="text-6xl mb-4">{service.icon}</div>
                      ) : (
                        <svg
                          className="w-24 h-24 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      )}
                      <p className="text-lg font-semibold">
                        {service.category_name || "Servicio"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Badge de categoría */}
                {service.category_name && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#F9A825] text-white px-3 py-1 rounded-full text-sm font-medium">
                      {service.category_name}
                    </span>
                  </div>
                )}
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-2 gap-4">
                {service.duration && (
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 text-[#F9A825]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-medium text-gray-800">
                        Duración
                      </span>
                    </div>
                    <p className="text-gray-600">{service.duration}</p>
                  </div>
                )}

                {(service.price_text) && (
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 text-[#F9A825]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      <span className="font-medium text-gray-800">Precio</span>
                    </div>
                    <p className="text-2xl font-bold text-[#F9A825]">
                      {service.price_text ||
                        (typeof service.price_text === "number"
                          ? `$${service.price_text}`
                          : service.price_text)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Columna derecha - Información del servicio */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {service.title || "Servicio sin título"}
                </h1>

                <p className="text-gray-600 leading-relaxed text-lg">
                  {service.description || "Descripción no disponible."}
                </p>
              </div>

              {/* Características/Features */}
              {service.features &&
                Array.isArray(service.features) &&
                service.features.length > 0 && (
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                      ¿Qué incluye este servicio?
                    </h2>
                    <div className="space-y-3">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-[#F9A825] rounded-full flex-shrink-0 mt-2"></div>
                          <span className="text-gray-700">
                            {String(feature)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Llamada a la acción */}
              <div className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  ¿Interesado en este servicio?
                </h3>
                <p className="mb-8 opacity-90 text-lg">
                  Contacta con nuestro equipo para obtener más información y una
                  cotización personalizada para tu proyecto.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/contact?service=${encodeURIComponent(
                      service.title || "Servicio"
                    )}`}
                    className="bg-white text-[#F9A825] px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors text-center"
                  >
                    Solicitar Cotización Gratuita
                  </Link>
                  <Link
                    href={`/contact?service=${encodeURIComponent(
                      service.title || "Servicio"
                    )}&action=call`}
                    className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-medium hover:bg-white/10 transition-colors text-center"
                  >
                    Programar Llamada
                  </Link>
                </div>
              </div>

              {/* Información de contacto rápido */}
              <div className="bg-gray-100 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  ¿Tienes preguntas específicas?
                </h4>
                <p className="text-gray-600 mb-4">
                  Nuestro equipo está listo para ayudarte con cualquier consulta
                  sobre este servicio.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/contact"
                    className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
                  >
                    Contactar Ahora
                  </Link>
                  <Link
                    href="/services"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors text-center"
                  >
                    Ver Otros Servicios
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sección adicional - Servicios relacionados */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Servicios Relacionados
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Descubre otros servicios que pueden complementar tu estrategia
                de marketing digital.
              </p>
            </div>

            <div className="text-center">
              <Link
                href="/services"
                className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-8 py-4 rounded-lg font-medium transition-colors inline-block"
              >
                Ver Todos los Servicios
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("❌ Error in ServicePageDetail:", error);

    // Fallback en caso de error
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Error al cargar el servicio
          </h2>
          <p className="text-gray-600 mb-6">
            Hubo un problema al obtener la información del servicio.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/services"
              className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-6 py-3 rounded-lg transition-colors inline-block"
            >
              Ver Todos los Servicios
            </Link>
            <Link
              href="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg transition-colors inline-block"
            >
              Ir al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default ServicePageDetail;
