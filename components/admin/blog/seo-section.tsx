import PostsAdminClient from "./post-admin-client";


interface BlogPost {
  title?: string;
  slug?: string;
  excerpt?: string;
  meta_title?: string;
  meta_description?: string;
}

interface SeoSectionProps {
  existingPost: BlogPost | null;
}

export const SeoSection = ({ existingPost }: SeoSectionProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Configuración SEO</h2>
        </div>
        <p className="text-gray-600">
          Optimiza tu artículo para motores de búsqueda
        </p>
      </div>

      <div className="space-y-6">
        {/* Meta Title */}
        <div>
          <label
            htmlFor="meta_title"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Meta Título
          </label>
          <input
            type="text"
            id="meta_title"
            name="meta_title"
            defaultValue={existingPost?.meta_title || ""}
            placeholder="Título optimizado para SEO (máx. 60 caracteres)"
            maxLength={60}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F9A825]/50 focus:border-[#F9A825] transition-colors"
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-gray-500">
              Si está vacío, se usará el título del artículo
            </p>
            <span
              id="meta-title-count"
              className="text-sm font-medium text-gray-400"
            >
              0/60
            </span>
          </div>
        </div>

        {/* Meta Description */}
        <div>
          <label
            htmlFor="meta_description"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Meta Descripción
          </label>
          <textarea
            id="meta_description"
            name="meta_description"
            defaultValue={existingPost?.meta_description || ""}
            rows={3}
            placeholder="Descripción que aparecerá en los resultados de búsqueda (máx. 160 caracteres)"
            maxLength={160}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F9A825]/50 focus:border-[#F9A825] transition-colors resize-none"
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-gray-500">
              Si está vacía, se usará el extracto del artículo
            </p>
            <span
              id="meta-description-count"
              className="text-sm font-medium text-gray-400"
            >
              0/160
            </span>
          </div>
        </div>

        {/* SEO Score Indicator */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Puntuación SEO
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span
                id="seo-score"
                className="text-sm font-medium text-gray-600"
              >
                En progreso
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div
                id="seo-title-check"
                className="w-2 h-2 rounded-full bg-gray-300"
              ></div>
              <span className="text-gray-600">Título optimizado</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div
                id="seo-description-check"
                className="w-2 h-2 rounded-full bg-gray-300"
              ></div>
              <span className="text-gray-600">Meta descripción presente</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div
                id="seo-slug-check"
                className="w-2 h-2 rounded-full bg-gray-300"
              ></div>
              <span className="text-gray-600">URL amigable</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div
                id="seo-content-check"
                className="w-2 h-2 rounded-full bg-gray-300"
              ></div>
              <span className="text-gray-600">
                Contenido suficiente (300+ palabras)
              </span>
            </div>
          </div>
        </div>

        {/* SEO Preview */}
        <PostsAdminClient action="seoPreview">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Vista previa en Google
            </h3>

            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="space-y-1">
                <h4
                  id="seo-preview-title"
                  className="text-blue-600 text-lg hover:underline cursor-pointer line-clamp-2 leading-snug"
                >
                  {existingPost?.meta_title ||
                    existingPost?.title ||
                    "Título del artículo"}
                </h4>

                <div className="flex items-center gap-2 text-sm">
                  <svg
                    className="w-3 h-3 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p id="seo-preview-url" className="text-green-700">
                    tudominio.com › blog ›{" "}
                    {existingPost?.slug || "url-del-articulo"}
                  </p>
                </div>

                <p
                  id="seo-preview-description"
                  className="text-gray-600 text-sm mt-2 line-clamp-2 leading-relaxed"
                >
                  {existingPost?.meta_description ||
                    existingPost?.excerpt ||
                    "Descripción del artículo que aparecerá en los resultados de búsqueda. Asegúrate de que sea atractiva y descriptiva para mejorar el CTR."}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Esta es una simulación de cómo se verá en Google</span>
            </div>
          </div>
        </PostsAdminClient>

        {/* SEO Tips */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                className="w-3 h-3 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                Consejos SEO
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>
                  • Incluye palabras clave relevantes en el título y descripción
                </li>
                <li>
                  • Mantén el título bajo 60 caracteres y la descripción bajo
                  160
                </li>
                <li>• Usa un lenguaje atractivo que invite al clic</li>
                <li>• Asegúrate de que el contenido sea único y valioso</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
