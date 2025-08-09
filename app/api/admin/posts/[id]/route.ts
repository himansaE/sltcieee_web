import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";

// GET: Get a specific post by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: { authors: true, organizationUnit: true },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (e) {
    console.error("Error fetching post:", e);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// PUT: Update a specific post
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const body = (await req.json()) as Partial<{
      title: string;
      slug: string;
      content: string;
      excerpt: string;
      coverImage: string;
      tags: string[];
      status: Prisma.PostUpdateInput["status"];
      authorIds: string[];
      organizationUnitId: string | null | "";
      publishedAt: string | null;
    }>;

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

    // If slug provided and changed, ensure uniqueness (append short id if taken)
    let newSlug = slug as string | undefined;
    if (newSlug && newSlug.trim() !== existing.slug) {
      const baseSlug = newSlug.trim();
      let unique = baseSlug;
      const taken = await prisma.post.findFirst({
        where: { slug: baseSlug, NOT: { id } },
      });
      if (taken) unique = `${baseSlug}-${createId().slice(0, 8)}`;
      newSlug = unique;
    }

    // Coerce empty org unit to null
    const newOrgId = organizationUnitId === "" ? null : organizationUnitId ?? undefined;

    const data: Prisma.PostUpdateInput = {
      ...(title !== undefined ? { title } : {}),
      ...(newSlug !== undefined ? { slug: newSlug } : {}),
      ...(coverImage !== undefined ? { coverImage } : {}),
      ...(content !== undefined ? { content } : {}),
      ...(excerpt !== undefined ? { excerpt } : {}),
      ...(tags !== undefined ? { tags } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(newOrgId !== undefined ? { organizationUnitId: newOrgId } : {}),
      ...(publishedAt !== undefined
        ? { publishedAt: publishedAt ? new Date(publishedAt as string) : null }
        : {}),
      ...(authorIds !== undefined
        ? {
            authorIds: authorIds,
            authors: { set: (authorIds || []).map((id) => ({ id })) },
          }
        : {}),
    };

    const updated = await prisma.post.update({ where: { id }, data });

    return NextResponse.json(updated);
  } catch (e: unknown) {
    console.error("Error updating post:", e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: e.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific post
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.post.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (e: unknown) {
    console.error("Error deleting post:", e);
    return NextResponse.json(
      { message: "Failed to delete post" },
      { status: 500 }
    );
  }
}
