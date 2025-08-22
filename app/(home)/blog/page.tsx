import BlogContent from "@/components/blog/blog-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Dosis de Marketing",
  description:
    "Descubre las últimas tendencias en marketing digital, branding y desarrollo web.",
  robots: "index, follow",
  openGraph: {
    title: "Blog | Dosis de Marketing",
    description:
      "Descubre las últimas tendencias en marketing digital, branding y desarrollo web.",
    images: ["/images/logo.jpg"],
    url: "https://dosisdemarketing.com/blog",
  },
};

const BlogPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | null; page?: string }>;
}) => {
  // Await searchParams para Next.js 15+
  const resolvedSearchParams = await searchParams;
  const selectedCategory = resolvedSearchParams?.category || "";
  const page = Number(resolvedSearchParams?.page) || 1;

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

      {/* Componente cliente que maneja la navegación */}
      <BlogContent initialCategory={selectedCategory} initialPage={page} />
    </div>
  );
};

export default BlogPage;
