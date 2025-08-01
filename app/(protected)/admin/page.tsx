"use client";

import DashboardAdmin from "@/components/admin/dashboard/DashboardAdmin";
import HeaderAdmin from "@/components/admin/dashboard/HeaderAdmin";
import UsersManagement from "@/components/admin/user/UsersManagement ";
import TabButton from "@/components/customs/TabButton";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
  avatar?: string;
}

interface Project {
  id: number;
  title: string;
  client: string;
  status: "active" | "completed" | "pending";
  progress: number;
  deadline: string;
  budget: number;
}

interface Stat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: string;
}

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Datos de ejemplo para stats
  const stats: Stat[] = [
    {
      label: "Total Clientes",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: "👥",
    },
    {
      label: "Proyectos Activos",
      value: "24",
      change: "+8%",
      trend: "up",
      icon: "📊",
    },
    {
      label: "Ingresos del Mes",
      value: "$45,320",
      change: "+15%",
      trend: "up",
      icon: "💰",
    },
    {
      label: "Tasa de Conversión",
      value: "68%",
      change: "-3%",
      trend: "down",
      icon: "📈",
    },
  ];

  // Datos de ejemplo para usuarios
  const users: User[] = [
    {
      id: 1,
      name: "Ana García",
      email: "ana@empresa.com",
      role: "Cliente",
      status: "active",
      lastLogin: "2024-01-15",
    },
    {
      id: 2,
      name: "Carlos López",
      email: "carlos@startup.com",
      role: "Cliente",
      status: "active",
      lastLogin: "2024-01-14",
    },
    {
      id: 3,
      name: "María Rodriguez",
      email: "maria@pyme.com",
      role: "Cliente",
      status: "inactive",
      lastLogin: "2024-01-10",
    },
    {
      id: 4,
      name: "Juan Pérez",
      email: "juan@corporativo.com",
      role: "VIP",
      status: "active",
      lastLogin: "2024-01-15",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }; // 🔧 AQUÍ ESTABA LA LLAVE FALTANTE

  const projects: Project[] = [
    {
      id: 1,
      title: "Campaña Digital Q1",
      client: "TechCorp",
      status: "active",
      progress: 75,
      deadline: "2024-02-15",
      budget: 15000,
    },
    {
      id: 2,
      title: "Rediseño de Marca",
      client: "StartupXYZ",
      status: "completed",
      progress: 100,
      deadline: "2024-01-30",
      budget: 8500,
    },
    {
      id: 3,
      title: "SEO & Content Strategy",
      client: "PymeLocal",
      status: "pending",
      progress: 25,
      deadline: "2024-03-01",
      budget: 5200,
    },
    {
      id: 4,
      title: "Social Media Management",
      client: "Empresa ABC",
      status: "active",
      progress: 60,
      deadline: "2024-02-20",
      budget: 3800,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderAdmin />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm">
          <TabButton
            id="dashboard"
            label="Dashboard"
            icon="📊"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <TabButton
            id="users"
            label="Usuarios"
            icon="👥"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <TabButton
            id="projects"
            label="Proyectos"
            icon="📁"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <TabButton
            id="analytics"
            label="Analytics"
            icon="📈"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <TabButton
            id="settings"
            label="Configuración"
            icon="⚙️"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
        </div>

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <DashboardAdmin stats={stats} />
          </div>
        )}

        {/* Users Management */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <UsersManagement users={users} getStatusColor={getStatusColor} />
          </div>
        )}

        {/* Projects Management */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-gray-800">
                  Gestión de Proyectos
                </h2>
                <p className="text-gray-600">
                  Supervisa y gestiona todos los proyectos activos
                </p>
              </div>
              <button className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300">
                + Nuevo Proyecto
              </button>
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status === "active"
                        ? "Activo"
                        : project.status === "completed"
                        ? "Completado"
                        : "Pendiente"}
                    </span>
                    <button className="text-gray-400 hover:text-[#F9A825] transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-gray-800 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Cliente: {project.client}
                  </p>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Progreso</span>
                      <span className="text-sm font-semibold text-[#F9A825]">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#F9A825] to-[#FF8F00] transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <span>📅 {project.deadline}</span>
                    <span className="font-semibold text-green-600">
                      ${project.budget.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#F9A825] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#FF8F00] transition-colors">
                      Ver Detalles
                    </button>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      📝
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
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
                    <p className="text-gray-600">
                      Gráfico de conversiones aquí
                    </p>
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
                {[
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
                ].map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-gray-50 rounded-lg"
                  >
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {item.metric}
                    </h4>
                    <div className="text-2xl font-bold text-[#F9A825] mb-1">
                      {item.value}
                    </div>
                    <div className="text-sm text-gray-600">
                      Target: {item.target}
                    </div>
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
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-800 mb-2">
                Configuración del Sistema
              </h2>
              <p className="text-gray-600">
                Ajustes generales y configuración de la aplicación
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* General Settings */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-heading text-xl font-bold text-gray-800 mb-6">
                  Configuración General
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Empresa
                    </label>
                    <input
                      type="text"
                      defaultValue="Dosis de Marketing"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de Contacto
                    </label>
                    <input
                      type="email"
                      defaultValue="contacto@dosisdemarketing.com"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      defaultValue="+34 123 456 789"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-heading text-xl font-bold text-gray-800 mb-6">
                  Configuración de Seguridad
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Autenticación de Dos Factores
                      </h4>
                      <p className="text-sm text-gray-600">
                        Protege tu cuenta con 2FA
                      </p>
                    </div>
                    <button className="bg-[#F9A825] text-white px-4 py-2 rounded-lg hover:bg-[#FF8F00] transition-colors">
                      Activar
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Backup Automático
                      </h4>
                      <p className="text-sm text-gray-600">
                        Respaldo diario de datos
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F9A825]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F9A825]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] text-white font-semibold px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300">
                Guardar Cambios
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
