"use client";

import Contact from "@/components/contact/Contact";
import Head from "next/head";

<Head>
  <title>Contacto | Dosis de Marketing</title>
  <meta
    name="description"
    content="Ponte en contacto con nosotros para llevar tu negocio al siguiente nivel."
  />
  <meta name="robots" content="index, follow" />
  <meta property="og:title" content="Contacto | Dosis de Marketing" />
  <meta
    property="og:description"
    content="Ponte en contacto con nosotros para llevar tu negocio al siguiente nivel."
  />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/images/og-image.jpg" />
  <meta property="og:url" content="https://dosisdemarketing.com/contact" />
</Head>;

const ContactPage = () => {
  return (
    <div>
      <Contact />
    </div>
  );
};

export default ContactPage;
