import { NextRequest, NextResponse } from "next/server";
import {
  getServices,
  getServiceDetails,
  getServicesByCategory,
  getPopularServices,
  getFeaturedServices,
  getServiceCategories,
  getServiceStats,
  getCategoryWithServices,
  createServiceInquiry,
  incrementServiceViews,
  trackServiceEvent,
  createService,
  updateService,
  deleteService,
} from "@/lib/services/serviceApi";
import { ServiceFilters } from "@/types/home/service";

// ================================================================
// API ROUTES
// ================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");
    const popular = searchParams.get("popular");
    const featured = searchParams.get("featured");

    switch (action) {
      case "list":
        const filters: ServiceFilters = {
          category: category || undefined,
          search: search || undefined,
          popular: popular === "true",
          featured: featured === "true",
          limit: limit ? parseInt(limit) : undefined,
        };
        const services = await getServices(filters);
        return NextResponse.json({ success: true, data: services });

      case "details":
        if (!slug) {
          return NextResponse.json(
            { success: false, error: "Slug is required" },
            { status: 400 }
          );
        }
        const serviceDetails = await getServiceDetails(slug);
        return NextResponse.json(serviceDetails);

      case "by-category":
        if (!category) {
          return NextResponse.json(
            { success: false, error: "Category is required" },
            { status: 400 }
          );
        }
        const categoryServices = await getServicesByCategory(
          category,
          limit ? parseInt(limit) : 10
        );
        return NextResponse.json({ success: true, data: categoryServices });

      case "popular":
        const popularServices = await getPopularServices(
          limit ? parseInt(limit) : 6
        );
        return NextResponse.json({ success: true, data: popularServices });

      case "featured":
        const featuredServices = await getFeaturedServices(
          limit ? parseInt(limit) : 3
        );
        return NextResponse.json({ success: true, data: featuredServices });

      case "categories":
        const categories = await getServiceCategories();
        return NextResponse.json({ success: true, data: categories });

      case "stats":
        const stats = await getServiceStats();
        return NextResponse.json({ success: true, data: stats });

      case "category-details":
        if (!slug) {
          return NextResponse.json(
            { success: false, error: "Category slug is required" },
            { status: 400 }
          );
        }
        const categoryDetails = await getCategoryWithServices(slug);
        return NextResponse.json({ success: true, data: categoryDetails });

      default:
        const allServices = await getServices();
        return NextResponse.json({ success: true, data: allServices });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "create-inquiry":
        const inquiryResult = await createServiceInquiry(body.data);
        return NextResponse.json(inquiryResult);

      case "track-view":
        if (!body.slug) {
          return NextResponse.json(
            { success: false, error: "Slug is required" },
            { status: 400 }
          );
        }
        const viewResult = await incrementServiceViews(body.slug);
        return NextResponse.json(viewResult);

      case "track-event":
        if (!body.service_id || !body.event_type) {
          return NextResponse.json(
            { success: false, error: "Service ID and event type are required" },
            { status: 400 }
          );
        }
        const trackResult = await trackServiceEvent(
          body.service_id,
          body.event_type,
          body.metadata
        );
        return NextResponse.json({ success: trackResult });

      case "create-service":
        const newService = await createService(body.data);
        return NextResponse.json({ success: true, data: newService });

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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Service ID is required" },
        { status: 400 }
      );
    }

    const updatedService = await updateService(id, data);
    return NextResponse.json({ success: true, data: updatedService });
  } catch (error) {
    console.error("PUT API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Service ID is required" },
        { status: 400 }
      );
    }

    const deleted = await deleteService(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("DELETE API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
