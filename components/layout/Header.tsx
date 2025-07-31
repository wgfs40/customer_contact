"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const Header = ({ menuOpen, setMenuOpen }: HeaderProps) => {
  // Function to handle menu toggle
  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between p-4 bg-white text-black shadow-lg z-30">
      <div className="flex items-center space-x-2">
        <div className="bg-white  p-2 ">
          <Image
            src="/images/logo_sin_fondo.png"
            alt="Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
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
        <div className="hidden md:flex space-x-2 md:space-x-4 flex-wrap md:flex-nowrap items-center text-black font-sans">
          <Link
            href="/"
            className="hover:text-[#F9A825] transition-colors px-2 py-1"
          >
            Inicio
          </Link>
          <Link
            href="/about"
            className="hover:text-[#F9A825] transition-colors px-2 py-1"
          >
            Sobre mí
          </Link>
          <Link
            href="/services"
            className="hover:text-[#F9A825] transition-colors px-2 py-1"
          >
            Servicios
          </Link>
          <Link
            href="/gallery"
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
            href="/blog"
            className="hover:text-[#F9A825] transition-colors px-2 py-1"
          >
            Blog
          </Link>

          <SignedIn>
            <Link
              href="/customer"
              className="bg-[#F9A825] hover:bg-[#FF8F00] text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-md"
            >
              Panel de Cliente
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <button className="hover:text-[#F9A825] transition-colors px-2 py-1 font-sans">
                Iniciar Sesión
              </button>
            </SignInButton>
            {/* <SignUpButton>
              <button className="hover:text-[#F9A825] transition-colors px-2 py-1 font-sans">
                Registrarse
              </button>
            </SignUpButton> */}
          </SignedOut>
          <UserButton />
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
                href="/"
                className="hover:text-[#F9A825] transition-colors px-4 py-2 text-black"
                onClick={() => setMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/about"
                className="hover:text-[#F9A825] transition-colors px-4 py-2 text-black"
                onClick={() => setMenuOpen(false)}
              >
                Sobre mí
              </Link>
              <Link
                href="/services"
                className="hover:text-[#F9A825] transition-colors px-4 py-2 text-black"
                onClick={() => setMenuOpen(false)}
              >
                Servicios
              </Link>
              <Link
                href="/gallery"
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
                href="/blog"
                className="hover:text-[#F9A825] transition-colors px-4 py-2 text-black"
                onClick={() => setMenuOpen(false)}
              >
                Blog
              </Link>

              <SignedIn>
                <Link
                  href="/customer"
                  className="bg-[#F9A825] hover:bg-[#FF8F00] text-white font-medium px-4 py-2 mx-4 my-2 rounded-lg transition-colors shadow-md text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Panel de Cliente
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <button className="hover:text-[#F9A825] transition-colors px-2 py-1 font-sans">
                    Iniciar Sesión
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="hover:text-[#F9A825] transition-colors px-2 py-1 font-sans">
                    Registrarse
                  </button>
                </SignUpButton>
              </SignedOut>
              <UserButton />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
