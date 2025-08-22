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
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const Header = ({ menuOpen, setMenuOpen }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  const router = useRouter();

  // Function to handle sign-in redirection
  // This function can be customized based on your routing structure
  const signIn = () => {
    if (typeof window !== "undefined") {
      const signInUrl = "/sign-in"; // Adjust this URL based on your routing
      router.push(signInUrl);
    }
  };

  // Effect to handle scroll background change
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { href: "/", label: "Inicio", icon: "🏠" },
    { href: "/about", label: "Sobre mí", icon: "👤" },
    { href: "/services", label: "Servicios", icon: "💼" },
    { href: "/gallery", label: "Galería", icon: "🖼️" },
    { href: "/contact", label: "Contacto", icon: "📞" },
    { href: "/blog", label: "Blog", icon: "📝" },
  ];

  const handleLinkClick = (href: string) => {
    setActiveLink(href);
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 z-30 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
            : "bg-white shadow-md"
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="relative group">
            {/* Logo Background with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F9A825]/20 to-[#FF8F00]/20 rounded-xl blur-sm group-hover:blur-none transition-all duration-300"></div>

            {/* Logo Container */}
            <div className="relative bg-white rounded-xl p-3 shadow-sm group-hover:shadow-md transition-all duration-300 border border-gray-100">
              <Image
                src="/images/logo.jpg"
                alt="Dosis de Marketing - Logo"
                width={50}
                height={50}
                className="object-contain group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </div>

          {/* Brand Name */}
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
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setActiveLink(item.href)}
              className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${
                activeLink === item.href
                  ? "text-[#F9A825] bg-[#F9A825]/10"
                  : "text-gray-700 hover:text-[#F9A825] hover:bg-gray-50"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-sm">{item.icon}</span>
                {item.label}
              </span>

              {/* Active indicator */}
              {activeLink === item.href && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-full"></div>
              )}

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#F9A825]/5 to-[#FF8F00]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          ))}

          {/* Auth Section */}
          <div className="flex items-center ml-6 space-x-3">
            <SignedIn>
              <Link
                href="/customer"
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
                <button className="text-gray-700 hover:text-[#F9A825] font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-50">
                  Iniciar Sesión
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] hover:from-[#FF8F00] hover:to-[#F57C00] text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                  Registrarse
                </button>
              </SignUpButton>
            </SignedOut>
          </div>
        </nav>

        {/* Mobile/Tablet Menu Button */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-[#F9A825] hover:bg-[#F9A825]/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F9A825]/20"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú de navegación"
        >
          <div className="relative w-6 h-6">
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                menuOpen ? "rotate-45 opacity-0" : "rotate-0 opacity-100"
              }`}
            >
              <svg
                className="w-5 h-5 text-gray-700"
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
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                menuOpen ? "rotate-0 opacity-100" : "rotate-45 opacity-0"
              }`}
            >
              <svg
                className="w-5 h-5 text-[#F9A825]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          </div>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setMenuOpen(false)}
        >
          {/* Mobile Menu Panel */}
          <div
            className="absolute top-0 right-0 w-80 max-w-[90vw] h-full bg-white shadow-2xl transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center">
                <div className="relative">
                  <div className="bg-gradient-to-br from-[#F9A825]/20 to-[#FF8F00]/20 rounded-lg p-2">
                    <Image
                      src="/images/logo.jpg"
                      alt="Logo"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-bold bg-gradient-to-r from-[#F9A825] to-[#FF8F00] bg-clip-text text-transparent">
                    Dosis de Marketing
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className="py-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleLinkClick(item.href)}
                  className={`flex items-center gap-4 px-6 py-4 transition-all duration-200 ${
                    activeLink === item.href
                      ? "text-[#F9A825] bg-[#F9A825]/10 border-r-4 border-[#F9A825]"
                      : "text-gray-700 hover:text-[#F9A825] hover:bg-gray-50"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {activeLink === item.href && (
                    <div className="ml-auto w-2 h-2 bg-[#F9A825] rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Auth Section */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-gray-50/50">
              <SignedIn>
                <Link
                  href="/customer"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full bg-gradient-to-r from-[#F9A825] to-[#FF8F00] hover:from-[#FF8F00] hover:to-[#F57C00] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md text-center mb-4"
                >
                  Panel de Cliente
                </Link>
                <div className="flex justify-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 ring-2 ring-[#F9A825]/20",
                      },
                    }}
                  />
                </div>
              </SignedIn>

              <SignedOut>
                <div className="space-y-3">
                  <SignInButton>
                    <button className="w-full text-gray-700 hover:text-[#F9A825] font-medium px-6 py-3 rounded-lg border border-gray-200 hover:border-[#F9A825] hover:bg-[#F9A825]/5 transition-all duration-300">
                      Iniciar Sesión
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="w-full bg-gradient-to-r from-[#F9A825] to-[#FF8F00] hover:from-[#FF8F00] hover:to-[#F57C00] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md">
                      Registrarse
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
