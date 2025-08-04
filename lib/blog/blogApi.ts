import { createClient } from "@supabase/supabase-js";
import {
  BlogPost,
  BlogPostWithDetails,
  CreateBlogPostData,
  UpdateBlogPostData,
  BlogCategory,
  BlogTag,
  BlogComment,
  BlogFilters,
  BlogStats,
  CreateCommentData,
  BlogMetrics,
} from "@/types/blog";

// ================================================================
// CONFIGURACIÓN DE SUPABASE
// ================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ================================================================
// TIPOS DE RESPUESTA
// ================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ================================================================
// FUNCIONES AUXILIARES
// ================================================================

const handleSupabaseError = (error: unknown, context: string): ApiResponse => {
  console.error(`[${context}]`, error);

  if (typeof error === "object" && error !== null && "code" in error) {
    const err = error as { code?: string; message?: string };
    switch (err.code) {
      case "42501":
        return {
          success: false,
          error: "No tienes permisos para realizar esta acción",
        };
      case "23505":
        return {
          success: false,
          error: "Ya existe un registro con esta información",
        };
      case "23503":
        return {
          success: false,
          error: "Error de relación en los datos",
        };
      case "PGRST116":
        return {
          success: false,
          error: "Error temporal del servidor. Intenta nuevamente.",
        };
      default:
        return {
          success: false,
          error: err.message || "Error de base de datos",
        };
    }
  }

  return {
    success: false,
    error:
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message || "Error inesperado"
        : "Error inesperado",
  };
};

const validateSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remover acentos
    .replace(/[^a-z0-9\s-]/g, "") // Remover caracteres especiales
    .trim()
    .replace(/\s+/g, "-") // Espacios a guiones
    .replace(/-+/g, "-"); // Múltiples guiones a uno
};

// ================================================================
// BLOG POSTS CRUD
// ================================================================

export const createBlogPost = async (
  postData: CreateBlogPostData
): Promise<ApiResponse<BlogPost>> => {
  try {
    // Validaciones
    if (!postData.title?.trim()) {
      return {
        success: false,
        error: "El título es requerido",
      };
    }

    if (!postData.content?.trim()) {
      return {
        success: false,
        error: "El contenido es requerido",
      };
    }

    // Generar slug si no se proporciona
    const slug = postData.slug || generateSlug(postData.title);

    if (!validateSlug(slug)) {
      return {
        success: false,
        error:
          "El slug debe contener solo letras minúsculas, números y guiones",
      };
    }

    // Verificar que el slug sea único
    const { data: existingPost } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existingPost) {
      return {
        success: false,
        error: "Ya existe un post con este slug",
      };
    }

    const blogPost = {
      ...postData,
      slug,
      published_at:
        postData.status === "published" ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("blog_posts")
      .insert([blogPost])
      .select()
      .single();

    if (error) {
      return handleSupabaseError(error, "createBlogPost");
    }

    return {
      success: true,
      data,
      message: "Post creado exitosamente",
    };
  } catch (error) {
    return handleSupabaseError(error, "createBlogPost");
  }
};

export const getAllBlogPosts = async (
  filters: BlogFilters = {}
): Promise<PaginatedResponse<BlogPostWithDetails>> => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category_id,
      author_id,
      tag,
      search,
      sort_by = "created_at",
      sort_order = "desc",
      include_drafts = false,
    } = filters;

    const offset = (page - 1) * limit;

    let query = supabase.from("blog_posts").select(
      `
        *,
        category:blog_categories(id, name, slug, description),
        author:profiles(id, full_name, avatar_url),
        tags:blog_post_tags(tag:blog_tags(id, name, slug)),
        comments:blog_comments(id, status),
        _count:blog_post_stats(views, likes, shares)
      `,
      { count: "exact" }
    );

    // Filtros
    if (!include_drafts) {
      query = query.eq("status", "published");
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (category_id) {
      query = query.eq("category_id", category_id);
    }

    if (author_id) {
      query = query.eq("author_id", author_id);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%, content.ilike.%${search}%, excerpt.ilike.%${search}%`
      );
    }

    if (tag) {
      query = query.eq("tags.tag.slug", tag);
    }

    // Ordenamiento
    query = query.order(sort_by, { ascending: sort_order === "asc" });

    // Paginación
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      const baseError = handleSupabaseError(error, "getAllBlogPosts");
      return {
        ...baseError,
        data: [],
        pagination: {
          total: 0,
          page: page,
          limit: limit,
          totalPages: 0,
        },
      };
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      success: true,
      data: data || [],
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error) {
    const baseError = handleSupabaseError(error, "getAllBlogPosts");
    return {
      ...baseError,
      data: [],
      pagination: {
        total: 0,
        page: filters.page ?? 1,
        limit: filters.limit ?? 10,
        totalPages: 0,
      },
    };
  }
};

export const getBlogPostBySlug = async (
  slug: string
): Promise<ApiResponse<BlogPostWithDetails>> => {
  try {
    if (!slug) {
      return {
        success: false,
        error: "El slug es requerido",
      };
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        `
        *,
        category:blog_categories(id, name, slug, description, color),
        author:profiles(id, full_name, avatar_url, bio),
        tags:blog_post_tags(tag:blog_tags(id, name, slug, color)),
        comments:blog_comments(
          id, content, author_name, author_email, 
          status, created_at, parent_id
        ),
        _count:blog_post_stats(views, likes, shares, comments)
      `
      )
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return {
          success: false,
          error: "Post no encontrado",
        };
      }
      return handleSupabaseError(error, "getBlogPostBySlug");
    }

    // Incrementar vista
    await incrementPostViews(data.id);

    return {
      success: true,
      data,
    };
  } catch (error) {
    return handleSupabaseError(error, "getBlogPostBySlug");
  }
};

export const getBlogPostById = async (
  id: string
): Promise<ApiResponse<BlogPostWithDetails>> => {
  try {
    if (!id) {
      return {
        success: false,
        error: "El ID es requerido",
      };
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        `
        *,
        category:blog_categories(id, name, slug, description, color),
        author:profiles(id, full_name, avatar_url, bio),
        tags:blog_post_tags(tag:blog_tags(id, name, slug, color)),
        comments:blog_comments(
          id, content, author_name, author_email, 
          status, created_at, parent_id
        ),
        _count:blog_post_stats(views, likes, shares, comments)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      return handleSupabaseError(error, "getBlogPostById");
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return handleSupabaseError(error, "getBlogPostById");
  }
};

export const updateBlogPost = async (
  id: string,
  updateData: UpdateBlogPostData
): Promise<ApiResponse<BlogPost>> => {
  try {
    if (!id) {
      return {
        success: false,
        error: "El ID es requerido",
      };
    }

    // Si se actualiza el slug, validarlo
    if (updateData.slug && !validateSlug(updateData.slug)) {
      return {
        success: false,
        error:
          "El slug debe contener solo letras minúsculas, números y guiones",
      };
    }

    // Si se cambia el estado a publicado, agregar fecha de publicación
    if (updateData.status === "published" && !updateData.published_at) {
      updateData.published_at = new Date().toISOString();
    }

    const blogPost = {
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("blog_posts")
      .update(blogPost)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return handleSupabaseError(error, "updateBlogPost");
    }

    return {
      success: true,
      data,
      message: "Post actualizado exitosamente",
    };
  } catch (error) {
    return handleSupabaseError(error, "updateBlogPost");
  }
};

export const deleteBlogPost = async (id: string): Promise<ApiResponse> => {
  try {
    if (!id) {
      return {
        success: false,
        error: "El ID es requerido",
      };
    }

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      return handleSupabaseError(error, "deleteBlogPost");
    }

    return {
      success: true,
      message: "Post eliminado exitosamente",
    };
  } catch (error) {
    return handleSupabaseError(error, "deleteBlogPost");
  }
};

// ================================================================
// CATEGORÍAS
// ================================================================

export const getAllCategories = async (): Promise<
  ApiResponse<BlogCategory[]>
> => {
  try {
    const { data, error } = await supabase
      .from("blog_categories")
      .select(
        `
        *,
        _count:blog_posts(count)
      `
      )
      .order("name");

    if (error) {
      const baseError = handleSupabaseError(error, "getAllCategories");
      return {
        ...baseError,
        data: [],
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    const baseError = handleSupabaseError(error, "getAllCategories");
    return {
      ...baseError,
      data: [],
    };
  }
};

export const createCategory = async (
  categoryData: Omit<BlogCategory, "id" | "created_at" | "updated_at">
): Promise<ApiResponse<BlogCategory>> => {
  try {
    if (!categoryData.name?.trim()) {
      return {
        success: false,
        error: "El nombre de la categoría es requerido",
      };
    }

    const slug = categoryData.slug || generateSlug(categoryData.name);

    const category = {
      ...categoryData,
      slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("blog_categories")
      .insert([category])
      .select()
      .single();

    if (error) {
      return handleSupabaseError(error, "createCategory");
    }

    return {
      success: true,
      data,
      message: "Categoría creada exitosamente",
    };
  } catch (error) {
    return handleSupabaseError(error, "createCategory");
  }
};

// ================================================================
// TAGS
// ================================================================

export const getAllTags = async (): Promise<ApiResponse<BlogTag[]>> => {
  try {
    const { data, error } = await supabase
      .from("blog_tags")
      .select(
        `
        *,
        _count:blog_post_tags(count)
      `
      )
      .order("name");

    if (error) {
      const baseError = handleSupabaseError(error, "getAllTags");
      return {
        ...baseError,
        data: [],
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    const baseError = handleSupabaseError(error, "getAllTags");
    return {
      ...baseError,
      data: [],
    };
  }
};

export const createTag = async (
  tagData: Omit<BlogTag, "id" | "created_at" | "updated_at">
): Promise<ApiResponse<BlogTag>> => {
  try {
    if (!tagData.name?.trim()) {
      return {
        success: false,
        error: "El nombre del tag es requerido",
      };
    }

    const slug = tagData.slug || generateSlug(tagData.name);

    const tag = {
      ...tagData,
      slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("blog_tags")
      .insert([tag])
      .select()
      .single();

    if (error) {
      return handleSupabaseError(error, "createTag");
    }

    return {
      success: true,
      data,
      message: "Tag creado exitosamente",
    };
  } catch (error) {
    return handleSupabaseError(error, "createTag");
  }
};

// ================================================================
// COMENTARIOS
// ================================================================

export const getPostComments = async (
  postId: string,
  status: "approved" | "pending" | "rejected" = "approved"
): Promise<ApiResponse<BlogComment[]>> => {
  try {
    if (!postId) {
      return {
        success: false,
        error: "El ID del post es requerido",
      };
    }

    const { data, error } = await supabase
      .from("blog_comments")
      .select("*")
      .eq("post_id", postId)
      .eq("status", status)
      .order("created_at", { ascending: true });

    if (error) {
      return { ...handleSupabaseError(error, "getPostComments"), data: [] };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    return { ...handleSupabaseError(error, "getPostComments"), data: [] };
  }
};

export const createComment = async (
  commentData: CreateCommentData
): Promise<ApiResponse<BlogComment>> => {
  try {
    // Validaciones
    if (!commentData.post_id) {
      return {
        success: false,
        error: "El ID del post es requerido",
      };
    }

    if (!commentData.content?.trim()) {
      return {
        success: false,
        error: "El contenido del comentario es requerido",
      };
    }

    if (!commentData.author_name?.trim()) {
      return {
        success: false,
        error: "El nombre del autor es requerido",
      };
    }

    if (!commentData.author_email?.trim()) {
      return {
        success: false,
        error: "El email del autor es requerido",
      };
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(commentData.author_email)) {
      return {
        success: false,
        error: "El formato del email no es válido",
      };
    }

    const comment = {
      ...commentData,
      status: "pending" as const, // Los comentarios empiezan como pendientes
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("blog_comments")
      .insert([comment])
      .select()
      .single();

    if (error) {
      return handleSupabaseError(error, "createComment");
    }

    return {
      success: true,
      data,
      message: "Comentario enviado. Será revisado antes de publicarse.",
    };
  } catch (error) {
    return handleSupabaseError(error, "createComment");
  }
};

export const updateCommentStatus = async (
  commentId: string,
  status: "approved" | "pending" | "rejected"
): Promise<ApiResponse> => {
  try {
    if (!commentId) {
      return {
        success: false,
        error: "El ID del comentario es requerido",
      };
    }

    const { error } = await supabase
      .from("blog_comments")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId);

    if (error) {
      return handleSupabaseError(error, "updateCommentStatus");
    }

    return {
      success: true,
      message: "Estado del comentario actualizado",
    };
  } catch (error) {
    return handleSupabaseError(error, "updateCommentStatus");
  }
};

// ================================================================
// ESTADÍSTICAS Y MÉTRICAS
// ================================================================

export const incrementPostViews = async (postId: string): Promise<void> => {
  try {
    await supabase.rpc("increment_post_views", { post_id: postId });
  } catch (error) {
    console.error("Error incrementing views:", error);
  }
};

export const getBlogStats = async (): Promise<ApiResponse<BlogStats>> => {
  try {
    const [postsResult, categoriesResult, tagsResult, commentsResult] =
      await Promise.all([
        supabase.from("blog_posts").select("id, status", { count: "exact" }),
        supabase.from("blog_categories").select("id", { count: "exact" }),
        supabase.from("blog_tags").select("id", { count: "exact" }),
        supabase.from("blog_comments").select("id, status", { count: "exact" }),
      ]);

    if (
      postsResult.error ||
      categoriesResult.error ||
      tagsResult.error ||
      commentsResult.error
    ) {
      throw new Error("Error al obtener estadísticas");
    }

    const publishedPosts =
      postsResult.data?.filter((p) => p.status === "published").length || 0;
    const draftPosts =
      postsResult.data?.filter((p) => p.status === "draft").length || 0;
    const pendingComments =
      commentsResult.data?.filter((c) => c.status === "pending").length || 0;

    const stats: BlogStats = {
      totalPosts: postsResult.count || 0,
      publishedPosts,
      draftPosts,
      totalCategories: categoriesResult.count || 0,
      totalTags: tagsResult.count || 0,
      totalComments: commentsResult.count || 0,
      pendingComments,
    };

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    return handleSupabaseError(error, "getBlogStats");
  }
};

export const getPopularPosts = async (
  limit: number = 5
): Promise<ApiResponse<BlogPost[]>> => {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        `
        *,
        category:blog_categories(name, slug),
        _count:blog_post_stats(views)
      `
      )
      .eq("status", "published")
      .order("views", { ascending: false })
      .limit(limit);

    if (error) {
      return { ...handleSupabaseError(error, "getPopularPosts"), data: [] };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    return { ...handleSupabaseError(error, "getPopularPosts"), data: [] };
  }
};

export const getRecentPosts = async (
  limit: number = 5
): Promise<ApiResponse<BlogPost[]>> => {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        `
        *,
        category:blog_categories(name, slug),
        author:profiles(full_name)
      `
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      return { ...handleSupabaseError(error, "getRecentPosts"), data: [] };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    return { ...handleSupabaseError(error, "getRecentPosts"), data: [] };
  }
};

export const searchPosts = async (
  query: string,
  filters: Partial<BlogFilters> = {}
): Promise<ApiResponse<BlogPost[]>> => {
  try {
    if (!query?.trim()) {
      return {
        success: false,
        error: "El término de búsqueda es requerido",
      };
    }

    let supabaseQuery = supabase
      .from("blog_posts")
      .select(
        `
        *,
        category:blog_categories(name, slug),
        author:profiles(full_name),
        tags:blog_post_tags(tag:blog_tags(name, slug))
      `
      )
      .eq("status", "published")
      .or(
        `title.ilike.%${query}%, content.ilike.%${query}%, excerpt.ilike.%${query}%`
      );

    if (filters.category_id) {
      supabaseQuery = supabaseQuery.eq("category_id", filters.category_id);
    }

    if (filters.tag) {
      supabaseQuery = supabaseQuery.eq("tags.tag.slug", filters.tag);
    }

    const { data, error } = await supabaseQuery
      .order("published_at", { ascending: false })
      .limit(filters.limit || 20);

    if (error) {
      return { ...handleSupabaseError(error, "searchPosts"), data: [] };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    return { ...handleSupabaseError(error, "searchPosts"), data: [] };
  }
};

// ================================================================
// FUNCIONES DE UTILIDAD
// ================================================================

export const validateBlogPostData = (
  data: CreateBlogPostData | UpdateBlogPostData
): string[] => {
  const errors: string[] = [];

  if ("title" in data && !data.title?.trim()) {
    errors.push("El título es requerido");
  }

  if ("content" in data && !data.content?.trim()) {
    errors.push("El contenido es requerido");
  }

  if ("slug" in data && data.slug && !validateSlug(data.slug)) {
    errors.push(
      "El slug debe contener solo letras minúsculas, números y guiones"
    );
  }

  if ("excerpt" in data && data.excerpt && data.excerpt.length > 300) {
    errors.push("El extracto no puede superar los 300 caracteres");
  }

  return errors;
};

export const generateExcerpt = (
  content: string,
  maxLength: number = 150
): string => {
  // Remover HTML tags
  const textOnly = content.replace(/<[^>]*>/g, "");

  if (textOnly.length <= maxLength) {
    return textOnly;
  }

  // Cortar en la palabra más cercana
  const truncated = textOnly.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + "..."
    : truncated + "...";
};

const blogApi = {
  // Posts
  createBlogPost,
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,

  // Categorías
  getAllCategories,
  createCategory,

  // Tags
  getAllTags,
  createTag,

  // Comentarios
  getPostComments,
  createComment,
  updateCommentStatus,

  // Estadísticas
  getBlogStats,
  getPopularPosts,
  getRecentPosts,
  searchPosts,
  incrementPostViews,

  // Utilidades
  validateBlogPostData,
  generateExcerpt,
  generateSlug,
  validateSlug,
};

export default blogApi;
