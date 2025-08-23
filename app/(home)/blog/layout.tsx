import BlogCategory from "@/components/blog/blog-category";
import { ReactNode, Suspense } from "react";

const BlogLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
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
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {children}
        <aside className="max-w-5xl mx-auto px-4 py-8">
          <BlogCategory />
        </aside>
      </div>
    </div>
  );
};

export default BlogLayout;
