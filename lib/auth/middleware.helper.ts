/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Role } from "@prisma/client";

export const validateAccess = async (
  request: NextRequest,

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  session: any,
  allowedRoles: Role[]
) => {
  const isApi = request.nextUrl.pathname.startsWith("/api/");

  if (!session?.user) {
    if (isApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!allowedRoles.includes(session.user.role as Role)) {
    if (isApi) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.redirect(new URL("/need-access", request.url));
  }

  return null;
};

export const matchPath = (path: string, pattern: string): boolean => {
  const regexPattern = pattern.replace(/\*/g, ".*");
  return new RegExp(`^${regexPattern}$`).test(path);
};
