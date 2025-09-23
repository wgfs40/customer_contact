const FeaturedServices = () => {
  return (
    <section className="container mx-auto py-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Servicios Destacados
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Tarjeta de Servicio 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="bg-gray-200 h-32 rounded-lg mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Servicio 1</h3>
          <p className="text-gray-600">
            Breve descripción del servicio 1. Aquí se puede detallar lo que
            ofrece.
          </p>
        </div>
        {/* Tarjeta de Servicio 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="bg-gray-200 h-32 rounded-lg mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Servicio 2</h3>
          <p className="text-gray-600">
            Breve descripción del servicio 2. Se puede añadir más texto aquí.
          </p>
        </div>
        {/* Tarjeta de Servicio 3 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="bg-gray-200 h-32 rounded-lg mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Servicio 3</h3>
          <p className="text-gray-600">
            Breve descripción del servicio 3. Un texto que explique la propuesta
            de valor.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
