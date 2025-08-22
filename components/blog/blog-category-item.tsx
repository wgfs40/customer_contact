"use client";

interface BlogCategoriesProps {
  category: {
    id: string;
    name: string;
    slug?: string;
    _count?: { posts: number };
  };
  posts: { categoryId: string }[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const BlogCategoryItem = ({
  category,
  posts,
  selectedCategory,
  onCategoryChange,
}: BlogCategoriesProps) => {
  const isSelected =
    selectedCategory === category.id || selectedCategory === category.slug;
  const postCount = posts.filter(
    (post) => post.categoryId === category.id
  ).length;

  const handleClick = () => {
    onCategoryChange(isSelected ? "" : category.slug || category.id);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex justify-between items-center ${
        isSelected
          ? "bg-[#F9A825] text-white shadow-md"
          : "hover:bg-[#F9A825]/10 text-gray-700 hover:text-[#F9A825]"
      }`}
    >
      <span className="font-medium">{category.name}</span>

      <span
        className={`text-xs px-2 py-1 rounded-full ${
          isSelected ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
        }`}
      >
        {category._count?.posts || postCount || 0}
      </span>
    </button>
  );
};

export default BlogCategoryItem;
