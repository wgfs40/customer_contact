"use client";

import Gallery from "@/components/Gallery/Gallery";
import Head from "next/head";

<Head>
  <title>Galería de Proyectos | Dosis de Marketing</title>
  <meta
    name="description"
    content="Explora nuestros proyectos de marketing digital, branding, redes sociales y desarrollo web. Resultados reales para tu empresa."
  />
  <meta name="robots" content="index, follow" />
  <meta
    property="og:title"
    content="Galería de Proyectos | Dosis de Marketing"
  />
  <meta
    property="og:description"
    content="Explora nuestros proyectos de marketing digital, branding, redes sociales y desarrollo web."
  />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/images/og-image.jpg" />
  <meta property="og:url" content="https://dosisdemarketing.com/gallery" />
</Head>;

const GalleryPage = () => {
  return (
    <>
      <Gallery />
    </>
  );
};

export default GalleryPage;
