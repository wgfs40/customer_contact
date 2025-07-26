"use client";

import Image from "next/image";
import CustomInput from "../customs/CustomInput";
import { useState, useEffect } from "react";
import { SaveCustomerInfo } from "@/actions/customer_info";
import { useRouter } from "next/navigation";

const KitForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const formData = new FormData(event.currentTarget);
      const customerData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
      };

      await SaveCustomerInfo(customerData);
      setMessage("Información del cliente guardada con éxito!");
      router.push("/");
      //event.currentTarget.reset();
    } catch (error) {
      console.error("Error saving customer information:", error);
      setMessage(
        "Error al guardar la información del cliente. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="bg-orange-400 p-6 rounded-lg max-w-md mx-auto">
      <h1 className="text-4xl font-bold p-5 text-center text-white mb-4">
        Bienvenido a dosis de marketing
      </h1>
      <div className="mb-4 text-center">
        <Image
          src="/images/kit-illustration.png"
          alt="Ilustración de kit"
          width={128}
          height={128}
          className="mx-auto mb-4 w-32 h-auto"
        />
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <CustomInput
          name="name"
          type="text"
          placeholder="Introduce tu nombre completo"
          className="w-full px-4 py-2 border bg-white border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
        />
        <CustomInput
          name="email"
          type="email"
          placeholder="Introduce tu correo electrónico"
          className="w-full px-4 py-2 border bg-white border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
        />

        <button
          disabled={isLoading}
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          {isLoading ? "Guardando..." : " Quiero el Kit"}
        </button>
        {message && (
          <p
            className={`text-center ${
              message.includes("Error") ? "text-red-800" : "text-white"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default KitForm;
