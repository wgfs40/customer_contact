import ServicesPageSkeleton from "@/components/customs/loading/ServicesPageSkeleton";
import ServicesContent from "@/components/services/service-content";
import { Metadata } from "next";
import { Suspense } from "react";

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
    type: "website",
  },
};

// Tipado correcto para searchParams
interface ServicePageProps {
  searchParams: Promise<{ category?: string }> | { category?: string };
}

const ServicePage = async ({ searchParams }: ServicePageProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<ServicesPageSkeleton />}>
          <ServicesContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
};

export default ServicePage;
