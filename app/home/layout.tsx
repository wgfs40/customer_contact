"use client";
import { useState } from "react";
import Header from "@/Components/customs/Header";
const Layout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {children}
    </div>
  );
};

export default Layout;
