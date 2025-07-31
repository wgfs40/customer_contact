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
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Datos de ejemplo - puedes reemplazar con tus imágenes reales
  const galleryImages: GalleryImage[] = [
    {
      id: 1,
      src: "/images/gallery/marketing1.jpg",
      alt: "Campaña de Marketing Digital",
      category: "marketing",
      title: "Campaña de Marketing Digital",
      description:
        "Estrategia exitosa de marketing digital para cliente corporativo",
    },
    {
      id: 2,
      src: "/images/gallery/social1.jpg",
      alt: "Gestión de Redes Sociales",
      category: "social",
      title: "Gestión de Redes Sociales",
      description: "Contenido creativo para redes sociales",
    },
    {
      id: 3,
      src: "/images/gallery/branding1.jpg",
      alt: "Proyecto de Branding",
      category: "branding",
      title: "Proyecto de Branding",
      description: "Desarrollo de identidad visual corporativa",
    },
    {
      id: 4,
      src: "/images/gallery/web1.jpg",
      alt: "Desarrollo Web",
      category: "web",
      title: "Desarrollo Web",
      description: "Sitio web responsive y optimizado",
    },
    {
      id: 5,
      src: "/images/gallery/marketing2.jpg",
      alt: "Estrategia SEO",
      category: "marketing",
      title: "Estrategia SEO",
      description: "Optimización para motores de búsqueda",
    },
    {
      id: 6,
      src: "/images/gallery/social2.jpg",
      alt: "Campaña en Redes",
      category: "social",
      title: "Campaña en Redes",
      description: "Campaña viral exitosa en redes sociales",
    },
    {
      id: 7,
      src: "/images/gallery/branding2.jpg",
      alt: "Logo Design",
      category: "branding",
      title: "Logo Design",
      description: "Diseño de logotipo para startup",
    },
    {
      id: 8,
      src: "/images/gallery/web2.jpg",
      alt: "E-commerce",
      category: "web",
      title: "E-commerce",
      description: "Tienda online con sistema de pagos",
    },
    {
      id: 9,
      src: "/images/gallery/marketing3.jpg",
      alt: "Análisis de Datos",
      category: "marketing",
      title: "Análisis de Datos",
      description: "Dashboard de métricas y KPIs",
    },
  ];

  const categories = [
    { id: "all", name: "Todos" },
    { id: "marketing", name: "Marketing" },
    { id: "social", name: "Redes Sociales" },
    { id: "branding", name: "Branding" },
    { id: "web", name: "Desarrollo Web" },
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

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Nuestra <span className="text-[#F9A825]">Galería</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explora nuestros proyectos más destacados y descubre cómo ayudamos a
            nuestros clientes a alcanzar el éxito digital
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-[#F9A825] text-white shadow-lg transform scale-105"
                  : "bg-white text-gray-700 hover:bg-[#F9A825] hover:text-white shadow-md"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="group relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
              onClick={() => openModal(image)}
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {image.title}
                    </h3>
                    <p className="text-white/90 text-sm">{image.description}</p>
                  </div>
                </div>
                {/* Zoom Icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-[#F9A825] text-white p-2 rounded-full">
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {image.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {image.description}
                </p>
                <span className="inline-block bg-[#F9A825]/10 text-[#F9A825] px-3 py-1 rounded-full text-xs font-medium">
                  {categories.find((cat) => cat.id === image.category)?.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No hay imágenes en esta categoría
            </h3>
            <p className="text-gray-500">
              Selecciona otra categoría para ver más proyectos
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-[#F9A825] text-white p-2 rounded-full hover:bg-[#FF8F00] transition-colors duration-300"
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
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <div className="relative h-96 md:h-[500px]">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedImage.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {selectedImage.description}
                </p>
                <span className="inline-block bg-[#F9A825] text-white px-4 py-2 rounded-lg text-sm font-medium">
                  {
                    categories.find((cat) => cat.id === selectedImage.category)
                      ?.name
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
