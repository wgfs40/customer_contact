import { getServicesAction } from "@/actions/services_actions";
import Link from "next/link";

interface ServiceCardProps {
  categorySlug: string;
}

const ServiceCard = async ({ categorySlug }: ServiceCardProps) => {
  const services = await getServicesAction({
    category: categorySlug,
    limit: 50,
  });
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            key={service.id}
          >
            <div className="p-6">
              <p className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 text-[#F9A825]">
                {service.icon}
              </p>
              <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
            </div>

            {/* Actualizar botones de acción */}
            <div className="flex gap-2 p-6 border-t ">
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
          </div>
        ))}
      </div>
    </>
  );
};

export default ServiceCard;
