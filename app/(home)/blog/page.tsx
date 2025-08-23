import BlogCategory from "@/components/blog/blog-category";
import BlogPost from "@/components/blog/blog-post";
import { Metadata } from "next";
import { Suspense } from "react";

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
    <div className="flex flex-col lg:flex-row gap-8">
      <Suspense fallback={<div>Cargando publicaciones...</div>}>
        <BlogPost category={selectedCategory} page={page} />
      </Suspense>
    </div>
  );
};

export default BlogPage;
