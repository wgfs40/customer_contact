"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface NavItemProps {
  href: string;
  label: string;
  icon?: string;
  className?: string;
}
const NavItem = ({ href, label, icon, className }: NavItemProps) => {
  const path = usePathname();
  const { push } = useRouter();
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    push(href);
  };
  return (
    <div className={className}>
      {icon && <span className="icon">{icon}</span>}
      <Link href={href} onClick={onClick}>
        {label}
      </Link>
    </div>
  );
};

export default NavItem;
