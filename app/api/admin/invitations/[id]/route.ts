import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { checkAuth } from "@/lib/auth/server";
import { authError } from "@/lib/auth/error";
import { cancelInvitation } from "@/lib/services/invitation";

// DELETE /api/admin/invitations/:id - cancel an invitation
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const role = await checkAuth([Role.admin]);
  if (!role) return NextResponse.json(...authError);

  try {
    await cancelInvitation(params.id);
    return NextResponse.json({ message: "Invitation canceled" });
  } catch (error) {
    console.error("Error canceling invitation:", error);
    return NextResponse.json(
      { error: "Failed to cancel invitation" },
      { status: 500 }
    );
  }
}
