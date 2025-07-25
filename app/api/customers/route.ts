import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Debug environment variables
console.log("DB Configuration:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? process.env.DB_PORT : "NOT SET",
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? "***" : "NOT SET",
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

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

    // Test connection first
    const connection = await pool.getConnection();
    console.log("Database connection established successfully");

    await connection.query(
      "INSERT INTO customers (name, email) VALUES (?, ?)",
      [name, email]
    );
    connection.release();
    console.log("Customer data inserted successfully:", { name, email });

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
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM customers");
    connection.release();

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve customer information" },
      { status: 500 }
    );
  }
}
