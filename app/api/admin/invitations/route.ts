import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { checkAuth } from "@/lib/auth/server";
import { authError } from "@/lib/auth/error";
import { getPendingInvitations } from "@/lib/services/invitation";

// GET /api/admin/invitations - list pending invitations
export async function GET(req: NextRequest) {
  const role = await checkAuth([Role.admin]);
  if (!role) return NextResponse.json(...authError);

  try {
    const invites = await getPendingInvitations();
    return NextResponse.json({ invitations: invites });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}
