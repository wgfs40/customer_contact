"use client";

const ServicePage = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-8">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-4"
        >
          <rect width="80" height="80" rx="16" fill="#FB923C" />
          <path
            d="M40 24C36.6863 24 34 26.6863 34 30V50C34 53.3137 36.6863 56 40 56C43.3137 56 46 53.3137 46 50V30C46 26.6863 43.3137 24 40 24ZM40 28C41.6569 28 43 29.3431 43 31V49C43 50.6569 41.6569 52 40 52C38.3431 52 37 50.6569 37 49V31C37 29.3431 38.3431 28 40 28Z"
            fill="white"
          />
          <rect x="36" y="36" width="8" height="8" rx="2" fill="#FFF7ED" />
        </svg>
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
          Ir al formulario
        </a>
      </div>
    </div>
  );
};

export default ServicePage;
