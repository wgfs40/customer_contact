"use client";

import Hero from "@/components/layout/Hero";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Inicio | Dosis de Marketing",
  description: "Bienvenido a Dosis de Marketing, tu aliado en estrategias digitales.",
  robots: "index, follow",
  openGraph: {
    title: "Inicio | Dosis de Marketing",
    description: "Bienvenido a Dosis de Marketing, tu aliado en estrategias digitales.",
    type: "website",
    images: ["/images/og-image.jpg"],
    url: "https://dosisdemarketing.com/"
  }
};

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
