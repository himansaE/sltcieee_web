import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import prisma from "@/lib/prisma";
import { validateInvitationToken } from "@/lib/services/invitation";
import { InvitationStatus } from "@prisma/client";

// Export config to specify that this route should be dynamically rendered
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // 1) Validate invitation token
    const invitation = await validateInvitationToken(token);
    if (!invitation) {
      return NextResponse.json(
        { error: "Invalid or expired invitation" },
        { status: 400 }
      );
    }

    // Helper: mark invitation accepted and sync role
    const finalizeAcceptance = async () => {
      // Ensure user exists then update role and mark invitation accepted
      const user = await prisma.user.findUnique({
        where: { email: invitation.email },
      });
      if (user) {
        if (
          user.role !== invitation.role ||
          !user.emailVerified
        ) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              role: invitation.role,
              emailVerified: true,
              name: invitation.name || user.name,
            },
          });
        }
        await prisma.userInvitation.update({
          where: { id: invitation.id },
          data: { status: InvitationStatus.ACCEPTED, userId: user.id },
        });
      }
    };

    // 2) Try to sign up the user (preferred to ensure proper password hashing)
    const signUpRes = await auth.api.signUpEmail({
      body: {
        email: invitation.email,
        password,
        name: invitation.name || invitation.email,
      },
      asResponse: true,
    });

    if (signUpRes.ok) {
      await finalizeAcceptance();
      const json = { success: true, requiresLogin: false } as const;
      const res = NextResponse.json(json);
      const setCookie = signUpRes.headers.get("set-cookie");
      if (setCookie) res.headers.set("set-cookie", setCookie);
      return res;
    }

    // 3) If user already exists, try to sign in with provided password
    const signInRes = await auth.api.signInEmail({
      body: {
        email: invitation.email,
        password,
      },
      asResponse: true,
    });

    if (signInRes.ok) {
      await finalizeAcceptance();
      const json = { success: true, requiresLogin: false } as const;
      const res = NextResponse.json(json);
      const setCookie = signInRes.headers.get("set-cookie");
      if (setCookie) res.headers.set("set-cookie", setCookie);
      return res;
    }

    // 4) Both sign up and sign in failed
    return NextResponse.json(
      {
        error:
          "Unable to complete invitation: account already exists and password is incorrect. Please use 'Forgot password' to reset.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 }
    );
  }
}
