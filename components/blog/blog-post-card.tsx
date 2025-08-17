import { BlogPostWithDetails } from "@/types/home/blog";
import Link from "next/link";
import Image from "next/image";

interface BlogPostCardProps {
  post: BlogPostWithDetails;
  variant?: "default" | "featured" | "compact" | "horizontal";
  showCategory?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showExcerpt?: boolean;
}

const BlogPostCard = ({
  post,
  variant = "default",
  showCategory = true,
  showAuthor = true,
  showDate = true,
  showExcerpt = true,
}: BlogPostCardProps) => {
  // Función para formatear fecha
  const formatDate = (dateString: string | Date) => {
    try {
      const date =
        typeof dateString === "string" ? new Date(dateString) : dateString;
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Fecha no disponible";
    }
  };

  // Función para validar URL de imagen
  const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url) return false;
    return (
      url.startsWith("/") ||
      url.startsWith("http://") ||
      url.startsWith("https://")
    );
  };

  // Función para generar slug del post
  const getPostSlug = () => {
    return (
      post.slug ||
      post.id ||
      encodeURIComponent(post.title.toLowerCase().replace(/\s+/g, "-"))
    );
  };

  

  // Variante Horizontal (nueva variante con imagen izquierda)
  if (variant === "horizontal") {
    return (
      <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
        <Link href={`/blog/${getPostSlug()}`} className="block">
          <div className="flex flex-col md:flex-row">
            {/* Imagen izquierda */}
            <div className="relative md:w-80 h-48 md:h-64 flex-shrink-0 overflow-hidden">
              {isValidImageUrl(post.featured_image) ? (
                <Image
                  src={post.featured_image!}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#F9A825]/20 to-[#FF8F00]/20 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-[#F9A825]/50"
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
              )}

              {/* Badge de categoría sobre la imagen */}
              {showCategory && post.category?.name && (
                <div className="absolute top-3 left-3">
                  <span className="bg-[#F9A825] text-white px-2 py-1 rounded-full text-xs font-medium">
                    {post.category?.name}
                  </span>
                </div>
              )}

              {/* Tiempo de lectura */}
              {post.reading_time && (
                <div className="absolute top-3 right-3">
                  <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                    {post.reading_time} min
                  </span>
                </div>
              )}
            </div>

            {/* Contenido derecho */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                {/* Título */}
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#F9A825] transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                {showExcerpt && post.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-4 leading-relaxed text-base">
                    {post.excerpt}
                  </p>
                )}

                {/* Tags si están disponibles */}
                {post.tags &&
                  Array.isArray(post.tags) &&
                  post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 4).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs hover:bg-[#F9A825]/10 transition-colors"
                        >
                          #{typeof tag === "string" ? tag : tag.name || "tag"}
                        </span>
                      ))}
                      {post.tags.length > 4 && (
                        <span className="text-gray-400 text-xs">
                          +{post.tags.length - 4} más
                        </span>
                      )}
                    </div>
                  )}
              </div>

              {/* Footer con autor, fecha y CTA */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  {showAuthor && post.author?.full_name ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#F9A825] rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-xs">
                          {post.author?.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        Por {post.author?.full_name}
                      </span>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  {showDate && post.created_at && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
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
                      <time>{formatDate(post.created_at)}</time>
                    </div>
                  )}
                </div>

                {/* Call to action */}
                <div className="flex justify-end">
                  <span className="text-[#F9A825] font-medium text-sm group-hover:text-[#FF8F00] transition-colors inline-flex items-center gap-1">
                    Leer más
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Variante Featured (destacada) - modificada para layout horizontal también
  if (variant === "featured") {
    return (
      <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <Link href={`/blog/${getPostSlug()}`} className="block group">
          <div className="flex flex-col lg:flex-row">
            {/* Imagen izquierda */}
            <div className="relative lg:w-96 h-64 lg:h-80 overflow-hidden">
              {isValidImageUrl(post.featured_image) ? (
                <Image
                  src={post.featured_image!}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ objectFit: "cover" }}
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#F9A825]/20 to-[#FF8F00]/20 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-[#F9A825]/50"
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
              )}

              {/* Categoría sobre la imagen */}
              {showCategory && post.category?.name && (
                <div className="absolute top-4 left-4">
                  <span className="bg-[#F9A825] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category?.name}
                  </span>
                </div>
              )}
            </div>

            {/* Contenido derecho */}
            <div className="flex-1 p-8 flex flex-col justify-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 group-hover:text-[#F9A825] transition-colors">
                {post.title}
              </h2>

              {showExcerpt && post.excerpt && (
                <p className="text-gray-600 line-clamp-3 text-lg leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              )}

              {/* Información del autor y fecha */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                {showAuthor && post.author?.full_name && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#F9A825] rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {post.author?.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-base">
                      Por {post.author?.full_name}
                    </span>
                  </div>
                )}

                {showDate && post.created_at && (
                  <div className="flex items-center gap-2 text-base">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <time>{formatDate(post.created_at)}</time>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Variante Compact (ya tenía layout horizontal)
  if (variant === "compact") {
    return (
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <Link href={`/blog/${getPostSlug()}`} className="block group">
          <div className="flex">
            {/* Imagen lateral */}
            <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden">
              {isValidImageUrl(post.featured_image) ? (
                <Image
                  src={post.featured_image!}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#F9A825]/20 to-[#FF8F00]/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#F9A825]/50"
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
              )}
            </div>

            {/* Contenido derecho */}
            <div className="flex-1 p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[#F9A825] transition-colors mb-2">
                {post.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-gray-500">
                {showDate && post.created_at && (
                  <time>{formatDate(post.created_at)}</time>
                )}
                {showCategory && post.category?.name && (
                  <span className="text-[#F9A825]">{post.category?.name}</span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Variante Default (mantiene el diseño vertical original)
  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <Link href={`/blog/${getPostSlug()}`} className="block">
        {/* Imagen principal */}
        <div className="relative h-48 overflow-hidden">
          {isValidImageUrl(post.featured_image) ? (
            <Image
              src={post.featured_image!}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#F9A825]/20 to-[#FF8F00]/20 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-[#F9A825]/50"
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
          )}

          {/* Badge de categoría */}
          {showCategory && post.category?.name && (
            <div className="absolute top-3 left-3">
              <span className="bg-[#F9A825] text-white px-2 py-1 rounded-full text-xs font-medium">
                {post.category?.name}
              </span>
            </div>
          )}

          {/* Indicador de lectura si está disponible */}
          {post.reading_time && (
            <div className="absolute top-3 right-3">
              <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                {post.reading_time} min
              </span>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Título */}
          <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#F9A825] transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          {showExcerpt && post.excerpt && (
            <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Tags si están disponibles */}
          {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                >
                  #{typeof tag === "string" ? tag : tag.name || "tag"}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-gray-400 text-xs">
                  +{post.tags.length - 3} más
                </span>
              )}
            </div>
          )}

          {/* Footer con autor y fecha */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {showAuthor && post.author?.full_name ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#F9A825] rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-xs">
                    {post.author?.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {post.author?.full_name}
                </span>
              </div>
            ) : (
              <div></div>
            )}

            {showDate && post.created_at && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
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
                <time>{formatDate(post.created_at)}</time>
              </div>
            )}
          </div>

          {/* Call to action */}
          <div className="mt-4">
            <span className="text-[#F9A825] font-medium text-sm group-hover:text-[#FF8F00] transition-colors inline-flex items-center gap-1">
              Leer más
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogPostCard;
