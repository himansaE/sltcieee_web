import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRouteRoles } from "@/lib/auth/admin.routes";
import { validateAccess } from "@/lib/auth/middleware.helper";
import { ServerEnv } from "@/lib/env/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const response = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
    headers: {
      cookie: request.headers.get("cookie") || "",
      "x-internal-auth-token": ServerEnv.AUTH.INTERNAL_TOKEN,
    },
  });

  const session = response.ok ? await response.json() : null;

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const allowedRoles = getRouteRoles(path);
  if (allowedRoles) {
    const authResult = await validateAccess(request, session, allowedRoles);
    if (authResult) return authResult;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
