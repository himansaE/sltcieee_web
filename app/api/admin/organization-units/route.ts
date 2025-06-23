import { checkAuth } from "@/lib/auth/server";
import { Role } from "@prisma/client";
import { authError } from "@/lib/auth/error";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { createId } from "@paralleldrive/cuid2";
import { organizationUnitReqValidationSchema } from "@/lib/validation/organizationUnit";
import * as Yup from "yup";

export async function POST(req: NextRequest) {
  const role = await checkAuth([Role.admin]);
  if (!role) {
    return NextResponse.json(...authError);
  }

  try {
    const data = await req.json();

    // Validate request body
    try {
      await organizationUnitReqValidationSchema.validate(data, {
        abortEarly: false,
      });
    } catch (validationError) {
      if (validationError instanceof Yup.ValidationError) {
        return NextResponse.json(
          { error: validationError.errors.join(", ") },
          { status: 400 }
        );
      }
    }

    // Check for duplicate slug
    const existingUnit = await prisma.organizationUnit.findFirst({
      where: { slug: data.slug },
    });

    if (existingUnit) {
      return NextResponse.json(
        { error: "An organization unit with this slug already exists" },
        { status: 400 }
      );
    }

    const organizationUnit = await prisma.organizationUnit.create({
      data: {
        id: createId(),
        title: data.title.trim(),
        description: data.description.trim(),
        image: data.image,
        slug: data.slug.trim(),
        createdAt: new Date(),
      },
    });

    return NextResponse.json(organizationUnit, { status: 201 });
  } catch (error) {
    console.error("Organization unit creation error:", error);
    return NextResponse.json(
      { error: "Failed to create organization unit" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const include = params.get("withEvents") === "true" ? { events: true } : {};

  const organizationUnits = await prisma.organizationUnit.findMany({
    orderBy: { createdAt: "desc" },
    include,
  });

  return NextResponse.json(organizationUnits);
}
