"use client";

import { useService } from "@/hooks/useService";
import { ContactFormData } from "@/types/home/contact";
import { useState } from "react";

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
  loading: boolean;
  error?: string;
  submitSuccess?: boolean;
  formData: ContactFormData;
  formErrors: Partial<Record<keyof ContactFormData, string>>;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}
const ContactForm = ({
  onSubmit,
  loading,
  error,
  submitSuccess,
}: ContactFormProps) => {
  const initialFormData: ContactFormData = {
    full_name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    preferred_contact_method: "email",
    contact_type: "general",
    is_newsletter_subscribed: false,
  };

  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { services} = useService();

  function validate(data: ContactFormData) {
    const errors: Partial<Record<keyof ContactFormData, string>> = {};
    if (!data.full_name.trim()) errors.full_name = "El nombre es obligatorio.";
    if (!data.email.trim()) errors.email = "El email es obligatorio.";
    else if (!/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(data.email))
      errors.email = "Email inválido.";
    if (!data.subject) errors.subject = "Selecciona un servicio.";
    if (!data.message.trim())
      errors.message = "Por favor, describe tu proyecto.";
    return errors;
  }

  function handleInputChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const errors = validate(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setIsSubmitting(true);
    onSubmit(formData);
    setIsSubmitting(false);
  }

  return (
    <div>
      {/* Contact Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="font-heading text-3xl font-bold text-gray-800 mb-6">
            Cuéntanos sobre tu proyecto
          </h2>
          <p className="text-gray-600 mb-8">
            Completa el formulario y nos pondremos en contacto contigo en menos
            de 24 horas para discutir tu proyecto.
          </p>

          {/* Mostrar error general si existe */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {submitSuccess ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-500"
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
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                ¡Mensaje enviado exitosamente!
              </h3>
              <p className="text-gray-600 mb-6">
                Hemos recibido tu consulta. Nos pondremos en contacto contigo en
                las próximas 24 horas.
              </p>
              <div className="text-[#F9A825] font-semibold">
                Revisa tu email para más detalles...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent transition-all duration-300 ${
                      formErrors.full_name
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Tu nombre completo"
                  />
                  {formErrors.full_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.full_name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email corporativo *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent transition-all duration-300 ${
                      formErrors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="tu@empresa.com"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent transition-all duration-300"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Empresa
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent transition-all duration-300"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-1 gap-6">
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Consulta sobre servicios *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent transition-all duration-300 ${
                      formErrors.subject
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Selecciona un servicio</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                  {formErrors.subject && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.subject}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Cuéntanos sobre tu proyecto *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent transition-all duration-300 resize-none ${
                    formErrors.message
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Describe tu proyecto, objetivos, desafíos actuales y qué esperas lograr con nuestros servicios..."
                />
                {formErrors.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.message}
                  </p>
                )}
              </div>

              {/* Campos adicionales */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="preferred_contact_method"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Método de contacto preferido
                  </label>
                  <select
                    id="preferred_contact_method"
                    name="preferred_contact_method"
                    value={formData.preferred_contact_method || "email"}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent transition-all duration-300"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Teléfono</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact_type"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tipo de consulta
                  </label>
                  <select
                    id="contact_type"
                    name="contact_type"
                    value={formData.contact_type || "general"}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent transition-all duration-300"
                  >
                    <option value="general">General</option>
                    <option value="sales">Ventas</option>
                    <option value="support">Soporte</option>
                    <option value="partnership">Alianzas</option>
                    <option value="media">Medios</option>
                  </select>
                </div>
              </div>

              {/* Newsletter checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="is_newsletter_subscribed"
                  name="is_newsletter_subscribed"
                  checked={formData.is_newsletter_subscribed || false}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-[#F9A825] border-gray-300 rounded focus:ring-[#F9A825]"
                />
                <label
                  htmlFor="is_newsletter_subscribed"
                  className="text-sm text-gray-600"
                >
                  Sí, quiero recibir información sobre nuevos servicios y
                  consejos de marketing digital.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  isSubmitting || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#F9A825] to-[#FF8F00] hover:shadow-lg hover:scale-105 active:scale-95"
                } text-white`}
              >
                {isSubmitting || loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Enviando mensaje...
                  </div>
                ) : (
                  "Enviar mensaje"
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Al enviar este formulario, aceptas nuestros términos de
                privacidad y el procesamiento de tus datos.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
