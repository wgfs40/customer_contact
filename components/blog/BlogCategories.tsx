"use client";

import BlogCategoryItem from "./blog-category-item";
import { BlogCategory } from "@/types/home/blog";

interface BlogCategoriesProps {
  categories: BlogCategory[];
  posts: { categoryId: string }[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const BlogCategories = ({
  categories,
  posts,
  selectedCategory,
  onCategoryChange,
}: BlogCategoriesProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
        <span className="w-1 h-4 bg-[#F9A825] mr-2"></span>
        Categorías
      </h3>

      <div className="space-y-2">
        {/* Opción "Todas" */}
        <button
          onClick={() => onCategoryChange("")}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex justify-between items-center ${
            !selectedCategory
              ? "bg-[#F9A825] text-white shadow-md"
              : "hover:bg-[#F9A825]/10 text-gray-700 hover:text-[#F9A825]"
          }`}
        >
          <span className="font-medium">Todas las categorías</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              !selectedCategory
                ? "bg-white/20 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {posts.length}
          </span>
        </button>

        {/* Categorías individuales */}
        {categories.map((category) => (
          <BlogCategoryItem
            key={category.id}
            category={category}
            posts={posts}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogCategories;
