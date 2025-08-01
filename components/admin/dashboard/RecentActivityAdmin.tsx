"use client";
const RecentActivityAdmin = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="font-heading text-xl font-bold text-gray-800 mb-6">
        Actividad Reciente
      </h3>
      <div className="space-y-4">
        {[
          {
            action: "Nuevo cliente registrado",
            user: "Ana García",
            time: "Hace 2 horas",
            icon: "👤",
          },
          {
            action: "Proyecto completado",
            user: "Campaña StartupXYZ",
            time: "Hace 5 horas",
            icon: "✅",
          },
          {
            action: "Pago recibido",
            user: "$8,500 - TechCorp",
            time: "Hace 1 día",
            icon: "💰",
          },
          {
            action: "Nueva consulta",
            user: "María Lopez",
            time: "Hace 2 días",
            icon: "📧",
          },
        ].map((activity, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="text-2xl">{activity.icon}</div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{activity.action}</p>
              <p className="text-sm text-gray-600">{activity.user}</p>
            </div>
            <span className="text-sm text-gray-500">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityAdmin;
