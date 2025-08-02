import { NextRequest, NextResponse } from "next/server";
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
} from "@/lib/contacts/contactsApi";
import { ContactFilters, ContactFormData } from "@/types/home/contact";

// ================================================================
// GET - OBTENER CONTACTOS CON DIFERENTES ACCIONES
// ================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    switch (action) {
      // ============================================================
      // OBTENER LISTA DE CONTACTOS CON FILTROS
      // ============================================================
      case "list":
        const filters: ContactFilters = {
          status: searchParams.get("status") || undefined,
          contact_type: searchParams.get("contact_type") || undefined,
          priority: searchParams.get("priority") || undefined,
          search: searchParams.get("search") || undefined,
          date_from: searchParams.get("date_from") || undefined,
          date_to: searchParams.get("date_to") || undefined,
          is_processed:
            searchParams.get("is_processed") === "true" || undefined,
          limit: searchParams.get("limit")
            ? parseInt(searchParams.get("limit")!)
            : 50,
          offset: searchParams.get("offset")
            ? parseInt(searchParams.get("offset")!)
            : 0,
        };

        const contactsResult = await getContacts(filters);
        return NextResponse.json(contactsResult);

      // ============================================================
      // OBTENER CONTACTO POR ID
      // ============================================================
      case "details":
        const contactId = searchParams.get("id");
        if (!contactId) {
          return NextResponse.json(
            { success: false, error: "Contact ID is required" },
            { status: 400 }
          );
        }

        const contactResult = await getContactById(contactId);
        return NextResponse.json(contactResult);

      // ============================================================
      // BUSCAR CONTACTOS POR TEXTO
      // ============================================================
      case "search":
        const searchTerm = searchParams.get("q");
        const searchLimit = searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : 20;

        if (!searchTerm) {
          return NextResponse.json(
            { success: false, error: "Search term is required" },
            { status: 400 }
          );
        }

        const searchResult = await searchContacts(searchTerm, searchLimit);
        return NextResponse.json(searchResult);

      // ============================================================
      // OBTENER RESPUESTAS DE UN CONTACTO
      // ============================================================
      case "responses":
        const responseContactId = searchParams.get("contact_id");
        if (!responseContactId) {
          return NextResponse.json(
            { success: false, error: "Contact ID is required" },
            { status: 400 }
          );
        }

        const responsesResult = await getContactResponses(responseContactId);
        return NextResponse.json(responsesResult);

      // ============================================================
      // OBTENER PLANTILLAS DE RESPUESTA
      // ============================================================
      case "templates":
        const templateContactType =
          searchParams.get("contact_type") || undefined;
        const templateType = searchParams.get("template_type") || undefined;

        const templatesResult = await getContactTemplates(
          templateContactType,
          templateType
        );
        return NextResponse.json(templatesResult);

      // ============================================================
      // OBTENER ESTADÍSTICAS DEL DASHBOARD
      // ============================================================
      case "dashboard-stats":
        const statsDateFrom = searchParams.get("date_from") || undefined;
        const statsDateTo = searchParams.get("date_to") || undefined;

        const dashboardStatsResult = await getContactDashboardStats(
          statsDateFrom,
          statsDateTo
        );
        return NextResponse.json(dashboardStatsResult);

      // ============================================================
      // OBTENER CONTACTOS POR RANGO DE FECHAS
      // ============================================================
      case "by-date-range":
        const startDate = searchParams.get("start_date");
        const endDate = searchParams.get("end_date");
        const dateRangeLimit = searchParams.get("limit")
          ? parseInt(searchParams.get("limit")!)
          : 100;

        if (!startDate || !endDate) {
          return NextResponse.json(
            { success: false, error: "Start date and end date are required" },
            { status: 400 }
          );
        }

        const dateRangeResult = await getContactsByDateRange(
          startDate,
          endDate,
          dateRangeLimit
        );
        return NextResponse.json(dateRangeResult);

      // ============================================================
      // OBTENER MÉTRICAS DE CONVERSIÓN
      // ============================================================
      case "conversion-metrics":
        const metricsDateFrom = searchParams.get("date_from") || undefined;
        const metricsDateTo = searchParams.get("date_to") || undefined;

        const conversionMetricsResult = await getContactConversionMetrics(
          metricsDateFrom,
          metricsDateTo
        );
        return NextResponse.json(conversionMetricsResult);

      // ============================================================
      // ACCIÓN POR DEFECTO - OBTENER TODOS LOS CONTACTOS
      // ============================================================
      default:
        const defaultResult = await getContacts();
        return NextResponse.json(defaultResult);
    }
  } catch (error) {
    console.error("GET API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ================================================================
// POST - CREAR CONTACTOS Y EJECUTAR ACCIONES
// ================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      // ============================================================
      // CREAR NUEVO CONTACTO
      // ============================================================
      case "create-contact":
        if (!body.data) {
          return NextResponse.json(
            { success: false, error: "Contact data is required" },
            { status: 400 }
          );
        }

        // Validar datos requeridos
        const {
          full_name,
          email,
          subject: contact_subject,
          message,
        } = body.data;
        if (!full_name || !email || !contact_subject || !message) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Missing required fields: full_name, email, subject, message",
            },
            { status: 400 }
          );
        }

        // Validar formato de email
        if (!validateEmail(email)) {
          return NextResponse.json(
            { success: false, error: "Invalid email format" },
            { status: 400 }
          );
        }

        // Sanitizar datos
        const sanitizedData = sanitizeContactData(body.data as ContactFormData);

        const createResult = await createContact(sanitizedData);

        if (!createResult.success) {
          return NextResponse.json(createResult, { status: 400 });
        }

        return NextResponse.json(createResult, { status: 201 });

      // ============================================================
      // MARCAR CONTACTO COMO PROCESADO
      // ============================================================
      case "mark-processed":
        if (!body.contact_id) {
          return NextResponse.json(
            { success: false, error: "Contact ID is required" },
            { status: 400 }
          );
        }

        const processedResult = await markContactAsProcessed(
          body.contact_id,
          body.processed_by,
          body.notes
        );
        return NextResponse.json(processedResult);

      // ============================================================
      // ENVIAR RESPUESTA AUTOMÁTICA
      // ============================================================
      case "send-auto-response":
        if (!body.contact_id) {
          return NextResponse.json(
            { success: false, error: "Contact ID is required" },
            { status: 400 }
          );
        }

        const autoResponseResult = await sendAutoResponse(
          body.contact_id,
          body.template_id
        );
        return NextResponse.json(autoResponseResult);

      // ============================================================
      // CREAR RESPUESTA MANUAL
      // ============================================================
      case "create-response":
        if (!body.contact_id || !body.response_data) {
          return NextResponse.json(
            {
              success: false,
              error: "Contact ID and response data are required",
            },
            { status: 400 }
          );
        }

        if (!body.response_data.message) {
          return NextResponse.json(
            { success: false, error: "Response message is required" },
            { status: 400 }
          );
        }

        const responseResult = await createContactResponse(
          body.contact_id,
          body.response_data
        );
        return NextResponse.json(responseResult);

      // ============================================================
      // CREAR PLANTILLA DE RESPUESTA
      // ============================================================
      case "create-template":
        if (!body.template_data) {
          return NextResponse.json(
            { success: false, error: "Template data is required" },
            { status: 400 }
          );
        }

        const { name, subject, content, template_type, contact_type } =
          body.template_data;
        if (!name || !subject || !content || !template_type || !contact_type) {
          return NextResponse.json(
            { success: false, error: "Missing required template fields" },
            { status: 400 }
          );
        }

        const templateResult = await createContactTemplate(body.template_data);
        return NextResponse.json(templateResult);

      // ============================================================
      // BUSCAR CONTACTOS (POST para búsquedas complejas)
      // ============================================================
      case "search":
        if (!body.search_term) {
          return NextResponse.json(
            { success: false, error: "Search term is required" },
            { status: 400 }
          );
        }

        const searchPostResult = await searchContacts(
          body.search_term,
          body.limit || 20
        );
        return NextResponse.json(searchPostResult);

      // ============================================================
      // ACCIÓN INVÁLIDA
      // ============================================================
      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("POST API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ================================================================
// PUT - ACTUALIZAR CONTACTOS
// ================================================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, contact_id } = body;

    if (!contact_id) {
      return NextResponse.json(
        { success: false, error: "Contact ID is required" },
        { status: 400 }
      );
    }

    switch (action) {
      // ============================================================
      // ACTUALIZAR ESTADO DEL CONTACTO
      // ============================================================
      case "update-status":
        if (!body.status) {
          return NextResponse.json(
            { success: false, error: "Status is required" },
            { status: 400 }
          );
        }

        // Validar estado válido
        const validStatuses = [
          "new",
          "in_progress",
          "pending",
          "resolved",
          "closed",
        ];
        if (!validStatuses.includes(body.status)) {
          return NextResponse.json(
            { success: false, error: "Invalid status" },
            { status: 400 }
          );
        }

        const statusResult = await updateContactStatus(
          contact_id,
          body.status,
          body.notes
        );
        return NextResponse.json(statusResult);

      // ============================================================
      // ACTUALIZAR PRIORIDAD DEL CONTACTO
      // ============================================================
      case "update-priority":
        if (!body.priority) {
          return NextResponse.json(
            { success: false, error: "Priority is required" },
            { status: 400 }
          );
        }

        // Validar prioridad válida
        const validPriorities = ["low", "medium", "high", "urgent"];
        if (!validPriorities.includes(body.priority)) {
          return NextResponse.json(
            { success: false, error: "Invalid priority" },
            { status: 400 }
          );
        }

        const priorityResult = await updateContactPriority(
          contact_id,
          body.priority
        );
        return NextResponse.json(priorityResult);

      // ============================================================
      // AGREGAR TAGS AL CONTACTO
      // ============================================================
      case "add-tags":
        if (!body.tags || !Array.isArray(body.tags)) {
          return NextResponse.json(
            { success: false, error: "Tags array is required" },
            { status: 400 }
          );
        }

        // Filtrar tags vacías y duplicadas
        const cleanTags = [
          ...new Set(body.tags.filter((tag: string) => tag.trim())),
        ];

        if (cleanTags.length === 0) {
          return NextResponse.json(
            { success: false, error: "At least one valid tag is required" },
            { status: 400 }
          );
        }

        const tagsResult = await addContactTags(
          contact_id,
          cleanTags as string[]
        );
        return NextResponse.json(tagsResult);

      // ============================================================
      // ACCIÓN INVÁLIDA
      // ============================================================
      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("PUT API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ================================================================
// DELETE - ELIMINAR CONTACTOS (OPCIONAL)
// ================================================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("id");
    const action = searchParams.get("action");

    if (!contactId) {
      return NextResponse.json(
        { success: false, error: "Contact ID is required" },
        { status: 400 }
      );
    }

    switch (action) {
      // ============================================================
      // SOFT DELETE (MARCAR COMO INACTIVO)
      // ============================================================
      case "soft-delete":
        // En lugar de eliminar, marcar como cerrado/inactivo
        const softDeleteResult = await updateContactStatus(
          contactId,
          "closed",
          "Contact marked as deleted"
        );
        return NextResponse.json(softDeleteResult);

      // ============================================================
      // HARD DELETE (ELIMINAR PERMANENTEMENTE) - CUIDADO!
      // ============================================================
      case "hard-delete":
        // NOTA: Implementar solo si es realmente necesario
        // Por seguridad, no implementamos eliminación permanente por defecto
        return NextResponse.json(
          { success: false, error: "Hard delete not implemented for security" },
          { status: 403 }
        );

      // ============================================================
      // ACCIÓN POR DEFECTO - SOFT DELETE
      // ============================================================
      default:
        const defaultDeleteResult = await updateContactStatus(
          contactId,
          "closed",
          "Contact archived"
        );
        return NextResponse.json(defaultDeleteResult);
    }
  } catch (error) {
    console.error("DELETE API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ================================================================
// PATCH - ACTUALIZACIONES PARCIALES
// ================================================================

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { contact_id, updates } = body;

    if (!contact_id) {
      return NextResponse.json(
        { success: false, error: "Contact ID is required" },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { success: false, error: "Updates object is required" },
        { status: 400 }
      );
    }

    // Aquí puedes implementar actualizaciones parciales específicas
    // Por ejemplo, actualizar múltiples campos a la vez

    // Por ahora, redirigimos a las funciones específicas según el campo
    const results = [];

    if (updates.status) {
      const statusResult = await updateContactStatus(
        contact_id,
        updates.status,
        updates.notes
      );
      results.push({ field: "status", result: statusResult });
    }

    if (updates.priority) {
      const priorityResult = await updateContactPriority(
        contact_id,
        updates.priority
      );
      results.push({ field: "priority", result: priorityResult });
    }

    if (updates.tags) {
      const tagsResult = await addContactTags(contact_id, updates.tags);
      results.push({ field: "tags", result: tagsResult });
    }

    // Verificar si todas las actualizaciones fueron exitosas
    const allSuccessful = results.every((r) => r.result.success);

    return NextResponse.json({
      success: allSuccessful,
      message: allSuccessful ? "All updates successful" : "Some updates failed",
      results,
    });
  } catch (error) {
    console.error("PATCH API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
