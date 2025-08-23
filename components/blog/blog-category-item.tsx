"use client";

import { BlogCategory } from "@/types/home/blog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface BlogCategoriesProps {
  category: BlogCategory;
}

const BlogCategoryItem = ({ category }: BlogCategoriesProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedCategory = searchParams?.get("category") || "";
  const isSelected = selectedCategory === category.id;
  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category.id);
    router.push(`${pathname}?${params.toString()}`);
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
    </button>
  );
};

export default BlogCategoryItem;
