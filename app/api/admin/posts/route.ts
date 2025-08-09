import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Post } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";

type PostRequestBody = Omit<Post, "id" | "createdAt" | "updatedAt">;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);
  const skip = (page - 1) * limit;

  try {
    const [posts, total] = await prisma.$transaction([
      prisma.post.findMany({
        skip,
        take: limit,
        include: {
          authors: true,
          organizationUnit: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.post.count(),
    ]);

    return NextResponse.json({ data: posts, total });
  } catch (e: unknown) {
    console.error("Error fetching posts:", e);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: Partial<PostRequestBody> = await req.json();
    const {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      tags,
      status,
      authorIds,
      organizationUnitId,
      publishedAt,
    } = body;

    // Only require title, slug and coverImage
    if (!title || !slug || !coverImage) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure slug uniqueness (append short id if taken)
    const baseSlug = slug.trim();
    let uniqueSlug = baseSlug;
    const existing = await prisma.post.findFirst({ where: { slug: baseSlug } });
    if (existing) {
      uniqueSlug = `${baseSlug}-${createId().slice(0, 8)}`;
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug: uniqueSlug,
        coverImage,
        content: content ?? "",
        excerpt: excerpt ?? "",
        tags: tags ?? [],
        ...(status ? { status } : {}),
        organizationUnitId:
          organizationUnitId && organizationUnitId !== ""
            ? organizationUnitId
            : null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        authorIds: authorIds ?? [],
        ...(authorIds && authorIds.length > 0
          ? { authors: { connect: authorIds.map((id: string) => ({ id })) } }
          : {}),  
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (e: unknown) {
    console.error("Error creating post:", e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return NextResponse.json(
          {
            message:
              "One or more authors or the organization unit could not be found.",
          },
          { status: 400 }
        );
      }
    }
    console.log("Unexpected error:", e);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
