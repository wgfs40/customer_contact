"use client";

import useContacts from "@/hooks/useContacts";
import { ContactFormData } from "@/types/home/contact";
import React, { useState } from "react";
import HeroContact from "./HeroContact";
import ContactForm from "./ContactForm";
import ContactSuccessForm from "./ContactSuccessForm";
import ContactHeader from "./ContactHeader";
import ContactError from "./ContactError";
import ContactCardInformation from "./ContactCardInformation";
import ContactCardSocialNetwork from "./ContactCardSocialNetwork";
import ContactCallFastAction from "./ContactCallFastAction";
import ContactFAQ from "./ContactFAQ";

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

    const requiredFields: { key: keyof ContactFormData; message: string }[] = [
      { key: "full_name", message: "El nombre es requerido" },
      { key: "email", message: "El email es requerido" },
      { key: "subject", message: "Debes seleccionar un servicio" },
      { key: "message", message: "El mensaje es requerido" },
    ];

    requiredFields.forEach(({ key, message }) => {
      if (!formData[key]?.toString().trim()) {
        errors[key] = message;
      }
    });

    if (formData.email && !(await validateEmail(formData.email))) {
      errors.email = "El formato del email no es válido";
    }

    if (
      formData.message &&
      formData.message.trim().length > 0 &&
      formData.message.trim().length < 10
    ) {
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

      // Llamada a la API para crear el contacto
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
    } catch (error: unknown) {
      setFormErrors({
        submit: `Ha ocurrido un error al enviar el mensaje. Por favor intenta nuevamente. ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
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
              <ContactCardInformation />

              <ContactCardSocialNetwork />

              <ContactCallFastAction />
            </div>
          </div>
        </div>
      </section>

      <ContactFAQ />
    </div>
  );
};

export default Contact;
