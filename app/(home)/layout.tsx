"use client";
import { useState } from "react";
import Header from "@/components/customs/Header";
import Hero from "@/components/customs/Hero";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {/* Hero section */}
      <Hero />
      {/* Main content area */}
      <div className="container mx-auto px-4">
        {/* Main content */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
