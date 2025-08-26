import AnalyticsAdmin from "@/components/admin/analytics/AnalyticsAdmin";
import BlogManagement from "@/components/admin/blog/blog-management";
import PostsAdmin from "@/components/admin/blog/posts-admin";
import DashboardAdmin from "@/components/admin/dashboard/DashboardAdmin";
import HeaderAdmin from "@/components/admin/dashboard/HeaderAdmin";
import NavigationTabsAdmin from "@/components/admin/NavigationTabs/NavigationTabsAdmin";
import ProjectsAdmin from "@/components/admin/projects/ProjectsAdmin";
import SettingsAdmin from "@/components/admin/settings/SettingsAdmin";
import UsersManagement from "@/components/admin/user/UsersManagement ";
import { Project } from "@/types/admin/Project";
import { Stat } from "@/types/admin/Stat";
import { User } from "@/types/admin/User";

const AdminPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ tab: string; edit?: boolean; id?: string }>;
}) => {
  const params = await searchParams;

  const tab = params?.tab || "dashboard";

  const isEditing = params?.edit || false;
  const userId = params?.id || "";

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
        <NavigationTabsAdmin activeTab={tab} />

        {/* Tab Content */}
        <div className="mt-8">
          {/* Dashboard Content */}
          {tab === "dashboard" && (
            <div className="space-y-8">
              <DashboardAdmin stats={stats} />
            </div>
          )}

          {/* Users Management */}
          {tab === "users" && (
            <div className="space-y-6">
              <UsersManagement users={users} />
            </div>
          )}

          {/* Blog Management */}
          {tab === "blog" && (
            <div className="space-y-6">
              <BlogManagement />
            </div>
          )}

          {/* Projects Management */}
          {tab === "projects" && (
            <div className="space-y-6">
              <ProjectsAdmin projects={projects} />
            </div>
          )}

          {/* Analytics Tab */}
          {tab === "analytics" && (
            <div className="space-y-6">
              <AnalyticsAdmin />
            </div>
          )}

          {/* Settings Tab */}
          {tab === "settings" && (
            <div className="space-y-6">
              <SettingsAdmin />
            </div>
          )}

          {/* Post Tab */}
          {tab === "posts" && (
            <div className="space-y-6">
              <PostsAdmin edit={String(isEditing)} id={userId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
