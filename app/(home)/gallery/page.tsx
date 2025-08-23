import Gallery from "@/components/Gallery/Gallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galería de Proyectos | Dosis de Marketing",
  description:
    "Explora nuestros proyectos de marketing digital, branding, redes sociales y desarrollo web.",
  robots: "index, follow",
  openGraph: {
    title: "Galería de Proyectos | Dosis de Marketing",
    description:
      "Explora nuestros proyectos de marketing digital, branding, redes sociales y desarrollo web.",
    images: ["/images/logo.jpg"],
    url: "https://dosisdemarketing.com/gallery",
  },
};

const GalleryPage = () => {
  return (
    <>
      <Gallery />
    </>
  );
};

export default GalleryPage;
