"use client";
const ContactSuccessForm = () => {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <svg
          className="w-12 h-12 text-green-500"
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
      <h3 className="font-heading text-3xl font-bold text-gray-800 mb-4">
        ¡Mensaje enviado exitosamente! 🎉
      </h3>
      <p className="text-gray-600 mb-8 text-lg">
        Hemos recibido tu consulta. Nos pondremos en contacto contigo en las
        próximas 24 horas.
      </p>
      <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#F9A825] text-white rounded-xl font-semibold hover:bg-[#FF8F00] transition-colors">
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
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        Revisa tu email para más detalles
      </div>
    </div>
  );
};

export default ContactSuccessForm;
