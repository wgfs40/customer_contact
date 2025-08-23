import Image from "next/image";

const About = () => {
  const skills = [
    { name: "Marketing Digital", percentage: 95 },
    { name: "Estrategia de Contenido", percentage: 90 },
    { name: "Redes Sociales", percentage: 88 },
    { name: "SEO/SEM", percentage: 85 },
    { name: "Branding", percentage: 92 },
    { name: "Analytics", percentage: 87 },
  ];

  const achievements = [
    { number: "500+", label: "Proyectos Completados" },
    { number: "8+", label: "Años de Experiencia" },
    { number: "250+", label: "Clientes Satisfechos" },
    { number: "95%", label: "Tasa de Éxito" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F9A825] via-[#FF8F00] to-[#F57C00] py-20">
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="lg:w-1/2 text-white">
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-4">
                Hola, soy{" "}
                <span className="text-white drop-shadow-lg">Marisol Muñoz</span>
              </h1>
              <h2 className="font-heading font-semibold text-xl md:text-2xl lg:text-3xl text-white/90 mb-8">
                Experta en Marketing Digital & Estratega de Crecimiento
              </h2>
              <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
                Transformo ideas en estrategias digitales exitosas. Con más de 8
                años de experiencia, ayudo a empresas a alcanzar su máximo
                potencial en el mundo digital.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-[#F9A825] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Trabajemos Juntos
                </button>
                <button className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-[#F9A825] transition-all duration-300">
                  Ver Portfolio
                </button>
              </div>
            </div>

            {/* Image - Optimizada para móvil con forma redondeada */}
            <div className="lg:w-1/2 flex justify-center w-full">
              <div className="relative">
                {/* Background blur effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 rounded-full blur-3xl scale-110"></div>

                {/* Main image container - Totalmente redondeada */}
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden shadow-2xl group">
                  <Image
                    src="/images/marisol.png"
                    alt="Marisol - Experta en Marketing Digital"
                    fill
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`transition-all duration-1000 group-hover:scale-105                    }`}
                    priority
                  />

                  {/* Difuminado gradual en la parte inferior */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 md:h-32 lg:h-40 bg-gradient-to-t from-[#F9A825]/80 via-[#F9A825]/40 to-transparent"></div>

                  {/* Efecto de cristal difuminado en la parte inferior */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 lg:h-32 backdrop-blur-sm bg-gradient-to-t from-black/50 to-transparent"></div>

                  {/* Contenido elegante en la parte inferior */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white z-10 text-center">
                    <div className="transform transition-all duration-300 group-hover:translate-y-0 translate-y-2">
                      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2 drop-shadow-lg">
                        Marisol Muñoz
                      </h3>
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg opacity-90 drop-shadow-md mb-2 md:mb-3">
                        Marketing Digital Expert
                      </p>
                      <div className="flex items-center justify-center">
                        <div className="flex items-center text-xs sm:text-sm md:text-base">
                          <span className="w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                          Disponible para proyectos
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Brillo sutil en hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                </div>

                {/* Decorative rings - Adaptados para forma circular */}
                <div className="absolute inset-0 w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] border-2 border-white/40 rounded-full animate-pulse scale-105"></div>
                <div className="absolute inset-0 w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] border border-white/30 rounded-full opacity-60 scale-110"></div>

                {/* Elementos decorativos flotantes */}
                <div className="absolute -top-4 -right-4 w-6 h-6 md:w-8 md:h-8 bg-white/30 rounded-full animate-bounce"></div>
                <div
                  className="absolute -bottom-6 -left-6 w-4 h-4 md:w-6 md:h-6 bg-white/20 rounded-full animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div className="absolute top-1/4 -left-8 w-3 h-3 md:w-4 md:h-4 bg-white/25 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Mi Historia
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  Comencé mi carrera en el marketing digital hace más de 8 años,
                  cuando las redes sociales apenas comenzaban a transformar la
                  forma en que las empresas se conectan con sus clientes.
                </p>
                <p>
                  Mi pasión por entender el comportamiento del consumidor
                  digital me llevó a especializarme en estrategias de
                  crecimiento orgánico y campañas de alto impacto que generan
                  resultados medibles y sostenibles.
                </p>
                <p>
                  Hoy, lidero{" "}
                  <span className="text-[#F9A825] font-semibold">
                    Dosis de Marketing
                  </span>
                  , donde combinamos creatividad, datos y estrategia para crear
                  experiencias digitales que transforman negocios y conectan
                  marcas con sus audiencias de manera auténtica.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#F9A825]/10 to-[#FF8F00]/10 rounded-2xl p-8">
              <h3 className="font-heading text-2xl font-bold text-gray-800 mb-8">
                Mis Especialidades
              </h3>
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">
                        {skill.name}
                      </span>
                      <span className="text-[#F9A825] font-semibold">
                        {skill.percentage}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${skill.percentage}%`,
                          animationDelay: `${index * 0.2}s`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Logros en Números
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Estos números reflejan mi compromiso con la excelencia y los
              resultados que obtengo para mis clientes.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="font-display text-3xl md:text-4xl font-bold text-[#F9A825] mb-2">
                  {achievement.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Mis Valores
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Los principios que guían mi trabajo y mi relación con cada
              cliente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl hover:bg-gray-50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F9A825] to-[#FF8F00] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-800 mb-4">
                Innovación Constante
              </h3>
              <p className="text-gray-600">
                Siempre busco las últimas tendencias y tecnologías para mantener
                a mis clientes a la vanguardia.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl hover:bg-gray-50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F9A825] to-[#FF8F00] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-800 mb-4">
                Resultados Medibles
              </h3>
              <p className="text-gray-600">
                Cada estrategia está respaldada por datos concretos y métricas
                que demuestran el impacto real.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl hover:bg-gray-50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F9A825] to-[#FF8F00] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-800 mb-4">
                Pasión Auténtica
              </h3>
              <p className="text-gray-600">
                Cada proyecto es una oportunidad de crear algo extraordinario y
                generar un impacto positivo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#F9A825] to-[#FF8F00]">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para Transformar tu Negocio?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Trabajemos juntos para crear una estrategia digital que impulse tu
            crecimiento y conecte con tu audiencia de manera auténtica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#F9A825] font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
              Agendar Consulta Gratuita
            </button>
            <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-[#F9A825] transition-all duration-300">
              Ver Casos de Éxito
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
