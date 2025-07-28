"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="flex flex-col md:flex-row items-center justify-between p-8">
        <div className="max-w-xl">
          <h1
            className="text-4xl font-bold mb-4 text-black"
            style={{
              fontFamily:
                "'Montserrat', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            Descubre cómo Dosis de Marketing puede impulsar tu negocio y
            ayudarte a alcanzar tus metas. ¡Aprovecha el poder del marketing
            digital para destacar y crecer en el mundo actual!
          </h1>
          <p className="mb-6 text-lg text-gray-700">
            Conoce nuestras estrategias efectivas y personalizadas para llevar
            tu marca al siguiente nivel.
          </p>
          <div className="space-x-4">           
            <button
              className="bg-orange-500 text-primary px-4 py-2 rounded text-white hover:bg-orange-600 transition-colors"
              onClick={() => router.push("/home/contact")}
            >
              Contacto
            </button>
          </div>
        </div>
        <div className="mt-8 md:mt-0 flex space-x-4">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white">
            <Image
              src="/images/kit-illustration.png"
              alt="Mascotas"
              width={160}
              height={160}
            />
            prueba
          </div>
        </div>
      </main>

      <footer className="text-center p-4 bg-white text-black">
        © 2025 Dosis de Marketing. Todos los derechos reservados.
      </footer>
    </div>
  );
}
