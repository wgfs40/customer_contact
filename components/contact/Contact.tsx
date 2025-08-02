"use client";

import useContacts from "@/hooks/useContacts";
import { ContactFormData } from "@/types/home/contact";
import React, { useState } from "react";
import HeroContact from "./HeroContact";
import ContactForm from "./ContactForm";
import ContactSuccessForm from "./ContactSuccessForm";
import ContactHeader from "./ContactHeader";
import ContactError from "./ContactError";

const Contact = () => {
  const { createContact, error, validateEmail } = useContacts();

  const [formData, setFormData] = useState<ContactFormData>({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    contact_type: "general",
    source: "website",
    preferred_contact_method: "email",
    is_newsletter_subscribed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Validación del formulario
  const validateForm = async (): Promise<boolean> => {
    const errors: Record<string, string> = {};

    if (!formData.full_name?.trim()) {
      errors.full_name = "El nombre es requerido";
    }

    if (!formData.email?.trim()) {
      errors.email = "El email es requerido";
    } else if (!(await validateEmail(formData.email))) {
      errors.email = "El formato del email no es válido";
    }

    if (!formData.subject?.trim()) {
      errors.subject = "Debes seleccionar un servicio";
    }

    if (!formData.message?.trim()) {
      errors.message = "El mensaje es requerido";
    } else if (formData.message.trim().length < 10) {
      errors.message = "El mensaje debe tener al menos 10 caracteres";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;

    const finalValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFormSubmit = async (data: ContactFormData) => {
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const contactDataWithMetadata: ContactFormData = {
        ...data,
        source: "website_contact_form",
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          page: "contact",
          referrer: document.referrer,
        },
      };

      const success = await createContact(contactDataWithMetadata, true);

      if (success) {
        setSubmitSuccess(true);

        setTimeout(() => {
          setSubmitSuccess(false);
          setFormData({
            full_name: "",
            email: "",
            phone: "",
            company: "",
            subject: "",
            message: "",
            contact_type: "general",
            source: "website",
            preferred_contact_method: "email",
            is_newsletter_subscribed: false,
          });
        }, 3000);
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      setFormErrors({
        submit:
          "Ha ocurrido un error al enviar el mensaje. Por favor intenta nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroContact />

      {/* Main Content */}
      <section className="py-20 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Formulario Principal */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
                <ContactHeader />

                {/* Mostrar error general */}
                {(error || formErrors.submit) && (
                  <ContactError
                    error={error ?? undefined}
                    formErrors={formErrors}
                  />
                )}

                {/* Formulario o mensaje de éxito */}
                {submitSuccess ? (
                  <ContactSuccessForm />
                ) : (
                  <ContactForm
                    onSubmit={async (data: ContactFormData) => {
                      setFormData(data);
                      await handleFormSubmit(data);
                    }}
                    loading={isSubmitting}
                    error={formErrors.submit}
                    submitSuccess={submitSuccess}
                    formData={formData}
                    formErrors={formErrors}
                    onInputChange={handleInputChange}
                  />
                )}
              </div>
            </div>

            {/* Sidebar - Información de contacto */}
            <div className="lg:col-span-1 space-y-8">
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

              {/* Card de Redes Sociales */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="font-heading text-xl font-bold text-gray-800 mb-6">
                  Síguenos
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      name: "Twitter",
                      color: "bg-blue-500",
                      icon: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z",
                    },
                    {
                      name: "LinkedIn",
                      color: "bg-blue-700",
                      icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                    },
                    {
                      name: "Instagram",
                      color: "bg-pink-500",
                      icon: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.162-1.499-.69-2.436-2.878-2.436-4.632 0-3.78 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.747 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z",
                    },
                    {
                      name: "WhatsApp",
                      color: "bg-green-500",
                      icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
                    },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-[#F9A825] hover:bg-gray-50 transition-all duration-300 group"
                    >
                      <div
                        className={`w-8 h-8 ${social.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d={social.icon} />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {social.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Call to Action Rápido */}
              <div className="bg-[#F9A825] rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">⚡</div>
                  <h3 className="font-heading text-lg font-bold">
                    Respuesta Rápida
                  </h3>
                </div>
                <p className="text-white/90 mb-6 text-sm">
                  ¿Necesitas una respuesta inmediata? Agenda una llamada de 15
                  minutos gratuita.
                </p>
                <button className="w-full bg-white text-[#F9A825] py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                  Agendar Llamada
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

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

export default Contact;
