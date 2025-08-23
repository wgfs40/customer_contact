const ServicesHero = () => {
  return (
    // Hero Section
    <section className="bg-gradient-to-br from-[#F9A825] via-[#FF8F00] to-[#F57C00] text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Nuestros{" "}
            <span className="text-white drop-shadow-lg">Servicios</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto animate-fade-in-delay">
            Soluciones integrales de marketing digital diseñadas para hacer
            crecer tu negocio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
            <button className="bg-white text-[#F9A825] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg">
              Consulta Gratuita
            </button>
            <button className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-[#F9A825] transition-all duration-300">
              Ver Portfolio
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHero;
