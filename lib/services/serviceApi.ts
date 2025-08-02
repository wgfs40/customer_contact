import { createClient } from "@supabase/supabase-js";
import {
  Service,
  ServiceData,
  ServiceWithCategory,
  ServiceFilters,
  ServiceInquiryForm,
  ServiceAPIResponse,
  ServiceStats,
} from "@/types/home/service";

// Initialize Supabase client
const supabaseUrl = process.env.Project_URL as string;
const supabaseAnonKey = process.env.SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ================================================================
// CRUD BÁSICO DE SERVICIOS
// ================================================================

export const createService = async (data: ServiceData): Promise<Service> => {
  const { data: service, error } = await supabase
    .from("services")
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating service: ${error.message}`);
  }

  return service;
};

export const getServiceById = async (id: string): Promise<Service | null> => {
  const { data: service, error } = await supabase
    .from("services_with_category")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (error) {
    console.error("Error fetching service:", error.message);
    return null;
  }

  return service;
};

export const getServiceBySlug = async (
  slug: string
): Promise<Service | null> => {
  const { data: service, error } = await supabase
    .from("services_with_category")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) {
    console.error("Error fetching service by slug:", error.message);
    return null;
  }

  return service;
};

export const updateService = async (
  id: string,
  data: Partial<ServiceData>
): Promise<Service | null> => {
  const { data: service, error } = await supabase
    .from("services")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating service:", error.message);
    return null;
  }

  return service;
};

export const deleteService = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    console.error("Error deleting service:", error.message);
    return false;
  }

  return true;
};

// ================================================================
// OBTENER SERVICIOS CON FILTROS
// ================================================================

export const getServices = async (
  filters: ServiceFilters = {}
): Promise<ServiceWithCategory[]> => {
  let query = supabase
    .from("services_with_category")
    .select("*")
    .eq("published", true);

  // Aplicar filtros
  if (filters.category) {
    query = query.eq("category_slug", filters.category);
  }

  if (filters.popular) {
    query = query.eq("popular", true);
  }

  if (filters.featured) {
    query = query.eq("featured", true);
  }

  if (filters.price_min) {
    query = query.gte("price_min", filters.price_min);
  }

  if (filters.price_max) {
    query = query.lte("price_max", filters.price_max);
  }

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  // Ordenamiento
  const sortBy = filters.sort_by || "sort_order";
  const sortOrder = filters.sort_order || "asc";
  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  // Paginación
  if (filters.limit) {
    query = query.limit(filters.limit);
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + filters.limit - 1);
    }
  }

  const { data: services, error } = await query;

  if (error) {
    console.error("Error fetching services:", error.message);
    return [];
  }

  return services || [];
};

export const getServicesByCategory = async (
  categorySlug: string,
  limit: number = 10
): Promise<ServiceWithCategory[]> => {
  const { data, error } = await supabase.rpc("get_services_by_category", {
    category_slug: categorySlug,
    limit_count: limit,
  });

  if (error) {
    console.error("Error fetching services by category:", error.message);
    return [];
  }

  return data || [];
};

export const getPopularServices = async (
  limit: number = 6
): Promise<ServiceWithCategory[]> => {
  const { data: services, error } = await supabase
    .from("popular_services")
    .select("*")
    .limit(limit);

  if (error) {
    console.error("Error fetching popular services:", error.message);
    return [];
  }

  return services || [];
};

export const getFeaturedServices = async (
  limit: number = 3
): Promise<ServiceWithCategory[]> => {
  const { data: services, error } = await supabase
    .from("services_with_category")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured services:", error.message);
    return [];
  }

  return services || [];
};

// ================================================================
// OBTENER DETALLES COMPLETOS DE SERVICIO
// ================================================================

export const getServiceDetails = async (
  slug: string
): Promise<ServiceAPIResponse> => {
  const { data, error } = await supabase.rpc("get_service_details", {
    service_slug: slug,
  });

  if (error) {
    console.error("Error fetching service details:", error.message);
    return { success: false, error: error.message };
  }

  return data;
};

export const getServiceWithFeatures = async (
  slug: string
): Promise<Service | null> => {
  const { data: service, error: serviceError } = await supabase
    .from("services_with_category")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (serviceError || !service) {
    console.error("Error fetching service:", serviceError?.message);
    return null;
  }

  // Obtener características
  const { data: features, error: featuresError } = await supabase
    .from("service_features")
    .select("*")
    .eq("service_id", service.id)
    .order("sort_order");

  if (featuresError) {
    console.error("Error fetching features:", featuresError.message);
  }

  return {
    ...service,
    features: features || [],
  };
};

// ================================================================
// GESTIÓN DE VISTAS Y ANALYTICS
// ================================================================

export const incrementServiceViews = async (
  slug: string
): Promise<{ success: boolean; views?: number; error?: string }> => {
  const { data, error } = await supabase.rpc("increment_service_views", {
    service_slug: slug,
  });

  if (error) {
    console.error("Error incrementing views:", error.message);
    return { success: false, error: error.message };
  }

  return data;
};

export const trackServiceEvent = async (
  serviceId: string,
  eventType: "view" | "inquiry" | "quote_request" | "booking" | "conversion",
  metadata?: Record<string, unknown>
): Promise<boolean> => {
  const { error } = await supabase.from("service_analytics").insert([
    {
      service_id: serviceId,
      event_type: eventType,
      ...metadata,
    },
  ]);

  if (error) {
    console.error("Error tracking event:", error.message);
    return false;
  }

  return true;
};

// ================================================================
// SOLICITUDES DE SERVICIOS
// ================================================================

export const createServiceInquiry = async (
  inquiryData: ServiceInquiryForm
): Promise<{ success: boolean; inquiry_id?: string; error?: string }> => {
  const { data, error } = await supabase.rpc("create_service_inquiry", {
    service_slug: inquiryData.service_slug,
    client_name: inquiryData.client_name,
    client_email: inquiryData.client_email,
    project_description: inquiryData.project_description,
    client_phone: inquiryData.client_phone,
    client_company: inquiryData.client_company,
    budget_range: inquiryData.budget_range,
    timeline: inquiryData.timeline,
    additional_requirements: inquiryData.additional_requirements,
  });

  if (error) {
    console.error("Error creating inquiry:", error.message);
    return { success: false, error: error.message };
  }

  return data;
};

export const getServiceInquiries = async (
  serviceId?: string
): Promise<
  {
    id: string;
    service_id: string;
    client_name: string;
    client_email: string;
    project_description: string;
    client_phone?: string;
    client_company?: string;
    budget_range?: string;
    timeline?: string;
    additional_requirements?: string;
    created_at: string;
    services?: {
      title: string;
      slug: string;
    };
    [key: string]: unknown;
  }[]
> => {
  let query = supabase
    .from("service_inquiries")
    .select(
      `
      *,
      services(title, slug)
    `
    )
    .order("created_at", { ascending: false });

  if (serviceId) {
    query = query.eq("service_id", serviceId);
  }

  const { data: inquiries, error } = await query;

  if (error) {
    console.error("Error fetching inquiries:", error.message);
    return [];
  }

  return inquiries || [];
};

// ================================================================
// ESTADÍSTICAS Y MÉTRICAS
// ================================================================

export const getServiceStats = async (): Promise<ServiceStats | null> => {
  const { data: stats, error } = await supabase
    .from("service_stats")
    .select("*")
    .single();

  if (error) {
    console.error("Error fetching service stats:", error.message);
    return null;
  }

  return stats;
};

export interface ServiceAnalytics {
  id: string;
  service_id: string;
  event_type: string;
  created_at: string;
  [key: string]: unknown;
}

export const getServiceAnalytics = async (
  serviceId: string,
  days: number = 30
): Promise<ServiceAnalytics[]> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: analytics, error } = await supabase
    .from("service_analytics")
    .select("*")
    .eq("service_id", serviceId)
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching analytics:", error.message);
    return [];
  }

  return analytics || [];
};

// ================================================================
// CATEGORÍAS DE SERVICIOS
// ================================================================

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
  [key: string]: unknown;
}

export const getServiceCategories = async (): Promise<ServiceCategory[]> => {
  const { data: categories, error } = await supabase
    .from("service_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    console.error("Error fetching categories:", error.message);
    return [];
  }

  return categories || [];
};

export interface ServiceCategoryWithServices {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
  [key: string]: unknown;
  services: ServiceWithCategory[];
}

export const getCategoryWithServices = async (
  slug: string
): Promise<ServiceCategoryWithServices | null> => {
  const { data: category, error: categoryError } = await supabase
    .from("service_categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (categoryError || !category) {
    console.error("Error fetching category:", categoryError?.message);
    return null;
  }

  const { data: services, error: servicesError } = await supabase
    .from("services_with_category")
    .select("*")
    .eq("category_slug", slug)
    .eq("published", true)
    .order("sort_order");

  if (servicesError) {
    console.error("Error fetching category services:", servicesError.message);
  }

  return {
    ...category,
    services: services || [],
  };
};
