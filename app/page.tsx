"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F9E4B7] text-white">
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-[#F9A825] via-[#FFF8E1] to-[#F9E4B7] text-black shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="bg-white rounded-full p-2 shadow-md">
            <Image
              src="/images/logo_sin_fondo.png"
              alt="Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <span className="hidden md:inline font-serif font-extrabold text-2xl text-[#D7263D] drop-shadow">
            Dosis de Marketing
          </span>
        </div>

        {/* Responsive navigation: hamburger menu on mobile */}
        <nav className="relative">
          {/* Hamburger button (visible on mobile) */}
          <button
            className="md:hidden flex items-center px-2 py-1 border rounded text-black hover:text-[#F9A825] focus:outline-none"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Abrir menú"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {/* Menu links */}
          <div className="hidden md:flex space-x-2 md:space-x-4 flex-wrap md:flex-nowrap">
            <Link
              href="#"
              className="hover:text-[#F9A825] transition-colors px-2 py-1"
            >
              Inicio
            </Link>
            <Link
              href="#"
              className="hover:text-[#F9A825] transition-colors px-2 py-1"
            >
              Servicios
            </Link>
            <Link
              href="#"
              className="hover:text-[#F9A825] transition-colors px-2 py-1"
            >
              Galería
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#F9A825] transition-colors px-2 py-1"
            >
              Contacto
            </Link>
            <Link
              href="#"
              className="hover:text-[#F9A825] transition-colors px-2 py-1"
            >
              Blog
            </Link>
            <Link
              href="#"
              className="hover:text-[#F9A825] transition-colors px-2 py-1"
            >
              Sobre Mi
            </Link>
          </div>
          {/* Mobile menu dropdown */}
          {menuOpen && (
            <div
              className="fixed inset-0 bg-opacity-40 z-20 md:hidden"
              onClick={() => setMenuOpen(false)}
            >
              <div
                className="absolute top-16 left-4 right-4 bg-white shadow-md rounded flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  href="#"
                  className="hover:text-[#F9A825] transition-colors px-4 py-2 text-black"
                  onClick={() => setMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  href="#"
                  className="hover:text-[#F9A825] transition-colors px-4 py-2 text-black"
                  onClick={() => setMenuOpen(false)}
                >
                  Servicios
                </Link>
                <Link
                  href="#"
                  className="hover:text-[#F9A825] transition-colors px-4 py-2 text-black"
                  onClick={() => setMenuOpen(false)}
                >
                  Galería
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-[#F9A825] transition-colors px-4 py-2 text-black"
                  onClick={() => setMenuOpen(false)}
                >
                  Contacto
                </Link>
                <Link
                  href="#"
                  className="hover:text-[#F9A825] transition-colors px-4 py-2 text-black"
                  onClick={() => setMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="#"
                  className="hover:text-[#F9A825] transition-colors px-4 py-2 text-black"
                  onClick={() => setMenuOpen(false)}
                >
                  Sobre Mi
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

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
            <button className="bg-accent text-black px-4 py-2 rounded">
              Comprar
            </button>
            <button
              className="bg-orange-500 text-primary px-4 py-2 rounded"
              onClick={() => router.push("/contact")}
            >
              Contacto
            </button>
          </div>
        </div>
        <div className="mt-8 md:mt-0 flex space-x-4">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white">
            <Image
              src="/reference.jpg"
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
