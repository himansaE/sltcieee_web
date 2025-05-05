import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/lib/auth/server";
import { authError } from "@/lib/auth/error";

// GET: Get a specific user by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const role = await checkAuth([Role.admin]);
  if (!role) return NextResponse.json(...authError);

  try {
    const userId = params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        image: true,
        emailVerified: true,
        // Never include sensitive information
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PATCH: Update a specific user
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const role = await checkAuth([Role.admin]);
  if (!role) return NextResponse.json(...authError);

  try {
    const userId = params.id;
    const data = await req.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If changing email, check if new email already exists
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "Email already in use by another user" },
          { status: 400 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name !== undefined ? data.name : undefined,
        email: data.email !== undefined ? data.email : undefined,
        role: data.role !== undefined ? data.role : undefined,
        emailVerified:
          data.emailVerified !== undefined ? data.emailVerified : undefined,
        image: data.image !== undefined ? data.image : undefined,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        image: true,
        emailVerified: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const role = await checkAuth([Role.admin]);
  if (!role) return NextResponse.json(...authError);

  try {
    const userId = params.id;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if attempting to delete self
    const session = await req.headers.get("cookie");
    if (session && session.includes(userId)) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 403 }
      );
    }

    // Delete user accounts and sessions (cascade is set in the schema)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
