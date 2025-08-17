import {
  getAllBlogPostsAction,
  getAllCategoriesAction,
} from "@/actions/blog_actions";
import BlogFeaturePosts from "./BlogFeaturePosts";
import BlogPostCard from "./blog-post-card";
import BlogCategories from "./BlogCategories";
import { get } from "http";

const BlogContent = async () => {
  const result = await getAllBlogPostsAction({
    limit: 12,
    status: "published",
    sort_by: "publish_date",
    sort_order: "desc",
  });

  const getCategories = await getAllCategoriesAction();

  const categories = getCategories.data ?? [];

  // Define selectedCategory, set to empty string or desired default value
  const selectedCategory = "";

  if (!result || result.data?.length === 0) {
    return <div>No blog posts found.</div>;
  }

  const posts = result.data ?? [];

  let featuredLastTwoPosts = posts.filter((post) => post.featured).slice(0, 2);

  let featuredLastThreePosts = posts.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Blog de Marketing Digital
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Insights, estrategias y tendencias para hacer crecer tu negocio
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Featured Posts */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-1 h-8 bg-[#F9A825] mr-4"></span>
                Artículos Destacados
              </h2>
              <BlogFeaturePosts featuredPosts={featuredLastTwoPosts} />
            </div>

            {/* All Posts */}
            <div className="space-y-12">
              {featuredLastThreePosts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  variant="horizontal"
                  showAuthor
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-8 space-y-8">
              <BlogCategories
                categories={categories}
                posts={posts.map((post) => ({
                  categoryId: post.category?.id ?? "",
                }))}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogContent;
