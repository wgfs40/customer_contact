"use client";
import Services from "@/components/services/Services";
import Head from "next/head";
<Head>
  <title>Servicios | Dosis de Marketing</title>
  <meta
    name="description"
    content="Descubre nuestros servicios de marketing digital, branding y desarrollo web."
  />
  <meta name="robots" content="index, follow" />
  <meta property="og:title" content="Servicios | Dosis de Marketing" />
  <meta
    property="og:description"
    content="Descubre nuestros servicios de marketing digital, branding y desarrollo web."
  />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/images/og-image.jpg" />
  <meta property="og:url" content="https://dosisdemarketing.com/services" />
</Head>;
const ServicePage = () => {
  return (
    <div className="min-h-screenflex items-center justify-center px-4">
      <Services />
    </div>
  );
};

export default ServicePage;
