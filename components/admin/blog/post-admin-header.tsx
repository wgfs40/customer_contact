import PostsAdminClient from "./post-admin-client";

interface PostsAdminHeaderProps {
  isEditing: boolean;
}

export const PostsAdminHeader = ({ isEditing }: PostsAdminHeaderProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center gap-3">
          <PostsAdminClient action="goBack">
            <button
              className="p-2 text-gray-400 hover:text-[#F9A825] transition-colors rounded-lg hover:bg-[#F9A825]/10"
              aria-label="Volver"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </PostsAdminClient>

          <div className="w-12 h-12 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? "Editar Artículo" : "Crear Nuevo Artículo"}
            </h1>
            <p className="text-gray-600">
              {isEditing
                ? "Modifica tu contenido existente"
                : "Escribe y publica contenido increíble para tu audiencia"}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <PostsAdminClient action="saveDraft">
            <button className="inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Guardar Borrador
            </button>
          </PostsAdminClient>

          <PostsAdminClient action="publish" isEditing={isEditing}>
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              {isEditing ? "Actualizar" : "Publicar Ahora"}
            </button>
          </PostsAdminClient>
        </div>
      </div>
    </div>
  );
};
