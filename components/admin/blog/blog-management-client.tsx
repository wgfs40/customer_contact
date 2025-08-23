// components/admin/blog/blog-management-client.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface BlogManagementClientProps {
  children: React.ReactNode;
  tab?: string;
}

const BlogManagementClient = ({ children, tab }: BlogManagementClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabClick = () => {
    if (tab) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.push(`?${params.toString()}`);
    }
  };

  const handleClick = () => {
    if (tab) {
      handleTabClick();
    }
    // Aquí puedes agregar más lógica de manejo de eventos
  };

  return <div onClick={handleClick}>{children}</div>;
};

export default BlogManagementClient;
