import BlogCategory from "@/components/blog/blog-category";
import { ReactNode, Suspense } from "react";

const BlogLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Mejorado */}
      <div className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] text-white py-20 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/3 w-3 h-3 bg-white/15 rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-white/25 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            {/* Badge superior */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">Blog Actualizado</span>
            </div>

            {/* Título principal */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent leading-tight">
              Blog de Marketing Digital
            </h1>

            {/* Subtítulo */}
            <p className="text-xl md:text-2xl lg:text-3xl mb-8 opacity-90 max-w-4xl mx-auto leading-relaxed font-light">
              Insights, estrategias y tendencias para hacer crecer tu negocio al
              siguiente nivel
            </p>

            {/* Stats mejorados */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">
                  50+
                </div>
                <div className="text-sm md:text-base opacity-80 font-medium">
                  Artículos
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/20"></div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">
                  10
                </div>
                <div className="text-sm md:text-base opacity-80 font-medium">
                  Categorías
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/20"></div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">
                  5K+
                </div>
                <div className="text-sm md:text-base opacity-80 font-medium">
                  Lectores
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal Mejorado */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contenido principal */}
          <main className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {children}
            </div>
          </main>

          {/* Sidebar mejorado */}
          <aside className="lg:w-1/4">
            <div className="sticky top-8 space-y-8">
              {/* Categorías */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#F9A825]/5 to-[#FF8F00]/5 p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14-7l2 2-2 2m0 8l2 2-2 2"
                        />
                      </svg>
                    </div>
                    Categorías
                  </h2>
                  <p className="text-gray-600 text-sm mt-2">
                    Explora artículos por tema
                  </p>
                </div>

                <div className="p-6">
                  <Suspense
                    fallback={
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-24"></div>
                              </div>
                              <div className="w-6 h-4 bg-gray-300 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    }
                  >
                    <BlogCategory />
                  </Suspense>
                </div>
              </div>

              {/* Widget de posts populares */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#F9A825]/5 to-[#FF8F00]/5 p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-white"
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
                    Populares
                  </h3>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-[#F9A825]/20 to-[#FF8F00]/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <span className="text-[#F9A825] font-bold text-lg">
                            0{i}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-[#F9A825] transition-colors">
                            Estrategias de Marketing Digital para 2024
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
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
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            hace 2 días • 5 min lectura
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Newsletter signup */}
              <div className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-2xl shadow-lg text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <div className="p-6 relative z-10">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
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
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      ¡No te pierdas nada!
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      Suscríbete y recibe los mejores consejos de marketing
                      directo en tu inbox
                    </p>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all"
                    />
                    <button className="w-full bg-white text-[#F9A825] font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50">
                      Suscribirme Gratis
                    </button>
                    <p className="text-xs text-white/70 text-center">
                      Sin spam. Cancela cuando quieras.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags populares */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#F9A825]/5 to-[#FF8F00]/5 p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-white"
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
                    Tags Populares
                  </h3>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {[
                      "SEO",
                      "Marketing Digital",
                      "Email Marketing",
                      "Social Media",
                      "Analytics",
                      "Branding",
                    ].map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-[#F9A825]/10 hover:text-[#F9A825] transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogLayout;
