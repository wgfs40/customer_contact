import { ServiceCategory } from "@/types/home/service";
import Link from "next/link";

interface ServicesFilterCategoriesProps {
  categories: ServiceCategory[];
  selectedCategoryId?: string;
  currentPath: string;
}

const ServicesFilterCategories = ({
  categories,
  selectedCategoryId,
  currentPath,
}: ServicesFilterCategoriesProps) => {
  return (
    <>
      {/* Filter Categories */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Encuentra el Servicio Perfecto para tu Negocio
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {/* Botón "Todos" */}
          <Link
            href={currentPath}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-md ${
              !selectedCategoryId
                ? "bg-[#F9A825] text-white"
                : "bg-gray-100 text-gray-800 hover:text-white hover:bg-[#F9A825]"
            }`}
          >
            <span>🏢</span>
            <span>Todos los Servicios</span>
          </Link>

          {categories.map((category) => {
            const isSelected = selectedCategoryId === category.id;

            return (
              <Link
                key={category.id}
                href={`${currentPath}?category=${category.id}`}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-md ${
                  isSelected
                    ? "bg-[#F9A825] text-white"
                    : "bg-gray-100 text-gray-800 hover:text-white hover:bg-[#F9A825]"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                {category.services_count && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {category.services_count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ServicesFilterCategories;
