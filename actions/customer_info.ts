// Client-side functions to interact with customer API

// Types for pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "email" | "created_at" | "id";
  sortOrder?: "asc" | "desc";
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export async function SaveCustomerInfo(customerData: {
  name: string;
  email: string;
}) {
  try {
    const response = await fetch("/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    const data = await response.json();

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const errorMessage =
        data.message ||
        `Demasiadas solicitudes. Intenta nuevamente en ${retryAfter} segundos.`;
      throw new Error(errorMessage);
    }

    if (!response.ok) {
      throw new Error(data.error || "Failed to save customer information");
    }

    // Log rate limit info for debugging (opcional)
    const remaining = response.headers.get("X-RateLimit-Remaining");
    const limit = response.headers.get("X-RateLimit-Limit");
    console.log(`Rate limit: ${remaining}/${limit} requests remaining`);

    return data;
  } catch (error) {
    console.error("Error saving customer information:", error);
    throw error;
  }
}

// Get customers with pagination support
export async function GetCustomersWithPagination(
  params: PaginationParams = {}
): Promise<PaginatedResponse<Customer>> {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "created_at",
      sortOrder = "desc",
    } = params;

    // Build query string
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Only add non-empty search parameter
    if (search) {
      queryParams.append("search", search);
    }

    // Add sorting parameters
    queryParams.append("sortBy", sortBy);
    queryParams.append("sortOrder", sortOrder);

    const response = await fetch(`/api/customers?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const errorMessage =
        data.message ||
        `Demasiadas solicitudes. Intenta nuevamente en ${retryAfter} segundos.`;
      throw new Error(errorMessage);
    }

    if (!response.ok) {
      throw new Error(data.error || "Failed to retrieve customers");
    }

    // Log rate limit info for debugging (opcional)
    const remaining = response.headers.get("X-RateLimit-Remaining");
    const limit_header = response.headers.get("X-RateLimit-Limit");
    console.log(`Rate limit: ${remaining}/${limit_header} requests remaining`);

    return data as PaginatedResponse<Customer>;
  } catch (error) {
    console.error("Error retrieving customers with pagination:", error);
    throw error;
  }
}

// Get customer information from API (legacy function - mantener para compatibilidad)
export async function GetCustomerInfo() {
  try {
    const response = await fetch("/api/customers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const errorMessage =
        data.message ||
        `Demasiadas solicitudes. Intenta nuevamente en ${retryAfter} segundos.`;
      throw new Error(errorMessage);
    }

    if (!response.ok) {
      throw new Error(data.error || "Failed to retrieve customer information");
    }

    // Log rate limit info for debugging (opcional)
    const remaining = response.headers.get("X-RateLimit-Remaining");
    const limit = response.headers.get("X-RateLimit-Limit");
    console.log(`Rate limit: ${remaining}/${limit} requests remaining`);

    return data;
  } catch (error) {
    console.error("Error retrieving customer information:", error);
    throw error;
  }
}

// Update customer information
export async function UpdateCustomerInfo(
  customerId: number,
  customerData: { name: string; email: string }
) {
  try {
    const response = await fetch(`/api/customers/${customerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    const data = await response.json();

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const errorMessage =
        data.message ||
        `Demasiadas solicitudes. Intenta nuevamente en ${retryAfter} segundos.`;
      throw new Error(errorMessage);
    }

    if (!response.ok) {
      throw new Error(data.error || "Failed to update customer information");
    }

    // Log rate limit info for debugging (opcional)
    const remaining = response.headers.get("X-RateLimit-Remaining");
    const limit = response.headers.get("X-RateLimit-Limit");
    console.log(`Rate limit: ${remaining}/${limit} requests remaining`);

    return data;
  } catch (error) {
    console.error("Error updating customer information:", error);
    throw error;
  }
}

// Delete customer
export async function DeleteCustomerInfo(customerId: number) {
  try {
    const response = await fetch(`/api/customers/${customerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Handle rate limiting
    if (response.status === 429) {
      const data = await response.json();
      const retryAfter = response.headers.get("Retry-After");
      const errorMessage =
        data.message ||
        `Demasiadas solicitudes. Intenta nuevamente en ${retryAfter} segundos.`;
      throw new Error(errorMessage);
    }

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to delete customer");
    }

    // Log rate limit info for debugging (opcional)
    const remaining = response.headers.get("X-RateLimit-Remaining");
    const limit = response.headers.get("X-RateLimit-Limit");
    console.log(`Rate limit: ${remaining}/${limit} requests remaining`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
}

// Search customers with debounced functionality
export async function SearchCustomers(
  searchTerm: string,
  options: Omit<PaginationParams, "search"> = {}
) {
  return GetCustomersWithPagination({
    ...options,
    search: searchTerm,
  });
}

// Helper function to get customer count
export async function GetCustomerCount() {
  try {
    const response = await fetch("/api/customers/count", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to get customer count");
    }

    return data.count;
  } catch (error) {
    console.error("Error getting customer count:", error);
    throw error;
  }
}
