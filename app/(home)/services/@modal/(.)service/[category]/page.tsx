import { getServicesAction } from "@/actions/services_actions";
import ServiceModal from "@/components/services/services-modal";
import { notFound } from "next/navigation";

interface ServiceModalPageProps {
  params: Promise<{ category: string }> | { category: string };
}

const ServiceModalPage = async ({ params }: ServiceModalPageProps) => {
  const resolvedParams = await Promise.resolve(params);
  const category = resolvedParams.category;

  // Obtener datos del servicio
  const serviceResponse = await getServicesAction({ category: category });

  if (!serviceResponse || serviceResponse.length === 0) {
    notFound();
  }

  const service = serviceResponse[0];

  return <ServiceModal service={service} />;
};

export default ServiceModalPage;
