"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import Swal from "sweetalert2";
import CustomerInfoForm from "@/components/forms/CustomerInfoForm";
import { CustomerManagementSection } from "@/components/sections";
import { useCustomerManagement } from "@/hooks";

const CustomerPage = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  // Hook para gestión de clientes que incluye paginación
  const {
    paginatedData,
    loading,
    refreshKey,
    pagination,
    loadCustomers,
    handleAddCustomer,
    handleEditCustomer,
    handleDeleteCustomer,
  } = useCustomerManagement();

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
          <CustomerManagementSection
            paginatedData={paginatedData}
            loading={loading}
            pagination={pagination}
            handleAddCustomer={handleAddCustomer}
            handleEditCustomer={handleEditCustomer}
            handleDeleteCustomer={handleDeleteCustomer}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
