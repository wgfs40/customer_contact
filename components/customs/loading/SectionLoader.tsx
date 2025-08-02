"use client";
// Loading para sección específica
const SectionLoader = ({ message = "Cargando..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="mb-4">
      <div className="w-12 h-12 bg-gradient-to-br from-[#F9A825] to-[#FF8F00] rounded-xl flex items-center justify-center animate-spin">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
      </div>
    </div>
    <p className="text-gray-600 animate-pulse">{message}</p>
  </div>
);

export default SectionLoader;
