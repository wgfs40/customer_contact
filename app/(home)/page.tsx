"use client";

import Hero from "@/components/layout/Hero";
import Head from "next/head";
<Head>
  <title>Inicio | Dosis de Marketing</title>
  <meta
    name="description"
    content="Bienvenido a Dosis de Marketing, tu aliado en estrategias digitales."
  />
  <meta name="robots" content="index, follow" />
  <meta property="og:title" content="Inicio | Dosis de Marketing" />
  <meta
    property="og:description"
    content="Bienvenido a Dosis de Marketing, tu aliado en estrategias digitales."
  />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/images/og-image.jpg" />
  <meta property="og:url" content="https://dosisdemarketing.com/" />
</Head>;

const page = () => {
  return (
    <div>
      {" "}
      {/* Hero section */}
      <Hero />
    </div>
  );
};

export default page;
