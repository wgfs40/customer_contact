"use client";
import { useCookieConsent } from "@/hooks/useCookieConsent";

const PrivacySettings = () => {
  const { consentValue, acceptCookies, rejectCookies, resetConsent } =
    useCookieConsent();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">
        Configuración de Privacidad
      </h3>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Estado actual de cookies:
          <span
            className={`ml-2 px-2 py-1 rounded text-xs ${
              consentValue === "accepted"
                ? "bg-green-100 text-green-800"
                : consentValue === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {consentValue || "Sin decidir"}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          onClick={acceptCookies}
        >
          Aceptar Cookies
        </button>

        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          onClick={rejectCookies}
        >
          Rechazar Cookies
        </button>

        <button
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          onClick={resetConsent}
        >
          Restablecer
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Puedes cambiar tu preferencia en cualquier momento.
      </p>
    </div>
  );
};

export default PrivacySettings;
