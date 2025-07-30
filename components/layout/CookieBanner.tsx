import React from "react";

const CookieBanner = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4">
      <p className="text-sm">
        Este sitio web utiliza cookies para mejorar la experiencia del usuario.
      </p>
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Aceptar
      </button>
    </div>
  );
};

export default CookieBanner;
