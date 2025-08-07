"use client";

import { BlogPostWithDetails } from "@/types/home/blog";
import Image from "next/image";

interface BlogReadModalProps {
  selectedPost: BlogPostWithDetails;
  closePost: () => void;
  setSearchTerm: (term: string) => void;
}

const BlogReadModal: React.FC<BlogReadModalProps> = ({
  selectedPost,
  closePost,
  setSearchTerm,
}) => {
    if (!selectedPost) return null;

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
      {" "}
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
    </div>
  );
};

export default BlogReadModal;
