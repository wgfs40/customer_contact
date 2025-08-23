import Image from "next/image";
import {
  getAllBlogPostsAction,
  getAllCategoriesAction,
} from "@/actions/blog_actions";
import BlogManagementClient from "./blog-management-client";

interface BlogManagementProps {
  searchParams?: {
    tab?: string;
    search?: string;
    status?: string;
    category?: string;
  };
}

const BlogManagement = async ({ searchParams }: BlogManagementProps) => {
  // Obtener datos del servidor
  const [postsResult, categoriesResult] = await Promise.all([
    getAllBlogPostsAction({
      limit: 50,
      status: "published",
      sort_by: "created_at",
      sort_order: "desc",
      search: searchParams?.search,
      category_id:
        searchParams?.category !== "all" ? searchParams?.category : undefined,
    }),
    getAllCategoriesAction(),
  ]);

  // Define el tipo BlogPostWithDetails para incluir 'views'
  type BlogPostWithDetails = {
    id: string;
    title: string;
    status: string;
    created_at?: string;
    featured_image?: string;
    featured?: boolean;
    excerpt?: string;
    author?: {
      full_name?: string;
    };
    category?: {
      name: string;
    };
    views?: number;
    // agrega aquí otras propiedades que tenga un post
  };

  const posts: BlogPostWithDetails[] = postsResult?.data || [];
  // Define el tipo BlogCategory para incluir post_count
  type BlogCategory = {
    id: string;
    name: string;
    description?: string;
    post_count?: number;
    // agrega aquí otras propiedades que tenga una categoría
  };
  const categories: BlogCategory[] =
    (categoriesResult?.data as BlogCategory[]) || [];

  // Calcular estadísticas
  const stats = {
    totalPosts: posts.length,
    published: posts.filter((post) => post.status === "published").length,
    drafts: posts.filter((post) => post.status === "draft").length,
    archived: posts.filter((post) => post.status === "archived").length,
    totalViews: posts.reduce((sum, post) => sum + (post.views || 0), 0),
    avgViews:
      posts.length > 0
        ? Math.round(
            posts.reduce((sum, post) => sum + (post.views || 0), 0) /
              posts.length
          )
        : 0,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "Publicado";
      case "draft":
        return "Borrador";
      case "archived":
        return "Archivado";
      default:
        return "Desconocido";
    }
  };

  const activeTab = searchParams?.tab || "posts";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Encabezado */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
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
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Gestión del Blog
                  </h1>
                  <p className="text-gray-600">
                    Administra tus artículos, categorías y contenido
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <BlogManagementClient tab="posts">
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Nuevo Artículo
                </button>
              </BlogManagementClient>

              <BlogManagementClient>
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Exportar Datos
                </button>
              </BlogManagementClient>
            </div>
          </div>

          {/* Tarjetas de Estadísticas */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
            <div className="bg-gradient-to-r from-[#F9A825]/5 to-[#FF8F00]/5 rounded-xl p-4 border border-[#F9A825]/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Artículos</p>
                  <p className="text-2xl font-bold text-[#F9A825]">
                    {stats.totalPosts}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Publicados</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.published}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                <div>
                  <p className="text-sm text-gray-600">Borradores</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.drafts}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Total de Visualizaciones
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.totalViews.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                </div>
                <div>
                  <p className="text-sm text-gray-600">Promedio de Vistas</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.avgViews}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-6" aria-label="Pestañas">
              {[
                {
                  id: "posts",
                  name: "Artículos",
                  icon: "📝",
                  count: stats.totalPosts,
                },
                {
                  id: "categories",
                  name: "Categorías",
                  icon: "🏷️",
                  count: categories.length,
                },
                {
                  id: "analytics",
                  name: "Analíticas",
                  icon: "📊",
                  count: null,
                },
                {
                  id: "settings",
                  name: "Configuración",
                  icon: "⚙️",
                  count: null,
                },
              ].map((tab) => (
                <BlogManagementClient key={tab.id} tab={tab.id}>
                  <div
                    className={`${
                      activeTab === tab.id
                        ? "border-[#F9A825] text-[#F9A825] bg-[#F9A825]/5"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors rounded-t-xl cursor-pointer`}
                  >
                    <span>{tab.icon}</span>
                    {tab.name}
                    {tab.count && (
                      <span
                        className={`${
                          activeTab === tab.id
                            ? "bg-[#F9A825] text-white"
                            : "bg-gray-200 text-gray-600"
                        } ml-2 py-0.5 px-2 rounded-full text-xs font-medium`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </div>
                </BlogManagementClient>
              ))}
            </nav>
          </div>

          {/* Área de Contenido */}
          <div className="p-6">
            {/* Pestaña de Artículos */}
            {activeTab === "posts" && (
              <div className="space-y-6">
                {/* Filtros */}
                <BlogManagementClient>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <svg
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                        <input
                          type="text"
                          placeholder="Buscar artículos..."
                          defaultValue={searchParams?.search || ""}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F9A825]/50 focus:border-[#F9A825] transition-colors"
                        />
                      </div>
                    </div>

                    <select
                      defaultValue={searchParams?.status || "all"}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F9A825]/50 focus:border-[#F9A825] transition-colors"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="published">Publicados</option>
                      <option value="draft">Borradores</option>
                      <option value="archived">Archivados</option>
                    </select>

                    <select
                      defaultValue={searchParams?.category || "all"}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F9A825]/50 focus:border-[#F9A825] transition-colors"
                    >
                      <option value="all">Todas las categorías</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </BlogManagementClient>

                {/* Lista de Artículos */}
                <div className="space-y-4">
                  {posts.length === 0 ? (
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        No hay artículos
                      </h3>
                      <p className="text-gray-500">
                        No se encontraron artículos con los filtros aplicados.
                      </p>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors group"
                      >
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Imagen */}
                          <div className="lg:w-48 h-32 flex-shrink-0">
                            {post.featured_image ? (
                              <Image
                                src={post.featured_image}
                                alt={post.title}
                                width={200}
                                height={120}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#F9A825]/20 to-[#FF8F00]/20 rounded-lg flex items-center justify-center">
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
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Contenido */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#F9A825] transition-colors">
                                    {post.title}
                                  </h3>
                                  {post.featured && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#F9A825] to-[#FF8F00] text-white">
                                      ⭐ Destacado
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                                  <span className="flex items-center gap-1">
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
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                      />
                                    </svg>
                                    {post.author?.full_name ||
                                      "Autor desconocido"}
                                  </span>
                                  <span className="flex items-center gap-1">
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
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                    {post.created_at
                                      ? new Date(
                                          post.created_at
                                        ).toLocaleDateString("es-ES")
                                      : "Sin fecha"}
                                  </span>
                                  <span className="flex items-center gap-1">
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
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                      />
                                    </svg>
                                    {(post.views || 0).toLocaleString()}{" "}
                                    visualizaciones
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                      post.status
                                    )}`}
                                  >
                                    {getStatusText(post.status)}
                                  </span>
                                  {post.category && (
                                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                                      {post.category.name}
                                    </span>
                                  )}
                                </div>

                                {post.excerpt && (
                                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                    {post.excerpt}
                                  </p>
                                )}
                              </div>

                              {/* Acciones */}
                              <BlogManagementClient>
                                <div className="flex items-center gap-2">
                                  <button
                                    title="Editar artículo"
                                    className="p-2 text-gray-400 hover:text-[#F9A825] transition-colors rounded-lg hover:bg-[#F9A825]/10"
                                  >
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
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    title="Ver artículo"
                                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                                  >
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
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    title="Eliminar artículo"
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                                  >
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
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </BlogManagementClient>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Pestaña de Categorías */}
            {activeTab === "categories" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Gestión de Categorías
                  </h2>
                  <BlogManagementClient>
                    <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Nueva Categoría
                    </button>
                  </BlogManagementClient>
                </div>

                {categories.length === 0 ? (
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
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      No hay categorías
                    </h3>
                    <p className="text-gray-500">
                      Crea tu primera categoría para organizar tus artículos.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="bg-gradient-to-r from-[#F9A825]/5 to-[#FF8F00]/5 rounded-xl p-6 border border-[#F9A825]/10 group hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {category.name}
                          </h3>
                          <BlogManagementClient>
                            <div className="flex gap-2">
                              <button
                                title="Editar categoría"
                                className="p-1 text-gray-400 hover:text-[#F9A825] transition-colors"
                              >
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
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                              <button
                                title="Eliminar categoría"
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              >
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </BlogManagementClient>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-[#F9A825]">
                            {category.post_count || 0}
                          </span>
                          <span className="text-sm text-gray-600">
                            artículo
                            {(category.post_count || 0) !== 1 ? "s" : ""}
                          </span>
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-600 mt-2">
                            {category.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Pestaña de Analíticas */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Analíticas del Blog
                </h2>
                <div className="bg-gradient-to-r from-[#F9A825]/5 to-[#FF8F00]/5 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
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
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Analíticas Avanzadas
                  </h3>
                  <p className="text-gray-600">
                    Los gráficos y métricas detalladas se mostrarán aquí
                  </p>
                </div>
              </div>
            )}

            {/* Pestaña de Configuración */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Configuración del Blog
                </h2>
                <div className="bg-gradient-to-r from-[#F9A825]/5 to-[#FF8F00]/5 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Configuraciones Generales
                  </h3>
                  <p className="text-gray-600">
                    Panel de configuraciones generales del blog
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;
