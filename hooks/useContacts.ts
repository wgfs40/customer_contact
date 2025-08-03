"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  createContactWithAutoResponseAction,
  getContactsAction,
  getContactByIdAction,
  searchContactsAction,
  markContactAsProcessedAction,
  updateContactStatusAction,
  updateContactPriorityAction,
  addContactTagsAction,
  sendAutoResponseAction,
  getContactResponsesAction,
  createContactResponseAction,
  getContactTemplatesAction,
  createContactTemplateAction,
  getContactDashboardStatsAction,
  getContactConversionMetricsAction,
  processContactAction,
  getContactSummaryAction,
  validateEmailAction,
} from "@/actions/contacts_actions";
import {
  Contact,
  ContactWithDetails,
  ContactFormData,
  ContactFilters,
  ContactResponse,
  ContactTemplate,
  ContactStats,
  ContactData,
} from "@/types/home/contact";

// ================================================================
// TIPOS PARA EL MANEJO DE ERRORES
// ================================================================

interface DatabaseError {
  code?: string;
  message: string;
  details?: unknown;
  hint?: string;
}

interface ContactError {
  type: "validation" | "database" | "network" | "permission" | "unknown";
  message: string;
  code?: string;
  details?: unknown;
  timestamp: string;
  retryable: boolean;
}

// ================================================================
// TIPOS PARA EL HOOK
// ================================================================

interface UseContactsState {
  contacts: ContactWithDetails[];
  currentContact: ContactWithDetails | null;
  contactResponses: ContactResponse[];
  templates: ContactTemplate[];
  dashboardStats: ContactStats | null;
  conversionMetrics: unknown;
  loading: boolean;
  error: string | null;
  lastError: ContactError | null;
  searchResults: Contact[];
  searchLoading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface UseContactsFilters extends ContactFilters {
  autoLoad?: boolean;
}

interface UseContactsReturn extends UseContactsState {
  // Valores computados
  hasActiveFilters: boolean;
  contactsByStatus: Record<string, ContactWithDetails[]>;
  contactsByPriority: Record<string, ContactWithDetails[]>;

  // Operaciones CRUD
  createContact: (
    data: ContactFormData,
    sendAutoResponse?: boolean
  ) => Promise<boolean>;
  refreshContacts: () => Promise<void>;
  loadContact: (id: string) => Promise<void>;
  searchContacts: (term: string) => Promise<void>;
  clearSearch: () => void;

  // Gestión de contactos
  markAsProcessed: (
    contactId: string,
    processedBy?: string,
    notes?: string
  ) => Promise<boolean>;
  updateStatus: (
    contactId: string,
    status: Contact["status"],
    notes?: string
  ) => Promise<boolean>;
  updatePriority: (
    contactId: string,
    priority: Contact["priority"]
  ) => Promise<boolean>;
  addTags: (contactId: string, tags: string[]) => Promise<boolean>;
  processContact: (
    contactId: string,
    processedBy?: string,
    notes?: string
  ) => Promise<boolean>;

  // Respuestas
  sendAutoResponse: (
    contactId: string,
    templateId?: string
  ) => Promise<boolean>;
  loadContactResponses: (contactId: string) => Promise<void>;
  createResponse: (
    contactId: string,
    responseData: ContactResponse
  ) => Promise<boolean>;

  // Plantillas
  loadTemplates: (contactType?: string, templateType?: string) => Promise<void>;
  createTemplate: (templateData: ContactTemplate) => Promise<boolean>;

  // Estadísticas
  loadDashboardStats: (dateFrom?: string, dateTo?: string) => Promise<void>;
  loadConversionMetrics: (dateFrom?: string, dateTo?: string) => Promise<void>;

  // Utilidades
  validateEmail: (email: string) => Promise<boolean>;
  getContactSummary: (contactId: string) => Promise<unknown>;

  // Filtros y paginación
  updateFilters: (newFilters: Partial<ContactFilters>) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;

  // Estado y errores
  clearError: () => void;
  setCurrentContact: (contact: ContactWithDetails | null) => void;
  retryLastOperation: () => Promise<void>;
  isRetryable: boolean;
  getDetailedError: () => ContactError | null;
}

// ================================================================
// FUNCIONES DE MANEJO DE ERRORES
// ================================================================

const createContactError = (
  error: unknown,
  context: string,
  fallbackMessage: string
): ContactError => {
  const timestamp = new Date().toISOString();

  // Error de base de datos específico
  if (error && typeof error === "object" && "code" in error) {
    const dbError = error as DatabaseError;

    switch (dbError.code) {
      case "42501": // RLS Policy violation
        return {
          type: "permission",
          message: "Error de permisos. Por favor contacta al administrador.",
          code: dbError.code,
          details: dbError,
          timestamp,
          retryable: false,
        };

      case "23505": // Unique violation
        return {
          type: "validation",
          message: "Ya existe un registro con esta información.",
          code: dbError.code,
          details: dbError,
          timestamp,
          retryable: false,
        };

      case "23503": // Foreign key violation
        return {
          type: "validation",
          message: "Error de relación en los datos. Verifica la información.",
          code: dbError.code,
          details: dbError,
          timestamp,
          retryable: false,
        };

      case "23502": // Not null violation
        return {
          type: "validation",
          message: "Faltan campos requeridos.",
          code: dbError.code,
          details: dbError,
          timestamp,
          retryable: false,
        };

      case "42883": // Function does not exist
        return {
          type: "database",
          message: "Error de configuración del servidor.",
          code: dbError.code,
          details: dbError,
          timestamp,
          retryable: false,
        };

      case "PGRST116": // PostgREST - Schema cache load
        return {
          type: "database",
          message: "Error temporal del servidor. Intenta nuevamente.",
          code: dbError.code,
          details: dbError,
          timestamp,
          retryable: true,
        };

      case "08006": // Connection failure
      case "08001": // Unable to connect
        return {
          type: "network",
          message: "Error de conexión. Verifica tu conexión a internet.",
          code: dbError.code,
          details: dbError,
          timestamp,
          retryable: true,
        };

      case "57014": // Query canceled
        return {
          type: "database",
          message: "La operación tardó demasiado. Intenta nuevamente.",
          code: dbError.code,
          details: dbError,
          timestamp,
          retryable: true,
        };

      case "53300": // Too many connections
        return {
          type: "database",
          message: "Servidor sobrecargado. Intenta en unos minutos.",
          code: dbError.code,
          details: dbError,
          timestamp,
          retryable: true,
        };

      default:
        return {
          type: "database",
          message: `Error de base de datos: ${
            dbError.message || fallbackMessage
          }`,
          code: dbError.code,
          details: dbError,
          timestamp,
          retryable: true,
        };
    }
  }

  // Error de JavaScript/TypeScript
  if (error instanceof Error) {
    // Errores de red
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return {
        type: "network",
        message: "Error de conexión. Verifica tu conexión a internet.",
        details: error,
        timestamp,
        retryable: true,
      };
    }

    // Errores de validación
    if (
      error.message.includes("validation") ||
      error.message.includes("required")
    ) {
      return {
        type: "validation",
        message: error.message,
        details: error,
        timestamp,
        retryable: false,
      };
    }

    return {
      type: "unknown",
      message: error.message || fallbackMessage,
      details: error,
      timestamp,
      retryable: true,
    };
  }

  // Error de respuesta de API
  if (error && typeof error === "object" && "message" in error) {
    const apiError = error as { message: string; error?: string };
    return {
      type: "unknown",
      message: apiError.message || apiError.error || fallbackMessage,
      details: error,
      timestamp,
      retryable: true,
    };
  }

  // Error desconocido
  return {
    type: "unknown",
    message: fallbackMessage,
    details: error,
    timestamp,
    retryable: true,
  };
};

const getErrorMessage = (contactError: ContactError): string => {
  // Mensajes más amigables según el tipo de error
  switch (contactError.type) {
    case "validation":
      return contactError.message;
    case "permission":
      return "No tienes permisos para realizar esta acción.";
    case "network":
      return "Error de conexión. Verifica tu internet e intenta nuevamente.";
    case "database":
      if (contactError.retryable) {
        return "Error temporal del servidor. Intenta nuevamente en unos segundos.";
      }
      return "Error del servidor. Por favor contacta al soporte.";
    default:
      return contactError.message || "Ha ocurrido un error inesperado.";
  }
};

// ================================================================
// HOOK PRINCIPAL
// ================================================================

export const useContacts = (
  initialFilters: UseContactsFilters = { autoLoad: true }
): UseContactsReturn => {
  // ================================================================
  // ESTADO
  // ================================================================

  const [state, setState] = useState<UseContactsState>({
    contacts: [],
    currentContact: null,
    contactResponses: [],
    templates: [],
    dashboardStats: null,
    conversionMetrics: null,
    loading: false,
    error: null,
    lastError: null,
    searchResults: [],
    searchLoading: false,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 20,
    },
  });

  const [filters, setFilters] = useState<ContactFilters>(() => {
    return {
      limit: 20,
      offset: 0,
      ...initialFilters,
    };
  });

  // Para retry de operaciones
  const [lastOperation, setLastOperation] = useState<{
    type: string;
    params: unknown[];
  } | null>(null);

  // ================================================================
  // FUNCIONES AUXILIARES MEJORADAS
  // ================================================================

  const handleError = useCallback(
    (error: unknown, context: string, fallbackMessage: string) => {
      console.error(`[${context}]`, error);

      const contactError = createContactError(error, context, fallbackMessage);
      const userMessage = getErrorMessage(contactError);

      setState((prev) => ({
        ...prev,
        error: userMessage,
        lastError: contactError,
        loading: false,
        searchLoading: false,
      }));

      // Mostrar toast con mensaje apropiado
      if (contactError.type === "validation") {
        toast.error(userMessage);
      } else if (contactError.retryable) {
        toast.error(userMessage, {
          action: {
            label: "Reintentar",
            onClick: () => {
              // El retry se maneja en el componente
            },
          },
        });
      } else {
        toast.error(userMessage);
      }
    },
    []
  );

  const handleSuccess = useCallback((message: string) => {
    setState((prev) => ({
      ...prev,
      error: null,
      lastError: null,
    }));
    toast.success(message);
  }, []);

  // Función para validaciones previas
  const validateContactData = useCallback(
    (data: ContactFormData): ContactError | null => {
      if (!data.full_name?.trim()) {
        return createContactError(
          new Error("El nombre es requerido"),
          "validation",
          "El nombre es requerido"
        );
      }

      if (!data.email?.trim()) {
        return createContactError(
          new Error("El email es requerido"),
          "validation",
          "El email es requerido"
        );
      }

      // Validación básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return createContactError(
          new Error("El formato del email no es válido"),
          "validation",
          "El formato del email no es válido"
        );
      }

      if (!data.subject?.trim()) {
        return createContactError(
          new Error("El asunto es requerido"),
          "validation",
          "El asunto es requerido"
        );
      }

      if (!data.message?.trim()) {
        return createContactError(
          new Error("El mensaje es requerido"),
          "validation",
          "El mensaje es requerido"
        );
      }

      if (data.message.trim().length < 10) {
        return createContactError(
          new Error("El mensaje debe tener al menos 10 caracteres"),
          "validation",
          "El mensaje debe tener al menos 10 caracteres"
        );
      }

      return null;
    },
    []
  );

  // ================================================================
  // OPERACIONES CRUD MEJORADAS
  // ================================================================

  const refreshContacts = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        lastError: null,
      }));
      setLastOperation({ type: "refreshContacts", params: [] });

      const result = await getContactsAction(filters);

      if (result.success) {
        setState((prev) => {
          const contacts = Array.isArray(result.data) ? result.data : [];
          return {
            ...prev,
            contacts,
            pagination: {
              ...prev.pagination,
              totalItems: contacts.length,
              totalPages: Math.ceil(contacts.length / filters.limit!),
            },
            loading: false,
          };
        });
      } else {
        throw new Error(result.error || "Error al cargar contactos");
      }
    } catch (error) {
      handleError(error, "refreshContacts", "Error al cargar contactos");
    }
  }, [filters, handleError]);

  // ================================================================
  // UTILIDADES MEJORADAS
  // ================================================================

  const validateEmail = useCallback(async (email: string): Promise<boolean> => {
    try {
      const result = await validateEmailAction(email);
      return result;
    } catch (error) {
      console.error("Error validating email:", error);
      return false;
    }
  }, []);

  const createContact = useCallback(
    async (
      data: ContactFormData,
      sendAutoResponse: boolean = true
    ): Promise<boolean> => {
      try {
        // Validaciones previas
        const validationError = validateContactData(data);
        if (validationError) {
          setState((prev) => ({
            ...prev,
            error: getErrorMessage(validationError),
            lastError: validationError,
          }));
          toast.error(getErrorMessage(validationError));
          return false;
        }

        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "createContact",
          params: [data, sendAutoResponse],
        });

        // Validar email con el servidor si es necesario
        const isValidEmail = await validateEmail(data.email);
        if (!isValidEmail) {
          const emailError = createContactError(
            new Error("El email no es válido"),
            "validation",
            "El email no es válido"
          );
          setState((prev) => ({
            ...prev,
            error: getErrorMessage(emailError),
            lastError: emailError,
            loading: false,
          }));
          toast.error(getErrorMessage(emailError));
          return false;
        }

        const result = await createContactWithAutoResponseAction(
          data,
          sendAutoResponse
        );

        if (result.success) {
          handleSuccess("Contacto creado exitosamente");
          // Recargar la lista de contactos
          await refreshContacts();
          return true;
        } else {
          const errorMessage =
            (result.data as ContactData) || "Error al crear contacto";

          throw new Error(errorMessage.message || "Error al crear contacto");
        }
      } catch (error) {
        handleError(error, "createContact", "Error al crear contacto");
        return false;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [
      validateContactData,
      validateEmail,
      handleError,
      handleSuccess,
      refreshContacts,
    ]
  );

  const loadContact = useCallback(
    async (id: string): Promise<void> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({ type: "loadContact", params: [id] });

        const result = await getContactByIdAction(id);

        if (result.success) {
          setState((prev) => ({
            ...prev,
            currentContact: result.data as ContactWithDetails,
            loading: false,
          }));
        } else {
          throw new Error(result.error || "Error al cargar contacto");
        }
      } catch (error) {
        handleError(error, "loadContact", "Error al cargar contacto");
      }
    },
    [handleError]
  );

  const searchContacts = useCallback(
    async (term: string): Promise<void> => {
      try {
        setState((prev) => ({
          ...prev,
          searchLoading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({ type: "searchContacts", params: [term] });

        if (!term.trim()) {
          setState((prev) => ({
            ...prev,
            searchResults: [],
            searchLoading: false,
          }));
          return;
        }

        const result = await searchContactsAction(term);

        if (result.success) {
          setState((prev) => ({
            ...prev,
            searchResults: Array.isArray(result.data) ? result.data : [],
            searchLoading: false,
          }));
        } else {
          throw new Error(result.error || "Error en la búsqueda");
        }
      } catch (error) {
        handleError(error, "searchContacts", "Error en la búsqueda");
      }
    },
    [handleError]
  );

  const clearSearch = useCallback(() => {
    setState((prev) => ({ ...prev, searchResults: [], searchLoading: false }));
  }, []);

  // ================================================================
  // GESTIÓN DE CONTACTOS MEJORADA
  // ================================================================

  const markAsProcessed = useCallback(
    async (
      contactId: string,
      processedBy?: string,
      notes?: string
    ): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "markAsProcessed",
          params: [contactId, processedBy, notes],
        });

        const result = await markContactAsProcessedAction(
          contactId,
          processedBy,
          notes
        );

        if (result.success) {
          handleSuccess("Contacto marcado como procesado");
          await refreshContacts();

          // Actualizar contacto actual si es el mismo
          if (state.currentContact?.id === contactId) {
            await loadContact(contactId);
          }

          return true;
        } else {
          throw new Error(result.error || "Error al marcar como procesado");
        }
      } catch (error) {
        handleError(error, "markAsProcessed", "Error al marcar como procesado");
        return false;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [
      state.currentContact?.id,
      handleError,
      handleSuccess,
      loadContact,
      refreshContacts,
    ]
  );

  const updateStatus = useCallback(
    async (
      contactId: string,
      status: Contact["status"],
      notes?: string
    ): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "updateStatus",
          params: [contactId, status, notes],
        });

        const result = await updateContactStatusAction(
          contactId,
          status,
          notes
        );

        if (result.success) {
          handleSuccess("Estado actualizado exitosamente");
          await refreshContacts();

          // Actualizar contacto actual si es el mismo
          if (state.currentContact?.id === contactId) {
            await loadContact(contactId);
          }

          return true;
        } else {
          throw new Error(result.error || "Error al actualizar estado");
        }
      } catch (error) {
        handleError(error, "updateStatus", "Error al actualizar estado");
        return false;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [
      state.currentContact?.id,
      handleError,
      handleSuccess,
      loadContact,
      refreshContacts,
    ]
  );

  const updatePriority = useCallback(
    async (
      contactId: string,
      priority: Contact["priority"]
    ): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "updatePriority",
          params: [contactId, priority],
        });

        const result = await updateContactPriorityAction(contactId, priority);

        if (result.success) {
          handleSuccess("Prioridad actualizada exitosamente");
          await refreshContacts();

          // Actualizar contacto actual si es el mismo
          if (state.currentContact?.id === contactId) {
            await loadContact(contactId);
          }

          return true;
        } else {
          throw new Error(result.error || "Error al actualizar prioridad");
        }
      } catch (error) {
        handleError(error, "updatePriority", "Error al actualizar prioridad");
        return false;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [
      state.currentContact?.id,
      handleError,
      handleSuccess,
      loadContact,
      refreshContacts,
    ]
  );

  const addTags = useCallback(
    async (contactId: string, tags: string[]): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({ type: "addTags", params: [contactId, tags] });

        const result = await addContactTagsAction(contactId, tags);

        if (result.success) {
          handleSuccess("Etiquetas agregadas exitosamente");
          await refreshContacts();

          // Actualizar contacto actual si es el mismo
          if (state.currentContact?.id === contactId) {
            await loadContact(contactId);
          }

          return true;
        } else {
          throw new Error(result.error || "Error al agregar etiquetas");
        }
      } catch (error) {
        handleError(error, "addTags", "Error al agregar etiquetas");
        return false;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [
      state.currentContact?.id,
      handleError,
      handleSuccess,
      loadContact,
      refreshContacts,
    ]
  );

  const processContact = useCallback(
    async (
      contactId: string,
      processedBy?: string,
      notes?: string
    ): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "processContact",
          params: [contactId, processedBy, notes],
        });

        const result = await processContactAction(
          contactId,
          processedBy,
          notes
        );

        if (result.success) {
          handleSuccess("Contacto procesado exitosamente");
          await refreshContacts();

          // Actualizar contacto actual si es el mismo
          if (state.currentContact?.id === contactId) {
            await loadContact(contactId);
          }

          return true;
        } else {
          throw new Error(result.error || "Error al procesar contacto");
        }
      } catch (error) {
        handleError(error, "processContact", "Error al procesar contacto");
        return false;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [
      state.currentContact?.id,
      handleError,
      handleSuccess,
      loadContact,
      refreshContacts,
    ]
  );

  // ================================================================
  // RESPUESTAS MEJORADAS
  // ================================================================

  const loadContactResponses = useCallback(
    async (contactId: string): Promise<void> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({ type: "loadContactResponses", params: [contactId] });

        const result = await getContactResponsesAction(contactId);

        if (result.success) {
          setState((prev) => ({
            ...prev,
            contactResponses: Array.isArray(result.data) ? result.data : [],
            loading: false,
          }));
        } else {
          throw new Error(result.error || "Error al cargar respuestas");
        }
      } catch (error) {
        handleError(
          error,
          "loadContactResponses",
          "Error al cargar respuestas"
        );
      }
    },
    [handleError]
  );

  const sendAutoResponse = useCallback(
    async (contactId: string, templateId?: string): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "sendAutoResponse",
          params: [contactId, templateId],
        });

        const result = await sendAutoResponseAction(contactId, templateId);

        if (result.success) {
          handleSuccess("Respuesta automática enviada");

          // Recargar respuestas del contacto
          await loadContactResponses(contactId);

          return true;
        } else {
          throw new Error(
            result.error || "Error al enviar respuesta automática"
          );
        }
      } catch (error) {
        handleError(
          error,
          "sendAutoResponse",
          "Error al enviar respuesta automática"
        );
        return false;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [handleError, handleSuccess, loadContactResponses]
  );

  const createResponse = useCallback(
    async (
      contactId: string,
      responseData: ContactResponse
    ): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "createResponse",
          params: [contactId, responseData],
        });

        const result = await createContactResponseAction(
          contactId,
          responseData
        );

        if (result.success) {
          handleSuccess("Respuesta creada exitosamente");

          // Recargar respuestas del contacto
          await loadContactResponses(contactId);

          return true;
        } else {
          throw new Error(result.error || "Error al crear respuesta");
        }
      } catch (error) {
        handleError(error, "createResponse", "Error al crear respuesta");
        return false;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [handleError, handleSuccess, loadContactResponses]
  );

  // ================================================================
  // PLANTILLAS MEJORADAS
  // ================================================================

  const loadTemplates = useCallback(
    async (contactType?: string, templateType?: string): Promise<void> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "loadTemplates",
          params: [contactType, templateType],
        });

        const result = await getContactTemplatesAction(
          contactType,
          templateType
        );

        if (result.success) {
          setState((prev) => ({
            ...prev,
            templates: Array.isArray(result.data) ? result.data : [],
            loading: false,
          }));
        } else {
          throw new Error(result.error || "Error al cargar plantillas");
        }
      } catch (error) {
        handleError(error, "loadTemplates", "Error al cargar plantillas");
      }
    },
    [handleError]
  );

  const createTemplate = useCallback(
    async (templateData: ContactTemplate): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({ type: "createTemplate", params: [templateData] });

        const result = await createContactTemplateAction(templateData);

        if (result.success) {
          handleSuccess("Plantilla creada exitosamente");

          // Recargar plantillas
          await loadTemplates();

          return true;
        } else {
          throw new Error(result.error || "Error al crear plantilla");
        }
      } catch (error) {
        handleError(error, "createTemplate", "Error al crear plantilla");
        return false;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [handleError, handleSuccess, loadTemplates]
  );

  // ================================================================
  // ESTADÍSTICAS MEJORADAS
  // ================================================================

  const loadDashboardStats = useCallback(
    async (dateFrom?: string, dateTo?: string): Promise<void> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "loadDashboardStats",
          params: [dateFrom, dateTo],
        });

        const result = await getContactDashboardStatsAction(dateFrom, dateTo);

        if (result.success) {
          setState((prev) => ({
            ...prev,
            dashboardStats: result.data as ContactStats,
            loading: false,
          }));
        } else {
          throw new Error(result.error || "Error al cargar estadísticas");
        }
      } catch (error) {
        handleError(
          error,
          "loadDashboardStats",
          "Error al cargar estadísticas"
        );
      }
    },
    [handleError]
  );

  const loadConversionMetrics = useCallback(
    async (dateFrom?: string, dateTo?: string): Promise<void> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({
          type: "loadConversionMetrics",
          params: [dateFrom, dateTo],
        });

        const result = await getContactConversionMetricsAction(
          dateFrom,
          dateTo
        );

        if (result.success) {
          setState((prev) => ({
            ...prev,
            conversionMetrics: result.data,
            loading: false,
          }));
        } else {
          throw new Error(
            result.error || "Error al cargar métricas de conversión"
          );
        }
      } catch (error) {
        handleError(
          error,
          "loadConversionMetrics",
          "Error al cargar métricas de conversión"
        );
      }
    },
    [handleError]
  );

  const getContactSummary = useCallback(
    async (contactId: string): Promise<unknown> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          lastError: null,
        }));
        setLastOperation({ type: "getContactSummary", params: [contactId] });

        const result = await getContactSummaryAction(contactId);

        if (result.success) {
          setState((prev) => ({ ...prev, loading: false }));
          return result.data;
        } else {
          throw new Error(
            result.error || "Error al obtener resumen del contacto"
          );
        }
      } catch (error) {
        handleError(
          error,
          "getContactSummary",
          "Error al obtener resumen del contacto"
        );
        return null;
      }
    },
    [handleError]
  );

  // ================================================================
  // RETRY FUNCTIONALITY
  // ================================================================

  const retryLastOperation = useCallback(async (): Promise<void> => {
    if (!lastOperation || !state.lastError?.retryable) {
      return;
    }

    try {
      setState((prev) => ({ ...prev, error: null, lastError: null }));

      switch (lastOperation.type) {
        case "refreshContacts":
          await refreshContacts();
          break;
        case "createContact":
          await createContact(
            ...(lastOperation.params as [ContactFormData, boolean?])
          );
          break;
        case "loadContact":
          await loadContact(...(lastOperation.params as [string]));
          break;
        case "searchContacts":
          await searchContacts(...(lastOperation.params as [string]));
          break;
        case "markAsProcessed":
          await markAsProcessed(
            ...(lastOperation.params as [string, string?, string?])
          );
          break;
        case "updateStatus":
          await updateStatus(
            ...(lastOperation.params as [string, Contact["status"], string?])
          );
          break;
        case "updatePriority":
          await updatePriority(
            ...(lastOperation.params as [string, Contact["priority"]])
          );
          break;
        case "addTags":
          await addTags(...(lastOperation.params as [string, string[]]));
          break;
        case "processContact":
          await processContact(
            ...(lastOperation.params as [string, string?, string?])
          );
          break;
        case "loadContactResponses":
          await loadContactResponses(...(lastOperation.params as [string]));
          break;
        case "sendAutoResponse":
          await sendAutoResponse(
            ...(lastOperation.params as [string, string?])
          );
          break;
        case "createResponse":
          await createResponse(
            ...(lastOperation.params as [string, ContactResponse])
          );
          break;
        case "loadTemplates":
          await loadTemplates(...lastOperation.params);
          break;
        case "createTemplate":
          await createTemplate(...(lastOperation.params as [ContactTemplate]));
          break;
        case "loadDashboardStats":
          await loadDashboardStats(...lastOperation.params);
          break;
        case "loadConversionMetrics":
          await loadConversionMetrics(...lastOperation.params);
          break;
        case "getContactSummary":
          await getContactSummary(...(lastOperation.params as [string]));
          break;
        default:
          console.warn("Unknown operation type for retry:", lastOperation.type);
      }
    } catch (error) {
      console.error("Retry failed:", error);
      // El error se manejará en la función específica
    }
  }, [
    lastOperation,
    state.lastError,
    refreshContacts,
    createContact,
    loadContact,
    searchContacts,
    markAsProcessed,
    updateStatus,
    updatePriority,
    addTags,
    processContact,
    loadContactResponses,
    sendAutoResponse,
    createResponse,
    loadTemplates,
    createTemplate,
    loadDashboardStats,
    loadConversionMetrics,
    getContactSummary,
  ]);

  // ================================================================
  // FILTROS Y PAGINACIÓN
  // ================================================================

  const updateFilters = useCallback((newFilters: Partial<ContactFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      offset: 0, // Reset offset when filters change
    }));

    setState((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        currentPage: 1,
      },
    }));
  }, []);

  const setPage = useCallback(
    (page: number) => {
      const offset = (page - 1) * (filters.limit || 20);

      setFilters((prev) => ({ ...prev, offset }));

      setState((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          currentPage: page,
        },
      }));
    },
    [filters.limit]
  );

  const resetFilters = useCallback(() => {
    setFilters({
      limit: 20,
      offset: 0,
    });

    setState((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        currentPage: 1,
      },
    }));
  }, []);

  // ================================================================
  // ESTADO MEJORADO
  // ================================================================

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, lastError: null }));
    setLastOperation(null);
  }, []);

  const setCurrentContact = useCallback(
    (contact: ContactWithDetails | null) => {
      setState((prev) => ({ ...prev, currentContact: contact }));
    },
    []
  );

  const getDetailedError = useCallback(() => {
    return state.lastError;
  }, [state.lastError]);

  // ================================================================
  // EFECTOS
  // ================================================================

  // Auto-cargar contactos cuando cambian los filtros
  useEffect(() => {
    if (initialFilters.autoLoad !== false) {
      refreshContacts();
    }
  }, [filters, refreshContacts, initialFilters.autoLoad]);

  // ================================================================
  // VALORES COMPUTADOS
  // ================================================================

  const hasActiveFilters = useMemo(() => {
    const activeFilters = { ...filters };
    delete activeFilters.limit;
    return Object.values(activeFilters).some(
      (value) => value !== undefined && value !== null && value !== ""
    );
  }, [filters]);

  const contactsByStatus = useMemo(() => {
    return state.contacts.reduce((acc, contact) => {
      const status = contact.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(contact);
      return acc;
    }, {} as Record<string, ContactWithDetails[]>);
  }, [state.contacts]);

  const contactsByPriority = useMemo(() => {
    return state.contacts.reduce((acc, contact) => {
      const priority = contact.priority;
      if (!acc[priority]) {
        acc[priority] = [];
      }
      acc[priority].push(contact);
      return acc;
    }, {} as Record<string, ContactWithDetails[]>);
  }, [state.contacts]);

  const isRetryable = useMemo(() => {
    return state.lastError?.retryable === true;
  }, [state.lastError]);

  // ================================================================
  // RETURN
  // ================================================================

  return {
    // Estado
    ...state,

    // Valores computados
    hasActiveFilters,
    contactsByStatus,
    contactsByPriority,
    isRetryable,

    // Operaciones CRUD
    createContact,
    refreshContacts,
    loadContact,
    searchContacts,
    clearSearch,

    // Gestión de contactos
    markAsProcessed,
    updateStatus,
    updatePriority,
    addTags,
    processContact,

    // Respuestas
    sendAutoResponse,
    loadContactResponses,
    createResponse,

    // Plantillas
    loadTemplates,
    createTemplate,

    // Estadísticas
    loadDashboardStats,
    loadConversionMetrics,

    // Utilidades
    validateEmail,
    getContactSummary,

    // Filtros y paginación
    updateFilters,
    setPage,
    resetFilters,

    // Estado y errores
    clearError,
    setCurrentContact,
    retryLastOperation,
    getDetailedError,
  };
};

// ================================================================
// HOOK SIMPLIFICADO PARA DASHBOARD
// ================================================================

export const useContactsDashboard = () => {
  const {
    dashboardStats,
    conversionMetrics,
    loading,
    error,
    lastError,
    loadDashboardStats,
    loadConversionMetrics,
    clearError,
    retryLastOperation,
    isRetryable,
  } = useContacts({ autoLoad: false });

  useEffect(() => {
    loadDashboardStats();
    loadConversionMetrics();
  }, [loadDashboardStats, loadConversionMetrics]);

  return {
    dashboardStats,
    conversionMetrics,
    loading,
    error,
    lastError,
    isRetryable,
    refreshStats: loadDashboardStats,
    refreshMetrics: loadConversionMetrics,
    clearError,
    retry: retryLastOperation,
  };
};

// ================================================================
// HOOK PARA CONTACTO INDIVIDUAL
// ================================================================

export const useContact = (contactId?: string) => {
  const {
    currentContact,
    contactResponses,
    loading,
    error,
    lastError,
    loadContact,
    loadContactResponses,
    updateStatus,
    updatePriority,
    addTags,
    sendAutoResponse,
    createResponse,
    markAsProcessed,
    getContactSummary,
    clearError,
    retryLastOperation,
    isRetryable,
  } = useContacts({ autoLoad: false });

  useEffect(() => {
    if (contactId) {
      loadContact(contactId);
      loadContactResponses(contactId);
    }
  }, [contactId, loadContact, loadContactResponses]);

  return {
    contact: currentContact,
    responses: contactResponses,
    loading,
    error,
    lastError,
    isRetryable,
    updateStatus: (status: Contact["status"], notes?: string) =>
      contactId
        ? updateStatus(contactId, status, notes)
        : Promise.resolve(false),
    updatePriority: (priority: Contact["priority"]) =>
      contactId ? updatePriority(contactId, priority) : Promise.resolve(false),
    addTags: (tags: string[]) =>
      contactId ? addTags(contactId, tags) : Promise.resolve(false),
    sendAutoResponse: (templateId?: string) =>
      contactId
        ? sendAutoResponse(contactId, templateId)
        : Promise.resolve(false),
    createResponse: (responseData: ContactResponse) =>
      contactId
        ? createResponse(contactId, responseData)
        : Promise.resolve(false),
    markAsProcessed: (processedBy?: string, notes?: string) =>
      contactId
        ? markAsProcessed(contactId, processedBy, notes)
        : Promise.resolve(false),
    getSummary: () =>
      contactId ? getContactSummary(contactId) : Promise.resolve(null),
    refresh: () => (contactId ? loadContact(contactId) : Promise.resolve()),
    refreshResponses: () =>
      contactId ? loadContactResponses(contactId) : Promise.resolve(),
    clearError,
    retry: retryLastOperation,
  };
};

export default useContacts;
