import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.Project_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error("SUPABASE_KEY environment variable is not set");
}

// PUT - Update customer information
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerId = id;
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    if (!customerId || isNaN(Number(customerId))) {
      return NextResponse.json(
        { error: "Valid customer ID is required" },
        { status: 400 }
      );
    }

    const SupabaseClient = createClient(
      supabaseUrl as string,
      supabaseKey as string
    );

    const { data, error } = await SupabaseClient.from("Customers")
      .update({ names: name, email })
      .eq("id", customerId)
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    console.log("Customer data updated successfully:", {
      customerId,
      name,
      email,
    });

    return NextResponse.json(
      {
        message: "Customer information updated successfully",
        customer: {
          id: data[0].id,
          name: data[0].names,
          email: data[0].email,
          created_at: data[0].created_at,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);

    const err = error as { code?: string; message?: string };
    let errorMessage = "Failed to update customer information";

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

// DELETE - Remove customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerId = id;

    if (!customerId || isNaN(Number(customerId))) {
      return NextResponse.json(
        { error: "Valid customer ID is required" },
        { status: 400 }
      );
    }

    const SupabaseClient = createClient(
      supabaseUrl as string,
      supabaseKey as string
    );

    // First check if customer exists
    const { data: existingCustomer, error: selectError } =
      await SupabaseClient.from("Customers")
        .select("*")
        .eq("id", customerId)
        .single();

    if (selectError || !existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Delete the customer
    const { error } = await SupabaseClient.from("Customers")
      .delete()
      .eq("id", customerId);

    if (error) {
      throw error;
    }

    console.log("Customer deleted successfully:", { customerId });

    return NextResponse.json(
      {
        message: "Customer deleted successfully",
        deletedCustomer: {
          id: existingCustomer.id,
          name: existingCustomer.names,
          email: existingCustomer.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);

    const err = error as { code?: string; message?: string };
    let errorMessage = "Failed to delete customer";

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
