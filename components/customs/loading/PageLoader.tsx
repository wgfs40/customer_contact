"use client";
import AnimatedLogo from "@/components/customs/loading/AnimatedLogo";
// Loading principal de página
const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      {/* Logo animado */}
      <div className="mb-8 flex justify-center">
        <AnimatedLogo />
      </div>

      {/* Texto de carga */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-pulse">
        Cargando Servicios
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Preparando las mejores soluciones de marketing digital para tu negocio
      </p>

      {/* Barra de progreso animada */}
      <div className="w-80 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#F9A825] via-[#FF8F00] to-[#F57C00] rounded-full animate-loading-bar"></div>
      </div>

      {/* Puntos de carga */}
      <div className="flex justify-center items-center space-x-2 mt-6">
        <div className="w-3 h-3 bg-[#F9A825] rounded-full animate-bounce"></div>
        <div
          className="w-3 h-3 bg-[#FF8F00] rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-3 h-3 bg-[#F57C00] rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
    {/* Keyframes inline para garantizar que funcionen */}
    <style jsx>{`
      @keyframes loadingBar {
        0% {
          transform: translateX(-100%);
        }
        50% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(100%);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
  </div>
);

export default PageLoader;
