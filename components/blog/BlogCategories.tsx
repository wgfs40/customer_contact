"use client";

interface BlogCategoriesProps {
  categories: { id: string; name: string; _count?: { posts: number } }[];
  posts: { categoryId: string }[];
  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;
  updateFilters: (filters: { category_id?: string; page?: number }) => void;
}

const BlogCategories = ({
  categories,
  posts,
  selectedCategory,
  setSelectedCategory,
  updateFilters,
}: BlogCategoriesProps) => {
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    updateFilters({
      category_id: categoryId !== "all" ? categoryId : undefined,
      page: 1,
    });
  };
  return (
    <div>
      {" "}
      {/* Categories */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="w-1 h-6 bg-[#F9A825] mr-3"></span>
          Categorías
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex justify-between items-center ${
              selectedCategory === "all"
                ? "bg-[#F9A825] text-white shadow-md"
                : "text-gray-700 hover:bg-[#F9A825]/10"
            }`}
          >
            <span>Todas las categorías</span>
            <span
              className={`text-sm px-2 py-1 rounded-full ${
                selectedCategory === "all" ? "bg-white/20" : "bg-gray-200"
              }`}
            >
              {posts.length}
            </span>
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
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
                {category._count?.posts || 0}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogCategories;
