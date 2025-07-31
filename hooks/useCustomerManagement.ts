import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  GetCustomersWithPagination,
  PaginationParams,
  PaginatedResponse,
  Customer,
} from "@/actions/customer_info";
import { usePagination } from "./usePagination";

export interface UseCustomerManagementReturn {
  // Datos
  paginatedData: PaginatedResponse<Customer> | null;
  loading: boolean;
  refreshKey: number;

  // Paginación
  pagination: ReturnType<typeof usePagination>;

  // Acciones
  loadCustomers: () => Promise<void>;
  handleRefresh: () => void;
  handleAddCustomer: () => Promise<void>;
  handleEditCustomer: (customer: Customer) => Promise<void>;
  handleDeleteCustomer: (customer: Customer) => Promise<void>;
}

export const useCustomerManagement = (): UseCustomerManagementReturn => {
  const [paginatedData, setPaginatedData] =
    useState<PaginatedResponse<Customer> | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Hook de paginación
  const pagination = usePagination(10, "created_at", "desc");

  // Función para cargar clientes con paginación del servidor
  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const params: PaginationParams = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        search: pagination.debouncedSearchTerm,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
      };

      const response = await GetCustomersWithPagination(params);
      setPaginatedData(response);
    } catch (err) {
      console.error("Error loading customers:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los clientes",
        confirmButtonColor: "#FF8800",
      });
    } finally {
      setLoading(false);
    }
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    pagination.debouncedSearchTerm,
    pagination.sortBy,
    pagination.sortOrder,
  ]);

  // Resetear página cuando se actualiza la lista
  const handleRefresh = useCallback(() => {
    pagination.resetToFirstPage();
    setRefreshKey((prev: number) => prev + 1);
  }, [pagination]);

  // Función para agregar cliente
  const handleAddCustomer = useCallback(async () => {
    const { value: formValues } = await Swal.fire({
      title: "Agregar Nuevo Cliente",
      html:
        '<input id="name" class="swal2-input" placeholder="Nombre completo" maxlength="100">' +
        '<input id="email" class="swal2-input" placeholder="Correo electrónico" type="email">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#FF8800",
      cancelButtonColor: "#6B7280",
      preConfirm: () => {
        const name = (document.getElementById("name") as HTMLInputElement)
          ?.value;
        const email = (document.getElementById("email") as HTMLInputElement)
          ?.value;

        if (!name || !email) {
          Swal.showValidationMessage("Por favor completa todos los campos");
          return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          Swal.showValidationMessage("Por favor ingresa un email válido");
          return false;
        }

        return { name, email };
      },
    });

    if (formValues) {
      try {
        const response = await fetch("/api/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        });

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Cliente Agregado",
            text: "El cliente se ha agregado exitosamente",
            confirmButtonColor: "#FF8800",
          });
          handleRefresh();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al agregar cliente");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonColor: "#FF8800",
        });
      }
    }
  }, [handleRefresh]);

  // Función para editar cliente
  const handleEditCustomer = useCallback(
    async (customer: Customer) => {
      const { value: formValues } = await Swal.fire({
        title: "Editar Cliente",
        html:
          `<input id="name" class="swal2-input" placeholder="Nombre completo" value="${customer.name}" maxlength="100">` +
          `<input id="email" class="swal2-input" placeholder="Correo electrónico" value="${customer.email}" type="email">`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Actualizar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#FF8800",
        cancelButtonColor: "#6B7280",
        preConfirm: () => {
          const name = (document.getElementById("name") as HTMLInputElement)
            ?.value;
          const email = (document.getElementById("email") as HTMLInputElement)
            ?.value;

          if (!name || !email) {
            Swal.showValidationMessage("Por favor completa todos los campos");
            return false;
          }

          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Swal.showValidationMessage("Por favor ingresa un email válido");
            return false;
          }

          return { name, email };
        },
      });

      if (formValues) {
        try {
          const response = await fetch(`/api/customers/${customer.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formValues),
          });

          if (response.ok) {
            Swal.fire({
              icon: "success",
              title: "Cliente Actualizado",
              text: "Los datos del cliente se han actualizado exitosamente",
              confirmButtonColor: "#FF8800",
            });
            handleRefresh();
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al actualizar cliente");
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Error desconocido";
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
            confirmButtonColor: "#FF8800",
          });
        }
      }
    },
    [handleRefresh]
  );

  // Función para eliminar cliente
  const handleDeleteCustomer = useCallback(
    async (customer: Customer) => {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        html: `Estás a punto de eliminar el cliente:<br><strong>${customer.name}</strong><br>${customer.email}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#EF4444",
        cancelButtonColor: "#6B7280",
      });

      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/customers/${customer.id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            Swal.fire({
              icon: "success",
              title: "Cliente Eliminado",
              text: "El cliente se ha eliminado exitosamente",
              confirmButtonColor: "#FF8800",
            });
            handleRefresh();
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al eliminar cliente");
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Error desconocido";
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
            confirmButtonColor: "#FF8800",
          });
        }
      }
    },
    [handleRefresh]
  );

  return {
    // Datos
    paginatedData,
    loading,
    refreshKey,

    // Paginación
    pagination,

    // Acciones
    loadCustomers,
    handleRefresh,
    handleAddCustomer,
    handleEditCustomer,
    handleDeleteCustomer,
  };
};
