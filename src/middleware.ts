import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const sitePassword = process.env.SITE_PASSWORD;

  // No password set — site is open
  if (!sitePassword) return NextResponse.next();

  // Allow the gate page and its API route through
  if (
    request.nextUrl.pathname === "/gate" ||
    request.nextUrl.pathname === "/api/gate"
  ) {
    return NextResponse.next();
  }

  // Check for valid gate cookie
  const gateCookie = request.cookies.get("site_access")?.value;
  if (gateCookie === sitePassword) {
    return NextResponse.next();
  }

  // Redirect to gate
  const gateUrl = new URL("/gate", request.url);
  return NextResponse.redirect(gateUrl);
}

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
