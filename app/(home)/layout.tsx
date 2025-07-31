"use client";
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {/* Main content area */}
      <main className="flex-1 container mx-auto px-4 mt-50">
        <CookieBanner />
        {children}
      </main>
      {/* Footer section */}
      <Footer />
    </div>
  );
};

export default Layout;
