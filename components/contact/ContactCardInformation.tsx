"use client";

const ContactCardInformation = () => {
  return (
    <div>
      {" "}
      {/* Card de Información de Contacto */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="font-heading text-xl font-bold text-gray-800 mb-8">
          Información de Contacto
        </h3>

        <div className="space-y-6">
          {[
            {
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              ),
              title: "Email",
              content: [
                "hola@dosisdemarketing.com",
                "proyectos@dosisdemarketing.com",
              ],
              color: "bg-green-500",
            },
            {
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              ),
              title: "Teléfono",
              content: ["+52 55 1234 5678", "WhatsApp disponible"],
              color: "bg-purple-500",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div
                className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {item.icon}
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  {item.title}
                </h4>
                <div className="space-y-1">
                  {item.content.map((line, i) => (
                    <p key={i} className="text-gray-600 text-sm">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactCardInformation;
