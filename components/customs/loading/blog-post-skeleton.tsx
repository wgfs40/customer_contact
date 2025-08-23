const BlogPostSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-6 p-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="w-full">
          <div className="flex items-start gap-6 w-full">
            {/* Icono naranja circular - lado izquierdo */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-r from-[#F9A825]/30 to-[#FF8F00]/30 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 bg-[#F9A825]/50 rounded"></div>
              </div>
            </div>

            {/* Contenido del artículo - lado derecho (ocupa todo el ancho restante) */}
            <div className="flex-1 w-full min-w-0">
              {/* Meta información (fecha, autor, tiempo) */}
              <div className="flex flex-wrap items-center gap-4 mb-3 w-full">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-24 h-3 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-20 h-3 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-16 h-3 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Título del artículo - ancho completo */}
              <div className="space-y-2 mb-3 w-full">
                <div className="w-full h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
                <div className="w-4/5 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
              </div>

              {/* Descripción/Excerpt - ancho completo */}
              <div className="space-y-2 mb-6 w-full">
                <div className="w-full h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
                <div className="w-5/6 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
              </div>

              {/* Footer con categoría y botón "Leer más" - ancho completo */}
              <div className="flex items-center justify-between w-full">
                {/* Categoría */}
                <div className="w-20 h-5 bg-gradient-to-r from-[#F9A825]/20 via-[#F9A825]/40 to-[#F9A825]/20 rounded-full animate-shimmer bg-[length:200%_100%]"></div>

                {/* Botón "Leer más" */}
                <div className="flex items-center gap-2">
                  <div className="w-16 h-4 bg-gradient-to-r from-[#F9A825]/30 via-[#F9A825]/50 to-[#F9A825]/30 rounded animate-shimmer bg-[length:200%_100%]"></div>
                  <div className="w-4 h-4 bg-[#F9A825]/40 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Línea separadora (excepto en el último elemento) */}
          {index < count - 1 && (
            <div className="mt-6 w-full border-b border-gray-100"></div>
          )}
        </div>
      ))}

      {/* Skeleton para botón de "Cargar más" */}
      <div className="flex justify-center pt-4 w-full">
        <div className="w-48 h-12 bg-gradient-to-r from-[#F9A825]/30 to-[#FF8F00]/30 rounded-xl animate-pulse flex items-center justify-center">
          <div className="flex items-center gap-2 opacity-60">
            <span className="text-sm font-medium text-gray-600">
              Cargando...
            </span>
            <div className="w-3 h-3 border border-gray-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostSkeleton;
