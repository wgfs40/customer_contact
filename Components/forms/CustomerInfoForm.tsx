"use client";

import React, { useState } from "react";
import CustomInput from "../customs/CustomInput";
import { SaveCustomerInfo } from "@/actions/customer_info";

interface CustomerInfoFormProps {
  className?: string;
}

const CustomerInfoForm = ({ className }: CustomerInfoFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

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
      setMessage("Customer information saved successfully!");
      // Reset form
      event.currentTarget.reset();
    } catch (error) {
      console.error("Error saving customer information:", error);
      setMessage("Error saving customer information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-[16px] w-full mx-auto ${className}`}
        style={{ width: "100%" }}
      >
        <CustomInput
          name="name"
          type="text"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-center"
          placeholder="Entre su nombre completo"
          required
        />
        <CustomInput
          name="email"
          type="email"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-center"
          placeholder="Entre su correo electrónico"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#FF8800] text-[#323232] rounded-lg p-2 hover:bg-orange-600 transition-colors w-full font-bold disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Submit"}
        </button>
        {message && (
          <p
            className={`text-center ${
              message.includes("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default CustomerInfoForm;
