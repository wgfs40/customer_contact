"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CustomerInfoForm from "@/Components/forms/CustomerInfoForm";

interface Customer {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const CustomerPage = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Función para cargar clientes
  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/customers");

      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      } else {
        throw new Error("Error al cargar clientes");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los clientes",
        confirmButtonColor: "#FF8800",
      });
    } finally {
      setLoading(false);
    }
  };

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
          setRefreshKey((prev: number) => prev + 1);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al agregar cliente");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error instanceof Error ? error.message : "Error desconocido",
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
          setRefreshKey((prev: number) => prev + 1);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al actualizar cliente");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error instanceof Error ? error.message : "Error desconocido",
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
          setRefreshKey((prev: number) => prev + 1);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al eliminar cliente");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error instanceof Error ? error.message : "Error desconocido",
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

  // Cargar clientes cuando el componente se monte y cuando cambie refreshKey
  useEffect(() => {
    if (isSignedIn && isLoaded) {
      loadCustomers();
    }
  }, [isSignedIn, isLoaded, refreshKey]);

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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Panel de Cliente
            </h1>
            <p className="text-gray-600">
              Bienvenido/a,{" "}
              {user?.firstName || user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>

          {/* Sección de Gestión de Clientes */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Gestión de Clientes
              </h2>
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

            {/* Tabla de Clientes */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <span className="ml-3 text-gray-600">
                    Cargando clientes...
                  </span>
                </div>
              ) : customers.length === 0 ? (
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
                    No hay clientes registrados
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Comienza agregando tu primer cliente
                  </p>
                  <button
                    onClick={handleAddCustomer}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Agregar Cliente
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha de Registro
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers.map((customer: Customer, index: number) => (
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
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
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
                  <p>Total de clientes: {customers.length}</p>
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
