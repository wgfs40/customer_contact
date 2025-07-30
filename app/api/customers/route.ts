import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Rate limiting configuration
const RATE_LIMIT = 10; // Maximum requests
const WINDOW_MS = 60 * 1000; // 1 minute window
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const clientData = requestCounts.get(ip);

  if (!clientData || now > clientData.resetTime) {
    // First request or window expired, reset counter
    const newResetTime = now + WINDOW_MS;
    requestCounts.set(ip, { count: 1, resetTime: newResetTime });
    return {
      allowed: true,
      remaining: RATE_LIMIT - 1,
      resetTime: newResetTime,
    };
  }

  if (clientData.count >= RATE_LIMIT) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetTime: clientData.resetTime };
  }

  // Increment counter
  clientData.count += 1;
  requestCounts.set(ip, clientData);
  return {
    allowed: true,
    remaining: RATE_LIMIT - clientData.count,
    resetTime: clientData.resetTime,
  };
}

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback to a default IP for development
  return "127.0.0.1";
}

const supabaseUrl = process.env.Project_URL;
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseKey) {
  throw new Error("SUPABASE_KEY environment variable is not set");
}

// POST - Save customer information
export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP);

    if (!rateLimitResult.allowed) {
      const resetTimeSeconds = Math.ceil(
        (rateLimitResult.resetTime - Date.now()) / 1000
      );

      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `Too many requests. Try again in ${resetTimeSeconds} seconds.`,
          retryAfter: resetTimeSeconds,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
            "Retry-After": resetTimeSeconds.toString(),
          },
        }
      );
    }

    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        {
          status: 400,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
          },
        }
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
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": RATE_LIMIT.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
        },
      }
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

    // Get rate limit info for error response
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP);

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      },
      {
        status: 500,
        headers: {
          "X-RateLimit-Limit": RATE_LIMIT.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
        },
      }
    );
  }
}

// GET - Retrieve customer information
export async function GET(request: NextRequest) {
  try {
    // Check rate limit
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP);

    if (!rateLimitResult.allowed) {
      const resetTimeSeconds = Math.ceil(
        (rateLimitResult.resetTime - Date.now()) / 1000
      );

      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `Too many requests. Try again in ${resetTimeSeconds} seconds.`,
          retryAfter: resetTimeSeconds,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
            "Retry-After": resetTimeSeconds.toString(),
          },
        }
      );
    }

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

    // Transform the data to match the expected format
    const customers =
      rows?.map((row: any) => ({
        id: row.id,
        name: row.names,
        email: row.email,
        created_at: row.created_at,
      })) || [];

    return NextResponse.json(
      { customers },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": RATE_LIMIT.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Database error:", error);

    // Get rate limit info for error response
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP);

    return NextResponse.json(
      { error: "Failed to retrieve customer information" },
      {
        status: 500,
        headers: {
          "X-RateLimit-Limit": RATE_LIMIT.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
        },
      }
    );
  }
}
