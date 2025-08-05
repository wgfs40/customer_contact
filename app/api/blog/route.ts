import { NextRequest, NextResponse } from "next/server";
import blogApi from "@/lib/blog/blogApi";
import { BlogFilters, CreateBlogPostData } from "@/types/home/blog";

// ================================================================
// GET - Obtener todos los posts con filtros
// ================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extraer parámetros de query
    const filters: BlogFilters = {
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
      status: searchParams.get("status") as
        | "draft"
        | "published"
        | "archived"
        | undefined,
      category_id: searchParams.get("category_id") || undefined,
      author_id: searchParams.get("author_id") || undefined,
      tag: searchParams.get("tag") || undefined,
      search: searchParams.get("search") || undefined,
      sort_by:
        (searchParams.get("sort_by") as BlogFilters["sort_by"]) || "created_at",
      sort_order:
        (searchParams.get("sort_order") as "asc" | "desc" | undefined) ||
        "desc",
      include_drafts: searchParams.get("include_drafts") === "true",
    };

    const result = await blogApi.getAllBlogPosts(filters);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("GET /api/blog error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// ================================================================
// POST - Crear nuevo post
// ================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos requeridos
    const validationErrors = blogApi.validateBlogPostData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    const postData: CreateBlogPostData = {
      title: body.title,
      content: body.content,
      excerpt: body.excerpt || blogApi.generateExcerpt(body.content),
      slug: body.slug,
      status: body.status || "draft",
      category_id: body.category_id,
      author_id: body.author_id,
      featured_image: body.featured_image,
      meta_title: body.meta_title,
      meta_description: body.meta_description,
      is_featured: body.is_featured || false,
      allow_comments: body.allow_comments !== false,
      tags: body.tags || [],
    };

    const result = await blogApi.createBlogPost(postData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: result.message,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/blog error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
