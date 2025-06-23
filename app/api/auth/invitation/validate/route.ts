import { NextRequest, NextResponse } from "next/server";
import { validateInvitationToken } from "@/lib/services/invitation";

// Export config to specify that this route should be dynamically rendered
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Missing invitation token" },
        { status: 400 }
      );
    }

    // Validate the token
    const invitation = await validateInvitationToken(token);

    if (!invitation) {
      return NextResponse.json(
        { error: "Invalid or expired invitation token" },
        { status: 400 }
      );
    }

    // Return basic invitation info (without exposing the token)
    return NextResponse.json({
      valid: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        name: invitation.name,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.error("Error validating invitation token:", error);
    return NextResponse.json(
      { error: "Failed to validate invitation token" },
      { status: 500 }
    );
  }
}
