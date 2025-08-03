import React from "react";

const ContactCallFastAction = () => {
  return (
    <div>
      {" "}
      {/* Call to Action Rápido */}
      <div className="bg-[#F9A825] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">⚡</div>
          <h3 className="font-heading text-lg font-bold">Respuesta Rápida</h3>
        </div>
        <p className="text-white/90 mb-6 text-sm">
          ¿Necesitas una respuesta inmediata? Agenda una llamada de 15 minutos
          gratuita.
        </p>
        <button className="w-full bg-white text-[#F9A825] py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
          Agendar Llamada
        </button>
      </div>
    </div>
  );
};

export default ContactCallFastAction;
