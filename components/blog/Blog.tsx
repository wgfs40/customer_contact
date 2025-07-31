"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  imageUrl: string;
  featured: boolean;
}

interface BlogCategory {
  id: string;
  name: string;
  count: number;
}

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Datos de ejemplo para el blog
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title:
        "10 Estrategias de Marketing Digital que Transformarán tu Negocio en 2024",
      excerpt:
        "Descubre las últimas tendencias en marketing digital y cómo implementarlas para maximizar el crecimiento de tu empresa.",
      content:
        "El marketing digital evoluciona constantemente, y mantenerse al día con las últimas estrategias es crucial para el éxito empresarial...",
      author: "María González",
      publishDate: "2024-01-15",
      readTime: "8 min",
      category: "marketing",
      tags: ["SEO", "SEM", "Marketing Digital", "Estrategia"],
      imageUrl: "/images/blog/marketing-strategies.jpg",
      featured: true,
    },
    {
      id: 2,
      title: "Cómo Crear Contenido Viral en Redes Sociales: Guía Completa",
      excerpt:
        "Aprende los secretos para crear contenido que enganche a tu audiencia y se vuelva viral en todas las plataformas sociales.",
      content:
        "El contenido viral no es casualidad. Detrás de cada post exitoso hay una estrategia cuidadosamente planificada...",
      author: "Carlos Ruiz",
      publishDate: "2024-01-12",
      readTime: "6 min",
      category: "social",
      tags: ["Redes Sociales", "Contenido", "Viral", "Engagement"],
      imageUrl: "/images/blog/viral-content.jpg",
      featured: false,
    },
    {
      id: 3,
      title: "El Poder del Branding: Construyendo una Marca Memorable",
      excerpt:
        "Explora cómo una identidad visual sólida puede diferenciarte de la competencia y crear conexiones emocionales duraderas.",
      content:
        "Una marca fuerte va más allá de un logo bonito. Es la promesa que haces a tus clientes y la experiencia que entregas...",
      author: "Ana Martínez",
      publishDate: "2024-01-10",
      readTime: "7 min",
      category: "branding",
      tags: ["Branding", "Identidad Visual", "Marketing", "Diseño"],
      imageUrl: "/images/blog/branding-power.jpg",
      featured: true,
    },
    {
      id: 4,
      title: "SEO en 2024: Las Nuevas Reglas del Juego",
      excerpt:
        "Todo lo que necesitas saber sobre las últimas actualizaciones de los algoritmos de búsqueda y cómo adaptarte.",
      content:
        "El SEO continúa siendo fundamental para el éxito online, pero las reglas están cambiando constantemente...",
      author: "David López",
      publishDate: "2024-01-08",
      readTime: "10 min",
      category: "seo",
      tags: ["SEO", "Google", "Algoritmos", "Posicionamiento"],
      imageUrl: "/images/blog/seo-2024.jpg",
      featured: false,
    },
    {
      id: 5,
      title: "Email Marketing: Cómo Aumentar tus Conversiones en un 300%",
      excerpt:
        "Estrategias probadas para optimizar tus campañas de email marketing y conseguir resultados excepcionales.",
      content:
        "El email marketing sigue siendo uno de los canales con mejor ROI, pero requiere de estrategias específicas...",
      author: "Laura Fernández",
      publishDate: "2024-01-05",
      readTime: "5 min",
      category: "marketing",
      tags: ["Email Marketing", "Conversiones", "ROI", "Automatización"],
      imageUrl: "/images/blog/email-marketing.jpg",
      featured: false,
    },
    {
      id: 6,
      title: "Análisis de Datos: Convierte Métricas en Decisiones Estratégicas",
      excerpt:
        "Aprende a interpretar los datos de tu negocio y convertirlos en insights accionables para el crecimiento.",
      content:
        "Los datos son el nuevo petróleo del marketing digital, pero solo si sabes cómo extraer valor de ellos...",
      author: "Roberto Silva",
      publishDate: "2024-01-03",
      readTime: "9 min",
      category: "analytics",
      tags: ["Analytics", "Datos", "KPIs", "Business Intelligence"],
      imageUrl: "/images/blog/data-analytics.jpg",
      featured: true,
    },
  ];

  const categories: BlogCategory[] = [
    { id: "all", name: "Todos los artículos", count: blogPosts.length },
    {
      id: "marketing",
      name: "Marketing Digital",
      count: blogPosts.filter((p) => p.category === "marketing").length,
    },
    {
      id: "social",
      name: "Redes Sociales",
      count: blogPosts.filter((p) => p.category === "social").length,
    },
    {
      id: "branding",
      name: "Branding",
      count: blogPosts.filter((p) => p.category === "branding").length,
    },
    {
      id: "seo",
      name: "SEO",
      count: blogPosts.filter((p) => p.category === "seo").length,
    },
    {
      id: "analytics",
      name: "Analytics",
      count: blogPosts.filter((p) => p.category === "analytics").length,
    },
  ];

  // Filtrar posts basado en categoría y búsqueda
  const filteredPosts = useMemo(() => {
    let filtered =
      selectedCategory === "all"
        ? blogPosts
        : blogPosts.filter((post) => post.category === selectedCategory);

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    return filtered;
  }, [selectedCategory, searchTerm]);

  const featuredPosts = blogPosts.filter((post) => post.featured);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const openPost = (post: BlogPost) => {
    setSelectedPost(post);
    document.body.style.overflow = "hidden";
  };

  const closePost = () => {
    setSelectedPost(null);
    document.body.style.overflow = "unset";
  };

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
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Featured Posts */}
            {searchTerm === "" && selectedCategory === "all" && (
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
                              {post.category}
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#F9A825] text-white px-3 py-1 rounded-full text-xs font-medium">
                            Destacado
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span>{formatDate(post.publishDate)}</span>
                          <span className="mx-2">•</span>
                          <span>{post.readTime}</span>
                          <span className="mx-2">•</span>
                          <span className="text-[#F9A825]">{post.author}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#F9A825] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                            >
                              {tag}
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
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-1 h-8 bg-[#F9A825] mr-4"></span>
                {searchTerm
                  ? `Resultados de "${searchTerm}"`
                  : "Últimos Artículos"}
              </h2>

              <div className="space-y-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => openPost(post)}
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3">
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
                            <p className="text-xs font-medium capitalize">
                              {post.category}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span>{formatDate(post.publishDate)}</span>
                          <span className="mx-2">•</span>
                          <span>{post.readTime}</span>
                          <span className="mx-2">•</span>
                          <span className="text-[#F9A825]">{post.author}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#F9A825] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{post.excerpt}</p>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs hover:bg-[#F9A825] hover:text-white transition-colors cursor-pointer"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Empty State */}
              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                    No se encontraron artículos
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Intenta con otros términos de búsqueda o selecciona una
                    categoría diferente
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Ver todos los artículos
                  </button>
                </div>
              )}
            </div>
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
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
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
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

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
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-1 h-6 bg-[#F9A825] mr-3"></span>
                  Tags Populares
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(blogPosts.flatMap((post) => post.tags)))
                    .slice(0, 12)
                    .map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchTerm(tag)}
                        className="bg-gray-100 hover:bg-[#F9A825] hover:text-white text-gray-600 px-3 py-2 rounded-lg text-sm transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para leer artículo completo */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedPost.title}
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{formatDate(selectedPost.publishDate)}</span>
                  <span className="mx-2">•</span>
                  <span>{selectedPost.readTime}</span>
                  <span className="mx-2">•</span>
                  <span className="text-[#F9A825]">{selectedPost.author}</span>
                </div>
              </div>
              <button
                onClick={closePost}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
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

            {/* Content */}
            <div className="p-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-6 font-medium">
                  {selectedPost.excerpt}
                </p>
                <div className="text-gray-700 leading-relaxed">
                  {selectedPost.content}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#F9A825]/10 text-[#F9A825] px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
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
