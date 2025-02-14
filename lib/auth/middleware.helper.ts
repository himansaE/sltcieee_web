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
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!allowedRoles.includes(session.user.role as Role)) {
    return NextResponse.redirect(new URL("/need-access", request.url));
  }

  return null;
};

export const matchPath = (path: string, pattern: string): boolean => {
  const regexPattern = pattern.replace(/\*/g, ".*");
  return new RegExp(`^${regexPattern}$`).test(path);
};
