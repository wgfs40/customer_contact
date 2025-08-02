"use client";

const ContactHeader = () => {
  return (
    <div className="text-center mb-12">
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-6">
        Cuéntanos sobre tu{" "}
        <span className="text-[#F9A825]">proyecto</span>
      </h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
        Completa el formulario y nos pondremos en contacto contigo
        en menos de 24 horas para discutir tu proyecto.
      </p>

      {/* Indicadores de beneficios */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-green-700">
            Respuesta en 24h
          </p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-blue-700">
            Consulta gratuita
          </p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-purple-700">
            Plan personalizado
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContactHeader