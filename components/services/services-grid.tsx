import Service from "@/types/home/service";


interface ServicesGridProps {
  filteredServices: Service[];
  openServiceModal: (service: Service) => void;
}

const ServicesGrid: React.FC<ServicesGridProps> = ({
  filteredServices,
  openServiceModal,
}) => {
  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((service, index) => (
          <div
            key={service.id}
            className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer animate-fade-in-up"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: "both",
            }}
            onClick={() => openServiceModal(service)}
          >
            {/* Popular Badge */}
            {service.popular && (
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                  Más Popular
                </span>
              </div>
            )}

            {/* Service Icon */}
            <div className="p-6 pb-4">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#F9A825] transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {service.description}
              </p>
            </div>

            {/* Features Preview */}
            <div className="px-6 pb-4">
              <ul className="space-y-1">
                {service.features?.slice(0, 3).map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <svg
                      className="w-4 h-4 text-[#F9A825] mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {typeof feature === "object"
                      ? feature.feature_text
                      : String(feature)}
                  </li>
                ))}
                {service.features && service.features.length > 3 && (
                  <li className="text-xs text-[#F9A825] font-medium">
                    +{service.features.length - 3} características más
                  </li>
                )}
              </ul>
            </div>

            {/* Price and CTA */}
            <div className="px-6 pb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-lg font-bold text-[#F9A825]">
                    {service.price_text}
                  </div>
                  <div className="text-xs text-gray-500">
                    {service.duration}
                  </div>
                </div>
                <button className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Ver Detalles
                </button>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#F9A825]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ServicesGrid;
