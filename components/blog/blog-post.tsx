import { getAllBlogPostsAction } from "@/actions/blog_actions";
import Image from "next/image";
import Link from "next/link";

const BlogPost = async ({
  category,
  page,
}: {
  category: string;
  page: number;
}) => {
  const postsResult = await getAllBlogPostsAction({
    limit: 12,
    status: "published",
    sort_by: "publish_date",
    sort_order: "desc",
    category_id: category || undefined,
    page: page || 1,
  });

  if (!postsResult || postsResult?.data?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="w-24 h-24 bg-gradient-to-r from-[#F9A825]/20 to-[#FF8F00]/20 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-[#F9A825]"
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
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          No hay artículos disponibles
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          {category
            ? "No encontramos artículos en esta categoría. Prueba con otra categoría o explora todos los artículos."
            : "Estamos trabajando en nuevos contenidos. ¡Vuelve pronto para más insights!"}
        </p>
        {category && (
          <Link
            href="/blog"
            className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Ver todos los artículos
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2">
      {/* Header con contador */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-full"></div>
          <span className="text-sm font-medium text-gray-600">
            {postsResult.data?.length} artículo
            {postsResult.data?.length !== 1 ? "s" : ""} encontrado
            {postsResult.data?.length !== 1 ? "s" : ""}
          </span>
        </div>

        {category && (
          <div className="flex items-center gap-2 text-sm text-[#F9A825] bg-[#F9A825]/10 px-3 py-1 rounded-full">
            <svg
              className="w-3 h-3"
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
            Filtrado
          </div>
        )}
      </div>

      {/* Grid de posts */}
      <div className="space-y-6">
        {postsResult.data?.map((post, index) => (
          <article
            key={post.id}
            className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex flex-col md:flex-row">
              {/* Imagen del post */}
              <div className="md:w-1/3 relative overflow-hidden bg-gradient-to-br from-[#F9A825]/10 to-[#FF8F00]/10">
                {post.featured_image ? (
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    width={400}
                    height={250}
                    className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-64 md:h-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-full flex items-center justify-center">
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
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Badge destacado */}
                {post.featured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    ⭐ Destacado
                  </div>
                )}

                {/* Overlay de categoría */}
                {post.category && (
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-[#F9A825] px-3 py-1 rounded-full text-xs font-medium">
                    {post.category.name}
                  </div>
                )}
              </div>

              {/* Contenido del post */}
              <div className="md:w-2/3 p-4 flex flex-col justify-between">
                <div className="flex-1">
                  {/* Meta información */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
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
                      <span>
                        {post.publish_date
                          ? new Date(post.publish_date).toLocaleDateString(
                              "es-ES",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "Fecha no disponible"}
                      </span>
                    </div>

                    {post.author && (
                      <div className="flex items-center gap-1">
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
                        <span>{post.author.full_name}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
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
                      <span>{post.reading_time || "5"} min lectura</span>
                    </div>
                  </div>

                  {/* Título */}
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#F9A825] transition-colors duration-300 leading-tight">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt ||
                      "Descubre más sobre este interesante tema en nuestro artículo completo..."}
                  </p>
                </div>

                {/* Footer del post */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    {post.tags &&
                      post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-[#F9A825]/10 hover:text-[#F9A825] transition-colors"
                        >
                          #{String(tag)}
                        </span>
                      ))}
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-[#F9A825] hover:text-[#FF8F00] font-medium text-sm transition-all duration-300 hover:gap-3 group"
                  >
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
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Paginación */}
      {postsResult.data && postsResult.data.length >= 12 && (
        <div className="flex justify-center pt-8 border-t border-gray-100">
          <Link
            href={`/blog?${category ? `category=${category}&` : ""}page=${
              page + 1
            }`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <span>Cargar más artículos</span>
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
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogPost;
