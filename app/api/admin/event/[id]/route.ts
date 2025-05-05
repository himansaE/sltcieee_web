import { authError } from "@/lib/auth/error";
import { checkAuth } from "@/lib/auth/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";

// GET: Get event by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const role = await checkAuth([Role.admin, Role.content]);
  if (!role) return NextResponse.json(...authError);

  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        organizationUnit: true,
        EventSession: true,
        galleryItems: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PATCH: Update event
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const role = await checkAuth([Role.admin, Role.content]);
  if (!role) return NextResponse.json(...authError);

  try {
    const eventId = params.id;
    const data = await req.json();

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Generate slug from title if title is changed
    let slug = event.slug;
    if (data.title && data.title !== event.title) {
      slug = slugify(data.title);

      // Check if slug already exists (excluding current event)
      const existingEvent = await prisma.event.findFirst({
        where: {
          slug,
          id: { not: eventId },
        },
      });

      if (existingEvent) {
        // Append a random string to make slug unique
        slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
      }
    }

    // Update event
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...data,
        slug,
      },
      include: {
        organizationUnit: true,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE: Delete event
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const role = await checkAuth([Role.admin]);
  if (!role) return NextResponse.json(...authError);

  try {
    const eventId = params.id;

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Delete event
    await prisma.event.delete({
      where: { id: eventId },
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
