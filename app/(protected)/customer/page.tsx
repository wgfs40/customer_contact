"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Swal from "sweetalert2";

const CustomerPage = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();

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
      <div className="max-w-4xl mx-auto px-4">
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
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  Swal.fire({
                    icon: "info",
                    title: "Perfil",
                    text: "Funcionalidad de perfil en desarrollo",
                    confirmButtonColor: "#FF8800",
                  });
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
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
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                Contactar Soporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
