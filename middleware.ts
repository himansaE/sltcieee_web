import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRouteRoles } from "@/lib/auth/admin.routes";
import { validateAccess } from "@/lib/auth/middleware.helper";

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;
    const response = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      cache: "no-cache",
    });

    const session = response.ok ? await response.json() : null;

    if (!session) {
      throw new Error("No session found");
    }

    const allowedRoles = getRouteRoles(path);
    if (allowedRoles) {
      const authResult = await validateAccess(request, session, allowedRoles);
      if (authResult) return authResult;
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    const url = request.nextUrl.clone();
    const callbackUrl = encodeURIComponent(
      request.nextUrl.pathname + request.nextUrl.search
    );
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
