import Services from "@/components/services/Services";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios | Dosis de Marketing",
  description:
    "Descubre nuestros servicios de marketing digital, branding y desarrollo web.",
  robots: "index, follow",
  openGraph: {
    title: "Servicios | Dosis de Marketing",
    description:
      "Descubre nuestros servicios de marketing digital, branding y desarrollo web.",
    images: ["/images/logo.jpg"],
    url: "https://dosisdemarketing.com/services",
  },
};

const ServicePage = () => {
  return (
    <div className="min-h-screenflex items-center justify-center px-4">
      <Services />
    </div>
  );
};

export default ServicePage;
