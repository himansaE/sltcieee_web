"use server";

import { Role, type $Enums } from "@prisma/client";
import type React from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export const WithAuth = async <T,>(
  children: React.ComponentType<T>,
  accessTypes: [$Enums.Role, ...$Enums.Role[]]
) => {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return redirect("/login");
  if (session.user.role === Role.user) return redirect("/need-access");
  if (
    !accessTypes.some((accessType) =>
      accessType.includes(session.user.role as $Enums.Role)
    )
  )
    return redirect("/login");

  return children;
};
