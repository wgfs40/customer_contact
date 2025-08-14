import { ServiceWithCategory } from "@/types/home/service";
import Link from "next/link";

interface ServiceCardProps {
  service: ServiceWithCategory;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  // ... resto del código igual ...

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      

      {/* Actualizar botones de acción */}
      <div className="flex gap-2">
        <Link
          href={`/services/service/${service.category_slug}`}
          className="flex-1 bg-[#F9A825] hover:bg-[#FF8F00] text-white py-3 px-4 rounded-lg font-medium transition-colors text-center"
        >
          Ver Detalles
        </Link>

        {service.featured && (
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* ... resto del contenido igual ... */}
    </div>
  );
};

export default ServiceCard;
