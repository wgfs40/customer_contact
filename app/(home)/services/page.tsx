"use client";
import Image from "next/image";

const ServicePage = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-8">
        <Image
          src="/images/pastilla.jpg"
          alt="Pastilla de Dosis de Marketing"
          width={200}
          height={200}
        />

        <p className="text-center text-lg text-gray-700 mb-2">
          Recibe inspiración y estrategias de marketing directo en tu correo.
          Suscríbete a mi newsletter.
        </p>
      </div>
      <div className="flex justify-center items-center mt-8">
        <a
          href="https://forms.gle/Y9daUs2p5N8PJhgm8"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-orange-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-600 transition"
        >
          ¡Suscríbete ahora al newsletter!
        </a>
      </div>
    </div>
  );
};

export default ServicePage;
