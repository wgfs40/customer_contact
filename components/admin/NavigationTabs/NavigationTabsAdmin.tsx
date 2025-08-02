import TabButton from "@/components/customs/TabButton";

interface NavigationTabsAdminProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavigationTabsAdmin = ({
  activeTab,
  setActiveTab,
}: NavigationTabsAdminProps) => {
    
  return (
    <>
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
    </>
  );
};

export default NavigationTabsAdmin;
