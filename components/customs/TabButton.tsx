"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface TabButtonProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  activeTab: string;
}
const TabButton = ({ id, label, icon, activeTab }: TabButtonProps) => {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setActiveTab = (id: string) => {
    if (params.get("tab") === id) return;

    const newParams = new URLSearchParams(params.toString());
    newParams.set("tab", id);

    const newUrl = `${pathname}?${newParams.toString()}`;
    router.push(newUrl);
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
