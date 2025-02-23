import { authError } from "@/lib/auth/error";
import { checkAuth } from "@/lib/auth/server";
import prisma from "@/lib/prisma";
import { Role, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import * as Yup from "yup";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = await checkAuth([Role.admin]);
  if (!role) return NextResponse.json(...authError);

  const withOrganization =
    req.nextUrl.searchParams.get("withOrganization") === "true";

  const event = await prisma.event.findUnique({
    where: { id: (await params).id },
    include: {
      organizationUnit: withOrganization,
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(event);
}

// Define the shape of possible update data
const updateEventSchema = Yup.object({
  title: Yup.string().max(100).optional(),
  description: Yup.string().optional(),
  date: Yup.date().optional(),
  location: Yup.string().optional(),
  eventType: Yup.string().optional(),
  organizationUnitId: Yup.string().optional(),
  coverImage: Yup.string().optional(),
  status: Yup.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const role = await checkAuth([Role.admin]);
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const updateData: Prisma.EventUpdateInput = {};

    // Validate and clean update data
    try {
      const validatedData = await updateEventSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true, // Remove any fields not in schema
      });

      // Only include fields that are actually provided
      Object.entries(validatedData).forEach(([key, value]) => {
        if (value !== undefined) {
          updateData[key as keyof typeof updateData] = value;
        }
      });
    } catch (validationError) {
      if (validationError instanceof Yup.ValidationError) {
        return NextResponse.json(
          { error: validationError.errors.join(", ") },
          { status: 400 }
        );
      }
    }

    // Handle title/slug update if provided
    if (data.title) {
      const slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const duplicateSlug = await prisma.event.findFirst({
        where: {
          slug,
          id: { not: params.id },
        },
      });

      updateData.slug = duplicateSlug
        ? `${slug}-${params.id.slice(0, 8)}`
        : slug;
    }

    // Only perform update if there are changes
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No changes to apply" },
        { status: 200 }
      );
    }

    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: updateData,
      include: {
        organizationUnit: true,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
    }

    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// Also add DELETE method for completeness
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const role = await checkAuth([Role.admin]);
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.event.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
