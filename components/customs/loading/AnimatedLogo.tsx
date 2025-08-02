"use client";
// Logo animado para el loading principal
const AnimatedLogo = () => (
  <div className="relative">
    {/* Logo principal */}
    <div className="w-20 h-20 bg-gradient-to-br from-[#F9A825] via-[#FF8F00] to-[#F57C00] rounded-2xl flex items-center justify-center shadow-2xl">
      <div className="text-white text-3xl font-bold">⚡</div>
    </div>

    {/* Anillos animados */}
    <div className="absolute -inset-4 border-4 border-[#F9A825]/30 rounded-full animate-ping"></div>
    <div className="absolute -inset-2 border-2 border-[#FF8F00]/40 rounded-full animate-pulse"></div>
    <div className="absolute -inset-6 border border-[#F57C00]/20 rounded-full animate-spin"></div>
  </div>
);

export default AnimatedLogo;
