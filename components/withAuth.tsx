"use server";

import { Role } from "@prisma/client";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export async function WithAuth<P>(
  Component: (props: P) => JSX.Element | Promise<JSX.Element>,
  allowedRoles: Role[]
) {
  return async function AuthenticatedComponent(props: P): Promise<JSX.Element> {
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

    return <>{await Component(props)}</>; // Ensure it renders correctly in a server context
  };
}
