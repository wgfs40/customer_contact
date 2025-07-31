import React from "react";
import { Customer, PaginatedResponse } from "@/actions/customer_info";
import { UsePaginationReturn } from "@/hooks/usePagination";
import { CustomerTable } from "@/components/table";
import { EmptyState } from "@/components/ui";

interface CustomerManagementSectionProps {
  paginatedData: PaginatedResponse<Customer> | null;
  loading: boolean;
  pagination: UsePaginationReturn;
  handleAddCustomer: () => Promise<void>;
  handleEditCustomer: (customer: Customer) => Promise<void>;
  handleDeleteCustomer: (customer: Customer) => Promise<void>;
}

const CustomerManagementSection: React.FC<CustomerManagementSectionProps> = ({
  paginatedData,
  loading,
  pagination,
  handleAddCustomer,
  handleEditCustomer,
  handleDeleteCustomer,
}) => {
  return (
    <div className="mb-8">
      {/* Header de la sección */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Gestión de Clientes
          </h2>
          {paginatedData && paginatedData.pagination.totalItems > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {paginatedData.pagination.totalItems} cliente
              {paginatedData.pagination.totalItems !== 1 ? "s" : ""} registrado
              {paginatedData.pagination.totalItems !== 1 ? "s" : ""}
              {paginatedData.pagination.totalPages > 1 &&
                ` • Página ${paginatedData.pagination.currentPage} de ${paginatedData.pagination.totalPages}`}
            </p>
          )}
        </div>

        {/* Controles de la sección */}
        <div className="flex items-center gap-4">
          {/* Barra de búsqueda */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={pagination.searchTerm}
              onChange={(e) => {
                pagination.setSearchTerm(e.target.value);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-64"
            />
          </div>

          {/* Selector de elementos por página */}
          {paginatedData && paginatedData.pagination.totalItems > 10 && (
            <div className="flex items-center gap-2">
              <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
                Mostrar:
              </label>
              <select
                id="itemsPerPage"
                value={pagination.itemsPerPage}
                onChange={(e) => {
                  pagination.setItemsPerPage(Number(e.target.value));
                }}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">por página</span>
            </div>
          )}

          {/* Botón Agregar Cliente */}
          <button
            onClick={handleAddCustomer}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Agregar Cliente
          </button>
        </div>
      </div>

      {/* Tabla de Clientes */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-600">Cargando clientes...</span>
          </div>
        ) : !paginatedData || paginatedData.data.length === 0 ? (
          <EmptyState
            hasSearchTerm={!!pagination.debouncedSearchTerm}
            searchTerm={pagination.debouncedSearchTerm}
            onAddCustomer={handleAddCustomer}
          />
        ) : (
          <CustomerTable
            customers={paginatedData.data}
            pagination={pagination}
            onEditCustomer={handleEditCustomer}
            onDeleteCustomer={handleDeleteCustomer}
          />
        )}
      </div>

      {/* Componente de Paginación */}
      {paginatedData &&
        paginatedData.pagination.totalItems > 0 &&
        paginatedData.pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              {/* Paginación móvil */}
              <button
                onClick={() =>
                  pagination.goToPreviousPage(
                    paginatedData.pagination.hasPrevPage
                  )
                }
                disabled={!paginatedData.pagination.hasPrevPage}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  !paginatedData.pagination.hasPrevPage
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                Anterior
              </button>
              <button
                onClick={() =>
                  pagination.goToNextPage(paginatedData.pagination.hasNextPage)
                }
                disabled={!paginatedData.pagination.hasNextPage}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  !paginatedData.pagination.hasNextPage
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando{" "}
                  <span className="font-medium">
                    {(paginatedData.pagination.currentPage - 1) *
                      paginatedData.pagination.itemsPerPage +
                      1}
                  </span>{" "}
                  -{" "}
                  <span className="font-medium">
                    {Math.min(
                      paginatedData.pagination.currentPage *
                        paginatedData.pagination.itemsPerPage,
                      paginatedData.pagination.totalItems
                    )}
                  </span>{" "}
                  de{" "}
                  <span className="font-medium">
                    {paginatedData.pagination.totalItems}
                  </span>{" "}
                  clientes
                  {pagination.debouncedSearchTerm && (
                    <span className="text-gray-500">
                      {" "}
                      (filtrados por &ldquo;{pagination.debouncedSearchTerm}
                      &rdquo;)
                    </span>
                  )}
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  {/* Botón Anterior */}
                  <button
                    onClick={() =>
                      pagination.goToPreviousPage(
                        paginatedData.pagination.hasPrevPage
                      )
                    }
                    disabled={!paginatedData.pagination.hasPrevPage}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                      !paginatedData.pagination.hasPrevPage
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-gray-500 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Anterior</span>
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Números de página */}
                  {Array.from(
                    { length: paginatedData.pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => {
                    const isCurrentPage =
                      page === paginatedData.pagination.currentPage;
                    const isNearCurrentPage =
                      Math.abs(page - paginatedData.pagination.currentPage) <=
                      2;
                    const isFirstOrLast =
                      page === 1 ||
                      page === paginatedData.pagination.totalPages;

                    if (
                      paginatedData.pagination.totalPages <= 7 ||
                      isNearCurrentPage ||
                      isFirstOrLast
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => pagination.goToPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            isCurrentPage
                              ? "z-10 bg-orange-50 border-orange-500 text-orange-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }

                    if (
                      page === paginatedData.pagination.currentPage - 3 ||
                      page === paginatedData.pagination.currentPage + 3
                    ) {
                      return (
                        <span
                          key={page}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }

                    return null;
                  })}

                  {/* Botón Siguiente */}
                  <button
                    onClick={() =>
                      pagination.goToNextPage(
                        paginatedData.pagination.hasNextPage
                      )
                    }
                    disabled={!paginatedData.pagination.hasNextPage}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                      !paginatedData.pagination.hasNextPage
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-gray-500 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Siguiente</span>
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default CustomerManagementSection;
