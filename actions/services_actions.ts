"use server";

import {
  getServices,
  getServiceCategories,
  getServiceBySlug,
  createServiceInquiry,
  trackServiceEvent,
} from "@/lib/services/serviceApi";
import { ServiceFilters, ServiceInquiryForm } from "@/types/home/service";

export async function getServicesAction(filters?: ServiceFilters) {
  try {
    return await getServices(filters);
  } catch (error) {
    console.error("Error in getServicesAction:", error);
    throw new Error("Failed to fetch services");
  }
}

export async function getServiceCategoriesAction() {
  try {
    return await getServiceCategories();
  } catch (error) {
    console.error("Error in getServiceCategoriesAction:", error);
    throw new Error("Failed to fetch service categories");
  }
}

export async function getServiceBySlugAction(slug: string) {
  try {
    return await getServiceBySlug(slug);
  } catch (error) {
    console.error("Error in getServiceBySlugAction:", error);
    throw new Error("Failed to fetch service");
  }
}

export async function createServiceInquiryAction(
  inquiryData: ServiceInquiryForm
) {
  try {
    return await createServiceInquiry(inquiryData);
  } catch (error) {
    console.error("Error in createServiceInquiryAction:", error);
    throw new Error("Failed to create service inquiry");
  }
}

export async function trackServiceEventAction(
  serviceId: string,
  eventType: "view" | "inquiry" | "quote_request" | "booking" | "conversion",
  metadata?: Record<string, unknown>
) {
  try {
    return await trackServiceEvent(serviceId, eventType, metadata);
  } catch (error) {
    console.error("Error in trackServiceEventAction:", error);
    throw new Error("Failed to track service event");
  }
}
