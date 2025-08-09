import { checkAuth } from "@/lib/auth/server";
import { Role } from "@prisma/client";
import { authError } from "@/lib/auth/error";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { createId } from "@paralleldrive/cuid2";
import { organizationUnitReqValidationSchema } from "@/lib/validation/organizationUnit";
import * as Yup from "yup";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const role = await checkAuth([Role.admin]);
  if (!role) {
    return NextResponse.json(...authError);
  }

  try {
    const data = await req.json();

    // Validate request body (no slug required on create)
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

    const title = typeof data.title === "string" ? data.title.trim() : "";
    const description =
      typeof data.description === "string" ? data.description.trim() : "";

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const baseSlug = slugify(title);
    if (!baseSlug) {
      return NextResponse.json(
        { error: "Invalid title provided" },
        { status: 400 }
      );
    }

    // Ensure uniqueness
    let uniqueSlug = baseSlug;
    const exists = await prisma.organizationUnit.findUnique({
      where: { slug: uniqueSlug },
      select: { id: true },
    });

    if (exists) {
      uniqueSlug = `${baseSlug}-${createId().slice(0, 8)}`;
    }

    const organizationUnit = await prisma.organizationUnit.create({
      data: {
        id: createId(),
        title,
        description,
        image: data.image,
        slug: uniqueSlug,
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
