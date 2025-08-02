"use client";

const AnalyticsAdmin = () => {
  const dataAnalytics = [
    {
      metric: "Tiempo de Carga",
      value: "2.3s",
      target: "< 3s",
      status: "good",
    },
    {
      metric: "Bounce Rate",
      value: "32%",
      target: "< 40%",
      status: "good",
    },
    {
      metric: "Pages/Session",
      value: "4.2",
      target: "> 3",
      status: "excellent",
    },
  ];
  return (
    <>
      <div>
        <h2 className="font-heading text-2xl font-bold text-gray-800 mb-2">
          Analytics & Reportes
        </h2>
        <p className="text-gray-600">
          Métricas detalladas y análisis de rendimiento
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Traffic Analytics */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-heading text-xl font-bold text-gray-800 mb-6">
            Tráfico del Sitio Web
          </h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-gray-600">Gráfico de tráfico aquí</p>
            </div>
          </div>
        </div>

        {/* Conversion Analytics */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-heading text-xl font-bold text-gray-800 mb-6">
            Tasa de Conversión
          </h3>
          <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-gray-600">Gráfico de conversiones aquí</p>
            </div>
          </div>
        </div>
      </div>
      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-heading text-xl font-bold text-gray-800 mb-6">
          Métricas de Rendimiento
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {dataAnalytics.map((item, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">
                {item.metric}
              </h4>
              <div className="text-2xl font-bold text-[#F9A825] mb-1">
                {item.value}
              </div>
              <div className="text-sm text-gray-600">Target: {item.target}</div>
              <div
                className={`text-xs mt-2 ${
                  item.status === "excellent"
                    ? "text-green-600"
                    : item.status === "good"
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              >
                {item.status === "excellent"
                  ? "Excelente"
                  : item.status === "good"
                  ? "Bueno"
                  : "Necesita mejora"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AnalyticsAdmin;
