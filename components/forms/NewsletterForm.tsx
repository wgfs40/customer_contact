"use client";
import { useState } from "react";
import { SaveCustomerInfo } from "../../actions/customer_info";
import Swal from "sweetalert2";
import CustomInput from "../customs/CustomInput";

export default function NewsletterSignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      Swal.fire({
        icon: "error",
        title: "Campos requeridos",
        text: "Por favor completa todos los campos obligatorios.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#FF8800",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await SaveCustomerInfo({
        name: name.trim(),
        email: email.trim(),
      });

      await Swal.fire({
        icon: "success",
        title: "¡Suscripción exitosa!",
        text: "¡Gracias por suscribirte! Tu información ha sido guardada exitosamente.",
        confirmButtonText: "¡Genial!",
        confirmButtonColor: "#FF8800",
      });

      // Limpiar el formulario después del éxito
      setName("");
      setEmail("");

      console.log("Customer information saved successfully!");
    } catch (error) {
      console.error("Error saving customer information:", error);

      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "Hubo un error al guardar tu información. Por favor, intenta nuevamente.",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#FF8800",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="bg-orange-500 -mx-6 -mt-6 mb-6 px-6 py-4 rounded-t-lg">
        <h2 className="text-lg font-bold text-gray-800 leading-tight">
          SUSCRÍBETE A MI NEWSLETTER
        </h2>
      </div>

      <p className="text-sm text-red-500 mb-6">
        * Indica que la pregunta es obligatoria
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre <span className="text-red-500">*</span>
          </label>
          <CustomInput
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
            placeholder="Tu respuesta"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico <span className="text-red-500">*</span>
          </label>
          <CustomInput
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
            placeholder="Tu respuesta"
            required
          />
        </div>

        <div className="flex justify-between items-center pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded font-medium transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className={`font-medium transition-colors ${
              isSubmitting
                ? "text-gray-400 cursor-not-allowed"
                : "text-orange-500 hover:text-orange-600"
            }`}
          >
            Borrar formulario
          </button>
        </div>
      </form>
    </div>
  );
}
