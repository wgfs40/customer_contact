"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import CustomerInfoForm from "@/components/forms/CustomerInfoForm";
import {
  GetCustomersWithPagination,
  PaginationParams,
  PaginatedResponse,
  Customer,
} from "@/actions/customer_info";

const CustomerPage = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [paginatedData, setPaginatedData] =
    useState<PaginatedResponse<Customer> | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Estados para paginación del servidor
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "email" | "created_at" | "id">(
    "created_at"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Resetear a la primera página cuando se busque
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Funciones de paginación del servidor
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (paginatedData?.pagination.hasPrevPage) {
      setCurrentPage((prev: number) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (paginatedData?.pagination.hasNextPage) {
      setCurrentPage((prev: number) => prev + 1);
    }
  };

  // Resetear página cuando se actualiza la lista
  const handleRefresh = () => {
    setCurrentPage(1);
    setRefreshKey((prev: number) => prev + 1);
  };

  // Función para cargar clientes con paginación del servidor
  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const params: PaginationParams = {
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm,
        sortBy,
        sortOrder,
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
  }, [currentPage, itemsPerPage, debouncedSearchTerm, sortBy, sortOrder]);

  // Función para agregar cliente
  const handleAddCustomer = async () => {
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
  };

  // Función para editar cliente
  const handleEditCustomer = async (customer: Customer) => {
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
  };

  // Función para eliminar cliente
  const handleDeleteCustomer = async (customer: Customer) => {
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
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      Swal.fire({
        icon: "warning",
        title: "Acceso Restringido",
        text: "Debes iniciar sesión para acceder a esta página.",
        confirmButtonText: "Ir a Inicio",
        confirmButtonColor: "#FF8800",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        router.push("/");
      });
    }
  }, [isLoaded, isSignedIn, router]);

  // Cargar clientes cuando el componente se monte y cuando cambien los parámetros de paginación
  useEffect(() => {
    if (isSignedIn && isLoaded) {
      loadCustomers();
    }
  }, [isSignedIn, isLoaded, refreshKey, loadCustomers]);

  // Mostrar loading mientras se verifica la autenticación
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (el useEffect manejará la redirección)
  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Panel de Cliente
                </h1>
                <p className="text-gray-600">
                  Bienvenido/a,{" "}
                  {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                </p>
              </div>
              <div>
                <Link
                  href="/"
                  className="bg-[#F9A825] hover:bg-[#FF8F00] text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-md flex items-center gap-2"
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>

          {/* Sección de Gestión de Clientes */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Gestión de Clientes
                </h2>
                {paginatedData && paginatedData.pagination.totalItems > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {paginatedData.pagination.totalItems} cliente
                    {paginatedData.pagination.totalItems !== 1 ? "s" : ""}{" "}
                    registrado
                    {paginatedData.pagination.totalItems !== 1 ? "s" : ""}
                    {paginatedData.pagination.totalPages > 1 &&
                      ` • Página ${paginatedData.pagination.currentPage} de ${paginatedData.pagination.totalPages}`}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                {/* Barra de búsqueda */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Buscar clientes..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-64"
                  />
                </div>

                {/* Selector de elementos por página */}
                {paginatedData && paginatedData.pagination.totalItems > 10 && (
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="itemsPerPage"
                      className="text-sm text-gray-600"
                    >
                      Mostrar:
                    </label>
                    <select
                      id="itemsPerPage"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
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
            </div>{" "}
            {/* Tabla de Clientes */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <span className="ml-3 text-gray-600">
                    Cargando clientes...
                  </span>
                </div>
              ) : !paginatedData || paginatedData.data.length === 0 ? (
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
                    {debouncedSearchTerm
                      ? "No se encontraron clientes"
                      : "No hay clientes registrados"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {debouncedSearchTerm
                      ? `No hay resultados para "${debouncedSearchTerm}"`
                      : "Comienza agregando tu primer cliente"}
                  </p>
                  {!debouncedSearchTerm && (
                    <button
                      onClick={handleAddCustomer}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Agregar Cliente
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <button
                            onClick={() => {
                              setSortBy("id");
                              setSortOrder(
                                sortBy === "id" && sortOrder === "asc"
                                  ? "desc"
                                  : "asc"
                              );
                            }}
                            className="flex items-center gap-1 hover:text-gray-700"
                          >
                            ID
                            {sortBy === "id" && (
                              <span className="text-orange-500">
                                {sortOrder === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                          </button>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <button
                            onClick={() => {
                              setSortBy("name");
                              setSortOrder(
                                sortBy === "name" && sortOrder === "asc"
                                  ? "desc"
                                  : "asc"
                              );
                            }}
                            className="flex items-center gap-1 hover:text-gray-700"
                          >
                            Nombre
                            {sortBy === "name" && (
                              <span className="text-orange-500">
                                {sortOrder === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                          </button>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <button
                            onClick={() => {
                              setSortBy("email");
                              setSortOrder(
                                sortBy === "email" && sortOrder === "asc"
                                  ? "desc"
                                  : "asc"
                              );
                            }}
                            className="flex items-center gap-1 hover:text-gray-700"
                          >
                            Email
                            {sortBy === "email" && (
                              <span className="text-orange-500">
                                {sortOrder === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                          </button>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <button
                            onClick={() => {
                              setSortBy("created_at");
                              setSortOrder(
                                sortBy === "created_at" && sortOrder === "asc"
                                  ? "desc"
                                  : "asc"
                              );
                            }}
                            className="flex items-center gap-1 hover:text-gray-700"
                          >
                            Fecha de Registro
                            {sortBy === "created_at" && (
                              <span className="text-orange-500">
                                {sortOrder === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                          </button>
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedData.data.map(
                        (customer: Customer, index: number) => (
                          <tr
                            key={customer.id}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{customer.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                    <span className="text-orange-600 font-medium text-sm">
                                      {customer.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {customer.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {customer.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(customer.created_at).toLocaleDateString(
                                "es-ES",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                              <div className="flex justify-center space-x-2">
                                <button
                                  onClick={() => handleEditCustomer(customer)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                                  title="Editar cliente"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteCustomer(customer)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                                  title="Eliminar cliente"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
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
                      onClick={goToPreviousPage}
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
                      onClick={goToNextPage}
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
                        {debouncedSearchTerm && (
                          <span className="text-gray-500">
                            {" "}
                            (filtrados por &ldquo;{debouncedSearchTerm}&rdquo;)
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
                          onClick={goToPreviousPage}
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
                            Math.abs(
                              page - paginatedData.pagination.currentPage
                            ) <= 2;
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
                                onClick={() => goToPage(page)}
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
                          onClick={goToNextPage}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tarjeta de Información Personal */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">
                Información Personal
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Nombre:</strong> {user?.firstName} {user?.lastName}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {user?.emailAddresses[0]?.emailAddress}
                </p>
                <p>
                  <strong>ID:</strong> {user?.id}
                </p>
              </div>
            </div>

            {/* Tarjeta de Newsletter */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Newsletter
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Estás suscrito/a a nuestro newsletter
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors">
                Gestionar Suscripción
              </button>
            </div>

            {/* Tarjeta de Configuración */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                Configuración
              </h3>
              <p className="text-sm text-green-700 mb-3">
                Personaliza tu experiencia
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors">
                Configurar
              </button>
            </div>
          </div>

          {/* Sección de Acciones */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Acciones Rápidas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomerInfoForm />
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-700 mb-3">
                  Información del Sistema
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Última actualización: {new Date().toLocaleDateString()}</p>
                  <p>Estado: Activo</p>
                  <p>Versión: 1.0.0</p>
                  <p>
                    Total de clientes:{" "}
                    {paginatedData?.pagination.totalItems || 0}
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => {
                      Swal.fire({
                        icon: "info",
                        title: "Perfil",
                        text: "Funcionalidad de perfil en desarrollo",
                        confirmButtonColor: "#FF8800",
                      });
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors text-sm"
                  >
                    Ver Perfil Completo
                  </button>
                  <button
                    onClick={() => {
                      Swal.fire({
                        icon: "info",
                        title: "Soporte",
                        text: "¿Necesitas ayuda? Contacta con nuestro equipo de soporte",
                        confirmButtonColor: "#FF8800",
                      });
                    }}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors text-sm"
                  >
                    Contactar Soporte
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
