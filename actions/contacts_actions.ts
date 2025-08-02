"use server";

import {
  createContact,
  getContacts,
  getContactById,
  searchContacts,
  markContactAsProcessed,
  updateContactStatus,
  updateContactPriority,
  addContactTags,
  sendAutoResponse,
  getContactResponses,
  createContactResponse,
  getContactTemplates,
  createContactTemplate,
  getContactDashboardStats,
  getContactsByDateRange,
  getContactConversionMetrics,
  validateEmail,
  sanitizeContactData,
  formatContactForDisplay,
} from "@/lib/contacts/contactsApi";
import {
  ContactFilters,
  ContactFormData,
  Contact,
  ContactTemplate,
  ContactResponse,
} from "@/types/home/contact";

// ================================================================
// ACCIONES PRINCIPALES DE CONTACTOS
// ================================================================

/**
 * Crear un nuevo contacto
 */
export async function createContactAction(contactData: ContactFormData) {
  try {
    // Validar email antes de enviar
    if (!validateEmail(contactData.email)) {
      throw new Error("Invalid email format");
    }

    // Sanitizar datos
    const sanitizedData = sanitizeContactData(contactData);

    return await createContact(sanitizedData);
  } catch (error) {
    console.error("Error in createContactAction:", error);
    throw new Error("Failed to create contact");
  }
}

/**
 * Obtener contactos con filtros
 */
export async function getContactsAction(filters?: ContactFilters) {
  try {
    return await getContacts(filters);
  } catch (error) {
    console.error("Error in getContactsAction:", error);
    throw new Error("Failed to fetch contacts");
  }
}

/**
 * Obtener contacto por ID
 */
export async function getContactByIdAction(id: string) {
  try {
    if (!id || id.trim() === "") {
      throw new Error("Contact ID is required");
    }

    return await getContactById(id);
  } catch (error) {
    console.error("Error in getContactByIdAction:", error);
    throw new Error("Failed to fetch contact");
  }
}

/**
 * Buscar contactos por texto
 */
export async function searchContactsAction(searchTerm: string, limit?: number) {
  try {
    if (!searchTerm || searchTerm.trim() === "") {
      return { success: true, data: [] };
    }

    return await searchContacts(searchTerm.trim(), limit);
  } catch (error) {
    console.error("Error in searchContactsAction:", error);
    throw new Error("Failed to search contacts");
  }
}

// ================================================================
// ACCIONES DE GESTIÓN DE CONTACTOS
// ================================================================

/**
 * Marcar contacto como procesado
 */
export async function markContactAsProcessedAction(
  contactId: string,
  processedBy?: string,
  notes?: string
) {
  try {
    if (!contactId || contactId.trim() === "") {
      throw new Error("Contact ID is required");
    }

    return await markContactAsProcessed(contactId, processedBy, notes);
  } catch (error) {
    console.error("Error in markContactAsProcessedAction:", error);
    throw new Error("Failed to mark contact as processed");
  }
}

/**
 * Actualizar estado del contacto
 */
export async function updateContactStatusAction(
  contactId: string,
  status: Contact["status"],
  notes?: string
) {
  try {
    if (!contactId || contactId.trim() === "") {
      throw new Error("Contact ID is required");
    }

    // Validar estado válido
    const validStatuses = [
      "new",
      "in_progress",
      "pending",
      "resolved",
      "closed",
    ];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status provided");
    }

    return await updateContactStatus(contactId, status, notes);
  } catch (error) {
    console.error("Error in updateContactStatusAction:", error);
    throw new Error("Failed to update contact status");
  }
}

/**
 * Actualizar prioridad del contacto
 */
export async function updateContactPriorityAction(
  contactId: string,
  priority: Contact["priority"]
) {
  try {
    if (!contactId || contactId.trim() === "") {
      throw new Error("Contact ID is required");
    }

    // Validar prioridad válida
    const validPriorities = ["low", "medium", "high", "urgent"];
    if (!validPriorities.includes(priority)) {
      throw new Error("Invalid priority provided");
    }

    return await updateContactPriority(contactId, priority);
  } catch (error) {
    console.error("Error in updateContactPriorityAction:", error);
    throw new Error("Failed to update contact priority");
  }
}

/**
 * Agregar tags al contacto
 */
export async function addContactTagsAction(contactId: string, tags: string[]) {
  try {
    if (!contactId || contactId.trim() === "") {
      throw new Error("Contact ID is required");
    }

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      throw new Error("At least one tag is required");
    }

    // Filtrar tags vacías y duplicadas
    const cleanTags = [
      ...new Set(tags.filter((tag) => tag.trim()).map((tag) => tag.trim())),
    ];

    if (cleanTags.length === 0) {
      throw new Error("No valid tags provided");
    }

    return await addContactTags(contactId, cleanTags);
  } catch (error) {
    console.error("Error in addContactTagsAction:", error);
    throw new Error("Failed to add contact tags");
  }
}

// ================================================================
// ACCIONES DE RESPUESTAS
// ================================================================

/**
 * Enviar respuesta automática
 */
export async function sendAutoResponseAction(
  contactId: string,
  templateId?: string
) {
  try {
    if (!contactId || contactId.trim() === "") {
      throw new Error("Contact ID is required");
    }

    return await sendAutoResponse(contactId, templateId);
  } catch (error) {
    console.error("Error in sendAutoResponseAction:", error);
    throw new Error("Failed to send auto response");
  }
}

/**
 * Obtener respuestas de un contacto
 */
export async function getContactResponsesAction(contactId: string) {
  try {
    if (!contactId || contactId.trim() === "") {
      throw new Error("Contact ID is required");
    }

    return await getContactResponses(contactId);
  } catch (error) {
    console.error("Error in getContactResponsesAction:", error);
    throw new Error("Failed to fetch contact responses");
  }
}

/**
 * Crear respuesta manual
 */
export async function createContactResponseAction(
  contactId: string,
  responseData: {
    response_type: ContactResponse["response_type"];
    subject?: string;
    message: string;
    sent_by?: string;
  }
) {
  try {
    if (!contactId || contactId.trim() === "") {
      throw new Error("Contact ID is required");
    }

    if (!responseData.message || responseData.message.trim() === "") {
      throw new Error("Response message is required");
    }

    // Validar tipo de respuesta
    const validResponseTypes = ["email", "phone", "in_person", "system"];
    if (!validResponseTypes.includes(responseData.response_type)) {
      throw new Error("Invalid response type");
    }

    return await createContactResponse(contactId, responseData);
  } catch (error) {
    console.error("Error in createContactResponseAction:", error);
    throw new Error("Failed to create contact response");
  }
}

// ================================================================
// ACCIONES DE PLANTILLAS
// ================================================================

/**
 * Obtener plantillas de respuesta
 */
export async function getContactTemplatesAction(
  contactType?: string,
  templateType?: string
) {
  try {
    return await getContactTemplates(contactType, templateType);
  } catch (error) {
    console.error("Error in getContactTemplatesAction:", error);
    throw new Error("Failed to fetch contact templates");
  }
}

/**
 * Crear plantilla de respuesta
 */
export async function createContactTemplateAction(
  templateData: Omit<ContactTemplate, "id" | "created_at" | "updated_at">
) {
  try {
    // Validar datos requeridos
    if (!templateData.name || templateData.name.trim() === "") {
      throw new Error("Template name is required");
    }

    if (!templateData.subject || templateData.subject.trim() === "") {
      throw new Error("Template subject is required");
    }

    if (!templateData.content || templateData.content.trim() === "") {
      throw new Error("Template content is required");
    }

    // Validar tipos válidos
    const validTemplateTypes = [
      "response",
      "follow_up",
      "welcome",
      "thank_you",
    ];
    if (!validTemplateTypes.includes(templateData.template_type)) {
      throw new Error("Invalid template type");
    }

    return await createContactTemplate(templateData);
  } catch (error) {
    console.error("Error in createContactTemplateAction:", error);
    throw new Error("Failed to create contact template");
  }
}

// ================================================================
// ACCIONES DE ESTADÍSTICAS Y ANALYTICS
// ================================================================

/**
 * Obtener estadísticas del dashboard
 */
export async function getContactDashboardStatsAction(
  dateFrom?: string,
  dateTo?: string
) {
  try {
    return await getContactDashboardStats(dateFrom, dateTo);
  } catch (error) {
    console.error("Error in getContactDashboardStatsAction:", error);
    throw new Error("Failed to fetch contact dashboard stats");
  }
}

/**
 * Obtener contactos por rango de fechas
 */
export async function getContactsByDateRangeAction(
  startDate: string,
  endDate: string,
  limit?: number
) {
  try {
    if (!startDate || !endDate) {
      throw new Error("Start date and end date are required");
    }

    // Validar formato de fecha básico
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      throw new Error("Invalid date format. Use YYYY-MM-DD");
    }

    return await getContactsByDateRange(startDate, endDate, limit);
  } catch (error) {
    console.error("Error in getContactsByDateRangeAction:", error);
    throw new Error("Failed to fetch contacts by date range");
  }
}

/**
 * Obtener métricas de conversión
 */
export async function getContactConversionMetricsAction(
  dateFrom?: string,
  dateTo?: string
) {
  try {
    return await getContactConversionMetrics(dateFrom, dateTo);
  } catch (error) {
    console.error("Error in getContactConversionMetricsAction:", error);
    throw new Error("Failed to fetch contact conversion metrics");
  }
}

// ================================================================
// ACCIONES DE UTILIDAD
// ================================================================

/**
 * Validar email
 */
export async function validateEmailAction(email: string): Promise<boolean> {
  try {
    return validateEmail(email);
  } catch (error) {
    console.error("Error in validateEmailAction:", error);
    return false;
  }
}

/**
 * Sanitizar datos de contacto
 */
export async function sanitizeContactDataAction(
  data: ContactFormData
): Promise<ContactFormData> {
  try {
    return sanitizeContactData(data);
  } catch (error) {
    console.error("Error in sanitizeContactDataAction:", error);
    throw new Error("Failed to sanitize contact data");
  }
}

/**
 * Formatear contacto para display
 */
export async function formatContactForDisplayAction(contact: Contact) {
  try {
    return formatContactForDisplay(contact);
  } catch (error) {
    console.error("Error in formatContactForDisplayAction:", error);
    throw new Error("Failed to format contact for display");
  }
}

// ================================================================
// ACCIONES COMBINADAS (WORKFLOWS)
// ================================================================

/**
 * Workflow completo: Crear contacto y enviar respuesta automática
 */
export async function createContactWithAutoResponseAction(
  contactData: ContactFormData,
  sendAutoResponse: boolean = true
) {
  try {
    // Crear el contacto
    const contactResult = await createContactAction(contactData);

    if (!contactResult.success) {
      return contactResult;
    }

    // Type assertion to inform TypeScript about the expected structure
    const contactId = (contactResult.data as { contact_id: string })?.contact_id;

    if (sendAutoResponse && contactId) {
      // Enviar respuesta automática
      const responseResult = await sendAutoResponseAction(contactId);

      return {
        success: true,
        data: {
          contact: contactResult.data,
          autoResponse: responseResult.data,
        },
        message: "Contact created and auto-response sent successfully",
      };
    }

    return contactResult;
  } catch (error) {
    console.error("Error in createContactWithAutoResponseAction:", error);
    throw new Error("Failed to create contact with auto response");
  }
}

/**
 * Workflow: Procesar contacto (marcar como procesado + cambiar estado)
 */
export async function processContactAction(
  contactId: string,
  processedBy?: string,
  notes?: string,
  newStatus: Contact["status"] = "in_progress"
) {
  try {
    // Marcar como procesado
    const processedResult = await markContactAsProcessedAction(
      contactId,
      processedBy,
      notes
    );

    if (!processedResult.success) {
      return processedResult;
    }

    // Actualizar estado
    const statusResult = await updateContactStatusAction(
      contactId,
      newStatus,
      notes
    );

    return {
      success: statusResult.success,
      data: {
        processed: processedResult.data,
        status: statusResult.data,
      },
      message: "Contact processed successfully",
    };
  } catch (error) {
    console.error("Error in processContactAction:", error);
    throw new Error("Failed to process contact");
  }
}

/**
 * Obtener resumen completo de un contacto
 */
export async function getContactSummaryAction(contactId: string) {
  try {
    // Obtener datos del contacto
    const contactResult = await getContactByIdAction(contactId);

    if (!contactResult.success) {
      return contactResult;
    }

    // Obtener respuestas del contacto
    const responsesResult = await getContactResponsesAction(contactId);

    return {
      success: true,
      data: {
        contact: contactResult.data,
        responses: responsesResult.success ? responsesResult.data : [],
        summary: {
          total_responses: responsesResult.success
            ? (Array.isArray(responsesResult.data) ? responsesResult.data.length : 0)
            : 0,
          last_response:
            responsesResult.success &&
            Array.isArray(responsesResult.data) &&
            responsesResult.data.length > 0
              ? responsesResult.data[0].sent_at
              : null,
          formatted_contact: await formatContactForDisplayAction(
            contactResult.data as Contact
          ),
        },
      },
    };
  } catch (error) {
    console.error("Error in getContactSummaryAction:", error);
    throw new Error("Failed to fetch contact summary");
  }
}
