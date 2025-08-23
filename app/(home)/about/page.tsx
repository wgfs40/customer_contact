import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros | Dosis de Marketing",
  description:
    "Conoce más sobre nuestro equipo y nuestra misión en Dosis de Marketing.",
  robots: "index, follow",
  openGraph: {
    title: "Sobre Nosotros | Dosis de Marketing",
    description:
      "Conoce más sobre nuestro equipo y nuestra misión en Dosis de Marketing.",
    type: "website",
    images: ["/images/logo.jpg"],
    url: "https://dosisdemarketing.com/about",
  },
};

import About from "@/components/about/About";
const AboutPage = () => {
  return (
    <div>
      <About />
    </div>
  );
};

export default AboutPage;
