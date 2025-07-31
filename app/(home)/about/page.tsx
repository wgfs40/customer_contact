"use client";

import Head from "next/head";

<Head>
  <title>Sobre Nosotros | Dosis de Marketing</title>
  <meta
    name="description"
    content="Conoce más sobre nuestro equipo y nuestra misión en Dosis de Marketing."
  />
  <meta name="robots" content="index, follow" />
  <meta property="og:title" content="Sobre Nosotros | Dosis de Marketing" />
  <meta
    property="og:description"
    content="Conoce más sobre nuestro equipo y nuestra misión en Dosis de Marketing."
  />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/images/og-image.jpg" />
  <meta property="og:url" content="https://dosisdemarketing.com/about" />
</Head>;

import About from "@/components/about/About";
const AboutPage = () => {
  return (
    <div>
      <About />
    </div>
  );
};

export default AboutPage;
