"use client";

import AnalyticsAdmin from "@/components/admin/analytics/AnalyticsAdmin";
import DashboardAdmin from "@/components/admin/dashboard/DashboardAdmin";
import HeaderAdmin from "@/components/admin/dashboard/HeaderAdmin";
import NavigationTabsAdmin from "@/components/admin/NavigationTabs/NavigationTabsAdmin";
import ProjectsAdmin from "@/components/admin/projects/ProjectsAdmin";
import SettingsAdmin from "@/components/admin/settings/SettingsAdmin";
import UsersManagement from "@/components/admin/user/UsersManagement ";
import { Project } from "@/types/admin/Project";
import { Stat } from "@/types/admin/Stat";
import { User } from "@/types/admin/User";
import { useState } from "react";

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
  };

  // Datos de ejemplo para proyectos
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
        <NavigationTabsAdmin
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Tab Content */}
        <div className="mt-8">
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
              <ProjectsAdmin
                projects={projects}
                getStatusColor={getStatusColor}
              />
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <AnalyticsAdmin />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <SettingsAdmin />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
