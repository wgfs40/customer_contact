import Contact from "@/components/contact/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | Dosis de Marketing",
  description: "Ponte en contacto con nosotros para llevar tu negocio al siguiente nivel.",
  robots: "index, follow",
  openGraph: {
    title: "Contacto | Dosis de Marketing",
    description: "Ponte en contacto con nosotros para llevar tu negocio al siguiente nivel.",
    type: "website",
    images: ["/images/logo.jpg"],
  },
};



const ContactPage = () => {
  return (
    <div>
      <Contact />
    </div>
  );
};

export default ContactPage;
