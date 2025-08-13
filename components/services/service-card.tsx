import { ServiceWithCategory } from "@/types/home/service";

interface ServiceCardProps {
  service: ServiceWithCategory;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md">
      <span className="block text-3xl text-gray-500 p-4">{service.icon}</span>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{service.category_name}</h3>
        <p className="text-gray-600">{service.description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
