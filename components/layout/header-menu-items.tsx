"use client";

import Link from "next/link";

interface HeaderMenuItemsProps {
  item: {
    name: string;
    href: string;
    label: string;
    icon: string;
  };
  pathname: string;
}

const HeaderMenuItems: React.FC<HeaderMenuItemsProps> = ({
  item,
  pathname,
}) => {
  return (
    <li>
      <Link
        href={item.href}
        className={`flex items-center space-x-1 transition duration-300 ${
          pathname === item.href
            ? "text-[#F9A825] bg-[#F9A825]/10"
            : "text-gray-600 hover:text-teal-500 hover:bg-teal-100"
        }`}
      >
        <span className="relative z-10 flex items-center gap-2">
          <span className="text-sm">{item.icon}</span>
          {item.label}
        </span>
        {pathname === item.href && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-full"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F9A825]/5 to-[#FF8F00]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>
    </li>
  );
};

export default HeaderMenuItems;
