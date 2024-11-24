import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../prisma";
import { admin } from "better-auth/plugins";
import { headers } from "next/headers";
import type { Role } from "@prisma/client";

export const auth = betterAuth({
  appName: "YPSL NewsLetter",
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  plugins: [admin()],
});

export const checkAuth = async (roles: Role[]) => {
  const role = await auth.api
    .getSession({
      headers: headers(),
    })
    .then((session) => {
      if (!session) {
        return false;
      }
      return roles.find((role) => role === session.user.role);
    });

  if (!role) {
    return false;
  }

  return role;
};
