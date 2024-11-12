import { checkAuth } from "@/lib/auth/server";
import { Role } from "@prisma/client";
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

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        organizationUnitId: true,
        slug: true,
        createdAt: true,
        organizationUnit: true,
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Event fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
