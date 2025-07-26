"use client";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const Header = ({ menuOpen, setMenuOpen }: HeaderProps) => {
  // Function to handle menu toggle

  return (
    <header className="flex items-center justify-between p-4 bg-orange-400 text-black shadow-lg">
      <div className="flex items-center space-x-2">
        <div className="bg-white  p-2 shadow-md">
          <Image
            src="/images/logo_sin_fondo.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
        <span className="hidden md:inline font-serif font-extrabold text-2xl text-[#e6e5e5] drop-shadow">
          Dosis de Marketing
        </span>
      </div>

      {/* Responsive navigation: hamburger menu on mobile */}
      <nav className="relative">
        {/* Hamburger button (visible on mobile) */}
        <button
          className="md:hidden flex items-center px-2 py-1 border rounded text-black hover:text-[#F9A825] focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
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
            href="/home"
            className="hover:text-[#F9A825] transition-colors px-2 py-1"
          >
            Inicio
          </Link>
          <Link
            href="/home/services"
            className="hover:text-[#F9A825] transition-colors px-2 py-1"
          >
            Servicios
          </Link>
          <Link
            href="/home/gallery"
            className="hover:text-[#F9A825] transition-colors px-2 py-1"
          >
            Galería
          </Link>
          <Link
            href="/home/contact"
            className="hover:text-[#F9A825] transition-colors px-2 py-1"
          >
            Contacto
          </Link>
          <Link
            href="/home/blog"
            className="hover:text-[#F9A825] transition-colors px-2 py-1"
          >
            Blog
          </Link>
          <Link
            href="/home/about"
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
                href="/home"
                className="hover:text-[#F9A825] transition-colors px-4 py-2 text-black"
                onClick={() => setMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/home/services"
                className="hover:text-[#F9A825] transition-colors px-4 py-2 text-black"
                onClick={() => setMenuOpen(false)}
              >
                Servicios
              </Link>
              <Link
                href="/home/gallery"
                className="hover:text-[#F9A825] transition-colors px-4 py-2 text-black"
                onClick={() => setMenuOpen(false)}
              >
                Galería
              </Link>
              <Link
                href="/home/contact"
                className="hover:text-[#F9A825] transition-colors px-4 py-2 text-black"
                onClick={() => setMenuOpen(false)}
              >
                Contacto
              </Link>
              <Link
                href="/home/blog"
                className="hover:text-[#F9A825] transition-colors px-4 py-2 text-black"
                onClick={() => setMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/home/blog"
                className="hover:text-[#F9A825] transition-colors px-4 py-2 text-black"
                onClick={() => setMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/home/about"
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
  );
};

export default Header;
