import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo_sin_fondo.png"
              alt="Dosis de Marketing Logo"
              width={120}
              height={120}
              className="mx-auto object-contain"
            />
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Dosis de Marketing
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Impulsa tu negocio con estrategias digitales
          </p>
        </div>

        {/* Contenedor del formulario de SignIn */}
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-orange-200">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-gray-600">
              Accede a tu panel de cliente y gestiona tu información
            </p>
          </div>

          {/* Componente SignIn de Clerk con personalización */}
          <div className="flex justify-center items-center">
            <div className="w-full flex justify-center">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "shadow-none bg-transparent border-none p-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtons: "flex flex-col gap-3",
                    socialButtonsBlockButton:
                      "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors shadow-sm",
                    socialButtonsBlockButtonText: "text-sm font-medium",
                    formButtonPrimary:
                      "bg-[#F9A825] hover:bg-[#FF8F00] text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-md w-full",
                    formFieldInput:
                      "block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F9A825] focus:border-[#F9A825] text-sm",
                    formFieldLabel:
                      "block text-sm font-medium text-gray-700 mb-2",
                    footerActionLink:
                      "text-[#F9A825] hover:text-[#FF8F00] font-medium",
                    identityPreviewText: "text-sm text-gray-600",
                    identityPreviewEditButton:
                      "text-[#F9A825] hover:text-[#FF8F00]",
                    dividerLine: "bg-gray-200",
                    dividerText: "text-gray-400 text-sm",
                    alertText: "text-red-600 text-sm",
                    formHeaderTitle: "text-xl font-semibold text-gray-900 mb-1",
                    formHeaderSubtitle: "text-gray-600 text-sm",
                  },
                }}
                redirectUrl="/customer"
                signUpUrl="/sign-up"
              />
            </div>
          </div>
        </div>

        {/* Enlaces adicionales */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <Link
              href="/"
              className="text-gray-600 hover:text-[#F9A825] transition-colors font-medium"
            >
              ← Volver al inicio
            </Link>
            <span className="hidden sm:inline text-gray-300">|</span>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-[#F9A825] transition-colors font-medium"
            >
              ¿Necesitas ayuda?
            </Link>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            ¿Por qué crear una cuenta?
          </h3>
          <div className="grid gap-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-[#F9A825] mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Gestión de Clientes
                </h4>
                <p className="text-sm text-gray-600">
                  Administra tu información personal y de contacto
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-[#F9A825] mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Acceso Seguro
                </h4>
                <p className="text-sm text-gray-600">
                  Tu información protegida con los más altos estándares
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-[#F9A825] mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Soporte Personalizado
                </h4>
                <p className="text-sm text-gray-600">
                  Atención directa para todas tus consultas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
