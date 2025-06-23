import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const units = await prisma.organizationUnit.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: units.length,
      units: units,
    });
  } catch (error) {
    console.error("Error fetching organization units:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch organization units",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
