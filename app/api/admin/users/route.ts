import { NextRequest, NextResponse } from "next/server";
import { Role, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { checkAuth, auth } from "@/lib/auth/server";
import { authError } from "@/lib/auth/error";
import { createUserInvitation } from "@/lib/services/invitation";

// GET: Get all users with pagination and filtering
export async function GET(req: NextRequest) {
  const role = await checkAuth([Role.admin]);
  if (!role) return NextResponse.json(...authError);

  try {
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const roleFilter = searchParams.get("role") as Role | null;

    const skip = (page - 1) * limit;

    // Build the query filter
    const filter: Prisma.UserWhereInput = {};

    if (search) {
      filter.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (roleFilter) {
      filter.role = roleFilter;
    }

    // Get users with pagination
    const users = await prisma.user.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        image: true,
        // For security, never return sensitive info like password hashes
      },
    });

    // Get total count for pagination
    const total = await prisma.user.count({ where: filter });

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST: Create a new user and send invitation email
export async function POST(req: NextRequest) {
  const role = await checkAuth([Role.admin]);
  if (!role) return NextResponse.json(...authError);

  try {
    const data = await req.json();
    const { name, email, role: userRole = Role.user } = data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Get current admin user's session for tracking who created the invitation
    const adminSession = await auth.api.getSession({
      headers: req.headers,
    });
    const createdBy = adminSession?.user?.id;

    // Create invitation and send email
    const invitation = await createUserInvitation({
      email,
      name,
      role: userRole,
      createdBy,
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "User invitation sent successfully",
        invitation: {
          id: invitation.id,
          email: invitation.email,
          expiresAt: invitation.expiresAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user invitation:", error);
    return NextResponse.json(
      { error: "Failed to create user invitation" },
      { status: 500 }
    );
  }
}
