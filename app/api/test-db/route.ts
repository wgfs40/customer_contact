import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function GET() {
  try {
    console.log("Testing database connection...");
    console.log("DB Config:", {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? process.env.DB_PORT : "NOT SET",
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD ? "***SET***" : "NOT SET",
    });

    const connection = await pool.getConnection();
    console.log("Connection established successfully");

    // Test a simple query
    const [result] = await connection.query("SELECT 1 as test");
    connection.release();

    console.log("Database test query successful:", result);

    return NextResponse.json(
      {
        status: "success",
        message: "Database connection successful",
        result: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database connection test failed:", error);
    const err = error as { code?: string; message?: string; errno?: number };

    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: {
          code: err.code,
          message: err.message,
          errno: err.errno,
        },
      },
      { status: 500 }
    );
  }
}
