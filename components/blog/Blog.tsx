"use client";

import Image from "next/image";
import useBlog from "@/hooks/useBlog";
import { BlogPostWithDetails } from "@/types/home/blog";
import { useState, useMemo, useEffect } from "react";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPostWithDetails | null>(
    null
  );

  // Usar el hook del blog con configuración inicial
  const {
    posts,
    categories,
    tags,
    popularPosts,
    loading,
    error,
    searchResults,
    searchLoading,
    loadCategories,
    loadTags,
    searchPosts,
    clearSearch,
    loadPopularPosts,
    updateFilters,
    clearError,
    refreshPosts,
  } = useBlog({
    autoLoad: true,
    status: "published", // Solo posts publicados
    sort_by: "publish_date",
    sort_order: "desc",
    limit: 12,
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadCategories();
    loadTags();
    loadPopularPosts(4);
  }, [loadCategories, loadTags, loadPopularPosts]);

  // Manejar búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchPosts(searchTerm, {
          category_id:
            selectedCategory !== "all" ? selectedCategory : undefined,
          limit: 20,
        });
      } else {
        clearSearch();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, searchPosts, clearSearch]);

  // Filtrar posts basado en categoría
  const filteredPosts = useMemo(() => {
    // Si hay búsqueda activa, usar resultados de búsqueda
    if (searchTerm.trim()) {
      return searchResults;
    }

    // Si no hay búsqueda, filtrar posts por categoría
    if (selectedCategory === "all") {
      return posts;
    }

    return posts.filter((post) => post.category?.id === selectedCategory);
  }, [selectedCategory, searchTerm, posts, searchResults]);

  // Posts destacados (solo cuando no hay filtros activos)
  const featuredPosts = useMemo(() => {
    return posts.filter((post) => post.is_featured);
  }, [posts]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Fecha no disponible";

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const formatReadingTime = (minutes: number | undefined) => {
    if (!minutes) return "5 min lectura";
    return `${minutes} min lectura`;
  };

  const openPost = (post: BlogPostWithDetails) => {
    setSelectedPost(post);
    document.body.style.overflow = "hidden";
  };

  const closePost = () => {
    setSelectedPost(null);
    document.body.style.overflow = "unset";
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    updateFilters({
      category_id: categoryId !== "all" ? categoryId : undefined,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    clearSearch();
    updateFilters({
      category_id: undefined,
      page: 1,
    });
  };

  // Mostrar error si existe
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Error al cargar el blog
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              clearError();
              refreshPosts();
            }}
            className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-6 py-3 rounded-lg transition-colors"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Blog de Marketing Digital
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Insights, estrategias y tendencias para hacer crecer tu negocio
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="Buscar artículos, estrategias, consejos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
                disabled={loading}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {searchLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                ) : (
                  <svg
                    className="w-6 h-6 text-gray-400"
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
                )}
              </div>
            </div>

            {/* Active filters indicator */}
            {(searchTerm || selectedCategory !== "all") && (
              <div className="mt-4 flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-4">
                  <span className="text-sm">Filtros activos:</span>
                  {searchTerm && (
                    <span className="bg-white/30 px-3 py-1 rounded-full text-sm">
                      &quot;{searchTerm}&quot;
                    </span>
                  )}
                  {selectedCategory !== "all" && (
                    <span className="bg-white/30 px-3 py-1 rounded-full text-sm">
                      {categories.find((c) => c.id === selectedCategory)?.name}
                    </span>
                  )}
                  <button
                    onClick={handleClearFilters}
                    className="bg-white/30 hover:bg-white/40 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Loading State */}
            {loading && !posts.length && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9A825]"></div>
                <span className="ml-3 text-gray-600">
                  Cargando artículos...
                </span>
              </div>
            )}

            {/* Featured Posts */}
            {!loading &&
              searchTerm === "" &&
              selectedCategory === "all" &&
              featuredPosts.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                    <span className="w-1 h-8 bg-[#F9A825] mr-4"></span>
                    Artículos Destacados
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    {featuredPosts.slice(0, 2).map((post) => (
                      <article
                        key={post.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        onClick={() => openPost(post)}
                      >
                        <div className="relative h-48 overflow-hidden">
                          {post.featured_image ? (
                            <Image
                              src={post.featured_image}
                              alt={post.title}
                              fill
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              style={{ objectFit: "cover" }}
                              priority={false}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#F9A825]/20 to-[#FF8F00]/20 flex items-center justify-center">
                              <div className="text-center text-[#F9A825]">
                                <svg
                                  className="w-16 h-16 mx-auto mb-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3v9"
                                  />
                                </svg>
                                <p className="text-sm font-medium">
                                  {post.category?.name}
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="bg-[#F9A825] text-white px-3 py-1 rounded-full text-xs font-medium">
                              Destacado
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <span>{formatDate(post.publish_date)}</span>
                            <span className="mx-2">•</span>
                            <span>{formatReadingTime(post.reading_time)}</span>
                            <span className="mx-2">•</span>
                            <span className="text-[#F9A825]">
                              {post.author?.full_name || "Autor anónimo"}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#F9A825] transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {post.tags?.slice(0, 3).map((tag) => (
                              <span
                                key={tag.id}
                                className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs hover:bg-[#F9A825] hover:text-white transition-colors"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

            {/* All Posts */}
            {!loading && (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                  <span className="w-1 h-8 bg-[#F9A825] mr-4"></span>
                  {searchTerm
                    ? `Resultados de "${searchTerm}" (${filteredPosts.length})`
                    : "Últimos Artículos"}
                </h2>

                <div className="space-y-8">
                  {filteredPosts.map((post: BlogPostWithDetails) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                      onClick={() => openPost(post)}
                    >
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          {post.featured_image ? (
                            <Image
                              src={post.featured_image}
                              alt={post.title}
                              width={400}
                              height={256}
                              className="h-48 md:h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                              style={{ objectFit: "cover" }}
                              priority={false}
                            />
                          ) : (
                            <div className="h-48 md:h-full bg-gradient-to-br from-[#F9A825]/20 to-[#FF8F00]/20 flex items-center justify-center">
                              <div className="text-center text-[#F9A825]">
                                <svg
                                  className="w-12 h-12 mx-auto mb-2"
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
                                <p className="text-xs font-medium">
                                  {post.category?.name || "General"}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <span>{formatDate(post.publish_date)}</span>
                            <span className="mx-2">•</span>
                            <span>{formatReadingTime(post.reading_time)}</span>
                            <span className="mx-2">•</span>
                            <span className="text-[#F9A825]">
                              {post.author?.full_name || "Autor anónimo"}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#F9A825] transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-4">{post.excerpt}</p>
                          <div className="flex flex-wrap gap-2">
                            {post.tags
                              ?.slice(0, 4)
                              .map((tag: { id: string; name: string }) => (
                                <span
                                  key={tag.id}
                                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs hover:bg-[#F9A825] hover:text-white transition-colors cursor-pointer"
                                  onClick={(
                                    e: React.MouseEvent<HTMLSpanElement>
                                  ) => {
                                    e.stopPropagation();
                                    setSearchTerm(tag.name);
                                  }}
                                >
                                  {tag.name}
                                </span>
                              ))}
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
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
                              {post.views_count || 0}
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
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                              {post.likes_count || 0}
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
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              {post._count?.comments_count || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Empty State */}
                {filteredPosts.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                      No se encontraron artículos
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm
                        ? `No hay resultados para "${searchTerm}"`
                        : "Intenta con otros términos de búsqueda o selecciona una categoría diferente"}
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Ver todos los artículos
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-8 space-y-8">
              {/* Categories */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-1 h-6 bg-[#F9A825] mr-3"></span>
                  Categorías
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex justify-between items-center ${
                      selectedCategory === "all"
                        ? "bg-[#F9A825] text-white shadow-md"
                        : "text-gray-700 hover:bg-[#F9A825]/10"
                    }`}
                  >
                    <span>Todas las categorías</span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        selectedCategory === "all"
                          ? "bg-white/20"
                          : "bg-gray-200"
                      }`}
                    >
                      {posts.length}
                    </span>
                  </button>

                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex justify-between items-center ${
                        selectedCategory === category.id
                          ? "bg-[#F9A825] text-white shadow-md"
                          : "text-gray-700 hover:bg-[#F9A825]/10"
                      }`}
                    >
                      <span>{category.name}</span>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          selectedCategory === category.id
                            ? "bg-white/20"
                            : "bg-gray-200"
                        }`}
                      >
                        {category._count?.posts || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Posts */}
              {popularPosts.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="w-1 h-6 bg-[#F9A825] mr-3"></span>
                    Posts Populares
                  </h3>
                  <div className="space-y-4">
                    {popularPosts.slice(0, 4).map((post, index) => (
                      <div
                        key={post.id}
                        className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        onClick={() => openPost(post)}
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-[#F9A825] text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-[#F9A825] transition-colors">
                            {post.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {post.views_count || 0} visualizaciones
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                </div>
              )}

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-[#F9A825] to-[#FF8F00] text-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">
                  Suscríbete a nuestro Newsletter
                </h3>
                <p className="mb-6 opacity-90">
                  Recibe las últimas estrategias de marketing directamente en tu
                  bandeja de entrada.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Tu email"
                    className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <button className="w-full bg-white text-[#F9A825] px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Suscribirse
                  </button>
                </div>
              </div>

              {/* Popular Tags */}
              {tags.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="w-1 h-6 bg-[#F9A825] mr-3"></span>
                    Tags Populares
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 12).map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => setSearchTerm(tag.name)}
                        className="bg-gray-100 hover:bg-[#F9A825] hover:text-white text-gray-600 px-3 py-2 rounded-lg text-sm transition-colors"
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para leer artículo completo */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePost();
          }}
        >
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedPost.title}
                </h1>
                <div className="flex items-center text-sm text-gray-500 flex-wrap gap-4">
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
                    {formatDate(selectedPost.publish_date)}
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {formatReadingTime(selectedPost.reading_time)}
                  </span>
                  <span className="flex items-center gap-1 text-[#F9A825]">
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
                    {selectedPost.author?.full_name || "Autor anónimo"}
                  </span>
                </div>
              </div>
              <button
                onClick={closePost}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors flex-shrink-0"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Featured Image */}
            {selectedPost.featured_image && (
              <Image
                src={selectedPost.featured_image}
                alt={selectedPost.title}
                width={800}
                height={256}
                className="w-full h-64 object-cover rounded-lg"
                style={{ objectFit: "cover" }}
                priority
              />
            )}

            {/* Content */}
            <div className="p-6">
              <div className="prose prose-lg max-w-none">
                {selectedPost.excerpt && (
                  <p className="text-xl text-gray-600 mb-6 font-medium border-l-4 border-[#F9A825] pl-4 italic">
                    {selectedPost.excerpt}
                  </p>
                )}
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />
              </div>

              {/* Tags */}
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map(
                      (tag: { id: string; name: string }) => (
                        <span
                          key={tag.id}
                          className="bg-[#F9A825]/10 text-[#F9A825] px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-[#F9A825] hover:text-white transition-colors"
                          onClick={() => {
                            setSearchTerm(tag.name);
                            closePost();
                          }}
                        >
                          #{tag.name}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Stats and Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-6 text-sm text-gray-600">
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
                    {selectedPost.views_count || 0} visualizaciones
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {selectedPost.likes_count || 0} me gusta
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    {selectedPost._count?.comments_count || 0} comentarios
                  </span>
                </div>

                <div className="flex gap-2">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Compartir
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors">
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
