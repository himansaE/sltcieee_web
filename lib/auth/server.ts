import { betterAuth, User } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../prisma";
import { admin } from "better-auth/plugins";
import { headers } from "next/headers";
import type { Role } from "@prisma/client";
import { sendEmail } from "@/lib/services/resend";
import { generateResetPasswordEmailHTML } from "@/lib/emails/templates";

export const auth = betterAuth({
  appName: "YPSL NewsLetter",
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    autoCreate: true,
    sendResetPassword: async (user: User, url) => {
      try {
        // Generate the password reset email using our React template
        const emailHtml = generateResetPasswordEmailHTML(
          user.name || "User",
          url
        );

        // Send the email using Resend
        await sendEmail({
          to: user.email,
          subject: "Reset Your SLTC IEEE Admin Password",
          html: await emailHtml,
        });

        console.log(`Password reset email sent to ${user.email}`);
        return Promise.resolve();
      } catch (error) {
        console.error("Failed to send password reset email:", error);
        return Promise.reject(new Error("Failed to send password reset email"));
      }
    },
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
