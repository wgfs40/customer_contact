"use client";

import { ServiceWithCategory } from "@/types/home/service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ServiceModalProps {
  service: ServiceWithCategory;
}

const ServiceModal = ({ service }: ServiceModalProps) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Evitar hidratación mismatch
  useEffect(() => {
    setIsMounted(true);
    // Prevenir scroll del body
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const closeModal = () => {
    document.body.style.overflow = "unset";
    router.back();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Función para validar si es una URL válida
  const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url) return false;
    return (
      url.startsWith("/") ||
      url.startsWith("http://") ||
      url.startsWith("https://")
    );
  };

  // No renderizar hasta que esté montado
  if (!isMounted) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F9A825] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full my-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del modal */}
        <div className="border-b border-gray-200 p-6 flex justify-between items-start">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-3 mb-2">
              {service.icon && !isValidImageUrl(service.icon) && (
                <span className="text-2xl">{service.icon}</span>
              )}
              <h1 className="text-2xl font-bold text-gray-800">
                {service.title || service.description || "Servicio sin título"}
              </h1>
              {service.category_name && (
                <span className="bg-[#F9A825]/10 text-[#F9A825] px-3 py-1 rounded-full text-sm font-medium">
                  {service.category_name}
                </span>
              )}
            </div>

            {service.price_text && (
              <div className="text-3xl font-bold text-[#F9A825]">
                {service.price_text ||
                  (typeof service.price_text === "number"
                    ? `$${service.price_text}`
                    : service.price_text)}
              </div>
            )}
          </div>

          <button
            onClick={closeModal}
            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors flex-shrink-0"
            aria-label="Cerrar modal"
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

        {/* Resto del contenido igual que antes... */}
        {/* Imagen principal */}
        {isValidImageUrl(service.icon) && (
          <div className="relative h-64 w-full">
            <Image
              src={service.icon!}
              alt={
                service.title || service.description || "Imagen del servicio"
              }
              fill
              className="object-cover"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        )}

        {/* Contenido del modal */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Descripción */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Descripción del Servicio
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {service.description || "Descripción no disponible."}
            </p>
          </div>

          {/* Características */}
          {service.features &&
            Array.isArray(service.features) &&
            service.features.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  ¿Qué incluye este servicio?
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#F9A825] rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">{String(feature)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Información adicional */}
          {service.duration && (
            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
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
                  <span className="font-medium text-gray-800">Duración</span>
                </div>
                <p className="text-gray-600">{service.duration}</p>
              </div>
            </div>
          )}

          {/* Llamada a la acción */}
          <div className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-3">
              ¿Interesado en este servicio?
            </h3>
            <p className="mb-6 opacity-90">
              Contacta con nuestro equipo para obtener más información y una
              cotización personalizada.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  const serviceName =
                    service.title || service.description || "Servicio";
                  closeModal();
                  router.push(
                    `/contact?service=${encodeURIComponent(serviceName)}`
                  );
                }}
                className="bg-white text-[#F9A825] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Solicitar Cotización
              </button>
              <button
                onClick={() => {
                  const serviceName =
                    service.title || service.description || "Servicio";
                  closeModal();
                  router.push(
                    `/contact?service=${encodeURIComponent(
                      serviceName
                    )}&action=call`
                  );
                }}
                className="border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Programar Llamada
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
