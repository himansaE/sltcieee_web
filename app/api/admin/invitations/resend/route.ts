import { NextRequest, NextResponse } from "next/server";
import { Role, InvitationStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { checkAuth, auth } from "@/lib/auth/server";
import { authError } from "@/lib/auth/error";
import { createUserInvitation } from "@/lib/services/invitation";

// POST /api/admin/invitations/resend - resend an invitation with a new token
export async function POST(req: NextRequest) {
  const role = await checkAuth([Role.admin]);
  if (!role) return NextResponse.json(...authError);

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing invitation id" }, { status: 400 });
    }

    // Get existing invitation
    const existing = await prisma.userInvitation.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // Optional: mark old as expired to invalidate old token
    await prisma.userInvitation.update({
      where: { id },
      data: { status: InvitationStatus.EXPIRED },
    });

    // Get current admin user's session for createdBy
    const adminSession = await auth.api.getSession({ headers: req.headers });
    const createdBy = adminSession?.user?.id;

    // Create a fresh invitation and send email
    const newInvite = await createUserInvitation({
      email: existing.email,
      name: existing.name ?? "",
      role: existing.role,
      createdBy,
    });

    return NextResponse.json({
      message: "Invitation resent",
      invitation: {
        id: newInvite.id,
        email: newInvite.email,
        expiresAt: newInvite.expiresAt,
      },
    });
  } catch (error) {
    console.error("Error resending invitation:", error);
    return NextResponse.json(
      { error: "Failed to resend invitation" },
      { status: 500 }
    );
  }
}
