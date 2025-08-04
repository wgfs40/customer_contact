// ================================================================
// TIPOS BASE
// ================================================================

export type BlogPostStatus = "draft" | "published" | "archived" | "scheduled";
export type CommentStatus = "pending" | "approved" | "rejected";
export type BlogSortBy =
  | "created_at"
  | "updated_at"
  | "published_at"
  | "title"
  | "views"
  | "likes";
export type SortOrder = "asc" | "desc";

// ================================================================
// BLOG POST
// ================================================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: BlogPostStatus;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  author_id: string;
  category_id?: string;
  is_featured: boolean;
  allow_comments: boolean;
  views: number;
  likes: number;
  shares: number;
  reading_time?: number; // en minutos
  published_at?: string;
  scheduled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPostWithDetails extends BlogPost {
  // Relaciones
  author?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    bio?: string;
    email?: string;
  };
  category?: BlogCategory;
  tags?: BlogTag[];
  comments?: BlogComment[];

  // Estadísticas extendidas
  _count?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    approved_comments: number;
  };

  // Datos adicionales
  next_post?: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
  };
  previous_post?: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
  };
  related_posts?: BlogPost[];
}

export interface CreateBlogPostData {
  title: string;
  content: string;
  excerpt?: string;
  slug?: string; // Si no se proporciona, se genera automáticamente
  status?: BlogPostStatus;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  author_id: string;
  category_id?: string;
  is_featured?: boolean;
  allow_comments?: boolean;
  tags?: string[]; // Array de IDs de tags
  scheduled_at?: string; // Para posts programados
}

export interface UpdateBlogPostData {
  title?: string;
  content?: string;
  excerpt?: string;
  slug?: string;
  status?: BlogPostStatus;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  category_id?: string;
  is_featured?: boolean;
  allow_comments?: boolean;
  tags?: string[]; // Array de IDs de tags
  published_at?: string | null;
  scheduled_at?: string | null;
}

// ================================================================
// CATEGORÍA
// ================================================================

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string; // Color hex para UI
  icon?: string; // Nombre del icono o URL
  parent_id?: string; // Para categorías anidadas
  sort_order?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  // Campos computados
  _count?: {
    posts: number;
    published_posts: number;
  };

  // Para categorías anidadas
  children?: BlogCategory[];
  parent?: BlogCategory;
}

export interface CreateCategoryData {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
  parent_id?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
  parent_id?: string;
  sort_order?: number;
  is_active?: boolean;
}

// ================================================================
// TAG
// ================================================================

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string; // Color hex para UI
  is_featured: boolean;
  created_at: string;
  updated_at: string;

  // Campos computados
  _count?: {
    posts: number;
  };
}

export interface CreateTagData {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  is_featured?: boolean;
}

export interface UpdateTagData {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
  is_featured?: boolean;
}

// ================================================================
// COMENTARIO
// ================================================================

export interface BlogComment {
  id: string;
  post_id: string;
  content: string;
  status: CommentStatus;
  author_name: string;
  author_email: string;
  author_url?: string;
  author_ip?: string;
  user_agent?: string;
  parent_id?: string; // Para respuestas anidadas
  user_id?: string; // Si el comentario es de un usuario registrado
  likes: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;

  // Relaciones
  post?: {
    id: string;
    title: string;
    slug: string;
  };
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  replies?: BlogComment[]; // Comentarios hijos
  parent?: BlogComment; // Comentario padre
}

export interface CreateCommentData {
  post_id: string;
  content: string;
  author_name: string;
  author_email: string;
  author_url?: string;
  parent_id?: string;
  user_id?: string;
}

export interface UpdateCommentData {
  content?: string;
  status?: CommentStatus;
  is_pinned?: boolean;
}

// ================================================================
// FILTROS
// ================================================================

export interface BlogFilters {
  // Paginación
  page?: number;
  limit?: number;

  // Filtros básicos
  status?: BlogPostStatus;
  category_id?: string;
  author_id?: string;
  tag?: string; // slug del tag
  search?: string;

  // Filtros avanzados
  is_featured?: boolean;
  allow_comments?: boolean;
  include_drafts?: boolean;

  // Filtros de fecha
  date_from?: string; // ISO string
  date_to?: string; // ISO string
  published_after?: string;
  published_before?: string;

  // Ordenamiento
  sort_by?: BlogSortBy;
  sort_order?: SortOrder;

  // Incluir relaciones
  include_author?: boolean;
  include_category?: boolean;
  include_tags?: boolean;
  include_comments?: boolean;
  include_stats?: boolean;
}

export interface CommentFilters {
  post_id?: string;
  status?: CommentStatus;
  author_email?: string;
  user_id?: string;
  parent_id?: string;
  is_pinned?: boolean;
  page?: number;
  limit?: number;
  sort_by?: "created_at" | "updated_at" | "likes";
  sort_order?: SortOrder;
}

// ================================================================
// ESTADÍSTICAS
// ================================================================

export interface BlogStats {
  // Posts
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  archivedPosts: number;
  scheduledPosts: number;
  featuredPosts: number;

  // Categorías y Tags
  totalCategories: number;
  activeCategories: number;
  totalTags: number;
  featuredTags: number;

  // Comentarios
  totalComments: number;
  approvedComments: number;
  pendingComments: number;
  rejectedComments: number;

  // Engagement
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  averageCommentsPerPost: number;

  // Métricas de tiempo
  averageReadingTime: number;
  postsThisMonth: number;
  postsThisWeek: number;
  postsToday: number;
}

export interface BlogMetrics {
  // Métricas por período
  views_by_period: {
    date: string;
    views: number;
    unique_views: number;
  }[];

  posts_by_period: {
    date: string;
    posts: number;
  }[];

  comments_by_period: {
    date: string;
    comments: number;
  }[];

  // Top posts
  most_viewed_posts: {
    id: string;
    title: string;
    views: number;
    slug: string;
  }[];

  most_liked_posts: {
    id: string;
    title: string;
    likes: number;
    slug: string;
  }[];

  most_commented_posts: {
    id: string;
    title: string;
    comments: number;
    slug: string;
  }[];

  // Top categorías y tags
  top_categories: {
    id: string;
    name: string;
    posts: number;
    views: number;
  }[];

  top_tags: {
    id: string;
    name: string;
    posts: number;
    views: number;
  }[];

  // Métricas de autor
  top_authors: {
    id: string;
    name: string;
    posts: number;
    total_views: number;
    avg_views_per_post: number;
  }[];
}

// ================================================================
// RESPUESTAS DE API
// ================================================================

export interface BlogApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedBlogResponse<T> extends BlogApiResponse<T[]> {
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ================================================================
// TIPOS PARA FORMULARIOS
// ================================================================

export interface BlogPostFormData {
  // Información básica
  title: string;
  content: string;
  excerpt: string;
  slug: string;

  // Configuración
  status: BlogPostStatus;
  category_id: string;
  tags: string[];

  // SEO
  meta_title: string;
  meta_description: string;
  featured_image: string;

  // Opciones
  is_featured: boolean;
  allow_comments: boolean;
  scheduled_at?: string;
}

export interface CommentFormData {
  content: string;
  author_name: string;
  author_email: string;
  author_url?: string;
  parent_id?: string;
}

// ================================================================
// TIPOS PARA HOOKS
// ================================================================

export interface UseBlogPostsOptions {
  filters?: BlogFilters;
  autoLoad?: boolean;
  revalidateOnFocus?: boolean;
}

export interface UseBlogPostsReturn {
  // Data
  posts: BlogPostWithDetails[];
  loading: boolean;
  error: string | null;

  // Pagination
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };

  // Actions
  loadPosts: (filters?: BlogFilters) => Promise<void>;
  createPost: (data: CreateBlogPostData) => Promise<boolean>;
  updatePost: (id: string, data: UpdateBlogPostData) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  publishPost: (id: string) => Promise<boolean>;

  // Filters
  filters: BlogFilters;
  updateFilters: (newFilters: Partial<BlogFilters>) => void;
  resetFilters: () => void;

  // Utilities
  refresh: () => Promise<void>;
  clearError: () => void;
}

// ================================================================
// TIPOS PARA COMPONENTES
// ================================================================

export interface BlogPostCardProps {
  post: BlogPost | BlogPostWithDetails;
  showAuthor?: boolean;
  showCategory?: boolean;
  showTags?: boolean;
  showStats?: boolean;
  showExcerpt?: boolean;
  className?: string;
  onClick?: (post: BlogPost) => void;
}

export interface BlogCategoryBadgeProps {
  category: BlogCategory;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "secondary";
  className?: string;
}

export interface BlogTagProps {
  tag: BlogTag;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "secondary";
  className?: string;
  onClick?: (tag: BlogTag) => void;
}

// ================================================================
// TIPOS PARA BÚSQUEDA
// ================================================================

export interface BlogSearchResult {
  posts: BlogPost[];
  categories: BlogCategory[];
  tags: BlogTag[];
  total: number;
  query: string;
  filters?: Partial<BlogFilters>;
}

export interface BlogSearchFilters {
  query: string;
  categories?: string[];
  tags?: string[];
  authors?: string[];
  date_range?: {
    from: string;
    to: string;
  };
  content_type?: "posts" | "categories" | "tags" | "all";
}

// ================================================================
// EXPORTAR TIPOS PRINCIPALES
// ================================================================

export type {
  // Principales
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

  // Adicionales
  BlogMetrics,
  BlogApiResponse,
  PaginatedBlogResponse,
  BlogPostFormData,
  CommentFormData,
  UseBlogPostsReturn,
  BlogSearchResult,
};

// Exports por defecto para facilitar imports
export default {
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
};
