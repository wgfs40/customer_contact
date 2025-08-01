"use client";
interface TabButtonProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  activeTab: string;
  onClick: (id: string) => void;
}
const TabButton = ({ id, label, icon, activeTab, onClick }: TabButtonProps) => {
  const setActiveTab = (id: string) => {
    onClick(id);
  };

  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
        activeTab === id
          ? "bg-[#F9A825] text-white shadow-lg"
          : "text-gray-600 hover:text-[#F9A825] hover:bg-[#F9A825]/10"
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
};

export default TabButton;
