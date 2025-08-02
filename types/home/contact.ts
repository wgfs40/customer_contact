export interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  contact_type:
    | "general"
    | "sales"
    | "support"
    | "partnership"
    | "media"
    | "career";
  priority: "low" | "medium" | "high" | "urgent";
  status: "new" | "in_progress" | "pending" | "resolved" | "closed";
  source: string;
  ip_address?: string;
  user_agent?: string;
  referrer_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  preferred_contact_method: "email" | "phone" | "whatsapp";
  best_time_to_contact?: string;
  language: string;
  country?: string;
  timezone?: string;
  is_newsletter_subscribed: boolean;
  is_processed: boolean;
  processed_at?: string;
  processed_by?: string;
  response_sent_at?: string;
  follow_up_date?: string;
  notes?: string;
  tags?: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ContactWithDetails extends Contact {
  response_count: number;
  last_response_at?: string;
  attachment_count?: number;
  recency: "very_recent" | "recent" | "this_week" | "this_month" | "older";
  urgency_score: number;
}

export interface ContactFormData {
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  contact_type?:
    | "general"
    | "sales"
    | "support"
    | "partnership"
    | "media"
    | "career";
  source?: string;
  preferred_contact_method?: "email" | "phone" | "whatsapp";
  best_time_to_contact?: string;
  is_newsletter_subscribed?: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  metadata?: Record<string, unknown>;
}

export interface ContactResponse {
  id: string;
  contact_id: string;
  response_type: "email" | "phone" | "in_person" | "system";
  subject?: string;
  message: string;
  sent_by?: string;
  sent_at: string;
  delivery_status: "pending" | "sent" | "delivered" | "failed" | "bounced";
  opened_at?: string;
  clicked_at?: string;
  replied_at?: string;
  email_provider?: string;
  tracking_id?: string;
  template_used?: string;
  attachments: unknown[];
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ContactTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  template_type: "response" | "follow_up" | "welcome" | "thank_you";
  contact_type: string;
  language: string;
  is_active: boolean;
  sort_order: number;
  variables: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactStats {
  total_contacts: number;
  new_contacts: number;
  pending_contacts: number;
  processed_contacts: number;
  avg_response_time_hours?: number;
  top_contact_types: Record<string, number>;
  daily_stats: Array<{
    date: string;
    contacts: number;
    new: number;
    processed: number;
  }>;
}

export interface ContactFilters {
  status?: string;
  contact_type?: string;
  priority?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  is_processed?: boolean;
  limit?: number;
  offset?: number;
}

export interface ContactAPIResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  message?: string;
}
