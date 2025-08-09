import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Using MongoDB-specific $runCommandRaw to avoid adding a Prisma model.
// We'll store a singleton document in the "roundTable" collection with _id: "singleton".

type RoundTableDoc = {
  _id: string;
  photos: string[]; // up to 5 entries, empty string for empty slots
  createdAt: Date;
  updatedAt: Date;
};

const COLLECTION = "roundTable";
const DOC_ID = "singleton";

export async function GET(req: NextRequest) {
  try {
    const result: any = await prisma.$runCommandRaw({
      find: COLLECTION,
      filter: { _id: DOC_ID },
      limit: 1,
    });

    const doc: RoundTableDoc | undefined = result?.cursor?.firstBatch?.[0];

    if (!doc) {
      // Create an initial document with 5 empty slots
      const now = new Date();
      const initial: RoundTableDoc = {
        _id: DOC_ID,
        photos: ["", "", "", "", ""],
        createdAt: now,
        updatedAt: now,
      };

      await prisma.$runCommandRaw({
        insert: COLLECTION,
        documents: [initial],
      });

      return NextResponse.json({ photos: initial.photos });
    }

    // Ensure we always return 5 slots
    const photos = Array.from({ length: 5 }, (_, i) => doc.photos?.[i] ?? "");
    return NextResponse.json({ photos });
  } catch (e) {
    console.error("Error fetching round table:", e);
    return NextResponse.json(
      { message: "Failed to load round table data" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    let photos: unknown = body?.photos;

    if (!Array.isArray(photos)) {
      return NextResponse.json({ message: "photos must be an array" }, { status: 400 });
    }

    // Normalize to length 5 with strings only
    const normalized = Array.from({ length: 5 }, (_, i) => {
      const v = photos[i];
      return typeof v === "string" ? v : "";
    });

    const now = new Date();

    await prisma.$runCommandRaw({
      update: COLLECTION,
      updates: [
        {
          q: { _id: DOC_ID },
          u: {
            $set: { photos: normalized, updatedAt: now },
            $setOnInsert: { createdAt: now },
          },
          upsert: true,
          multi: false,
        },
      ],
    });

    return NextResponse.json({ photos: normalized });
  } catch (e) {
    console.error("Error updating round table:", e);
    return NextResponse.json(
      { message: "Failed to update round table data" },
      { status: 500 }
    );
  }
}
