import { authError } from "@/lib/auth/error";
import { checkAuth } from "@/lib/auth/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const role = await checkAuth([Role.admin]);
    if (!role) {
      return NextResponse.json(...authError);
    }

    const body = await req.json();
    const { title, description, image, slug } = body;

    // Validate slug uniqueness (except for current unit)
    const existingUnit = await prisma.organizationUnit.findFirst({
      where: {
        slug,
        NOT: {
          id: params.id,
        },
      },
    });

    if (existingUnit) {
      return NextResponse.json(
        { error: "A unit with this slug already exists" },
        { status: 400 }
      );
    }

    const updated = await prisma.organizationUnit.update({
      where: { id: params.id },
      data: {
        title,
        description,
        image,
        slug,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating organization unit:", error);
    return NextResponse.json(
      { error: "Failed to update organization unit" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const role = await checkAuth([Role.admin]);
    if (!role) {
      return NextResponse.json(...authError);
    }

    // Delete associated events first
    await prisma.event.deleteMany({
      where: { organizationUnitId: params.id },
    });

    // Delete the organization unit
    const deleted = await prisma.organizationUnit.delete({
      where: { id: params.id },
    });

    return NextResponse.json(deleted);
  } catch (error) {
    console.error("Error deleting organization unit:", error);
    return NextResponse.json(
      { error: "Failed to delete organization unit" },
      { status: 500 }
    );
  }
}
