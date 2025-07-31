"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  title: string;
  description?: string;
  color?: string; // Para placeholders coloridos
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Imágenes con placeholders profesionales
  const galleryImages: GalleryImage[] = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
      alt: "Campaña de Marketing Digital",
      category: "marketing",
      title: "Campaña de Marketing Digital",
      description:
        "Estrategia exitosa de marketing digital para cliente corporativo con ROI del 300%",
      color: "#F9A825",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
      alt: "Gestión de Redes Sociales",
      category: "social",
      title: "Gestión de Redes Sociales",
      description: "Contenido creativo que aumentó el engagement en 250%",
      color: "#FF8F00",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
      alt: "Proyecto de Branding",
      category: "branding",
      title: "Proyecto de Branding Completo",
      description:
        "Desarrollo de identidad visual corporativa para startup tecnológica",
      color: "#F57C00",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
      alt: "Desarrollo Web Profesional",
      category: "web",
      title: "Desarrollo Web Profesional",
      description: "Sitio web responsive con aumento del 180% en conversiones",
      color: "#FF6F00",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
      alt: "Estrategia SEO Avanzada",
      category: "marketing",
      title: "Estrategia SEO Avanzada",
      description:
        "Optimización que logró posición #1 en Google para 15 keywords",
      color: "#F9A825",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
      alt: "Campaña Viral en Redes",
      category: "social",
      title: "Campaña Viral en Redes",
      description: "Campaña que alcanzó 2M de visualizaciones en 48 horas",
      color: "#FF8F00",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
      alt: "Diseño de Logo Premium",
      category: "branding",
      title: "Diseño de Logo Premium",
      description:
        "Logotipo minimalista para empresa de consultoría financiera",
      color: "#F57C00",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
      alt: "E-commerce Avanzado",
      category: "web",
      title: "E-commerce Avanzado",
      description: "Tienda online con sistema de pagos y gestión de inventario",
      color: "#FF6F00",
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
      alt: "Dashboard de Analytics",
      category: "marketing",
      title: "Dashboard de Analytics",
      description:
        "Sistema de métricas y KPIs en tiempo real para decisiones data-driven",
      color: "#F9A825",
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
      alt: "Estrategia de Contenido",
      category: "social",
      title: "Estrategia de Contenido",
      description: "Plan de contenido que duplicó el alcance orgánico mensual",
      color: "#FF8F00",
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
      alt: "Manual de Marca",
      category: "branding",
      title: "Manual de Marca Corporativa",
      description:
        "Guía completa de aplicación de identidad visual empresarial",
      color: "#F57C00",
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
      alt: "Aplicación Web",
      category: "web",
      title: "Aplicación Web Personalizada",
      description:
        "Sistema web con dashboard administrativo y panel de usuario",
      color: "#FF6F00",
    },
  ];

  const categories = [
    { id: "all", name: "Todos los Proyectos", count: galleryImages.length },
    {
      id: "marketing",
      name: "Marketing Digital",
      count: galleryImages.filter((img) => img.category === "marketing").length,
    },
    {
      id: "social",
      name: "Redes Sociales",
      count: galleryImages.filter((img) => img.category === "social").length,
    },
    {
      id: "branding",
      name: "Branding",
      count: galleryImages.filter((img) => img.category === "branding").length,
    },
    {
      id: "web",
      name: "Desarrollo Web",
      count: galleryImages.filter((img) => img.category === "web").length,
    },
  ];

  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  const openModal = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "unset";
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      marketing: "📈",
      social: "📱",
      branding: "🎨",
      web: "💻",
      all: "🎯",
    };
    return icons[category as keyof typeof icons] || "📁";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#F9A825] via-[#FF8F00] to-[#F57C00] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Nuestra <span className="text-white drop-shadow-lg">Galería</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Explora nuestros proyectos más destacados y descubre cómo
              transformamos ideas en éxito digital
            </p>
            <div className="flex items-center justify-center gap-8 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span>+150 Proyectos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span>98% Satisfacción</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Filter Buttons */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Filtra por Categoría
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-[#F9A825] text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-[#F9A825] hover:text-white shadow-md hover:shadow-lg"
                }`}
              >
                <span className="text-lg">{getCategoryIcon(category.id)}</span>
                <span>{category.name}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
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

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
              onClick={() => openModal(image)}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-[#F9A825] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <span>{getCategoryIcon(image.category)}</span>
                  {categories.find((cat) => cat.id === image.category)?.name}
                </span>
              </div>

              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {image.title}
                    </h3>
                    <p className="text-white/90 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                      {image.description}
                    </p>
                  </div>
                </div>

                {/* Zoom Icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                  <div className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full border border-white/30">
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#F9A825] transition-colors">
                  {image.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {image.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#F9A825]"></div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {
                        categories.find((cat) => cat.id === image.category)
                          ?.name
                      }
                    </span>
                  </div>
                  <button className="text-[#F9A825] hover:text-[#FF8F00] font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Ver proyecto
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Subtle border effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#F9A825]/20 rounded-xl transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No hay proyectos en esta categoría
            </h3>
            <p className="text-gray-500 mb-6">
              Selecciona otra categoría para ver más proyectos increíbles
            </p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Ver todos los proyectos
            </button>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "150+", label: "Proyectos Completados", icon: "🎯" },
              { number: "98%", label: "Satisfacción del Cliente", icon: "⭐" },
              { number: "50+", label: "Clientes Activos", icon: "🤝" },
              { number: "5", label: "Años de Experiencia", icon: "📈" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-[#F9A825] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl max-h-[90vh] w-full">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-[#F9A825] hover:bg-[#FF8F00] text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
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

            {/* Modal Content */}
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <div className="relative h-96 md:h-[500px]">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#F9A825] px-3 py-1 rounded-full text-xs font-semibold">
                      {
                        categories.find(
                          (cat) => cat.id === selectedImage.category
                        )?.name
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {selectedImage.title}
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {selectedImage.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                    <span>Solicitar Cotización</span>
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  <button className="border-2 border-[#F9A825] text-[#F9A825] hover:bg-[#F9A825] hover:text-white px-6 py-3 rounded-lg font-semibold transition-all">
                    Ver Más Detalles
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

export default Gallery;
