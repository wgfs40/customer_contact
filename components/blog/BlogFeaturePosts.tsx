import { BlogPostWithDetails } from "@/types/home/blog";
import Image from "next/image";
import { useState } from "react";
import BlogReadModal from "./BlogReadModal";

interface BlogFeaturePostsProps {
  featuredPosts: BlogPostWithDetails[];
    setSearchTerm: (term: string) => void;
}
const BlogFeaturePosts: React.FC<BlogFeaturePostsProps> = ({
  featuredPosts,
  setSearchTerm,
}: BlogFeaturePostsProps) => {
    const [selectedPost, setSelectedPost] = useState<BlogPostWithDetails | null>(null);
  const openPost = (post: BlogPostWithDetails) => {
    // Lógica para abrir el post
       setSelectedPost(post);
       document.body.style.overflow = "hidden";
  };

    const closePost = () => {
      setSelectedPost(null);
      document.body.style.overflow = "unset";
    };

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

  return (
    <div>
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
      {/* Modal para leer artículo completo */}
      {selectedPost && (
        <BlogReadModal
          selectedPost={selectedPost}
          closePost={closePost}
          setSearchTerm={setSearchTerm}
        />
      )}
    </div>
  );
};

export default BlogFeaturePosts;
