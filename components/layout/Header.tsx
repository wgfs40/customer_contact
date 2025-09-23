// src/components/HeaderServer.js
// ¡Nota: Este componente no puede usar useState o useEffect!

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import HeaderMenuItems from "./header-menu-items";

const Header = () => {
  // En un Server Component, no se puede usar useState o useEffect.
  // La lógica del scroll y del link activo debe manejarse en el cliente.
  // El 'activeLink' ahora se determina dinámicamente.

  // Puedes obtener la ruta actual si la pasas como prop desde un Client Component
  // que usa usePathname() de next/navigation.
  const pathname = "/"; // Reemplazar con la ruta real pasada por un cliente

  const navItems = [
    { name: "inicio", href: "/", label: "Inicio", icon: "🏠" },
    { name: "about", href: "/about", label: "Sobre mí", icon: "👤" },
    { name: "services", href: "/services", label: "Servicios", icon: "💼" },
    { name: "gallery", href: "/gallery", label: "Galería", icon: "🖼️" },
    { name: "contact", href: "/contact", label: "Contacto", icon: "📞" },
    { name: "blog", href: "/blog", label: "Blog", icon: "📝" },
  ];

  return (
    <>
      <header className="bg-white p-4 shadow-md rounded-b-lg">
        <div className="flex justify-between items-center px-4 py-3 md:py-4 lg:py-5 bg-white shadow-sm">
          {/* Logo Section (no change needed) */}
          <div className="flex items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F9A825]/20 to-[#FF8F00]/20 rounded-xl blur-sm group-hover:blur-none transition-all duration-300"></div>
              <div className="relative bg-white rounded-xl p-3 shadow-sm group-hover:shadow-md transition-all duration-300 border border-gray-100">
                <Image
                  src="/images/new_logo.png"
                  alt="Dosis de Marketing - Logo"
                  width={50}
                  height={50}
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            </div>
            <div className="ml-3 hidden sm:block">
              <h1 className="font-display font-bold text-2xl text-gradient-brand">
                Dosis de Marketing
              </h1>
              <p className="font-heading text-sm text-gray-500">
                Marketing Digital
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <HeaderMenuItems
                key={item.href}
                item={item}
                pathname={pathname}
              />
            ))}
            <div className="flex items-center ml-6 space-x-3">
              <SignedIn>
                <Link
                  href="/admin"
                  className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] hover:from-[#FF8F00] hover:to-[#F57C00] text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Panel de Cliente
                </Link>
                <div className="border-l border-gray-200 pl-3">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-9 h-9 ring-2 ring-[#F9A825]/20 hover:ring-[#F9A825]/40 transition-all duration-300",
                      },
                    }}
                  />
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-300">
                    Iniciar Sesión
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
