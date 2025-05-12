"use server";

import { Role } from "@prisma/client";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { ComponentType, ReactElement } from "react";

export async function WithAuth<P extends object = Record<string, unknown>>(
  Component: ComponentType<P>,
  allowedRoles: Role[]
) {
  async function checkAuth() {
    const session = await auth.api.getSession({ headers: headers() });

    if (!session) {
      redirect("/login");
    }

    if (session.user.role === Role.user) {
      redirect("/need-access");
    }

    if (!allowedRoles.includes(session.user.role as Role)) {
      redirect("/login");
    }

    return session;
  }

  async function AuthenticatedComponent(props: P): Promise<ReactElement> {
    await checkAuth();

    return <Component {...props} />;
  }

  AuthenticatedComponent.displayName = `WithAuth(${Component.displayName || Component.name || "Component"})`;

  return AuthenticatedComponent;
}
