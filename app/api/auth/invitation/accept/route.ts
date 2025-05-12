import { NextRequest, NextResponse } from "next/server";
import { acceptInvitation } from "@/lib/services/invitation";
import { auth } from "@/lib/auth/server";

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

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Accept invitation and create/update user
    const user = await acceptInvitation(token, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired invitation" },
        { status: 400 }
      );
    }

    // Auto sign-in the user
    try {
      const signInResponse = await auth.api.signInEmail({
        body: {
          email: user.email,
          password: password,
        },
        asResponse: true,
      });

      // Return the sign-in response to properly set cookies
      return signInResponse;
    } catch (signInError) {
      console.error(
        "Error signing in after accepting invitation:",
        signInError
      );

      // Still return success even if auto-login fails
      return NextResponse.json({
        success: true,
        message: "Account created successfully. Please sign in.",
        requiresLogin: true,
      });
    }
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 }
    );
  }
}
