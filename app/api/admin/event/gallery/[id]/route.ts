import { authError } from "@/lib/auth/error";
import { checkAuth } from "@/lib/auth/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// DELETE: Remove a gallery item
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const role = await checkAuth([Role.admin, Role.content]);
  if (!role) return NextResponse.json(...authError);

  try {
    const itemId = params.id;

    // Check if gallery item exists
    const galleryItem = await prisma.eventGalleryItem.findUnique({
      where: { id: itemId },
    });

    if (!galleryItem) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    // Delete gallery item
    await prisma.eventGalleryItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json(
      { message: "Gallery item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery item" },
      { status: 500 }
    );
  }
}
