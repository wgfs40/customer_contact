// components/admin/blog/blog-management-client.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface BlogManagementClientProps {
  children: React.ReactNode;
  tab?: string;
  edit?: boolean;
  id?: string;
}

const BlogManagementClient = ({ children, tab, edit, id }: BlogManagementClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabClick = () => {
    if (tab) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      if (edit) {
        params.set("edit", String(edit));
      }
      if (id) {
        params.set("id", id);
      }
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
