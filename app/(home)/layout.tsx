"use client";
import { useState } from "react";
import Header from "@/Components/customs/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {/* Main content area */}
      <main className="flex-1 container mx-auto px-4 mt-50">{children}</main>
      {/* Footer section */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4">
          <p className="text-center">
            © 2023 Dosis de Marketing. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
