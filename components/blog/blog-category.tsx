import { getAllCategoriesAction } from "@/actions/blog_actions";
import BlogCategoryItem from "./blog-category-item";
import Link from "next/link";

const BlogCategory = async () => {
  const categoriesResult = await getAllCategoriesAction();

  if (!categoriesResult || categoriesResult?.data?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          No hay categorías disponibles
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          Estamos trabajando en nuevos contenidos. ¡Vuelve pronto para más
          insights!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Botón "Todas las categorías" */}
      <div className="group">
        <Link
          href="/blog"
          className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 border hover:shadow-md bg-gray-50 text-gray-700 border-gray-200 hover:bg-gradient-to-r hover:from-[#F9A825]/10 hover:to-[#FF8F00]/10 hover:border-[#F9A825]/30`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full transition-colors bg-white/80 `}
            />
            <span className="font-medium">Todas las categorías</span>
          </div>
        </Link>
      </div>

      {/* Separador elegante */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-3 text-gray-500 font-medium">
            Por categoría
          </span>
        </div>
      </div>

      {/* Lista de categorías */}
      <div className="space-y-2">
        {Array.isArray(categoriesResult?.data) &&
          categoriesResult.data.map((category) => (
            <div key={category.id} className="group">
              <BlogCategoryItem category={category} />
            </div>
          ))}
      </div>

      {/* Footer con stats */}
      {Array.isArray(categoriesResult?.data) &&
        categoriesResult.data.length > 0 && (
          <div className="pt-4 mt-6 border-t border-gray-200">
            <div className="bg-gradient-to-r from-[#F9A825]/5 to-[#FF8F00]/5 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600 font-medium">
                    Total categorías
                  </span>
                </div>
                <span className="text-lg font-bold text-[#F9A825]">
                  {categoriesResult.data.length}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-center">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  <span>Explora todos los temas</span>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Empty state mejorado */}
      {(!Array.isArray(categoriesResult?.data) ||
        categoriesResult.data.length === 0) && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-[#F9A825]/20 to-[#FF8F00]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-[#F9A825]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14-7l2 2-2 2m0 8l2 2-2 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No hay categorías disponibles
          </h3>
          <p className="text-gray-500 text-sm">
            Las categorías aparecerán aquí cuando estén disponibles
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogCategory;
