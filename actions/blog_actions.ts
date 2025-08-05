"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import blogApi from "@/lib/blog/blogApi";
import {
  BlogCategory,
  BlogComment,
  BlogFilters,
  BlogPost,
  BlogPostWithDetails,
  BlogStats,
  BlogTag,
  CreateBlogPostData,
  CreateCommentData,
  UpdateBlogPostData,
} from "@/types/home/blog";

// ================================================================
// TIPOS DE RESPUESTA
// ================================================================

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ================================================================
// BLOG POSTS ACTIONS
// ================================================================

export async function createBlogPostAction(
  postData: CreateBlogPostData
): Promise<ActionResponse<BlogPost>> {
  try {
    console.log("[createBlogPostAction] Iniciando:", postData.title);

    // Validaciones de servidor
    if (!postData.title?.trim()) {
      return {
        success: false,
        error: "El título del post es requerido",
      };
    }

    if (!postData.content?.trim()) {
      return {
        success: false,
        error: "El contenido del post es requerido",
      };
    }

    if (!postData.author_id) {
      return {
        success: false,
        error: "El autor del post es requerido",
      };
    }

    // Crear el post
    const result = await blogApi.createBlogPost(postData);

    if (!result.success) {
      console.error("[createBlogPostAction] Error:", result.error);
      return {
        success: false,
        error: result.error || "Error al crear el post",
      };
    }

    // Revalidar caché
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidateTag("blog-posts");

    if (postData.category_id) {
      revalidateTag(`blog-category-${postData.category_id}`);
    }

    console.log(
      "[createBlogPostAction] Post creado exitosamente:",
      result.data?.id
    );

    return {
      success: true,
      data: result.data,
      message: "Post creado exitosamente",
    };
  } catch (error) {
    console.error("[createBlogPostAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al crear el post",
    };
  }
}

export async function getAllBlogPostsAction(
  filters: BlogFilters = {}
): Promise<ActionResponse<BlogPostWithDetails[]>> {
  try {
    console.log(
      "[getAllBlogPostsAction] Obteniendo posts con filtros:",
      filters
    );

    const result = await blogApi.getAllBlogPosts(filters);

    if (!result.success) {
      console.error("[getAllBlogPostsAction] Error:", result.error);
      return {
        success: false,
        error: result.error || "Error al obtener los posts",
      };
    }
   
    return {
      success: true,
      data: result.data || [],
      message: `${result.data?.length || 0} posts obtenidos`,
    };
  } catch (error) {
    console.error("[getAllBlogPostsAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al obtener los posts",
    };
  }
}

export async function getBlogPostBySlugAction(
  slug: string
): Promise<ActionResponse<BlogPostWithDetails>> {
  try {
    console.log("[getBlogPostBySlugAction] Obteniendo post:", slug);

    if (!slug?.trim()) {
      return {
        success: false,
        error: "El slug del post es requerido",
      };
    }

    const result = await blogApi.getBlogPostBySlug(slug);

    if (!result.success) {
      console.error("[getBlogPostBySlugAction] Error:", result.error);
      return {
        success: false,
        error: result.error || "Error al obtener el post",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("[getBlogPostBySlugAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al obtener el post",
    };
  }
}

export async function getBlogPostByIdAction(
  id: string
): Promise<ActionResponse<BlogPostWithDetails>> {
  try {
    console.log("[getBlogPostByIdAction] Obteniendo post:", id);

    if (!id?.trim()) {
      return {
        success: false,
        error: "El ID del post es requerido",
      };
    }

    const result = await blogApi.getBlogPostById(id);

    if (!result.success) {
      console.error("[getBlogPostByIdAction] Error:", result.error);
      return {
        success: false,
        error: result.error || "Error al obtener el post",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("[getBlogPostByIdAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al obtener el post",
    };
  }
}

export async function updateBlogPostAction(
  id: string,
  updateData: UpdateBlogPostData
): Promise<ActionResponse<BlogPost>> {
  try {
    console.log("[updateBlogPostAction] Actualizando post:", id);

    if (!id?.trim()) {
      return {
        success: false,
        error: "El ID del post es requerido",
      };
    }

    // Validaciones básicas
    if (updateData.title !== undefined && !updateData.title?.trim()) {
      return {
        success: false,
        error: "El título no puede estar vacío",
      };
    }

    if (updateData.content !== undefined && !updateData.content?.trim()) {
      return {
        success: false,
        error: "El contenido no puede estar vacío",
      };
    }

    const result = await blogApi.updateBlogPost(id, updateData);

    if (!result.success) {
      console.error("[updateBlogPostAction] Error:", result.error);
      return {
        success: false,
        error: result.error || "Error al actualizar el post",
      };
    }

    // Revalidar caché
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${result.data?.slug}`);
    revalidateTag("blog-posts");
    revalidateTag(`blog-post-${id}`);

    if (result.data?.category_id) {
      revalidateTag(`blog-category-${result.data.category_id}`);
    }

    console.log("[updateBlogPostAction] Post actualizado exitosamente");

    return {
      success: true,
      data: result.data,
      message: "Post actualizado exitosamente",
    };
  } catch (error) {
    console.error("[updateBlogPostAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al actualizar el post",
    };
  }
}

export async function deleteBlogPostAction(
  id: string
): Promise<ActionResponse> {
  try {
    console.log("[deleteBlogPostAction] Eliminando post:", id);

    if (!id?.trim()) {
      return {
        success: false,
        error: "El ID del post es requerido",
      };
    }

    // Obtener el post antes de eliminar para revalidar rutas específicas
    const postResult = await blogApi.getBlogPostById(id);
    const post = postResult.data;

    const result = await blogApi.deleteBlogPost(id);

    if (!result.success) {
      console.error("[deleteBlogPostAction] Error:", result.error);
      return {
        success: false,
        error: result.error || "Error al eliminar el post",
      };
    }

    // Revalidar caché
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidateTag("blog-posts");
    revalidateTag(`blog-post-${id}`);

    if (post?.slug) {
      revalidatePath(`/blog/${post.slug}`);
    }

    if (post?.category_id) {
      revalidateTag(`blog-category-${post.category_id}`);
    }

    console.log("[deleteBlogPostAction] Post eliminado exitosamente");

    return {
      success: true,
      message: "Post eliminado exitosamente",
    };
  } catch (error) {
    console.error("[deleteBlogPostAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al eliminar el post",
    };
  }
}

export async function publishBlogPostAction(
  id: string
): Promise<ActionResponse<BlogPost>> {
  try {
    console.log("[publishBlogPostAction] Publicando post:", id);

    const updateData: UpdateBlogPostData = {
      status: "published",
      published_date: new Date().toISOString(),
    };

    const result = await updateBlogPostAction(id, updateData);

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: result.data,
      message: "Post publicado exitosamente",
    };
  } catch (error) {
    console.error("[publishBlogPostAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al publicar el post",
    };
  }
}

export async function unpublishBlogPostAction(
  id: string
): Promise<ActionResponse<BlogPost>> {
  try {
    console.log("[unpublishBlogPostAction] Despublicando post:", id);

    const updateData: UpdateBlogPostData = {
      status: "draft",
      published_date: null,
    };

    const result = await updateBlogPostAction(id, updateData);

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: result.data,
      message: "Post despublicado exitosamente",
    };
  } catch (error) {
    console.error("[unpublishBlogPostAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al despublicar el post",
    };
  }
}

// ================================================================
// CATEGORÍAS ACTIONS
// ================================================================

export async function getAllCategoriesAction(): Promise<
  ActionResponse<BlogCategory[]>
> {
  try {
    console.log("[getAllCategoriesAction] Obteniendo categorías");

    const result = await blogApi.getAllCategories();

    if (!result.success) {
      console.error("[getAllCategoriesAction] Error:", result.error);
      return {
        success: false,
        error: result.error || "Error al obtener las categorías",
      };
    }

    return {
      success: true,
      data: result.data || [],
    };
  } catch (error) {
    console.error("[getAllCategoriesAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al obtener las categorías",
    };
  }
}

export async function createCategoryAction(
  categoryData: Omit<BlogCategory, "id">
): Promise<ActionResponse<BlogCategory>> {
  try {
    console.log("[createCategoryAction] Creando categoría:", categoryData.name);

    if (!categoryData.name?.trim()) {
      return {
        success: false,
        error: "El nombre de la categoría es requerido",
      };
    }

    const result = await blogApi.createCategory(categoryData);

    if (!result.success) {
      console.error("[createCategoryAction] Error:", result.error);
      return {
        success: false,
        error: result.error || "Error al crear la categoría",
      };
    }

    // Revalidar caché
    revalidatePath("/admin/blog/categories");
    revalidateTag("blog-categories");

    console.log(
      "[createCategoryAction] Categoría creada exitosamente:",
      result.data?.id
    );

    return {
      success: true,
      data: result.data,
      message: "Categoría creada exitosamente",
    };
  } catch (error) {
    console.error("[createCategoryAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al crear la categoría",
    };
  }
}

// ================================================================
// TAGS ACTIONS
// ================================================================

export async function getAllTagsAction(): Promise<ActionResponse<BlogTag[]>> {
  try {
    console.log("[getAllTagsAction] Obteniendo tags");

    const result = await blogApi.getAllTags();

    if (!result.success) {
      console.error("[getAllTagsAction] Error:", result.error);
      return {
        success: false,
        error: result.error || "Error al obtener los tags",
      };
    }

    return {
      success: true,
      data: result.data || [],
    };
  } catch (error) {
    console.error("[getAllTagsAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al obtener los tags",
    };
  }
}

export async function createTagAction(
  tagData: Omit<BlogTag, "id">
): Promise<ActionResponse<BlogTag>> {
  try {
    console.log("[createTagAction] Creando tag:", tagData.name);

    if (!tagData.name?.trim()) {
      return {
        success: false,
        error: "El nombre del tag es requerido",
      };
    }

    const result = await blogApi.createTag(tagData);

    if (!result.success) {
      console.error("[createTagAction] Error:", result.error);
      return {
        success: false,
        error: result.error || "Error al crear el tag",
      };
    }

    // Revalidar caché
    revalidatePath("/admin/blog/tags");
    revalidateTag("blog-tags");

    console.log("[createTagAction] Tag creado exitosamente:", result.data?.id);

    return {
      success: true,
      data: result.data,
      message: "Tag creado exitosamente",
    };
  } catch (error) {
    console.error("[createTagAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al crear el tag",
    };
  }
}

// ================================================================
// COMENTARIOS ACTIONS
// ================================================================

export async function getPostCommentsAction(
  postId: string,
  status: "approved" | "pending" | "rejected" = "approved"
): Promise<ActionResponse<BlogComment[]>> {
  try {
    console.log("[getPostCommentsAction] Obteniendo comentarios:", postId);

    if (!postId?.trim()) {
      return {
        success: false,
        error: "El ID del post es requerido",
      };
    }

    const result = await blogApi.getPostComments(postId, status);

    if (!result.success) {
      console.error("[getPostCommentsAction] Error:", result.error);
      return {
        success: false,
        error: result.error || "Error al obtener los comentarios",
      };
    }

    return {
      success: true,
      data: result.data || [],
    };
  } catch (error) {
    console.error("[getPostCommentsAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al obtener los comentarios",
    };
  }
}

export async function createCommentAction(
  commentData: CreateCommentData
): Promise<ActionResponse<BlogComment>> {
  try {
    console.log(
      "[createCommentAction] Creando comentario para post:",
      commentData.post_id
    );

    // Validaciones de servidor
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

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(commentData.author_email)) {
      return {
        success: false,
        error: "El formato del email no es válido",
      };
    }

    const result = await blogApi.createComment(commentData);

    if (!result.success) {
      console.error("[createCommentAction] Error:", result.error);
      return {
        success: false,
        error: result.error || "Error al crear el comentario",
      };
    }

    // Revalidar caché
    revalidatePath(`/blog/*`);
    revalidateTag(`blog-comments-${commentData.post_id}`);
    revalidateTag("blog-comments");

    console.log(
      "[createCommentAction] Comentario creado exitosamente:",
      result.data?.id
    );

    return {
      success: true,
      data: result.data,
      message: result.message || "Comentario enviado exitosamente",
    };
  } catch (error) {
    console.error("[createCommentAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al crear el comentario",
    };
  }
}

export async function approveCommentAction(
  commentId: string
): Promise<ActionResponse> {
  try {
    console.log("[approveCommentAction] Aprobando comentario:", commentId);

    if (!commentId?.trim()) {
      return {
        success: false,
        error: "El ID del comentario es requerido",
      };
    }

    const result = await blogApi.updateCommentStatus(commentId, "approved");

    if (!result.success) {
      console.error("[approveCommentAction] Error:", result.error);
      return {
        success: false,
        error: result.error || "Error al aprobar el comentario",
      };
    }

    // Revalidar caché
    revalidatePath("/admin/blog/comments");
    revalidatePath("/blog/*");
    revalidateTag("blog-comments");
    revalidateTag(`blog-comment-${commentId}`);

    console.log("[approveCommentAction] Comentario aprobado exitosamente");

    return {
      success: true,
      message: "Comentario aprobado exitosamente",
    };
  } catch (error) {
    console.error("[approveCommentAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al aprobar el comentario",
    };
  }
}

export async function rejectCommentAction(
  commentId: string
): Promise<ActionResponse> {
  try {
    console.log("[rejectCommentAction] Rechazando comentario:", commentId);

    if (!commentId?.trim()) {
      return {
        success: false,
        error: "El ID del comentario es requerido",
      };
    }

    const result = await blogApi.updateCommentStatus(commentId, "rejected");

    if (!result.success) {
      console.error("[rejectCommentAction] Error:", result.error);
      return {
        success: false,
        error: result.error || "Error al rechazar el comentario",
      };
    }

    // Revalidar caché
    revalidatePath("/admin/blog/comments");
    revalidatePath("/blog/*");
    revalidateTag("blog-comments");
    revalidateTag(`blog-comment-${commentId}`);

    console.log("[rejectCommentAction] Comentario rechazado exitosamente");

    return {
      success: true,
      message: "Comentario rechazado exitosamente",
    };
  } catch (error) {
    console.error("[rejectCommentAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al rechazar el comentario",
    };
  }
}

// ================================================================
// BÚSQUEDA Y FILTROS ACTIONS
// ================================================================

export async function searchBlogPostsAction(
  query: string,
  filters: Partial<BlogFilters> = {}
): Promise<ActionResponse<BlogPost[]>> {
  try {
    console.log("[searchBlogPostsAction] Buscando:", query);

    if (!query?.trim()) {
      return {
        success: false,
        error: "El término de búsqueda es requerido",
      };
    }

    const result = await blogApi.searchPosts(query, filters);

    if (!result.success) {
      console.error("[searchBlogPostsAction] Error:", result.error);
      return {
        success: false,
        error: result.error || "Error en la búsqueda",
      };
    }

    return {
      success: true,
      data: result.data || [],
      message: `${result.data?.length || 0} posts encontrados`,
    };
  } catch (error) {
    console.error("[searchBlogPostsAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado en la búsqueda",
    };
  }
}

export async function getPopularPostsAction(
  limit: number = 5
): Promise<ActionResponse<BlogPost[]>> {
  try {
    console.log("[getPopularPostsAction] Obteniendo posts populares");

    const result = await blogApi.getPopularPosts(limit);

    if (!result.success) {
      console.error("[getPopularPostsAction] Error:", result.error);
      return {
        success: false,
        error: result.error || "Error al obtener posts populares",
      };
    }

    return {
      success: true,
      data: result.data || [],
    };
  } catch (error) {
    console.error("[getPopularPostsAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al obtener posts populares",
    };
  }
}

export async function getRecentPostsAction(
  limit: number = 5
): Promise<ActionResponse<BlogPost[]>> {
  try {
    console.log("[getRecentPostsAction] Obteniendo posts recientes");

    const result = await blogApi.getRecentPosts(limit);

    if (!result.success) {
      console.error("[getRecentPostsAction] Error:", result.error);
      return {
        success: false,
        error: result.error || "Error al obtener posts recientes",
      };
    }

    return {
      success: true,
      data: result.data || [],
    };
  } catch (error) {
    console.error("[getRecentPostsAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al obtener posts recientes",
    };
  }
}

// ================================================================
// ESTADÍSTICAS ACTIONS
// ================================================================

export async function getBlogStatsAction(): Promise<ActionResponse<BlogStats>> {
  try {
    console.log("[getBlogStatsAction] Obteniendo estadísticas del blog");

    const result = await blogApi.getBlogStats();

    if (!result.success) {
      console.error("[getBlogStatsAction] Error:", result.error);
      return {
        success: false,
        error: result.error || "Error al obtener estadísticas",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("[getBlogStatsAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al obtener estadísticas",
    };
  }
}

// ================================================================
// UTILIDADES ACTIONS
// ================================================================

export async function generateSlugAction(
  title: string
): Promise<ActionResponse<string>> {
  try {
    if (!title?.trim()) {
      return {
        success: false,
        error: "El título es requerido",
      };
    }

    const slug = blogApi.generateSlug(title);

    return {
      success: true,
      data: slug,
    };
  } catch (error) {
    console.error("[generateSlugAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al generar el slug",
    };
  }
}

export async function validateSlugAction(
  slug: string
): Promise<ActionResponse<boolean>> {
  try {
    if (!slug?.trim()) {
      return {
        success: false,
        error: "El slug es requerido",
      };
    }

    const isValid = blogApi.validateSlug(slug);

    return {
      success: true,
      data: isValid,
    };
  } catch (error) {
    console.error("[validateSlugAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al validar el slug",
    };
  }
}

export async function generateExcerptAction(
  content: string,
  maxLength: number = 150
): Promise<ActionResponse<string>> {
  try {
    if (!content?.trim()) {
      return {
        success: false,
        error: "El contenido es requerido",
      };
    }

    const excerpt = blogApi.generateExcerpt(content, maxLength);

    return {
      success: true,
      data: excerpt,
    };
  } catch (error) {
    console.error("[generateExcerptAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al generar el extracto",
    };
  }
}

// ================================================================
// ACTIONS ESPECÍFICAS PARA DASHBOARD ADMIN
// ================================================================

export async function getDraftPostsAction(): Promise<
  ActionResponse<BlogPostWithDetails[]>
> {
  try {
    const filters: BlogFilters = {
      status: "draft",
      include_drafts: true,
      sort_by: "updated_at",
      sort_order: "desc",
    };

    return await getAllBlogPostsAction(filters);
  } catch (error) {
    console.error("[getDraftPostsAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al obtener borradores",
    };
  }
}

export async function getPublishedPostsAction(): Promise<
  ActionResponse<BlogPostWithDetails[]>
> {
  try {
    const filters: BlogFilters = {
      status: "published",
      sort_by: "published_date",
      sort_order: "desc",
    };

    return await getAllBlogPostsAction(filters);
  } catch (error) {
    console.error("[getPublishedPostsAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al obtener posts publicados",
    };
  }
}

export async function getPendingCommentsAction(): Promise<
  ActionResponse<BlogComment[]>
> {
  try {
    console.log("[getPendingCommentsAction] Obteniendo comentarios pendientes");

    // Esta función necesitaría una implementación en blogApi para obtener todos los comentarios pendientes
    // Por ahora retornamos un array vacío como placeholder
    return {
      success: true,
      data: [],
      message: "Función en desarrollo",
    };
  } catch (error) {
    console.error("[getPendingCommentsAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al obtener comentarios pendientes",
    };
  }
}

// ================================================================
// CACHE MANAGEMENT
// ================================================================

export async function revalidateBlogCacheAction(): Promise<ActionResponse> {
  try {
    console.log("[revalidateBlogCacheAction] Revalidando caché del blog");

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    revalidateTag("blog-posts");
    revalidateTag("blog-categories");
    revalidateTag("blog-tags");
    revalidateTag("blog-comments");

    return {
      success: true,
      message: "Caché del blog revalidado exitosamente",
    };
  } catch (error) {
    console.error("[revalidateBlogCacheAction] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al revalidar el caché",
    };
  }
}
