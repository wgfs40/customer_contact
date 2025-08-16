"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  BlogPost,
  BlogPostWithDetails,
  CreateBlogPostData,
  UpdateBlogPostData,
  BlogCategory,
  BlogTag,
  BlogComment,
  CreateCommentData,
  BlogFilters,
  BlogStats,
  BlogMetrics,
} from "@/types/home/blog";
import {
  createBlogPostAction,
  getAllBlogPostsAction,
  getBlogPostBySlugAction,
  getBlogPostByIdAction,
  updateBlogPostAction,
  deleteBlogPostAction,
  publishBlogPostAction,
  unpublishBlogPostAction,
  getAllCategoriesAction,
  createCategoryAction,
  getAllTagsAction,
  createTagAction,
  getPostCommentsAction,
  createCommentAction,
  approveCommentAction,
  rejectCommentAction,
  searchBlogPostsAction,
  getPopularPostsAction,
  getRecentPostsAction,
  getBlogStatsAction,
  generateSlugAction,
  validateSlugAction,
} from "@/actions/blog_actions";

// ================================================================
// TIPOS DEL HOOK
// ================================================================

interface UseBlogState {
  // Posts
  posts: BlogPostWithDetails[];
  currentPost: BlogPostWithDetails | null;
  searchResults: BlogPost[];
  popularPosts: BlogPost[];
  recentPosts: BlogPost[];

  // Categorías y Tags
  categories: BlogCategory[];
  tags: BlogTag[];

  // Comentarios
  comments: BlogComment[];
  pendingComments: BlogComment[];

  // Estados de carga
  loading: boolean;
  searchLoading: boolean;
  commentsLoading: boolean;
  statsLoading: boolean;

  // Errores
  error: string | null;
  lastError: BlogError | null;

  // Paginación
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };

  // Filtros
  filters: BlogFilters;

  // Estadísticas
  stats: BlogStats | null;
  metrics: BlogMetrics | null;
}

interface BlogError {
  message: string;
  type: string;
  retryable: boolean;
  timestamp: Date;
}

interface UseBlogFilters extends BlogFilters {
  autoLoad?: boolean;
}

interface UseBlogReturn extends UseBlogState {
  // Valores computados
  hasActiveFilters: boolean;
  postsByStatus: Record<string, BlogPostWithDetails[]>;
  postsByCategory: Record<string, BlogPostWithDetails[]>;
  commentsByStatus: Record<string, BlogComment[]>;

  // Operaciones CRUD de Posts
  createPost: (
    data: CreateBlogPostData,
    redirectToEdit?: boolean
  ) => Promise<boolean>;
  refreshPosts: () => Promise<void>;
  loadPost: (identifier: string, bySlug?: boolean) => Promise<void>;
  searchPosts: (term: string, filters?: Partial<BlogFilters>) => Promise<void>;
  clearSearch: () => void;

  // Gestión de Posts
  publishPost: (postId: string) => Promise<boolean>;
  unpublishPost: (postId: string) => Promise<boolean>;
  updatePostStatus: (
    postId: string,
    status: BlogPost["status"]
  ) => Promise<boolean>;
  toggleFeatured: (postId: string) => Promise<boolean>;
  incrementViews: (postId: string) => Promise<void>;

  // Categorías
  loadCategories: () => Promise<void>;
  createCategory: (
    categoryData: Omit<BlogCategory, "id">
  ) => Promise<boolean>;

  // Tags
  loadTags: () => Promise<void>;
  createTag: (
    tagData: Omit<BlogTag, "id">
  ) => Promise<boolean>;

  // Comentarios
  loadComments: (
    postId: string,
    status?: "approved" | "pending" | "rejected"
  ) => Promise<void>;
  createComment: (commentData: CreateCommentData) => Promise<boolean>;
  approveComment: (commentId: string) => Promise<boolean>;
  rejectComment: (commentId: string) => Promise<boolean>;
  moderateComment: (
    commentId: string,
    action: "approve" | "reject"
  ) => Promise<boolean>;

  // Estadísticas
  loadStats: () => Promise<void>;
  loadPopularPosts: (limit?: number) => Promise<void>;
  loadRecentPosts: (limit?: number) => Promise<void>;

  // Utilidades
  generateSlug: (title: string) => Promise<string>;
  validateSlug: (slug: string) => Promise<boolean>;
  generateExcerpt: (content: string, maxLength?: number) => string;

  // Filtros y navegación
  updateFilters: (newFilters: Partial<BlogFilters>) => void;
  setPage: (page: number) => Promise<void>;
  resetFilters: () => void;
  clearError: () => void;
  setCurrentPost: (post: BlogPostWithDetails | null) => void;

  // Retry functionality
  retryLastOperation: () => Promise<void>;
  isRetryable: boolean;
  getDetailedError: () => BlogError | null;
}

type LastOperationType =
  | { type: "refreshPosts"; params: [] }
  | { type: "createPost"; params: [CreateBlogPostData, boolean?] }
  | { type: "loadPost"; params: [string, boolean?] }
  | { type: "searchPosts"; params: [string, Partial<BlogFilters>?] }
  | { type: "publishPost"; params: [string] }
  | { type: "unpublishPost"; params: [string] }
  | { type: "updatePost"; params: [string, UpdateBlogPostData] }
  | { type: "deletePost"; params: [string] }
  | { type: "loadCategories"; params: [] }
  | {
      type: "createCategory";
      params: [Omit<BlogCategory, "id" | "created_at" | "updated_at">];
    }
  | { type: "loadTags"; params: [] }
  | {
      type: "createTag";
      params: [Omit<BlogTag, "id" | "created_at" | "updated_at">];
    }
  | {
      type: "loadComments";
      params: [string, ("approved" | "pending" | "rejected")?];
    }
  | { type: "createComment"; params: [CreateCommentData] }
  | { type: "approveComment"; params: [string] }
  | { type: "rejectComment"; params: [string] }
  | { type: "loadStats"; params: [] };

// ================================================================
// ESTADO INICIAL
// ================================================================

const initialState: UseBlogState = {
  posts: [],
  currentPost: null,
  searchResults: [],
  popularPosts: [],
  recentPosts: [],
  categories: [],
  tags: [],
  comments: [],
  pendingComments: [],
  loading: false,
  searchLoading: false,
  commentsLoading: false,
  statsLoading: false,
  error: null,
  lastError: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  filters: {
    page: 1,
    limit: 10,
    sort_by: "created_at",
    sort_order: "desc",
  },
  stats: null,
  metrics: null,
};

// ================================================================
// HOOK PRINCIPAL
// ================================================================

export const useBlog = (
  initialFilters: UseBlogFilters = { autoLoad: true }
): UseBlogReturn => {
  const [state, setState] = useState<UseBlogState>({
    ...initialState,
    filters: { ...initialState.filters, ...initialFilters },
  });

  const [lastOperation, setLastOperation] = useState<LastOperationType | null>(
    null
  );

  // ================================================================
  // FUNCIONES AUXILIARES
  // ================================================================

  const handleError = useCallback(
    (error: unknown, operation: string, fallbackMessage: string) => {
      let errorMessage: string;
      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string"
      ) {
        errorMessage = (error as { message: string }).message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else {
        errorMessage = fallbackMessage;
      }
      const blogError: BlogError = {
        message: errorMessage,
        type: operation,
        retryable:
          !errorMessage.includes("404") &&
          !errorMessage.includes("no encontrado"),
        timestamp: new Date(),
      };

      console.error(`[useBlog.${operation}]`, error);

      setState((prev) => ({
        ...prev,
        loading: false,
        searchLoading: false,
        commentsLoading: false,
        statsLoading: false,
        error: errorMessage,
        lastError: blogError,
      }));
    },
    []
  );

  const handleSuccess = useCallback((message?: string) => {
    if (message) {
      console.log(`[useBlog] ${message}`);
    }
    setState((prev) => ({
      ...prev,
      loading: false,
      searchLoading: false,
      commentsLoading: false,
      statsLoading: false,
      error: null,
      lastError: null,
    }));
  }, []);

  // ================================================================
  // OPERACIONES CRUD DE POSTS
  // ================================================================

  const refreshPosts = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        lastError: null,
      }));
      setLastOperation({ type: "refreshPosts", params: [] });

      const result = await getAllBlogPostsAction(state.filters);

      console.log(
        "[useBlog.refreshPosts] wilson fernandez Result:",
        result.data && result.data[0] ? result.data[0].publish_date : []
      );
      //publish_date
      if (result.success) {
        setState((prev) => ({
          ...prev,
          posts: result.data || [],
          loading: false,
        }));
      } else {
        handleError(
          new Error(result.error),
          "refreshPosts",
          "Error al obtener los posts"
        );
      }
    } catch (error) {
      handleError(
        error,
        "refreshPosts",
        "Error inesperado al obtener los posts"
      );
    }
  }, [state.filters, handleError]);

  const createPost = useCallback(
    async (
      data: CreateBlogPostData,
      redirectToEdit: boolean = false
    ): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "createPost",
          params: [data, redirectToEdit],
        });

        const result = await createBlogPostAction(data);

        if (result.success) {
          await refreshPosts();
          handleSuccess("Post creado exitosamente");
          return true;
        } else {
          handleError(
            new Error(result.error),
            "createPost",
            "Error al crear el post"
          );
          return false;
        }
      } catch (error) {
        handleError(error, "createPost", "Error inesperado al crear el post");
        return false;
      }
    },
    [handleError, handleSuccess, refreshPosts]
  );

  const loadPost = useCallback(
    async (identifier: string, bySlug: boolean = false): Promise<void> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "loadPost",
          params: [identifier, bySlug],
        });

        const result = bySlug
          ? await getBlogPostBySlugAction(identifier)
          : await getBlogPostByIdAction(identifier);

        if (result.success) {
          setState((prev) => ({
            ...prev,
            currentPost: result.data || null,
            loading: false,
          }));
        } else {
          handleError(
            new Error(result.error),
            "loadPost",
            "Error al obtener el post"
          );
        }
      } catch (error) {
        handleError(error, "loadPost", "Error inesperado al obtener el post");
      }
    },
    [handleError]
  );

  const searchPosts = useCallback(
    async (term: string, filters: Partial<BlogFilters> = {}): Promise<void> => {
      try {
        setState((prev) => ({
          ...prev,
          searchLoading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "searchPosts",
          params: [term, filters],
        });

        const result = await searchBlogPostsAction(term, filters);

        if (result.success) {
          setState((prev) => ({
            ...prev,
            searchResults: result.data || [],
            searchLoading: false,
          }));
        } else {
          handleError(
            new Error(result.error),
            "searchPosts",
            "Error en la búsqueda"
          );
        }
      } catch (error) {
        handleError(error, "searchPosts", "Error inesperado en la búsqueda");
      }
    },
    [handleError]
  );

  const clearSearch = useCallback(() => {
    setState((prev) => ({
      ...prev,
      searchResults: [],
      searchLoading: false,
    }));
  }, []);

  // ================================================================
  // GESTIÓN DE POSTS
  // ================================================================

  const publishPost = useCallback(
    async (postId: string): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "publishPost",
          params: [postId],
        });

        const result = await publishBlogPostAction(postId);

        if (result.success) {
          await refreshPosts();
          handleSuccess("Post publicado exitosamente");
          return true;
        } else {
          handleError(
            new Error(result.error),
            "publishPost",
            "Error al publicar el post"
          );
          return false;
        }
      } catch (error) {
        handleError(
          error,
          "publishPost",
          "Error inesperado al publicar el post"
        );
        return false;
      }
    },
    [handleError, handleSuccess, refreshPosts]
  );

  const unpublishPost = useCallback(
    async (postId: string): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "unpublishPost",
          params: [postId],
        });

        const result = await unpublishBlogPostAction(postId);

        if (result.success) {
          await refreshPosts();
          handleSuccess("Post despublicado exitosamente");
          return true;
        } else {
          handleError(
            new Error(result.error),
            "unpublishPost",
            "Error al despublicar el post"
          );
          return false;
        }
      } catch (error) {
        handleError(
          error,
          "unpublishPost",
          "Error inesperado al despublicar el post"
        );
        return false;
      }
    },
    [handleError, handleSuccess, refreshPosts]
  );

  const updatePostStatus = useCallback(
    async (postId: string, status: BlogPost["status"]): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));

        const updateData: UpdateBlogPostData = { status };
        setLastOperation({
          type: "updatePost",
          params: [postId, updateData],
        });

        const result = await updateBlogPostAction(postId, updateData);

        if (result.success) {
          await refreshPosts();
          handleSuccess(`Estado actualizado a ${status}`);
          return true;
        } else {
          handleError(
            new Error(result.error),
            "updatePostStatus",
            "Error al actualizar el estado"
          );
          return false;
        }
      } catch (error) {
        handleError(
          error,
          "updatePostStatus",
          "Error inesperado al actualizar el estado"
        );
        return false;
      }
    },
    [handleError, handleSuccess, refreshPosts]
  );

  const toggleFeatured = useCallback(
    async (postId: string): Promise<boolean> => {
      try {
        const currentPost = state.posts.find((p) => p.id === postId);
        if (!currentPost) {
          handleError(
            new Error("Post no encontrado"),
            "toggleFeatured",
            "Post no encontrado"
          );
          return false;
        }

        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));

        const updateData: UpdateBlogPostData = {
          is_featured: !currentPost.is_featured,
        };
        setLastOperation({
          type: "updatePost",
          params: [postId, updateData],
        });

        const result = await updateBlogPostAction(postId, updateData);

        if (result.success) {
          await refreshPosts();
          handleSuccess(
            `Post ${
              updateData.is_featured
                ? "marcado como destacado"
                : "removido de destacados"
            }`
          );
          return true;
        } else {
          handleError(
            new Error(result.error),
            "toggleFeatured",
            "Error al actualizar el post"
          );
          return false;
        }
      } catch (error) {
        handleError(
          error,
          "toggleFeatured",
          "Error inesperado al actualizar el post"
        );
        return false;
      }
    },
    [state.posts, handleError, handleSuccess, refreshPosts]
  );

  const incrementViews = useCallback(async (postId: string): Promise<void> => {
    try {
      // Esta función podría llamar a una API específica para incrementar vistas
      // Por ahora es un placeholder
      console.log(`[useBlog] Incrementing views for post: ${postId}`);
    } catch (error) {
      console.error("[useBlog.incrementViews]", error);
    }
  }, []);

  // ================================================================
  // CATEGORÍAS
  // ================================================================

  const loadCategories = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        lastError: null,
      }));
      setLastOperation({ type: "loadCategories", params: [] });

      const result = await getAllCategoriesAction();

      if (result.success) {
        setState((prev) => ({
          ...prev,
          categories: result.data || [],
          loading: false,
        }));
      } else {
        handleError(
          new Error(result.error),
          "loadCategories",
          "Error al obtener las categorías"
        );
      }
    } catch (error) {
      handleError(
        error,
        "loadCategories",
        "Error inesperado al obtener las categorías"
      );
    }
  }, [handleError]);

  const createCategory = useCallback(
    async (
      categoryData: Omit<BlogCategory, "id">
    ): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "createCategory",
          params: [categoryData],
        });

        const result = await createCategoryAction(categoryData);

        if (result.success) {
          await loadCategories();
          handleSuccess("Categoría creada exitosamente");
          return true;
        } else {
          handleError(
            new Error(result.error),
            "createCategory",
            "Error al crear la categoría"
          );
          return false;
        }
      } catch (error) {
        handleError(
          error,
          "createCategory",
          "Error inesperado al crear la categoría"
        );
        return false;
      }
    },
    [handleError, handleSuccess, loadCategories]
  );

  // ================================================================
  // TAGS
  // ================================================================

  const loadTags = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        lastError: null,
      }));
      setLastOperation({ type: "loadTags", params: [] });

      const result = await getAllTagsAction();

      if (result.success) {
        setState((prev) => ({
          ...prev,
          tags: result.data || [],
          loading: false,
        }));
      } else {
        handleError(
          new Error(result.error),
          "loadTags",
          "Error al obtener los tags"
        );
      }
    } catch (error) {
      handleError(error, "loadTags", "Error inesperado al obtener los tags");
    }
  }, [handleError]);

  const createTag = useCallback(
    async (
      tagData: Omit<BlogTag, "id">
    ): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "createTag",
          params: [tagData],
        });

        const result = await createTagAction(tagData);

        if (result.success) {
          await loadTags();
          handleSuccess("Tag creado exitosamente");
          return true;
        } else {
          handleError(
            new Error(result.error),
            "createTag",
            "Error al crear el tag"
          );
          return false;
        }
      } catch (error) {
        handleError(error, "createTag", "Error inesperado al crear el tag");
        return false;
      }
    },
    [handleError, handleSuccess, loadTags]
  );

  // ================================================================
  // COMENTARIOS
  // ================================================================

  const loadComments = useCallback(
    async (
      postId: string,
      status: "approved" | "pending" | "rejected" = "approved"
    ): Promise<void> => {
      try {
        setState((prev) => ({
          ...prev,
          commentsLoading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "loadComments",
          params: [postId, status],
        });

        const result = await getPostCommentsAction(postId, status);

        if (result.success) {
          setState((prev) => ({
            ...prev,
            comments: result.data || [],
            commentsLoading: false,
          }));
        } else {
          handleError(
            new Error(result.error),
            "loadComments",
            "Error al obtener los comentarios"
          );
        }
      } catch (error) {
        handleError(
          error,
          "loadComments",
          "Error inesperado al obtener los comentarios"
        );
      }
    },
    [handleError]
  );

  const createComment = useCallback(
    async (commentData: CreateCommentData): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          commentsLoading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "createComment",
          params: [commentData],
        });

        const result = await createCommentAction(commentData);

        if (result.success) {
          await loadComments(commentData.post_id, "approved");
          handleSuccess("Comentario enviado exitosamente");
          return true;
        } else {
          handleError(
            new Error(result.error),
            "createComment",
            "Error al enviar el comentario"
          );
          return false;
        }
      } catch (error) {
        handleError(
          error,
          "createComment",
          "Error inesperado al enviar el comentario"
        );
        return false;
      }
    },
    [handleError, handleSuccess, loadComments]
  );

  const approveComment = useCallback(
    async (commentId: string): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          commentsLoading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "approveComment",
          params: [commentId],
        });

        const result = await approveCommentAction(commentId);

        if (result.success) {
          // Recargar comentarios pendientes si estamos viendo esos
          const currentComment = state.comments.find((c) => c.id === commentId);
          if (currentComment) {
            await loadComments(currentComment.post_id, "pending");
          }
          handleSuccess("Comentario aprobado exitosamente");
          return true;
        } else {
          handleError(
            new Error(result.error),
            "approveComment",
            "Error al aprobar el comentario"
          );
          return false;
        }
      } catch (error) {
        handleError(
          error,
          "approveComment",
          "Error inesperado al aprobar el comentario"
        );
        return false;
      }
    },
    [handleError, handleSuccess, loadComments, state.comments]
  );

  const rejectComment = useCallback(
    async (commentId: string): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          commentsLoading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "rejectComment",
          params: [commentId],
        });

        const result = await rejectCommentAction(commentId);

        if (result.success) {
          // Recargar comentarios pendientes si estamos viendo esos
          const currentComment = state.comments.find((c) => c.id === commentId);
          if (currentComment) {
            await loadComments(currentComment.post_id, "pending");
          }
          handleSuccess("Comentario rechazado exitosamente");
          return true;
        } else {
          handleError(
            new Error(result.error),
            "rejectComment",
            "Error al rechazar el comentario"
          );
          return false;
        }
      } catch (error) {
        handleError(
          error,
          "rejectComment",
          "Error inesperado al rechazar el comentario"
        );
        return false;
      }
    },
    [handleError, handleSuccess, loadComments, state.comments]
  );

  const moderateComment = useCallback(
    async (
      commentId: string,
      action: "approve" | "reject"
    ): Promise<boolean> => {
      return action === "approve"
        ? await approveComment(commentId)
        : await rejectComment(commentId);
    },
    [approveComment, rejectComment]
  );

  // ================================================================
  // ESTADÍSTICAS
  // ================================================================

  const loadStats = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({
        ...prev,
        statsLoading: true,
        error: null,
        lastError: null,
      }));
      setLastOperation({ type: "loadStats", params: [] });

      const result = await getBlogStatsAction();

      if (result.success) {
        setState((prev) => ({
          ...prev,
          stats: result.data || null,
          statsLoading: false,
        }));
      } else {
        handleError(
          new Error(result.error),
          "loadStats",
          "Error al obtener las estadísticas"
        );
      }
    } catch (error) {
      handleError(
        error,
        "loadStats",
        "Error inesperado al obtener las estadísticas"
      );
    }
  }, [handleError]);

  const loadPopularPosts = useCallback(
    async (limit: number = 5): Promise<void> => {
      try {
        const result = await getPopularPostsAction(limit);

        if (result.success) {
          setState((prev) => ({
            ...prev,
            popularPosts: result.data || [],
          }));
        }
      } catch (error) {
        console.error("[useBlog.loadPopularPosts]", error);
      }
    },
    []
  );

  const loadRecentPosts = useCallback(
    async (limit: number = 5): Promise<void> => {
      try {
        const result = await getRecentPostsAction(limit);

        if (result.success) {
          setState((prev) => ({
            ...prev,
            recentPosts: result.data || [],
          }));
        }
      } catch (error) {
        console.error("[useBlog.loadRecentPosts]", error);
      }
    },
    []
  );

  // ================================================================
  // UTILIDADES
  // ================================================================

  const generateSlug = useCallback(async (title: string): Promise<string> => {
    try {
      const result = await generateSlugAction(title);
      return result.success ? result.data || "" : "";
    } catch (error) {
      console.error("[useBlog.generateSlug]", error);
      return "";
    }
  }, []);

  const validateSlug = useCallback(async (slug: string): Promise<boolean> => {
    try {
      const result = await validateSlugAction(slug);
      return result.success ? result.data || false : false;
    } catch (error) {
      console.error("[useBlog.validateSlug]", error);
      return false;
    }
  }, []);

  const generateExcerpt = useCallback(
    (content: string, maxLength: number = 150): string => {
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
    },
    []
  );

  // ================================================================
  // FILTROS Y NAVEGACIÓN
  // ================================================================

  const updateFilters = useCallback((newFilters: Partial<BlogFilters>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
    }));
  }, []);

  const setPage = useCallback(
    async (page: number): Promise<void> => {
      updateFilters({ page });
      await refreshPosts();
    },
    [updateFilters, refreshPosts]
  );

  const resetFilters = useCallback(() => {
    setState((prev) => ({
      ...prev,
      filters: {
        page: 1,
        limit: 10,
        sort_by: "created_at",
        sort_order: "desc",
      },
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
      lastError: null,
    }));
  }, []);

  const setCurrentPost = useCallback((post: BlogPostWithDetails | null) => {
    setState((prev) => ({
      ...prev,
      currentPost: post,
    }));
  }, []);

  // ================================================================
  // RETRY FUNCTIONALITY
  // ================================================================

  const retryLastOperation = useCallback(async (): Promise<void> => {
    if (!lastOperation || !state.lastError?.retryable) {
      return;
    }

    const op = lastOperation as LastOperationType;

    try {
      setState((prev) => ({ ...prev, error: null, lastError: null }));

      switch (op.type) {
        case "refreshPosts":
          await refreshPosts();
          break;
        case "createPost":
          await createPost(...(op.params as [CreateBlogPostData, boolean?]));
          break;
        case "loadPost":
          await loadPost(...(op.params as [string, boolean?]));
          break;
        case "searchPosts":
          await searchPosts(...(op.params as [string, Partial<BlogFilters>?]));
          break;
        case "publishPost":
          await publishPost(...(op.params as [string]));
          break;
        case "unpublishPost":
          await unpublishPost(...(op.params as [string]));
          break;
        case "updatePost":
          await updateBlogPostAction(
            ...(op.params as [string, UpdateBlogPostData])
          );
          break;
        case "deletePost":
          await deleteBlogPostAction(...(op.params as [string]));
          break;
        case "loadCategories":
          await loadCategories();
          break;
        case "createCategory":
          await createCategory(
            ...(op.params as [Omit<BlogCategory, "id">])
          );
          break;
        case "loadTags":
          await loadTags();
          break;
        case "createTag":
          await createTag(
            ...(op.params as [Omit<BlogTag, "id">])
          );
          break;
        case "loadComments":
          await loadComments(
            ...(op.params as [string, ("approved" | "pending" | "rejected")?])
          );
          break;
        case "createComment":
          await createComment(...(op.params as [CreateCommentData]));
          break;
        case "approveComment":
          await approveComment(...(op.params as [string]));
          break;
        case "rejectComment":
          await rejectComment(...(op.params as [string]));
          break;
        case "loadStats":
          await loadStats();
          break;
        default:
          console.warn(
            "Tipo de operación desconocido para retry:",
            (op as LastOperationType).type
          );
      }
    } catch (error) {
      console.error("Retry falló:", error);
    }
  }, [
    lastOperation,
    state.lastError,
    refreshPosts,
    createPost,
    loadPost,
    searchPosts,
    publishPost,
    unpublishPost,
    loadCategories,
    createCategory,
    loadTags,
    createTag,
    loadComments,
    createComment,
    approveComment,
    rejectComment,
    loadStats,
  ]);

  // ================================================================
  // VALORES COMPUTADOS
  // ================================================================

  const hasActiveFilters = useMemo(() => {
    return Object.entries(state.filters)
      .filter(([key]) => key !== "page")
      .some(
        ([, value]) => value !== undefined && value !== null && value !== ""
      );
  }, [state.filters]);

  const postsByStatus = useMemo(() => {
    return state.posts.reduce((acc, post) => {
      const status = post.status || "draft";
      if (!acc[status]) acc[status] = [];
      acc[status].push(post);
      return acc;
    }, {} as Record<string, BlogPostWithDetails[]>);
  }, [state.posts]);

  const postsByCategory = useMemo(() => {
    return state.posts.reduce((acc, post) => {
      const categoryName = post.category?.name || "Sin categoría";
      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push(post);
      return acc;
    }, {} as Record<string, BlogPostWithDetails[]>);
  }, [state.posts]);

  const commentsByStatus = useMemo(() => {
    return state.comments.reduce((acc, comment) => {
      const status = comment.status || "pending";
      if (!acc[status]) acc[status] = [];
      acc[status].push(comment);
      return acc;
    }, {} as Record<string, BlogComment[]>);
  }, [state.comments]);

  const isRetryable = useMemo(() => {
    return Boolean(state.lastError?.retryable);
  }, [state.lastError]);

  const getDetailedError = useCallback(() => {
    return state.lastError;
  }, [state.lastError]);

  // ================================================================
  // EFECTOS
  // ================================================================

  useEffect(() => {
    if (initialFilters.autoLoad) {
      refreshPosts();
      loadCategories();
      loadTags();
    }
  }, [initialFilters.autoLoad, refreshPosts, loadCategories, loadTags]);

  // Auto-refrescar posts cuando cambian los filtros
  useEffect(() => {
    if (initialFilters.autoLoad) {
      refreshPosts();
    }
  }, [state.filters, initialFilters.autoLoad, refreshPosts]);

  // ================================================================
  // RETURN DEL HOOK
  // ================================================================

  return {
    // Estado
    ...state,

    // Valores computados
    hasActiveFilters,
    postsByStatus,
    postsByCategory,
    commentsByStatus,

    // Operaciones CRUD de Posts
    createPost,
    refreshPosts,
    loadPost,
    searchPosts,
    clearSearch,

    // Gestión de Posts
    publishPost,
    unpublishPost,
    updatePostStatus,
    toggleFeatured,
    incrementViews,

    // Categorías
    loadCategories,
    createCategory,

    // Tags
    loadTags,
    createTag,

    // Comentarios
    loadComments,
    createComment,
    approveComment,
    rejectComment,
    moderateComment,

    // Estadísticas
    loadStats,
    loadPopularPosts,
    loadRecentPosts,

    // Utilidades
    generateSlug,
    validateSlug,
    generateExcerpt,

    // Filtros y navegación
    updateFilters,
    setPage,
    resetFilters,
    clearError,
    setCurrentPost,

    // Retry functionality
    retryLastOperation,
    isRetryable,
    getDetailedError,
  };
};

export default useBlog;
