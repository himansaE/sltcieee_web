import { checkAuth } from "@/lib/auth/server";
import { Role, Prisma } from "@prisma/client";
import { authError } from "@/lib/auth/error";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { createId } from "@paralleldrive/cuid2";
import { eventReqValidationSchema } from "@/lib/validation/event";
import * as Yup from "yup";

export async function POST(req: NextRequest) {
  const role = await checkAuth([Role.admin, Role.content]);
  if (!role) {
    return NextResponse.json(...authError);
  }

  try {
    const data = await req.json();

    // Validate request body
    try {
      await eventReqValidationSchema.validate(data, { abortEarly: false });
    } catch (validationError) {
      if (validationError instanceof Yup.ValidationError) {
        return NextResponse.json(
          { error: validationError.errors.join(", ") },
          { status: 400 }
        );
      }
    }

    // Check title length
    if (data.title.length > 100) {
      return NextResponse.json(
        { error: "Title must be less than 100 characters" },
        { status: 400 }
      );
    }

    const orgUnit = await prisma.organizationUnit.findUnique({
      where: { id: data.organizationUnitId },
    });

    if (!orgUnit) {
      return NextResponse.json(
        { error: "Invalid organization unit" },
        { status: 400 }
      );
    }

    // Generate and check slug
    let slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check for duplicate slug
    const existingEvent = await prisma.event.findFirst({
      where: { slug },
    });

    if (existingEvent) {
      slug = `${slug}-${createId().slice(0, 8)}`;
    }

    const event = await prisma.event.create({
      data: {
        id: createId(),
        title: data.title.trim(),
        description: data.description.trim(),
        image: data.image,
        organizationUnitId: data.organizationUnit,
        coverImage: data.coverImage,
        slug,
        createdAt: new Date(),
        organizationUnit: { connect: { id: data.organizationUnitId } },
        date: data.date,
        location: data.location,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Event creation error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const role = await checkAuth([Role.admin]);
  if (!role) return NextResponse.json(...authError);

  try {
    const { searchParams } = new URL(req.url);
    const withOrganization = searchParams.get("withOrganization") === "true";
    const search = searchParams.get("search") || undefined;
    const organizationUnitId =
      searchParams.get("organizationUnitId") || undefined;
    const sortBy = (searchParams.get("sortBy") || "date") as "date" | "title";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as
      | "asc"
      | "desc";

    // Fix pagination params parsing
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const itemsPerPage = Math.max(
      1,
      Math.min(50, parseInt(searchParams.get("itemsPerPage") || "12"))
    );
    const skip = (page - 1) * itemsPerPage;

    // Build where clause
    const where: Prisma.EventWhereInput = {
      AND: [
        organizationUnitId ? { organizationUnitId } : {},
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          organizationUnit: withOrganization,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: itemsPerPage,
      }),
      prisma.event.count({ where }),
    ]);

    console.log("Pagination:", { page, itemsPerPage, skip, total }); // Debug log

    return NextResponse.json({
      data: events,
      total,
      page,
      itemsPerPage,
      pageCount: Math.ceil(total / itemsPerPage),
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
