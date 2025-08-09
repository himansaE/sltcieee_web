import { InvitationStatus, Role } from "@prisma/client";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";
import { sendEmail } from "@/lib/services/mailer";
import { generateLoginLinkEmailHTML } from "@/lib/emails/templates";
import { ServerEnv } from "../env/server";

/**
 * Generates a secure random token for invitations
 * @returns A random hexadecimal string
 */
export function generateInvitationToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Creates a new user invitation and sends an email
 *
 * @param email The email address of the invited user
 * @param name The name of the invited user
 * @param role The role to assign to the user
 * @param createdBy ID of the user creating the invitation
 * @returns The created invitation object
 */
export async function createUserInvitation({
  email,
  name,
  role = Role.user,
  createdBy,
}: {
  email: string;
  name: string;
  role?: Role;
  createdBy?: string;
}) {
  // Generate a unique token for this invitation
  const token = generateInvitationToken();

  // Set expiration time (24 hours from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  // Create the invitation record
  const invitation = await prisma.userInvitation.create({
    data: {
      email,
      name,
      token,
      role,
      expiresAt,
      createdBy,
    },
  });

  // Generate the login link with the token
  const loginLink = `${ServerEnv.APP.URL || "http://localhost:3000"}/login/accept-invitation?token=${token}`;

  try {
    // Generate the HTML for the email
    const emailHtml = await generateLoginLinkEmailHTML(
      name || "User",
      loginLink
    );

    // Send the invitation email
    await sendEmail({
      to: email,
      subject: "Your SLTC IEEE Admin Portal Access",
      html: emailHtml,
    });

    console.log(`Invitation email sent to ${email}`);
  } catch (error) {
    console.error("Error sending invitation email:", error);
    // We still return the invitation even if email sending fails
  }

  return invitation;
}

/**
 * Validates an invitation token
 *
 * @param token The invitation token to validate
 * @returns The invitation if valid, null otherwise
 */
export async function validateInvitationToken(token: string) {
  const invitation = await prisma.userInvitation.findUnique({
    where: { token },
  });

  // Check if invitation exists
  if (!invitation) {
    return null;
  }

  // Check if invitation has already been used
  if (invitation.status !== InvitationStatus.PENDING) {
    return null;
  }

  // Check if invitation has expired
  if (invitation.expiresAt < new Date()) {
    // Update status to expired
    await prisma.userInvitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.EXPIRED },
    });
    return null;
  }

  return invitation;
}

/**
 * Accepts an invitation and creates or updates a user account
 *
 * @param token The invitation token
 * @param password The password for the new account
 * @returns The user object if successful, null otherwise
 */
export async function acceptInvitation(token: string, password: string) {
  // Validate the token first
  const invitation = await validateInvitationToken(token);
  if (!invitation) {
    return null;
  }

  try {
    // Start a transaction
    return await prisma.$transaction(async (tx) => {
      // Check if user already exists with this email
      const existingUser = await tx.user.findUnique({
        where: { email: invitation.email },
      });

      let user;

      if (existingUser) {
        // Update existing user
        user = await tx.user.update({
          where: { id: existingUser.id },
          data: {
            role: invitation.role,
            emailVerified: true,
            name: invitation.name || existingUser.name,
            updatedAt: new Date(),
          },
        });

        // Update or create account with password
        const existingAccount = await tx.account.findFirst({
          where: {
            userId: user.id,
            providerId: "credentials",
          },
        });

        if (existingAccount) {
          await tx.account.update({
            where: { id: existingAccount.id },
            data: { password },
          });
        } else {
          await tx.account.create({
            data: {
              id: randomBytes(16).toString("hex"),
              accountId: "credentials",
              providerId: "credentials",
              userId: user.id,
              password,
            },
          });
        }
      } else {
        // Create a new user
        user = await tx.user.create({
          data: {
            id: randomBytes(16).toString("hex"),
            name: invitation.name || "User",
            email: invitation.email,
            emailVerified: true,
            role: invitation.role,
            createdAt: new Date(),
            updatedAt: new Date(),
            Account: {
              create: {
                id: randomBytes(16).toString("hex"),
                accountId: "credentials",
                providerId: "credentials",
                password,
              },
            },
          },
        });
      }

      // Mark invitation as accepted
      await tx.userInvitation.update({
        where: { id: invitation.id },
        data: {
          status: InvitationStatus.ACCEPTED,
          userId: user.id,
        },
      });

      return user;
    });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return null;
  }
}

/**
 * Gets all pending invitations
 */
export async function getPendingInvitations() {
  return prisma.userInvitation.findMany({
    where: {
      status: InvitationStatus.PENDING,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Cancels a pending invitation
 */
export async function cancelInvitation(id: string) {
  return prisma.userInvitation.delete({
    where: { id },
  });
}
