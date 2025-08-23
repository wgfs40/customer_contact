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
} from "@/types/home/blog";
import { cache } from "react";

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
      case "PGRST200":
        return {
          success: false,
          error:
            "Error de relación en la base de datos. Verificando estructura...",
        };
      case "42703":
        return {
          success: false,
          error: "Columna no encontrada en la base de datos.",
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
    .replace(/-+/g, "-") // Múltiples guiones a uno
    .substring(0, 200); // Limitar longitud
};

// ================================================================
// FUNCIÓN AUXILIAR PARA OBTENER DATOS DEL AUTOR
// ================================================================

const getAuthorData = async (authorId: string) => {
  try {
    // Intentar obtener desde profiles primero
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, bio, email")
      .eq("id", authorId)
      .single();

    if (profile && !profileError) {
      return {
        id: profile.id,
        full_name: profile.full_name || "Usuario",
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        email: profile.email,
      };
    }

    // Si no existe en profiles, intentar obtener desde una tabla users personalizada
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, full_name, email, avatar_url")
      .eq("id", authorId)
      .single();

    if (user && !userError) {
      return {
        id: user.id,
        full_name: user.full_name || user.email || "Usuario",
        avatar_url: user.avatar_url,
        bio: undefined,
        email: user.email,
      };
    }

    // Como último recurso, crear datos básicos con el ID
    console.warn(`No se encontraron datos para el autor: ${authorId}`);
    return {
      id: authorId,
      full_name: "Usuario",
      avatar_url: undefined,
      bio: undefined,
      email: undefined,
    };
  } catch (error) {
    console.error("Error obteniendo datos del autor:", error);
    return {
      id: authorId,
      full_name: "Usuario anónimo",
      avatar_url: undefined,
      bio: undefined,
      email: undefined,
    };
  }
};

// ================================================================
// FUNCIÓN AUXILIAR PARA PROCESAR POSTS
// ================================================================

const processPostData = async (
  posts: BlogPost[]
): Promise<BlogPostWithDetails[]> => {
  const processedPosts: BlogPostWithDetails[] = [];

  for (const post of posts) {
    try {
      // Obtener datos del autor
      const author = await getAuthorData(post.author_id);

      author.full_name =
        author.full_name === "Usuario" ? post.author_name : author.full_name;

      // Obtener categoría si existe category_id
      let category: BlogCategory | undefined = undefined;
      if (post.category_id) {
        const { data: categoryData } = await supabase
          .from("blog_categories")
          .select(
            "id, name, slug, color, icon, is_active, created_at, updated_at"
          )
          .eq("id", post.category_id)
          .single();
        category = categoryData || undefined;
      }

      // Obtener tags - Estructura corregida
      let tags: BlogTag[] = [];
      const { data: postTags } = await supabase
        .from("blog_post_tags")
        .select(
          `
          tag:blog_tags(id, name, slug, color, featured, description, created_at, updated_at)
        `
        )
        .eq("post_id", post.id);

      if (postTags && Array.isArray(postTags)) {
        tags = postTags
          .flatMap((pt: { tag: BlogTag | BlogTag[] }) => {
            if (Array.isArray(pt.tag)) {
              return pt.tag.map((t) => ({
                id: t.id || "",
                name: t.name || "",
                slug: t.slug || "",
                color: t.color,
                featured: t.featured || false,
                description: t.description || "",
                created_at: t.created_at,
                updated_at: t.updated_at,
                _count: undefined,
              }));
            } else if (pt.tag && typeof pt.tag === "object") {
              const t = pt.tag as BlogTag;
              return [
                {
                  id: t.id || "",
                  name: t.name || "",
                  slug: t.slug || "",
                  color: t.color,
                  featured: t.featured || false,
                  description: t.description || "",
                  created_at: t.created_at,
                  updated_at: t.updated_at,
                  _count: undefined,
                },
              ];
            }
            return [];
          })
          .filter((tag): tag is NonNullable<typeof tag> => tag !== null); // Filtrar valores nulos
      }

      // Obtener conteo de comentarios (sin filtrar por status)
      const { count: commentsCount } = await supabase
        .from("blog_comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);

      const processedPost: BlogPostWithDetails = {
        ...post,
        author,
        category,
        tags,
        _count: {
          views_count: post.views_count || 0,
          likes_count: post.likes_count || 0,
          shares_count: post.shares_count || 0,
          comments_count: commentsCount || 0,
          approved_comments_count: commentsCount || 0,
        },
      };

      processedPosts.push(processedPost);
    } catch (error) {
      console.error(`Error procesando post ${post.id}:`, error);
      // Agregar post con datos mínimos si hay error
      processedPosts.push({
        ...post,
        author: {
          id: post.author_id,
          full_name: "Usuario anónimo",
          avatar_url: undefined,
          bio: undefined,
          email: undefined,
        },
        category: undefined,
        tags: [],
        _count: {
          views_count: post.views_count || 0,
          likes_count: post.likes_count || 0,
          shares_count: post.shares_count || 0,
          comments_count: 0,
          approved_comments_count: 0,
        },
      });
    }
  }

  return processedPosts;
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
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt,
      slug,
      featured_image: postData.featured_image,
      meta_title: postData.meta_title,
      meta_description: postData.meta_description,
      author_id: postData.author_id,
      category_id: postData.category_id,
      is_featured: postData.featured || false,
      allow_comments: postData.allow_comments !== false,
      scheduled_at: postData.scheduled_at,
    };

    const { data, error } = await supabase
      .from("blog_posts")
      .insert([blogPost])
      .select()
      .single();

    if (error) {
      return handleSupabaseError(
        error,
        "createBlogPost"
      ) as ApiResponse<BlogPost>;
    }

    // Si hay tags, asociarlos
    if (postData.tags && postData.tags.length > 0) {
      const tagRelations = postData.tags.map((tagId) => ({
        post_id: data.id,
        tag_id: tagId,
      }));

      await supabase.from("blog_post_tags").insert(tagRelations);
    }

    return {
      success: true,
      data,
      message: "Post creado exitosamente",
    };
  } catch (error) {
    return handleSupabaseError(
      error,
      "createBlogPost"
    ) as ApiResponse<BlogPost>;
  }
};

export const getAllBlogPosts = async (
  filters: BlogFilters = {}
): Promise<PaginatedResponse<BlogPostWithDetails>> => {
  try {
    console.log("[getAllBlogPosts] Obteniendo posts con filtros:", filters);

    const {
      page = 1,
      limit = 10,
      category_id,
      author_id,
      tag,
      search,
      sort_by = "id",
      sort_order = "desc",
    } = filters;

    const offset = (page - 1) * limit;

    // Query base sin relaciones complejas
    let query = supabase.from("blog_posts").select("*", { count: "exact" });

    // Aplicar filtros
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

    // Ordenamiento - Solo columnas que existen
    const validSortColumns = [
      "id",
      "title",
      "views_count",
      "likes_count",
      "shares_count",
      "updated_at",
      "publish_date",
    ];
    const sortColumn = validSortColumns.includes(sort_by) ? sort_by : "id";
    query = query.order(sortColumn, { ascending: sort_order === "asc" });

    // Paginación
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("[getAllBlogPosts] Error en query:", error);
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

    if (!data || data.length === 0) {
      console.log("[getAllBlogPosts] No se encontraron posts");
      return {
        success: true,
        data: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      };
    }

    console.log(`[getAllBlogPosts] Se encontraron ${data.length} posts`);

    // Procesar datos con relaciones
    const processedData = await processPostData(data);

    // Filtrar por tag si se especifica (post-procesamiento)
    let finalData = processedData;
    if (tag) {
      finalData = processedData.filter((post) =>
        post.tags?.some((t) => t.slug === tag)
      );
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      success: true,
      data: finalData,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error) {
    console.error("[getAllBlogPosts] Error inesperado:", error);
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

    console.log("[getBlogPostBySlug] Buscando post con slug:", slug);

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("[getBlogPostBySlug] Error:", error);
      if (error.code === "PGRST116") {
        return {
          success: false,
          error: "Post no encontrado",
        };
      }
      return handleSupabaseError(
        error,
        "getBlogPostBySlug"
      ) as ApiResponse<BlogPostWithDetails>;
    }

    if (!data) {
      return {
        success: false,
        error: "Post no encontrado",
      };
    }

    // Procesar datos del post
    const [processedPost] = await processPostData([data]);

    // Incrementar vistas
    await incrementPostViews(data.id);

    return {
      success: true,
      data: processedPost,
    };
  } catch (error) {
    console.error("[getBlogPostBySlug] Error inesperado:", error);
    return handleSupabaseError(
      error,
      "getBlogPostBySlug"
    ) as ApiResponse<BlogPostWithDetails>;
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
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return handleSupabaseError(
        error,
        "getBlogPostById"
      ) as ApiResponse<BlogPostWithDetails>;
    }

    if (!data) {
      return {
        success: false,
        error: "Post no encontrado",
      };
    }

    // Procesar datos del post
    const [processedPost] = await processPostData([data]);

    return {
      success: true,
      data: processedPost,
    };
  } catch (error) {
    return handleSupabaseError(
      error,
      "getBlogPostById"
    ) as ApiResponse<BlogPostWithDetails>;
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

    const { data, error } = await supabase
      .from("blog_posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return handleSupabaseError(
        error,
        "updateBlogPost"
      ) as ApiResponse<BlogPost>;
    }

    // Si hay tags en la actualización, actualizarlos
    if (updateData.tags !== undefined) {
      // Eliminar relaciones existentes
      await supabase.from("blog_post_tags").delete().eq("post_id", id);

      // Agregar nuevas relaciones
      if (updateData.tags.length > 0) {
        const tagRelations = updateData.tags.map((tagId) => ({
          post_id: id,
          tag_id: tagId,
        }));

        await supabase.from("blog_post_tags").insert(tagRelations);
      }
    }

    return {
      success: true,
      data,
      message: "Post actualizado exitosamente",
    };
  } catch (error) {
    return handleSupabaseError(
      error,
      "updateBlogPost"
    ) as ApiResponse<BlogPost>;
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

export const getAllCategories = cache(
  async (): Promise<ApiResponse<BlogCategory[]>> => {
    try {
      console.log("[getAllCategories] Obteniendo categorías");

      // Obtener categorías activas
      const { data: categories, error } = await supabase
        .from("blog_categories")
        .select("id, name, slug, sort_order, is_active, created_at, updated_at")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("[getAllCategories] Error:", error);
        const baseError = handleSupabaseError(error, "getAllCategories");
        return {
          ...baseError,
          data: [],
        };
      }

      // Obtener conteo de posts por categoría en una sola consulta
      const { data: postCounts, error: countError } = await supabase
        .from("blog_posts")
        .select("category_id, count:category_id(*)");

      if (countError) {
        console.error("[getAllCategories] Error al contar posts:", countError);
      }

      // Mapear conteos a las categorías
      const processedData =
        categories?.map((category) => {
          const countEntry = postCounts?.find(
            (c) => c.category_id === category.id
          );
          // Asegurarse que countEntry?.count es un número
          const postCount =
            typeof countEntry?.count === "number" ? countEntry.count : 0;

          return {
            ...category,
            is_active: category.is_active ?? true,
            created_at: category.created_at ?? null,
            updated_at: category.updated_at ?? null,
            _count: {
              posts: postCount,
              published_posts: postCount,
            },
          };
        }) || [];

      return {
        success: true,
        data: processedData,
      };
    } catch (error) {
      console.error("[getAllCategories] Error inesperado:", error);
      const baseError = handleSupabaseError(error, "getAllCategories");
      return {
        ...baseError,
        data: [],
      };
    }
  }
);

export const createCategory = async (
  categoryData: Omit<BlogCategory, "id">
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
    };

    const { data, error } = await supabase
      .from("blog_categories")
      .insert([category])
      .select()
      .single();

    if (error) {
      return handleSupabaseError(
        error,
        "createCategory"
      ) as ApiResponse<BlogCategory>;
    }

    return {
      success: true,
      data,
      message: "Categoría creada exitosamente",
    };
  } catch (error) {
    return handleSupabaseError(
      error,
      "createCategory"
    ) as ApiResponse<BlogCategory>;
  }
};

// ================================================================
// TAGS
// ================================================================

export const getAllTags = async (): Promise<ApiResponse<BlogTag[]>> => {
  try {
    console.log("[getAllTags] Obteniendo tags");

    const { data, error } = await supabase
      .from("blog_tags")
      .select("*")
      .order("name");

    if (error) {
      console.error("[getAllTags] Error:", error);
      const baseError = handleSupabaseError(error, "getAllTags");
      return {
        ...baseError,
        data: [],
      };
    }

    // Procesar datos para incluir conteo de posts
    const processedData = [];
    for (const tag of data || []) {
      const { count } = await supabase
        .from("blog_post_tags")
        .select("*", { count: "exact", head: true })
        .eq("tag_id", tag.id);

      processedData.push({
        ...tag,
        _count: {
          posts: count || 0,
        },
      });
    }

    return {
      success: true,
      data: processedData,
    };
  } catch (error) {
    console.error("[getAllTags] Error inesperado:", error);
    const baseError = handleSupabaseError(error, "getAllTags");
    return {
      ...baseError,
      data: [],
    };
  }
};

export const createTag = async (
  tagData: Omit<BlogTag, "id">
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
    };

    const { data, error } = await supabase
      .from("blog_tags")
      .insert([tag])
      .select()
      .single();

    if (error) {
      return handleSupabaseError(error, "createTag") as ApiResponse<BlogTag>;
    }

    return {
      success: true,
      data,
      message: "Tag creado exitosamente",
    };
  } catch (error) {
    return handleSupabaseError(error, "createTag") as ApiResponse<BlogTag>;
  }
};

// ================================================================
// COMENTARIOS
// ================================================================

export const getPostComments = async (
  postId: string,
  commentStatus: "approved" | "pending" | "rejected" = "approved"
): Promise<ApiResponse<BlogComment[]>> => {
  try {
    if (!postId) {
      return {
        success: false,
        error: "El ID del post es requerido",
      };
    }

    let query = supabase
      .from("blog_comments")
      .select("*")
      .eq("post_id", postId)
      .order("id", { ascending: true });

    // Solo filtrar por status si la columna existe
    try {
      query = query.eq("status", commentStatus);
    } catch {
      console.log(
        "Columna status no existe en blog_comments, ignorando filtro"
      );
    }

    const { data, error } = await query;

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
    };

    const { data, error } = await supabase
      .from("blog_comments")
      .insert([comment])
      .select()
      .single();

    if (error) {
      return handleSupabaseError(
        error,
        "createComment"
      ) as ApiResponse<BlogComment>;
    }

    return {
      success: true,
      data,
      message: "Comentario enviado exitosamente.",
    };
  } catch (error) {
    return handleSupabaseError(
      error,
      "createComment"
    ) as ApiResponse<BlogComment>;
  }
};

export const updateCommentStatus = async (
  commentId: string,
  commentStatus: "approved" | "pending" | "rejected"
): Promise<ApiResponse> => {
  try {
    if (!commentId) {
      return {
        success: false,
        error: "El ID del comentario es requerido",
      };
    }

    // Intentar actualizar solo si la columna status existe
    try {
      const { error } = await supabase
        .from("blog_comments")
        .update({ status: commentStatus })
        .eq("id", commentId);

      if (error) {
        return handleSupabaseError(error, "updateCommentStatus");
      }
    } catch {
      console.log(
        "Columna status no existe en blog_comments, omitiendo actualización"
      );
      return {
        success: true,
        message:
          "Estado del comentario no se puede actualizar (columna no existe)",
      };
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
    // Incrementar vistas directamente
    const { data: currentPost } = await supabase
      .from("blog_posts")
      .select("views_count")
      .eq("id", postId)
      .single();

    if (currentPost) {
      await supabase
        .from("blog_posts")
        .update({ views_count: (currentPost.views_count || 0) + 1 })
        .eq("id", postId);
    }
  } catch (error) {
    console.error("Error incrementing views:", error);
  }
};

export const getBlogStats = async (): Promise<ApiResponse<BlogStats>> => {
  try {
    const [postsResult, categoriesResult, tagsResult, commentsResult] =
      await Promise.all([
        supabase
          .from("blog_posts")
          .select("id, views_count, likes_count, shares_count, featured", {
            count: "exact",
          }),
        supabase.from("blog_categories").select("id", { count: "exact" }),
        supabase.from("blog_tags").select("id, featured", { count: "exact" }),
        supabase.from("blog_comments").select("id", { count: "exact" }),
      ]);

    if (
      postsResult.error ||
      categoriesResult.error ||
      tagsResult.error ||
      commentsResult.error
    ) {
      throw new Error("Error al obtener estadísticas");
    }

    const posts = postsResult.data || [];
    const tags = tagsResult.data || [];

    const stats: BlogStats = {
      totalPosts: postsResult.count || 0,
      publishedPosts: postsResult.count || 0,
      draftPosts: 0,
      archivedPosts: 0,
      scheduledPosts: 0,
      featuredPosts: posts.filter((p) => p.featured).length,
      totalCategories: categoriesResult.count || 0,
      activeCategories: categoriesResult.count || 0,
      totalTags: tagsResult.count || 0,
      featuredTags: tags.filter((t) => t.featured).length,
      totalComments: commentsResult.count || 0,
      approvedComments: commentsResult.count || 0,
      pendingComments: 0,
      rejectedComments: 0,
      totalViews: posts.reduce((sum, p) => sum + (p.views_count || 0), 0),
      totalLikes: posts.reduce((sum, p) => sum + (p.likes_count || 0), 0),
      totalShares: posts.reduce((sum, p) => sum + (p.shares_count || 0), 0),
      averageCommentsPerPost:
        posts.length > 0 ? (commentsResult.count || 0) / posts.length : 0,
      averageReadingTime: 5, // Default
      postsThisMonth: 0, // Placeholder
      postsThisWeek: 0, // Placeholder
      postsToday: 0, // Placeholder
    };

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    return handleSupabaseError(error, "getBlogStats") as ApiResponse<BlogStats>;
  }
};

export const getPopularPosts = async (
  limit: number = 5
): Promise<ApiResponse<BlogPost[]>> => {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("views_count", { ascending: false })
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
      .select("*")
      .order("id", { ascending: false })
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
      .select("*")
      .or(
        `title.ilike.%${query}%, content.ilike.%${query}%, excerpt.ilike.%${query}%`
      );

    if (filters.category_id) {
      supabaseQuery = supabaseQuery.eq("category_id", filters.category_id);
    }

    const { data, error } = await supabaseQuery
      .order("id", { ascending: false })
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
