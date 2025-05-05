import { NextRequest, NextResponse } from "next/server";
import { Role, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/lib/auth/server";
import { authError } from "@/lib/auth/error";

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

// POST: Create a new user (admin only)
export async function POST(req: NextRequest) {
  const role = await checkAuth([Role.admin]);
  if (!role) return NextResponse.json(...authError);

  try {
    const data = await req.json();

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // In a real implementation with BetterAuth, you would use their createUser function
    // This is a simplified version for demonstration purposes
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        emailVerified: false,
        role: data.role || Role.user,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        emailVerified: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
