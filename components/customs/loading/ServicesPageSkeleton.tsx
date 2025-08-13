// Componente de Loading para el Hero
const HeroSkeleton = () => (
  <div className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] py-20">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <div className="h-12 bg-white/20 rounded-lg mb-6 mx-auto max-w-md animate-pulse"></div>
      <div className="h-6 bg-white/20 rounded-lg mb-8 mx-auto max-w-lg animate-pulse"></div>
      <div className="h-12 bg-white/20 rounded-lg mx-auto max-w-xs animate-pulse"></div>
    </div>
  </div>
);

// Componente de Loading para las categorías
const CategoriesSkeleton = () => (
  <div className="mb-12">
    <div className="h-8 bg-gray-200 rounded-lg mb-8 mx-auto max-w-md animate-pulse"></div>
    <div className="flex flex-wrap justify-center gap-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-12 w-32 bg-gray-200 rounded-lg animate-pulse"
        />
      ))}
    </div>
  </div>
);

// Componente de Loading para las tarjetas de servicios
const ServicesGridSkeleton = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-48 bg-gray-200 animate-pulse"></div>
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-3/4 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
);

// Componente principal de loading
const ServicesPageSkeleton = () => (
  <div className="min-h-screen flex flex-col">
    <div className="min-h-screen bg-gray-50">
      <HeroSkeleton />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <CategoriesSkeleton />
        <ServicesGridSkeleton />
      </div>
    </div>
  </div>
);

export default ServicesPageSkeleton;
