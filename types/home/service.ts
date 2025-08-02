// Tipo para categorías de servicios
export type ServiceCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  sort_order?: number;
  is_active?: boolean;
  services_count?: number;
  created_at?: string;
  updated_at?: string;
};

// Tipo para características de servicios
export type ServiceFeature = {
  id: string;
  service_id: string;
  feature_text: string;
  description?: string;
  included?: boolean;
  sort_order?: number;
  icon?: string;
  created_at?: string;
};

// Tipo para paquetes de servicios
export type ServicePackage = {
  id: string;
  service_id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  billing_period?: "one-time" | "monthly" | "quarterly" | "yearly";
  duration?: string;
  features?: string[];
  max_revisions?: number;
  delivery_time?: string;
  popular?: boolean;
  active?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
};

// Tipo para testimoniales de servicios
export type ServiceTestimonial = {
  id: string;
  service_id: string;
  client_name: string;
  client_position?: string;
  client_company?: string;
  client_avatar?: string;
  testimonial_text: string;
  rating?: number;
  project_result?: string;
  approved?: boolean;
  featured?: boolean;
  date_completed?: string;
  created_at?: string;
  updated_at?: string;
};

// Tipo para FAQs de servicios
export type ServiceFAQ = {
  id: string;
  service_id: string;
  question: string;
  answer: string;
  sort_order?: number;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
};

// Tipo para solicitudes de servicios
export type ServiceInquiry = {
  id: string;
  service_id?: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  client_company?: string;
  project_description: string;
  budget_range?: string;
  timeline?: string;
  additional_requirements?: string;
  status?:
    | "pending"
    | "contacted"
    | "quoted"
    | "accepted"
    | "rejected"
    | "completed";
  priority?: "low" | "normal" | "high" | "urgent";
  assigned_to?: string;
  follow_up_date?: string;
  notes?: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  created_at?: string;
  updated_at?: string;
};

// Tipo para analytics de servicios
export type ServiceAnalytics = {
  id: string;
  service_id: string;
  event_type: "view" | "inquiry" | "quote_request" | "booking" | "conversion";
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  session_id?: string;
  country?: string;
  city?: string;
  device_type?: string;
  created_at?: string;
};

// Tipo base para datos de servicios
export type ServiceData = {
  title: string;
  slug: string;
  description: string;
  detailed_description?: string;
  icon?: string;
  price_text: string;
  price_min?: number;
  price_max?: number;
  currency?: string;
  duration: string;
  category_id?: string;
  popular?: boolean;
  featured?: boolean;
  published?: boolean;
  sort_order?: number;
  views_count?: number;
  inquiries_count?: number;
  bookings_count?: number;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
};

// Tipo principal de Service
export type Service = ServiceData & {
  id: string;
  category?: ServiceCategory;
  features?: ServiceFeature[];
  packages?: ServicePackage[];
  testimonials?: ServiceTestimonial[];
  faqs?: ServiceFAQ[];
};

// Tipo para Service con información de categoría (vista)
export type ServiceWithCategory = Service & {
  category_name?: string;
  category_slug?: string;
  category_icon?: string;
  category_color?: string;
};

// Tipo para respuestas de API
export type ServiceAPIResponse = {
  success: boolean;
  error?: string;
  service?: Service;
  features?: ServiceFeature[];
  packages?: ServicePackage[];
  testimonials?: ServiceTestimonial[];
  faqs?: ServiceFAQ[];
};

// Tipo para estadísticas de servicios
export type ServiceStats = {
  total_services: number;
  published_services: number;
  popular_services: number;
  featured_services: number;
  total_views: number;
  total_inquiries: number;
  total_bookings: number;
  active_categories: number;
  pending_inquiries: number;
  average_rating: number;
};

// Tipo para servicios populares
export type PopularService = ServiceWithCategory & {
  popularity_rank: number;
};

// Tipos para formularios
export type ServiceInquiryForm = {
  service_slug: string;
  client_name: string;
  client_email: string;
  project_description: string;
  client_phone?: string;
  client_company?: string;
  budget_range?: string;
  timeline?: string;
  additional_requirements?: string;
};

export type ServiceContactForm = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_interest: string;
  message: string;
  budget_range?: string;
  timeline?: string;
};

// Tipo para filtros de servicios
export type ServiceFilters = {
  category?: string;
  popular?: boolean;
  featured?: boolean;
  price_min?: number;
  price_max?: number;
  search?: string;
  limit?: number;
  offset?: number;
  sort_by?: "title" | "price" | "views" | "created_at";
  sort_order?: "asc" | "desc";
};

// Tipos para el componente Services.tsx (compatibilidad)
export type ServiceComponentData = {
  id: number;
  title: string;
  description: string;
  features: string[];
  icon: string;
  price: string;
  duration: string;
  category: string;
  popular?: boolean;
};

// Tipo por defecto
export default Service;
