import { BasicInfoSection } from "./basic-info-section";
import { ContentEditorSection } from "./content-editor-section";
import { SeoSection } from "./seo-section";
import { SidebarSections } from "./sidebar-section";

// Types
interface Category {
  id: string;
  name: string;
}

interface BlogPost {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  status?: "draft" | "published" | "archived";
  featured?: boolean;
  category_id?: string;
  featured_image?: string;
  tags?: string[];
}

interface PostsAdminFormProps {
  categories: Category[];
  existingPost: BlogPost | null;
}

export const PostsAdminForm = ({
  categories,
  existingPost,
}: PostsAdminFormProps) => {
  return (
    <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        <BasicInfoSection existingPost={existingPost} />
        <ContentEditorSection existingPost={existingPost} />
        <SeoSection existingPost={existingPost} />
      </div>

      {/* Sidebar */}
      <div className="space-y-8">
        <SidebarSections categories={categories} existingPost={existingPost} />
      </div>
    </form>
  );
};
