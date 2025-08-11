import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Public GET endpoint to read the round table photos
// Uses the same Mongo collection as the admin endpoint but exposes read-only access.

type RoundTableDoc = {
  _id: string;
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
};

type FindResult = {
  cursor?: { firstBatch?: Array<Partial<RoundTableDoc>> };
};

const COLLECTION = "roundTable" as const;
const DOC_ID = "singleton" as const;

export async function GET() {
  try {
    const result = (await prisma.$runCommandRaw({
      find: COLLECTION,
      filter: { _id: DOC_ID },
      limit: 1,
    })) as FindResult;

    const raw = result?.cursor?.firstBatch?.[0];
    const doc: RoundTableDoc | undefined = raw
      ? {
          _id: String(raw._id ?? DOC_ID),
          photos: Array.isArray(raw.photos)
            ? (raw.photos as string[])
            : ["", "", "", "", ""],
          createdAt: raw.createdAt ? new Date(raw.createdAt as unknown as string) : new Date(),
          updatedAt: raw.updatedAt ? new Date(raw.updatedAt as unknown as string) : new Date(),
        }
      : undefined;

    if (!doc) {
      // If not initialized yet, surface 5 empty slots to the public as well
      return NextResponse.json({ photos: ["", "", "", "", ""] });
    }

    const photos = Array.from({ length: 5 }, (_, i) => doc.photos?.[i] ?? "");
    return NextResponse.json({ photos });
  } catch (e) {
    console.error("Error fetching round table (public):", e);
    return NextResponse.json(
      { message: "Failed to load round table data" },
      { status: 500 }
    );
  }
}
