"use client";

import useBlog from "@/hooks/useBlog";
import { BlogPostWithDetails } from "@/types/home/blog";
import { useState, useMemo, useEffect } from "react";
import BlogHero from "./BlogHero";
import BlogFeaturePosts from "./BlogFeaturePosts";
import BlogCategories from "./BlogCategories";

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
    return posts.filter((post) => post.featured);
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
      <BlogHero
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        loading={loading}
        searchLoading={searchLoading}
        selectedCategory={selectedCategory}
        categories={categories}
        handleClearFilters={handleClearFilters}
      />

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
                    <BlogFeaturePosts
                      featuredPosts={featuredPosts}
                      setSearchTerm={setSearchTerm}
                    />
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
                  <BlogFeaturePosts
                    featuredPosts={filteredPosts.slice(0, 2)}
                    setSearchTerm={setSearchTerm}
                  />
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
              <BlogCategories
                categories={categories}
                posts={posts.map((post) => ({
                  categoryId: post.category?.id ?? "",
                }))}
                selectedCategory={selectedCategory}                                
              />

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
    </div>
  );
};

export default Blog;
