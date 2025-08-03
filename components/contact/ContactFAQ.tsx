import React from "react";

const ContactFAQ = () => {
  return (
    <div>
      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-600 text-lg">
              Respuestas a las dudas más comunes sobre nuestros servicios
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "¿Cuánto tiempo toma ver resultados?",
                answer:
                  "Los resultados varían según el servicio, pero generalmente puedes ver mejoras iniciales en 2-4 semanas para redes sociales y 3-6 meses para SEO y marketing integral.",
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                question: "¿Trabajan con empresas de todos los tamaños?",
                answer:
                  "Sí, trabajamos desde startups hasta grandes corporaciones. Adaptamos nuestras estrategias al tamaño y presupuesto de cada cliente.",
                icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
              },
              {
                question: "¿Ofrecen contratos flexibles?",
                answer:
                  "Ofrecemos tanto proyectos únicos como contratos mensuales. Nuestros contratos son flexibles y sin permanencia forzosa.",
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
              },
              {
                question: "¿Qué incluye la consulta gratuita?",
                answer:
                  "En la consulta analizamos tu situación actual, identificamos oportunidades de mejora y te presentamos una estrategia inicial personalizada.",
                icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F9A825] rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={faq.icon}
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-gray-800 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactFAQ;
