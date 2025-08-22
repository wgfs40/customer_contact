"use client";

import {
  useEffect,
  useState,
  useTransition,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BlogFeaturePosts from "./BlogFeaturePosts";
import BlogCategories from "./BlogCategories";
import BlogPostCard from "./blog-post-card";
import { BlogPostWithDetails } from "@/types/home/blog";
import {
  getAllBlogPostsAction,
  getAllCategoriesAction,
} from "@/actions/blog_actions";

interface BlogContentProps {
  initialCategory: string;
  initialPage: number;
}

const BlogContent = ({ initialCategory, initialPage }: BlogContentProps) => {
  // ✅ Estados optimizados
  const [posts, setPosts] = useState<BlogPostWithDetails[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // ✅ Referencias para evitar re-renders innecesarios
  const categoriesLoadedRef = useRef(false);
  const initialLoadedRef = useRef(false);
  const lastParamsRef = useRef({
    category: initialCategory,
    page: initialPage,
  });

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const selectedCategory = searchParams.get("category") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  // ✅ Cache para categorías (carga solo una vez)
  const loadCategoriesOnce = useCallback(async () => {
    if (categoriesLoadedRef.current) return categories;

    try {
      console.log("🔄 Cargando categorías...");
      const categoriesResult = await getAllCategoriesAction();

      if (categoriesResult?.data) {
        setCategories(categoriesResult.data);
        categoriesLoadedRef.current = true;
        console.log("✅ Categorías cargadas:", categoriesResult.data.length);
        return categoriesResult.data;
      }
    } catch (error) {
      console.error("❌ Error loading categories:", error);
    }
    return [];
  }, [categories]);

  // ✅ Carga de posts ultra-optimizada
  const loadPosts = useCallback(async (category?: string, page?: number) => {
    const startTime = performance.now();

    try {
      setPostsLoading(true);
      console.log("🔄 Cargando posts...", { category, page });

      const postsResult = await getAllBlogPostsAction({
        limit: 12,
        status: "published",
        sort_by: "publish_date",
        sort_order: "desc",
        category_id: category || undefined,
        page: page || 1,
      });

      if (postsResult?.data) {
        setPosts(postsResult.data);
        const endTime = performance.now();
        console.log(
          `✅ Posts cargados en ${(endTime - startTime).toFixed(2)}ms:`,
          postsResult.data.length
        );
      }
    } catch (error) {
      console.error("❌ Error loading posts:", error);
    } finally {
      setPostsLoading(false);
    }
  }, []);

  // ✅ Carga inicial ultra-rápida
  useEffect(() => {
    if (initialLoadedRef.current) return;

    const loadInitialData = async () => {
      const startTime = performance.now();
      setLoading(true);

      try {
        // ✅ Carga en paralelo con Promise.allSettled para mejor rendimiento
        const [categoriesResult, postsResult] = await Promise.allSettled([
          loadCategoriesOnce(),
          loadPosts(initialCategory, initialPage),
        ]);

        if (categoriesResult.status === "rejected") {
          console.warn("Categories load failed:", categoriesResult.reason);
        }
        if (postsResult.status === "rejected") {
          console.warn("Posts load failed:", postsResult.reason);
        }

        const endTime = performance.now();
        console.log(
          `🚀 Carga inicial completa en ${(endTime - startTime).toFixed(2)}ms`
        );
      } catch (error) {
        console.error("❌ Error in initial load:", error);
      } finally {
        setLoading(false);
        initialLoadedRef.current = true;
      }
    };

    loadInitialData();
  }, [loadCategoriesOnce, loadPosts, initialCategory, initialPage]);

  // ✅ Solo cargar posts cuando realmente cambian los parámetros
  useEffect(() => {
    if (!initialLoadedRef.current || loading) return;

    const currentParams = { category: selectedCategory, page: currentPage };
    const lastParams = lastParamsRef.current;

    // ✅ Comparación deep para evitar cargas innecesarias
    const paramsChanged =
      currentParams.category !== lastParams.category ||
      currentParams.page !== lastParams.page;

    if (paramsChanged) {
      console.log("📊 Parámetros cambiaron:", {
        from: lastParams,
        to: currentParams,
      });

      startTransition(() => {
        loadPosts(selectedCategory, currentPage);
        lastParamsRef.current = currentParams;
      });
    }
  }, [selectedCategory, currentPage, loadPosts, loading]);

  // ✅ Función para manejar cambios de categoría (ultra-optimizada)
  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      // ✅ Evitar cambios redundantes
      if (
        (categoryId === "" && !selectedCategory) ||
        categoryId === selectedCategory
      ) {
        return;
      }

      startTransition(() => {
        const params = new URLSearchParams();

        if (categoryId) {
          params.set("category", categoryId);
        }
        // No agregar page=1 explícitamente si no es necesario

        const newUrl = params.toString()
          ? `${pathname}?${params.toString()}`
          : pathname;

        router.push(newUrl, { scroll: false });
      });
    },
    [selectedCategory, pathname, router]
  );

  // ✅ Memoización ultra-optimizada con shallow comparison
  const postsData = useMemo(() => {
    if (!posts.length) {
      return {
        featuredPosts: [],
        displayPosts: [],
        hasMorePosts: false,
        totalPosts: 0,
      };
    }

    const featured = posts.filter((post) => post.featured).slice(0, 2);
    const display = posts.slice(0, 9);
    const hasMore = posts.length >= 9;

    return {
      featuredPosts: featured,
      displayPosts: display,
      hasMorePosts: hasMore,
      totalPosts: posts.length,
    };
  }, [posts]);

  // ✅ Función de carga de más posts (optimizada)
  const handleLoadMore = useCallback(() => {
    const nextPage = Math.floor(postsData.displayPosts.length / 9) + 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", nextPage.toString());

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [postsData.displayPosts.length, searchParams, pathname, router]);

  // ✅ Estados de carga optimizados
  const isInitialLoading = loading && !initialLoadedRef.current;
  const isContentLoading = postsLoading || isPending;

  // ✅ Early returns optimizados
  if (isInitialLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-[#F9A825]/20 rounded-full"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-[#F9A825] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <p className="text-gray-600 font-medium">Cargando artículos...</p>
              <div className="flex items-center justify-center mt-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#F9A825] rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-[#F9A825] rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-[#F9A825] rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!posts.length && !isContentLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            No hay artículos disponibles
          </h3>
          <p className="text-gray-500">
            {selectedCategory
              ? "No encontramos artículos en esta categoría."
              : "Estamos trabajando en nuevos contenidos."}
          </p>
          {selectedCategory && (
            <button
              onClick={() => handleCategoryChange("")}
              className="mt-4 bg-[#F9A825] hover:bg-[#FF8F00] text-white px-6 py-3 rounded-lg transition-colors"
              disabled={isContentLoading}
            >
              Ver todos los artículos
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* ✅ Loading bar más sutil y rápido */}
      {isContentLoading && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] animate-pulse">
            <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <main className="lg:w-2/3">
          {/* Featured Posts - solo mostrar si no hay filtro activo */}
          {!selectedCategory && postsData.featuredPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-1 h-8 bg-[#F9A825] mr-4"></span>
                Artículos Destacados
              </h2>
              <BlogFeaturePosts featuredPosts={postsData.featuredPosts} />
            </section>
          )}

          {/* Indicador de filtro activo */}
          {selectedCategory && (
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 bg-[#F9A825]/10 text-[#F9A825] px-4 py-2 rounded-lg">
                <span>Filtrando por:</span>
                <span className="font-semibold">
                  {categories.find((cat) => cat.id === selectedCategory)
                    ?.name || selectedCategory}
                </span>
                <button
                  onClick={() => handleCategoryChange("")}
                  className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
                  title="Limpiar filtro"
                  disabled={isContentLoading}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* All Posts */}
          <section className="space-y-8">
            <header className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="w-1 h-6 bg-[#F9A825] mr-4"></span>
                {selectedCategory ? "Artículos Filtrados" : "Últimos Artículos"}
                {isContentLoading && (
                  <div className="ml-3 w-4 h-4 border-2 border-[#F9A825] border-t-transparent rounded-full animate-spin"></div>
                )}
              </h2>

              {/* ✅ Contador de resultados */}
              <div className="text-sm text-gray-500">
                {postsData.totalPosts} artículo
                {postsData.totalPosts !== 1 ? "s" : ""}
              </div>
            </header>

            <div className="space-y-6">
              {postsData.displayPosts.map((post, index) => (
                <article
                  key={`${post.id}-${selectedCategory}-${currentPage}`}
                  className={`transition-all duration-200 ${
                    isContentLoading
                      ? "opacity-60 pointer-events-none"
                      : "opacity-100"
                  }`}
                >
                  <BlogPostCard
                    post={post}
                    variant="horizontal"
                    showAuthor
                    showCategory
                    showDate
                    showExcerpt
                  />
                </article>
              ))}
            </div>

            {/* Load more button optimizado */}
            {postsData.hasMorePosts && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="bg-[#F9A825] hover:bg-[#FF8F00] text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  disabled={isContentLoading}
                >
                  {isContentLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Cargando...
                    </span>
                  ) : (
                    "Cargar más artículos"
                  )}
                </button>
              </div>
            )}
          </section>
        </main>

        {/* Sidebar */}
        <aside className="lg:w-1/3">
          <div className="sticky top-8 space-y-8">
            {/* ✅ Categorías con loading state */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {categoriesLoadedRef.current ? (
                <BlogCategories
                  categories={categories}
                  posts={posts.map((post) => ({
                    categoryId: post.category?.id ?? "",
                  }))}
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                />
              ) : (
                <div className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stats card ultra-optimizado */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total artículos:</span>
                  <span className="font-medium text-[#F9A825]">
                    {postsData.totalPosts}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categorías:</span>
                  <span className="font-medium text-[#F9A825]">
                    {categoriesLoadedRef.current ? categories.length : "..."}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Destacados:</span>
                  <span className="font-medium text-[#F9A825]">
                    {postsData.featuredPosts.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogContent;
