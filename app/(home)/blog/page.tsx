"use client";
import Head from "next/head";
<Head>
  <title>Blog | Dosis de Marketing</title>
  <meta
    name="description"
    content="Descubre las últimas tendencias en marketing digital, branding y desarrollo web."
  />
  <meta name="robots" content="index, follow" />
  <meta property="og:title" content="Blog | Dosis de Marketing" />
  <meta
    property="og:description"
    content="Descubre las últimas tendencias en marketing digital, branding y desarrollo web."
  />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/images/og-image.jpg" />
  <meta property="og:url" content="https://dosisdemarketing.com/blog" />
</Head>;
import Blog from "@/components/blog/Blog";

const BlogPage = () => {
  return (
    <div>
      <Blog />
    </div>
  );
};

export default BlogPage;
