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

import Blog from "@/components/blog/Blog";

const BlogPage = () => {
  return (
    <div>
      <Blog />
    </div>
  );
};

export default BlogPage;
