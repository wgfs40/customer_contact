interface BlogPost {
  title?: string;
  slug?: string;
  excerpt?: string;
}

interface BasicInfoSectionProps {
  existingPost: BlogPost | null;
}

export const BasicInfoSection = ({ existingPost }: BasicInfoSectionProps) => {
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Información Básica
          </h2>
        </div>
        <p className="text-gray-600">Detalles principales de tu artículo</p>
      </div>

      <div className="space-y-6">
        {/* Title Field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Título del Artículo *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={existingPost?.title || ""}
            placeholder="Ej: Las Mejores Estrategias de SEO para 2024"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F9A825]/50 focus:border-[#F9A825] transition-colors text-lg"
            required
          />
        </div>

        {/* Slug Field */}
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            URL Amigable (Slug)
          </label>
          <div className="flex items-center">
            <span className="text-gray-500 text-sm mr-2">
              tudominio.com/blog/
            </span>
            <input
              type="text"
              id="slug"
              name="slug"
              defaultValue={existingPost?.slug || ""}
              placeholder="las-mejores-estrategias-seo-2024"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F9A825]/50 focus:border-[#F9A825] transition-colors"
            />
          </div>
        </div>

        {/* Excerpt Field */}
        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Resumen/Extracto
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            defaultValue={existingPost?.excerpt || ""}
            rows={3}
            placeholder="Breve descripción de lo que trata el artículo..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F9A825]/50 focus:border-[#F9A825] transition-colors resize-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            Máximo 160 caracteres recomendados
          </p>
        </div>
      </div>
    </div>
  );
};
