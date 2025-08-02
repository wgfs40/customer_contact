"use client";

const HeroContact = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#F9A825] via-[#FF8F00] to-[#F57C00] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Hablemos de tu{" "}
              <span className="text-white drop-shadow-lg">Proyecto</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Estamos aquí para ayudarte a transformar tu negocio con
              estrategias digitales efectivas
            </p>
            <div className="flex items-center justify-center gap-8 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span>Respuesta en 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Consulta gratuita</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroContact;
