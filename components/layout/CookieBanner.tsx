"use client";
import { useCookieConsent } from "@/hooks/useCookieConsent";

const CookieBanner = () => {
  const { isVisible, acceptCookies, rejectCookies } = useCookieConsent();

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          Este sitio web utiliza cookies para mejorar la experiencia del
          usuario.
        </p>
        <div className="flex gap-2">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            onClick={acceptCookies}
          >
            Aceptar
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
            onClick={rejectCookies}
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
