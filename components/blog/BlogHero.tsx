interface BlogHeroProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  loading: boolean;
  searchLoading: boolean;
  selectedCategory: string;
  categories: { id: string; name: string }[];
  handleClearFilters: () => void;
}
const BlogHero: React.FC<BlogHeroProps> = ({
  searchTerm,
  setSearchTerm,
  loading,
  searchLoading,
  selectedCategory,
  categories,
  handleClearFilters,
}) => {
  return (
    <div>    
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
          </div></div>
  )
}

export default BlogHero