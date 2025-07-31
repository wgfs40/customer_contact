import React from "react";
import { UsePaginationReturn } from "@/hooks/usePagination";

interface CustomerTableHeaderProps {
  pagination: UsePaginationReturn;
}

const CustomerTableHeader: React.FC<CustomerTableHeaderProps> = ({
  pagination,
}) => {
  const handleSort = (
    sortBy: "name" | "email" | "created_at" | "id",
    currentSortBy: string,
    currentSortOrder: string
  ) => {
    pagination.setSortBy(sortBy);
    pagination.setSortOrder(
      currentSortBy === sortBy && currentSortOrder === "asc" ? "desc" : "asc"
    );
  };

  const SortButton: React.FC<{
    sortKey: "name" | "email" | "created_at" | "id";
    children: React.ReactNode;
  }> = ({ sortKey, children }) => (
    <button
      onClick={() =>
        handleSort(sortKey, pagination.sortBy, pagination.sortOrder)
      }
      className="flex items-center gap-1 hover:text-gray-700"
    >
      {children}
      {pagination.sortBy === sortKey && (
        <span className="text-orange-500">
          {pagination.sortOrder === "asc" ? "↑" : "↓"}
        </span>
      )}
    </button>
  );

  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <SortButton sortKey="id">ID</SortButton>
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <SortButton sortKey="name">Nombre</SortButton>
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <SortButton sortKey="email">Email</SortButton>
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <SortButton sortKey="created_at">Fecha de Registro</SortButton>
        </th>
        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
          Acciones
        </th>
      </tr>
    </thead>
  );
};

export default CustomerTableHeader;
