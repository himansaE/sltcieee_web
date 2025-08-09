import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || "10", 10);

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { bio: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const authors = await prisma.author.findMany({
    where,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip: (page - 1) * itemsPerPage,
    take: itemsPerPage,
  });

  const total = await prisma.author.count({ where });

  return NextResponse.json({ data: authors, total });
}

export async function POST(req: Request) {
  const { name, bio } = await req.json();
  const author = await prisma.author.create({
    data: {
      name,
      bio,
    },
  });
  return NextResponse.json(author);
}
