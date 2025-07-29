"use client";
import { useState } from "react";
import Header from "@/Components/customs/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {/* Main content area */}
      <div className="container mx-auto px-4">
        {/* Main content */}
        {children}
      </div>
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
