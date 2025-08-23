"use client";

import { ServiceCategory } from "@/types/home/service";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

interface ServicesCategoryItemsProps {
  category: ServiceCategory;
  onCategorySelect?: (categorySlug: string) => void; // Callback opcional
}

const ServicesCategoryItems = ({
  category,
  onCategorySelect,
}: ServicesCategoryItemsProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const selectedCategory = searchParams.get("category");
  const isSelected = selectedCategory === category.slug;

  const handleSearch = useCallback(
    (term: string) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (term) {
          params.set("category", term);
        } else {
          params.delete("category");
        }

        const newUrl = `${pathname}?${params.toString()}`;

        // Navegación sin postback completo
        router.push(newUrl, { scroll: false });

        // Callback opcional para el componente padre
        onCategorySelect?.(term);
      });
    },
    [searchParams, pathname, router, onCategorySelect]
  );

  return (
    <div
      className={`relative flex flex-col p-4 border-b border-gray-200 transition-all duration-300 overflow-hidden ${
        isSelected
          ? "bg-gradient-to-r from-[#F9A825]/10 to-[#FF8F00]/5 border-[#F9A825]/30 shadow-sm"
          : "hover:bg-gray-50 hover:shadow-sm"
      }`}
    >
      {/* Indicador de carga */}
      {isPending && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <div className="w-6 h-6 border-2 border-[#F9A825] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`text-2xl transition-transform duration-200 ${
            isSelected ? "scale-110" : "group-hover:scale-105"
          }`}
        >
          {category.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-semibold transition-colors duration-200 ${
              isSelected
                ? "text-[#F9A825]"
                : "text-gray-800 group-hover:text-[#F9A825]"
            }`}
          >
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Botón de acción */}
      <button
        onClick={() => handleSearch(isSelected ? "" : category.slug)}
        disabled={isPending}
        className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed ${
          isSelected
            ? "bg-[#F9A825] text-white shadow-md active:scale-95"
            : "bg-gray-100 text-gray-800 hover:text-white hover:bg-[#F9A825] hover:shadow-md active:scale-95"
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          {isPending ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : isSelected ? (
            <>
              <svg
                className="w-4 h-4"
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
              Limpiar filtro
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Ver Servicios
            </>
          )}
        </span>
      </button>

      {/* Contador de servicios */}
      {category.services_count !== undefined && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          {category.services_count} servicio
          {category.services_count !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default ServicesCategoryItems;
