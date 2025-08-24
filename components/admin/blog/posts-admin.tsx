import { getAllCategoriesAction } from "@/actions/blog_actions";
import PostsAdminClient from "./post-admin-client";
import { PostsAdminHeader } from "./post-admin-header";
import { PostsAdminForm } from "./post-admin-form";

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

interface PostsAdminProps {
  searchParams?: Promise<{
    edit?: string;
    id?: string;
  }>;
}

// Data fetching functions
async function getCategories(): Promise<Category[]> {
  try {
    const categoriesResult = await getAllCategoriesAction();
    return categoriesResult?.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getExistingPost(id: string): Promise<BlogPost | null> {
  try {
    // TODO: Implement getBlogPostByIdAction
    // const postResult = await getBlogPostByIdAction(id);
    // return postResult?.data as BlogPost;
    return null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

const PostsAdmin = async ({ searchParams }: PostsAdminProps) => {
  const params = await searchParams;
  const isEditing = Boolean(params?.edit && params?.id);

  // Fetch data in parallel
  const [categories, existingPost] = await Promise.all([
    getCategories(),
    isEditing && params?.id
      ? getExistingPost(params.id)
      : Promise.resolve(null),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <PostsAdminHeader isEditing={isEditing} />

        <PostsAdminClient
          categories={categories}
          existingPost={
            existingPost
              ? {
                  ...existingPost,
                  featured_image: undefined, // Ensure compatibility with expected type
                }
              : null
          }
          isEditing={isEditing}
        >
          <PostsAdminForm categories={categories} existingPost={existingPost} />
        </PostsAdminClient>
      </div>
    </div>
  );
};

export default PostsAdmin;
