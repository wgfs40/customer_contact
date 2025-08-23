import TabButton from "@/components/customs/TabButton";

interface NavigationTabsAdminProps {
  activeTab: string;
}

const NavigationTabsAdmin = ({ activeTab }: NavigationTabsAdminProps) => {
  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm">
        <TabButton
          id="dashboard"
          label="Dashboard"
          icon="📊"
          activeTab={activeTab}
        />
        <TabButton
          id="users"
          label="Usuarios"
          icon="👥"
          activeTab={activeTab}
        />
        <TabButton id="blog" label="Blog" icon="📝" activeTab={activeTab} />
        <TabButton
          id="projects"
          label="Proyectos"
          icon="📁"
          activeTab={activeTab}
        />
        <TabButton
          id="analytics"
          label="Analytics"
          icon="📈"
          activeTab={activeTab}
        />
        <TabButton
          id="settings"
          label="Configuración"
          icon="⚙️"
          activeTab={activeTab}
        />
      </div>
    </>
  );
};

export default NavigationTabsAdmin;
