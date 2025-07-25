import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.Project_URL;
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseKey) {
  throw new Error("SUPABASE_KEY environment variable is not set");
}

// POST - Save customer information
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }
    const SupabaseClient = createClient(
      supabaseUrl as string,
      supabaseKey as string
    );

    console.log("Database connection established successfully");
    const { data, error } = await SupabaseClient.from("Customers")
      .insert([{ names: name, email }])
      .select();

    if (error) {
      throw error;
    }

    console.log("Customer data inserted successfully:", { name, email, data });

    return NextResponse.json(
      { message: "Customer information saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);

    // Provide more specific error messages
    let errorMessage = "Failed to save customer information";
    const err = error as { code?: string; message?: string };

    if (err.code === "ENOTFOUND") {
      errorMessage =
        "Database server not found. Please check your database configuration.";
    } else if (err.code === "ER_ACCESS_DENIED_ERROR") {
      errorMessage =
        "Access denied to database. Please check your credentials.";
    } else if (err.code === "ECONNREFUSED") {
      errorMessage = "Connection refused by database server.";
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}

// GET - Retrieve customer information
export async function GET() {
  try {
    const SupabaseClient = createClient(
      supabaseUrl as string,
      supabaseKey as string
    );
    const { data: rows, error } = await SupabaseClient.from("Customers").select(
      "*"
    );

    if (error) {
      throw error;
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve customer information" },
      { status: 500 }
    );
  }
}
