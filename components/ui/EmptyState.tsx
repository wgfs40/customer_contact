import React from "react";

interface EmptyStateProps {
  hasSearchTerm: boolean;
  searchTerm?: string;
  onAddCustomer: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  hasSearchTerm,
  searchTerm,
  onAddCustomer,
}) => {
  return (
    <div className="text-center py-12">
      <svg
        className="w-16 h-16 text-gray-400 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {hasSearchTerm
          ? "No se encontraron clientes"
          : "No hay clientes registrados"}
      </h3>
      <p className="text-gray-500 mb-4">
        {hasSearchTerm
          ? `No hay resultados para "${searchTerm}"`
          : "Comienza agregando tu primer cliente"}
      </p>
      {!hasSearchTerm && (
        <button
          onClick={onAddCustomer}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Agregar Cliente
        </button>
      )}
    </div>
  );
};

export default EmptyState;
