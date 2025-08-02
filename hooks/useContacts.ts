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
} from "@/types/home/contact";

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

  // Estado
  clearError: () => void;
  setCurrentContact: (contact: ContactWithDetails | null) => void;
}

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

  // ================================================================
  // FUNCIONES AUXILIARES
  // ================================================================

  const handleError = useCallback((error: unknown, message: string) => {
    console.error(message, error);
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message
        : message;
    setState((prev) => ({
      ...prev,
      error: errorMessage ?? null,
      loading: false,
    }));
    toast.error(errorMessage);
  }, []);

  const handleSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  // ================================================================
  // RESPUESTAS
  // ================================================================

  // ================================================================
  // OPERACIONES CRUD
  // ================================================================

  const refreshContacts = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

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
          };
        });
      } else {
        throw new Error(result.error || "Error al cargar contactos");
      }
    } catch (error) {
      handleError(error, "Error al cargar contactos");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [filters, handleError]);

  const createContact = useCallback(
    async (
      data: ContactFormData,
      sendAutoResponse: boolean = true
    ): Promise<boolean> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

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
          throw new Error(result.error || "Error al crear contacto");
        }
      } catch (error) {
        handleError(error, "Error al crear contacto");
        return false;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [handleError, handleSuccess, refreshContacts]
  );

  const loadContact = useCallback(
    async (id: string): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const result = await getContactByIdAction(id);

        if (result.success) {
          setState((prev) => ({
            ...prev,
            currentContact: result.data as ContactWithDetails,
          }));
        } else {
          throw new Error(result.error || "Error al cargar contacto");
        }
      } catch (error) {
        handleError(error, "Error al cargar contacto");
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [handleError]
  );

  const searchContacts = useCallback(
    async (term: string): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, searchLoading: true, error: null }));

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
          }));
        } else {
          throw new Error(result.error || "Error en la búsqueda");
        }
      } catch (error) {
        handleError(error, "Error en la búsqueda");
      } finally {
        setState((prev) => ({ ...prev, searchLoading: false }));
      }
    },
    [handleError]
  );

  const clearSearch = useCallback(() => {
    setState((prev) => ({ ...prev, searchResults: [], searchLoading: false }));
  }, []);

  // ================================================================
  // GESTIÓN DE CONTACTOS
  // ================================================================

  const markAsProcessed = useCallback(
    async (
      contactId: string,
      processedBy?: string,
      notes?: string
    ): Promise<boolean> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

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
        handleError(error, "Error al marcar como procesado");
        return false;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [state.currentContact?.id, handleError, handleSuccess, loadContact, refreshContacts]
  );

  const updateStatus = useCallback(
    async (
      contactId: string,
      status: Contact["status"],
      notes?: string
    ): Promise<boolean> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

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
        handleError(error, "Error al actualizar estado");
        return false;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [state.currentContact?.id, handleError, handleSuccess, loadContact, refreshContacts]
  );

  const updatePriority = useCallback(
    async (
      contactId: string,
      priority: Contact["priority"]
    ): Promise<boolean> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

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
        handleError(error, "Error al actualizar prioridad");
        return false;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [state.currentContact?.id, handleError, handleSuccess, loadContact, refreshContacts]
  );

  const addTags = useCallback(
    async (contactId: string, tags: string[]): Promise<boolean> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

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
        handleError(error, "Error al agregar etiquetas");
        return false;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [state.currentContact?.id, handleError, handleSuccess, loadContact, refreshContacts]
  );

  const processContact = useCallback(
    async (
      contactId: string,
      processedBy?: string,
      notes?: string
    ): Promise<boolean> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

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
        handleError(error, "Error al procesar contacto");
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
  // RESPUESTAS
  // ================================================================

  const loadContactResponses = useCallback(
    async (contactId: string): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const result = await getContactResponsesAction(contactId);

        if (result.success) {
          setState((prev) => ({
            ...prev,
            contactResponses: Array.isArray(result.data) ? result.data : [],
          }));
        } else {
          throw new Error(result.error || "Error al cargar respuestas");
        }
      } catch (error) {
        handleError(error, "Error al cargar respuestas");
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [handleError]
  );

  const sendAutoResponse = useCallback(
    async (contactId: string, templateId?: string): Promise<boolean> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

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
        handleError(error, "Error al enviar respuesta automática");
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
        setState((prev) => ({ ...prev, loading: true, error: null }));

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
        handleError(error, "Error al crear respuesta");
        return false;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [handleError, handleSuccess, loadContactResponses]
  );

  // ================================================================
  // PLANTILLAS
  // ================================================================

  const loadTemplates = useCallback(
    async (contactType?: string, templateType?: string): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const result = await getContactTemplatesAction(
          contactType,
          templateType
        );

        if (result.success) {
          setState((prev) => ({
            ...prev,
            templates: Array.isArray(result.data) ? result.data : [],
          }));
        } else {
          throw new Error(result.error || "Error al cargar plantillas");
        }
      } catch (error) {
        handleError(error, "Error al cargar plantillas");
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [handleError]
  );

  const createTemplate = useCallback(
    async (templateData: ContactTemplate): Promise<boolean> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

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
        handleError(error, "Error al crear plantilla");
        return false;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [handleError, handleSuccess, loadTemplates]
  );

  // ================================================================
  // ESTADÍSTICAS
  // ================================================================

  const loadDashboardStats = useCallback(
    async (dateFrom?: string, dateTo?: string): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const result = await getContactDashboardStatsAction(dateFrom, dateTo);

        if (result.success) {
          setState((prev) => ({ ...prev, dashboardStats: result.data as ContactStats }));
        } else {
          throw new Error(result.error || "Error al cargar estadísticas");
        }
      } catch (error) {
        handleError(error, "Error al cargar estadísticas");
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [handleError]
  );

  const loadConversionMetrics = useCallback(
    async (dateFrom?: string, dateTo?: string): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const result = await getContactConversionMetricsAction(
          dateFrom,
          dateTo
        );

        if (result.success) {
          setState((prev) => ({ ...prev, conversionMetrics: result.data }));
        } else {
          throw new Error(
            result.error || "Error al cargar métricas de conversión"
          );
        }
      } catch (error) {
        handleError(error, "Error al cargar métricas de conversión");
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [handleError]
  );

  // ================================================================
  // UTILIDADES
  // ================================================================

  const validateEmail = useCallback(async (email: string): Promise<boolean> => {
    try {
      return await validateEmailAction(email);
    } catch (error) {
      console.error("Error validating email:", error);
      return false;
    }
  }, []);

  const getContactSummary = useCallback(
    async (contactId: string): Promise<unknown> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const result = await getContactSummaryAction(contactId);

        if (result.success) {
          return result.data;
        } else {
          throw new Error(
            result.error || "Error al obtener resumen del contacto"
          );
        }
      } catch (error) {
        handleError(error, "Error al obtener resumen del contacto");
        return null;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [handleError]
  );

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
  // ESTADO
  // ================================================================

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const setCurrentContact = useCallback(
    (contact: ContactWithDetails | null) => {
      setState((prev) => ({ ...prev, currentContact: contact }));
    },
    []
  );

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

    // Estado
    clearError,
    setCurrentContact,
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
    loadDashboardStats,
    loadConversionMetrics,
    clearError,
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
    refreshStats: loadDashboardStats,
    refreshMetrics: loadConversionMetrics,
    clearError,
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
  };
};

export default useContacts;
