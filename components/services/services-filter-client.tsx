"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useTransition } from "react";
import ServicesCategoryItems from "./services-category-items";
import { BlogCategory } from "@/types/home/blog";

interface ServicesFilterClientProps {
  categories: BlogCategory[];
}

const ServicesFilterClient = ({ categories }: ServicesFilterClientProps) => {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const selectedCategoryId = searchParams.get("category") || "";
  const deferredCategories = useDeferredValue(categories);

  // Limpiar filtros
  function clearAllFilters() {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }

  // Seleccionar categoría
  function handleCategorySelect(categorySlug: string) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (categorySlug) {
        params.set("category", categorySlug);
      } else {
        params.delete("category");
      }

      const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
      router.push(newUrl, { scroll: false });
    });
  }

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4">
        {/* Botón "Todos" */}
        <button
          onClick={clearAllFilters}
          disabled={isPending}
          aria-busy={isPending}
          aria-disabled={isPending}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-md transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
            !selectedCategoryId
              ? "bg-[#F9A825] text-white shadow-lg scale-105"
              : "bg-gray-100 text-gray-800 hover:text-white hover:bg-[#F9A825] hover:shadow-lg"
          }`}
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>🏢</span>
          )}
          <span>Todos los Servicios</span>
        </button>

        {/* Categorías individuales */}
        {deferredCategories.map((category) => (
          <ServicesCategoryItems
            key={category.id}
            category={category}
            onCategorySelect={handleCategorySelect}
          />
        ))}
      </div>

      {/* Indicador de filtro activo */}
      {selectedCategoryId && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-[#F9A825]/10 text-[#F9A825] px-4 py-2 rounded-lg">
            <span>Filtrando por:</span>
            <span className="font-semibold capitalize">
              {deferredCategories.find((cat) => cat.slug === selectedCategoryId)
                ?.name || selectedCategoryId.replace("-", " ")}
            </span>
            <button
              onClick={clearAllFilters}
              className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
              title="Limpiar filtro"
              aria-label="Limpiar filtro"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesFilterClient;
