// Exportar todos los hooks desde este archivo para facilitar las importaciones
export { usePagination } from "./usePagination";
export { useCustomerManagement } from "./useCustomerManagement";

// Exportar tipos también
export type {
  PaginationState,
  PaginationActions,
  UsePaginationReturn,
} from "./usePagination";

export type { UseCustomerManagementReturn } from "./useCustomerManagement";
