"use client";
import { SaveCustomerInfo } from "@/actions/customer_info";
import { useState } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import CustomInput from "../customs/CustomInput";
import Swal from "sweetalert2";

const NewsletterSignupForm = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const customerData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
      };
      console.log("Submitting customer data:", customerData);
      await SaveCustomerInfo(customerData);
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Tu información se ha guardado exitosamente.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar la información. Intenta nuevamente.",
      });
      console.error("Error submitting form:", error);
    }
  };

  const handleReset = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esto borrará todos los datos ingresados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector("form")?.reset();
        Swal.fire("Formulario borrado", "", "success");
      }
    });
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative">
      {/* Orange header bar */}
      <div className="bg-orange-500 -mx-6 -mt-6 mb-6 px-6 py-4 rounded-t-lg">
        <h2 className="text-lg font-bold text-white leading-tight">
          SUSCRÍBETE A MI NEWSLETTER Y RECIBE DOSIS DE INSPIRACIÓN, ESTRATEGIAS
          Y MARKETING REAL QUE SÍ CONECTA
        </h2>
      </div>

      <p className="text-gray-700 mb-6 text-sm leading-relaxed">
        Cada semana, recibirás consejos prácticos, herramientas útiles y
        contenido exclusivo para crecer con intención y diferenciar tu marca en
        un mundo saturado.
      </p>

      <p className="text-sm text-red-500 mb-6">
        * Indica que la pregunta es obligatoria
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre <span className="text-red-500">*</span>
          </label>
          <CustomInput
            type="text"
            name="name"
            className="w-full px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
            placeholder="Inserta tu nombre completo"
            required
          />
        </div>

        {/* Email input field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico <span className="text-red-500">*</span>
          </label>
          <CustomInput
            type="email"
            name="email"
            className="w-full px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
            placeholder="Inserta tu correo electrónico"
            required
          />
        </div>

        {/* Submit and Reset buttons */}
        <div className="flex justify-between items-center pt-6">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-medium transition-colors"
          >
            Enviar
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            Borrar formulario
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsletterSignupForm;
