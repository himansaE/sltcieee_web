import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { admin } from "better-auth/plugins";

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
