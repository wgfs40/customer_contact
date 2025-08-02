"use client";
// Skeleton para tarjetas de servicios
const ServiceCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
    <div className="p-6">
      {/* Icon placeholder */}
      <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>

      {/* Title placeholder */}
      <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>

      {/* Description placeholder */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      {/* Features placeholder */}
      <div className="space-y-2 mb-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
            <div className="h-3 bg-gray-200 rounded flex-1"></div>
          </div>
        ))}
      </div>

      {/* Price and button placeholder */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-5 bg-gray-200 rounded w-20 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="w-24 h-8 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
    {/* Keyframe para shimmer */}
    <style jsx>{`
      @keyframes shimmer {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(100%);
        }
      }
    `}</style>
  </div>
);

export default ServiceCardSkeleton;
