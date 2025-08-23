import ServicesPageSkeleton from "@/components/customs/loading/ServicesPageSkeleton";
import ServiceCard from "@/components/services/service-card";
import ServicesFilterCategories from "@/components/services/services-filter-categories";
import ServicesHero from "@/components/services/services-hero";
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

const ServicePage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string; category?: string }>;
}) => {
  const resolvedSearchParams = await searchParams;

  const query = resolvedSearchParams?.query || "";
  const page = Number(resolvedSearchParams?.page) || 1;
  const category = resolvedSearchParams?.category || "";

  return (
    <div className="min-h-screen flex flex-col">
      <div className="min-h-screen bg-gray-50">
        <ServicesHero />

        <div className="max-w-7xl mx-auto px-4 py-16">
          <Suspense fallback={<ServicesPageSkeleton />}>
            {/* Filtros de categorías */}
            <ServicesFilterCategories />
          </Suspense>

          <Suspense
            key={query + page + category}
            fallback={<ServicesPageSkeleton />}
          >
            <ServiceCard categorySlug={category || query} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
