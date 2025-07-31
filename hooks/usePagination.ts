import { useState, useEffect, useCallback } from "react";

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;
  debouncedSearchTerm: string;
  sortBy: "name" | "email" | "created_at" | "id";
  sortOrder: "asc" | "desc";
}

export interface PaginationActions {
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (sort: "name" | "email" | "created_at" | "id") => void;
  setSortOrder: (order: "asc" | "desc") => void;
  goToPage: (page: number) => void;
  goToPreviousPage: (hasPrevPage: boolean) => void;
  goToNextPage: (hasNextPage: boolean) => void;
  resetToFirstPage: () => void;
}

export interface UsePaginationReturn
  extends PaginationState,
    PaginationActions {}

export const usePagination = (
  initialItemsPerPage: number = 10,
  initialSortBy: "name" | "email" | "created_at" | "id" = "created_at",
  initialSortOrder: "asc" | "desc" = "desc"
): UsePaginationReturn => {
  // Estados para paginación del servidor
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "email" | "created_at" | "id">(
    initialSortBy
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Resetear a la primera página cuando se busque
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Funciones de paginación del servidor
  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const goToPreviousPage = useCallback((hasPrevPage: boolean) => {
    if (hasPrevPage) {
      setCurrentPage((prev: number) => prev - 1);
    }
  }, []);

  const goToNextPage = useCallback((hasNextPage: boolean) => {
    if (hasNextPage) {
      setCurrentPage((prev: number) => prev + 1);
    }
  }, []);

  const resetToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Función personalizada para setItemsPerPage que también resetea la página
  const handleSetItemsPerPage = useCallback((items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  }, []);

  return {
    // Estados
    currentPage,
    itemsPerPage,
    searchTerm,
    debouncedSearchTerm,
    sortBy,
    sortOrder,
    // Acciones
    setCurrentPage,
    setItemsPerPage: handleSetItemsPerPage,
    setSearchTerm,
    setSortBy,
    setSortOrder,
    goToPage,
    goToPreviousPage,
    goToNextPage,
    resetToFirstPage,
  };
};
