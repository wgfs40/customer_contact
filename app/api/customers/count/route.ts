import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Rate limiting setup
const RATE_LIMIT = 60; // requests per minute
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const limit = RATE_LIMIT;

  const current = rateLimitMap.get(ip);
  if (!current || now > current.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(ip, { count: 1, resetTime });
    return { allowed: true, remaining: limit - 1, resetTime };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: current.resetTime };
  }

  current.count += 1;
  rateLimitMap.set(ip, current);
  return {
    allowed: true,
    remaining: limit - current.count,
    resetTime: current.resetTime,
  };
}

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

// GET - Get total count of customers
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

    // Extract search parameter for filtered count
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const SupabaseClient = createClient(
      supabaseUrl as string,
      supabaseKey as string
    );

    // Build the query for count
    let query = SupabaseClient.from("Customers").select("*", {
      count: "exact",
      head: true,
    });

    // Add search filter if provided
    if (search) {
      query = query.or(`names.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { count, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { count: count || 0 },
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
      { error: "Failed to retrieve customer count" },
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
