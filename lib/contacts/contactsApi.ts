import {
  Contact,
  ContactAPIResponse,
  ContactFilters,
  ContactFormData,
  ContactResponse,
  ContactTemplate,
} from "@/types/home/contact";
import { createClient } from "@supabase/supabase-js";

// ================================================================
// CLIENTE SUPABASE
// ================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ================================================================
// MÉTODOS PRINCIPALES DE CONTACTOS
// ================================================================

/**
 * Crear un nuevo contacto
 */
export const createContact = async (
  contactData: ContactFormData
): Promise<ContactAPIResponse> => {
  try {
    // Validar datos requeridos
    if (
      !contactData.full_name ||
      !contactData.email ||
      !contactData.subject ||
      !contactData.message
    ) {
      return {
        success: false,
        error: "Missing required fields: full_name, email, subject, message",
      };
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      return {
        success: false,
        error: "Invalid email format",
      };
    }

    // Preparar datos para inserción
    const insertData = {
      full_name: contactData.full_name.trim(),
      email: contactData.email.toLowerCase().trim(),
      phone: contactData.phone?.trim() || null,
      company: contactData.company?.trim() || null,
      subject: contactData.subject.trim(),
      message: contactData.message.trim(),
      contact_type: contactData.contact_type || "general",
      source: contactData.source || "website",
      preferred_contact_method: contactData.preferred_contact_method || "email",
      best_time_to_contact: contactData.best_time_to_contact || null,
      is_newsletter_subscribed: contactData.is_newsletter_subscribed || false,
      utm_source: contactData.utm_source || null,
      utm_medium: contactData.utm_medium || null,
      utm_campaign: contactData.utm_campaign || null,
      utm_term: contactData.utm_term || null,
      utm_content: contactData.utm_content || null,
      metadata: contactData.metadata || {},
      language: "es",
      priority: "medium",
    };

    // Usar función RPC para crear el contacto
    const { data, error } = await supabase.rpc("create_contact", {
      p_full_name: insertData.full_name,
      p_email: insertData.email,
      p_subject: insertData.subject,
      p_message: insertData.message,
      p_phone: insertData.phone,
      p_company: insertData.company,
      p_contact_type: insertData.contact_type,
      p_source: insertData.source,
      p_metadata: insertData.metadata,
    });

    if (error) {     
      return {
        success: false,
        error: "Failed to create contact",
      };
    }

    return {
      success: data[0]?.success || false,
      data: {
        contact_id: data[0]?.contact_id,
        message: data[0]?.message,
      },
    };
  } catch (error) {
    console.error("Unexpected error creating contact:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

/**
 * Obtener contactos con filtros
 */
export const getContacts = async (
  filters: ContactFilters = {}
): Promise<ContactAPIResponse> => {
  try {
    const { data, error } = await supabase.rpc("get_contacts", {
      p_limit: filters.limit || 50,
      p_offset: filters.offset || 0,
      p_status: filters.status || null,
      p_contact_type: filters.contact_type || null,
      p_priority: filters.priority || null,
    });

    if (error) {
      console.error("Error fetching contacts:", error);
      return {
        success: false,
        error: "Failed to fetch contacts",
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Unexpected error fetching contacts:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

/**
 * Obtener contacto por ID
 */
export const getContactById = async (
  id: string
): Promise<ContactAPIResponse> => {
  try {
    const { data, error } = await supabase
      .from("contacts_with_details")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching contact:", error);
      return {
        success: false,
        error: "Contact not found",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Unexpected error fetching contact:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

/**
 * Buscar contactos por texto
 */
export const searchContacts = async (
  searchTerm: string,
  limit: number = 20
): Promise<ContactAPIResponse> => {
  try {
    if (!searchTerm.trim()) {
      return {
        success: true,
        data: [],
      };
    }

    const { data, error } = await supabase.rpc("search_contacts", {
      p_search_term: searchTerm.trim(),
      p_limit: limit,
    });

    if (error) {
      console.error("Error searching contacts:", error);
      return {
        success: false,
        error: "Failed to search contacts",
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Unexpected error searching contacts:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

/**
 * Marcar contacto como procesado
 */
export const markContactAsProcessed = async (
  contactId: string,
  processedBy?: string,
  notes?: string
): Promise<ContactAPIResponse> => {
  try {
    const { data, error } = await supabase.rpc("mark_contact_processed", {
      p_contact_id: contactId,
      p_processed_by: processedBy || null,
      p_notes: notes || null,
    });

    if (error) {
      console.error("Error marking contact as processed:", error);
      return {
        success: false,
        error: "Failed to update contact",
      };
    }

    return {
      success: data[0]?.success || false,
      message: data[0]?.message,
    };
  } catch (error) {
    console.error("Unexpected error updating contact:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

/**
 * Actualizar estado del contacto
 */
export const updateContactStatus = async (
  contactId: string,
  status: Contact["status"],
  notes?: string
): Promise<ContactAPIResponse> => {
  try {
    const updateData: Record<string, unknown> = { status };
    if (notes) {
      updateData.notes = notes;
    }

    const { data, error } = await supabase
      .from("contacts")
      .update(updateData)
      .eq("id", contactId)
      .select()
      .single();

    if (error) {
      console.error("Error updating contact status:", error);
      return {
        success: false,
        error: "Failed to update contact status",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Unexpected error updating contact status:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

/**
 * Actualizar prioridad del contacto
 */
export const updateContactPriority = async (
  contactId: string,
  priority: Contact["priority"]
): Promise<ContactAPIResponse> => {
  try {
    const { data, error } = await supabase
      .from("contacts")
      .update({ priority })
      .eq("id", contactId)
      .select()
      .single();

    if (error) {
      console.error("Error updating contact priority:", error);
      return {
        success: false,
        error: "Failed to update contact priority",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Unexpected error updating contact priority:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

/**
 * Agregar tags al contacto
 */
export const addContactTags = async (
  contactId: string,
  tags: string[]
): Promise<ContactAPIResponse> => {
  try {
    // Primero obtener las tags existentes
    const { data: currentContact, error: fetchError } = await supabase
      .from("contacts")
      .select("tags")
      .eq("id", contactId)
      .single();

    if (fetchError) {
      console.error("Error fetching current tags:", fetchError);
      return {
        success: false,
        error: "Failed to fetch current tags",
      };
    }

    // Combinar tags existentes con las nuevas (sin duplicados)
    const existingTags = currentContact.tags || [];
    const newTags = [...new Set([...existingTags, ...tags])];

    const { data, error } = await supabase
      .from("contacts")
      .update({ tags: newTags })
      .eq("id", contactId)
      .select()
      .single();

    if (error) {
      console.error("Error updating contact tags:", error);
      return {
        success: false,
        error: "Failed to update contact tags",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Unexpected error updating contact tags:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

// ================================================================
// MÉTODOS DE RESPUESTAS
// ================================================================

/**
 * Enviar respuesta automática
 */
export const sendAutoResponse = async (
  contactId: string,
  templateId?: string
): Promise<ContactAPIResponse> => {
  try {
    const { data, error } = await supabase.rpc("send_auto_response", {
      p_contact_id: contactId,
      p_template_id: templateId || null,
    });

    if (error) {
      console.error("Error sending auto response:", error);
      return {
        success: false,
        error: "Failed to send auto response",
      };
    }

    return {
      success: data[0]?.success || false,
      data: {
        response_id: data[0]?.response_id,
        message: data[0]?.message,
      },
    };
  } catch (error) {
    console.error("Unexpected error sending auto response:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

/**
 * Obtener respuestas de un contacto
 */
export const getContactResponses = async (
  contactId: string
): Promise<ContactAPIResponse> => {
  try {
    const { data, error } = await supabase
      .from("contact_responses")
      .select("*")
      .eq("contact_id", contactId)
      .order("sent_at", { ascending: false });

    if (error) {
      console.error("Error fetching contact responses:", error);
      return {
        success: false,
        error: "Failed to fetch contact responses",
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Unexpected error fetching contact responses:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

/**
 * Crear respuesta manual
 */
export const createContactResponse = async (
  contactId: string,
  responseData: {
    response_type: ContactResponse["response_type"];
    subject?: string;
    message: string;
    sent_by?: string;
  }
): Promise<ContactAPIResponse> => {
  try {
    const { data, error } = await supabase
      .from("contact_responses")
      .insert([
        {
          contact_id: contactId,
          response_type: responseData.response_type,
          subject: responseData.subject || null,
          message: responseData.message,
          sent_by: responseData.sent_by || null,
          delivery_status: "sent",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating contact response:", error);
      return {
        success: false,
        error: "Failed to create contact response",
      };
    }

    // Actualizar la fecha de respuesta en el contacto
    await supabase
      .from("contacts")
      .update({ response_sent_at: new Date().toISOString() })
      .eq("id", contactId);

     
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Unexpected error creating contact response:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

// ================================================================
// MÉTODOS DE PLANTILLAS
// ================================================================

/**
 * Obtener plantillas de respuesta
 */
export const getContactTemplates = async (
  contactType?: string,
  templateType?: string
): Promise<ContactAPIResponse> => {
  try {
    let query = supabase
      .from("contact_templates")
      .select("*")
      .eq("is_active", true);

    if (contactType) {
      query = query.eq("contact_type", contactType);
    }

    if (templateType) {
      query = query.eq("template_type", templateType);
    }

    const { data, error } = await query.order("sort_order", {
      ascending: true,
    });

    if (error) {
      console.error("Error fetching contact templates:", error);
      return {
        success: false,
        error: "Failed to fetch contact templates",
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Unexpected error fetching contact templates:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

/**
 * Crear plantilla de respuesta
 */
export const createContactTemplate = async (
  templateData: Omit<ContactTemplate, "id" | "created_at" | "updated_at">
): Promise<ContactAPIResponse> => {
  try {
    const { data, error } = await supabase
      .from("contact_templates")
      .insert([templateData])
      .select()
      .single();

    if (error) {
      console.error("Error creating contact template:", error);
      return {
        success: false,
        error: "Failed to create contact template",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Unexpected error creating contact template:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

// ================================================================
// MÉTODOS DE ESTADÍSTICAS
// ================================================================

/**
 * Obtener estadísticas del dashboard
 */
export const getContactDashboardStats = async (
  dateFrom?: string,
  dateTo?: string
): Promise<ContactAPIResponse> => {
  try {
    const { data, error } = await supabase.rpc("get_contact_dashboard_stats", {
      p_date_from: dateFrom || null,
      p_date_to: dateTo || null,
    });

    if (error) {
      console.error("Error fetching contact stats:", error);
      return {
        success: false,
        error: "Failed to fetch contact statistics",
      };
    }

    return {
      success: true,
      data: data[0] || {},
    };
  } catch (error) {
    console.error("Unexpected error fetching contact stats:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

/**
 * Obtener contactos por rango de fechas
 */
export const getContactsByDateRange = async (
  startDate: string,
  endDate: string,
  limit: number = 100
): Promise<ContactAPIResponse> => {
  try {
    const { data, error } = await supabase.rpc("get_contacts_by_date_range", {
      p_start_date: startDate,
      p_end_date: endDate,
      p_limit: limit,
    });

    if (error) {
      console.error("Error fetching contacts by date range:", error);
      return {
        success: false,
        error: "Failed to fetch contacts by date range",
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Unexpected error fetching contacts by date range:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

/**
 * Obtener métricas de conversión
 */
export const getContactConversionMetrics = async (
  dateFrom?: string,
  dateTo?: string
): Promise<ContactAPIResponse> => {
  try {
    // Consulta personalizada para métricas de conversión
    const { data, error } = await supabase
      .from("contacts")
      .select(
        `
        contact_type,
        status,
        created_at,
        response_sent_at,
        is_processed
      `
      )
      .gte("created_at", dateFrom || "2024-01-01")
      .lte("created_at", dateTo || new Date().toISOString());

    if (error) {
      console.error("Error fetching conversion metrics:", error);
      return {
        success: false,
        error: "Failed to fetch conversion metrics",
      };
    }

    // Procesar datos para calcular métricas
    const contacts = data || [];
    const totalContacts = contacts.length;
    const processedContacts = contacts.filter((c) => c.is_processed).length;
    const respondedContacts = contacts.filter((c) => c.response_sent_at).length;
    const closedContacts = contacts.filter(
      (c) => c.status === "closed" || c.status === "resolved"
    ).length;

    const conversionRate =
      totalContacts > 0 ? (processedContacts / totalContacts) * 100 : 0;
    const responseRate =
      totalContacts > 0 ? (respondedContacts / totalContacts) * 100 : 0;
    const closureRate =
      totalContacts > 0 ? (closedContacts / totalContacts) * 100 : 0;

    // Métricas por tipo de contacto
    type ContactMetric = {
      contact_type: string;
      status: string;
      created_at: string;
      response_sent_at?: string | null;
      is_processed?: boolean;
    };
    const typeMetrics = contacts.reduce((acc, contact: ContactMetric) => {
      const type = contact.contact_type;
      if (!acc[type]) {
        acc[type] = { total: 0, processed: 0, responded: 0, closed: 0 };
      }
      acc[type].total++;
      if (contact.is_processed) acc[type].processed++;
      if (contact.response_sent_at) acc[type].responded++;
      if (contact.status === "closed" || contact.status === "resolved")
        acc[type].closed++;
      return acc;
    }, {} as Record<string, { total: number; processed: number; responded: number; closed: number }>);

    return {
      success: true,
      data: {
        totalContacts,
        processedContacts,
        respondedContacts,
        closedContacts,
        conversionRate: Math.round(conversionRate * 100) / 100,
        responseRate: Math.round(responseRate * 100) / 100,
        closureRate: Math.round(closureRate * 100) / 100,
        typeMetrics,
      },
    };
  } catch (error) {
    console.error("Unexpected error calculating conversion metrics:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
};

// ================================================================
// MÉTODOS DE UTILIDAD
// ================================================================

/**
 * Validar formato de email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitizar datos de contacto
 */
export const sanitizeContactData = (data: ContactFormData): ContactFormData => {
  return {
    ...data,
    full_name: data.full_name?.trim() || "",
    email: data.email?.toLowerCase().trim() || "",
    phone: data.phone?.trim() || undefined,
    company: data.company?.trim() || undefined,
    subject: data.subject?.trim() || "",
    message: data.message?.trim() || "",
  };
};

/**
 * Formatear contacto para display
 */
export const formatContactForDisplay = (
  contact: Contact
): Contact & {
  created_at_formatted: string;
  priority_label: string;
  status_label: string;
  contact_type_label: string;
} => {
  return {
    ...contact,
    created_at_formatted: new Date(contact.created_at).toLocaleDateString(
      "es-ES",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ),
    priority_label:
      {
        low: "Baja",
        medium: "Media",
        high: "Alta",
        urgent: "Urgente",
      }[contact.priority] || contact.priority,
    status_label:
      {
        new: "Nuevo",
        in_progress: "En Progreso",
        pending: "Pendiente",
        resolved: "Resuelto",
        closed: "Cerrado",
      }[contact.status] || contact.status,
    contact_type_label:
      {
        general: "General",
        sales: "Ventas",
        support: "Soporte",
        partnership: "Alianzas",
        media: "Medios",
        career: "Carreras",
      }[contact.contact_type] || contact.contact_type,
  };
};

// ================================================================
// EXPORTAR TODAS LAS FUNCIONES
// ================================================================

const contactsApi = {
  // CRUD básico
  createContact,
  getContacts,
  getContactById,
  searchContacts,

  // Actualizaciones
  markContactAsProcessed,
  updateContactStatus,
  updateContactPriority,
  addContactTags,

  // Respuestas
  sendAutoResponse,
  getContactResponses,
  createContactResponse,

  // Plantillas
  getContactTemplates,
  createContactTemplate,

  // Estadísticas
  getContactDashboardStats,
  getContactsByDateRange,
  getContactConversionMetrics,

  // Utilidades
  validateEmail,
  sanitizeContactData,
  formatContactForDisplay,
};

export default contactsApi;
