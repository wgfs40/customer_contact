import PostsAdminClient from "./post-admin-client";

interface Category {
  id: string;
  name: string;
}

interface BlogPost {
  featured?: boolean;
  category_id?: string;
}

interface SidebarSectionsProps {
  categories: Category[];
  existingPost: BlogPost | null;
}

export const SidebarSections = ({
  categories,
  existingPost,
}: SidebarSectionsProps) => {
  return (
    <>
      {/* Status Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Estado del Artículo
          </h3>
          <p className="text-gray-600 text-sm">
            Controla la visibilidad de tu artículo
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              defaultChecked={existingPost?.featured || false}
              className="w-4 h-4 text-[#F9A825] bg-gray-100 border-gray-300 rounded focus:ring-[#F9A825] focus:ring-2"
            />
            <label
              htmlFor="featured"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              ⭐ Artículo destacado
            </label>
          </div>
        </div>
      </div>

      {/* Category Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Categoría</h3>
          <p className="text-gray-600 text-sm">
            Organiza tu contenido por temas
          </p>
        </div>

        <select
          id="category_id"
          name="category_id"
          defaultValue={existingPost?.category_id || ""}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F9A825]/50 focus:border-[#F9A825] transition-colors"
          required
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Image Upload */}
      <PostsAdminClient action="imageUpload">
        <></>
      </PostsAdminClient>

      {/* Tags Manager */}
      <PostsAdminClient action="tags">
        <></>
      </PostsAdminClient>

      {/* Stats */}
      <PostsAdminClient action="stats">
        <div className="bg-gradient-to-r from-[#F9A825]/5 to-[#FF8F00]/5 rounded-2xl border border-[#F9A825]/10 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Estadísticas
            </h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Palabras:</span>
              <span className="font-semibold text-[#F9A825]" id="word-count">
                0
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Caracteres:</span>
              <span className="font-semibold text-[#F9A825]" id="char-count">
                0
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tiempo de lectura:</span>
              <span className="font-semibold text-[#F9A825]" id="read-time">
                0 min
              </span>
            </div>
          </div>
        </div>
      </PostsAdminClient>
    </>
  );
};
