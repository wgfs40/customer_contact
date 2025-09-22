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
    <div className="flex gap-[2%] flex-wrap content-start p-2">
      {/* Header */}
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {/* Main content area */}
      <main className="grow h-3/4">
        <CookieBanner />
        {children}
      </main>
      {/* Footer section */}
      <Footer />
    </div>
  );
};

export default Layout;
