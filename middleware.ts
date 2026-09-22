import { geolocation } from "@vercel/functions";
import { NextResponse, type NextRequest } from "next/server";

const COUNTRY_COOKIE = "visitor_country";

/**
 * Captures the visitor country from Vercel geo and stores it in a cookie
 * so Server Components can read a reliable country code on every request.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { country } = geolocation(request);
  const normalized = country?.toUpperCase();

  // Persist real country codes only (skip empty / unknown ZZ).
  if (normalized && normalized !== "ZZ") {
    response.cookies.set(COUNTRY_COOKIE, normalized, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
