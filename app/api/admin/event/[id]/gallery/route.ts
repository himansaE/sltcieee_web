import { authError } from "@/lib/auth/error";
import { checkAuth } from "@/lib/auth/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for gallery operations
const galleryItemSchema = z.object({
  imageUrl: z.string().min(1, "Image URL is required"),
  caption: z.string().optional(),
});

// GET: Fetch gallery items for an event
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const role = await checkAuth([Role.admin, Role.content]);
  if (!role) return NextResponse.json(...authError);

  try {
    const eventId = params.id;
    
    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        galleryItems: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(event.galleryItems);
  } catch (error) {
    console.error("Error fetching event gallery:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery items" },
      { status: 500 }
    );
  }
}

// POST: Add a new gallery item
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const role = await checkAuth([Role.admin, Role.content]);
  if (!role) return NextResponse.json(...authError);

  try {
    const eventId = params.id;
    const data = await req.json();
    
    // Validate request data
    const validationResult = galleryItemSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Create gallery item
    const galleryItem = await prisma.eventGalleryItem.create({
      data: {
        eventId,
        imageUrl: data.imageUrl,
        caption: data.caption || "",
        createdAt: new Date(),
      },
    });

    return NextResponse.json(galleryItem, { status: 201 });
  } catch (error) {
    console.error("Error adding gallery item:", error);
    return NextResponse.json(
      { error: "Failed to add gallery item" },
      { status: 500 }
    );
  }
}