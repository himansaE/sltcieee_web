import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const units = await prisma.organizationUnit.findMany({
      select: { slug: true, title: true, description: true, image: true },
      orderBy: { title: "asc" },
    });
    return NextResponse.json({ units });
  } catch (e) {
    console.error("Error loading organization units:", e);
    return NextResponse.json({ message: "Failed to load units" }, { status: 500 });
  }
}
