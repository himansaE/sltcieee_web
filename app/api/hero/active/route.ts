import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date();
  const scheduled = await prisma.heroAnnouncement.findMany({
    where: {
      scheduleEnabled: true,
      startAt: { lte: now },
      endAt: { gte: now },
    },
    orderBy: [{ startAt: "desc" }, { updatedAt: "desc" }],
    take: 1,
  });
  if (scheduled.length > 0) return NextResponse.json(scheduled[0]);

  const unscheduled = await prisma.heroAnnouncement.findFirst({
    where: { scheduleEnabled: false },
    orderBy: { updatedAt: "desc" },
  });
  if (unscheduled) return NextResponse.json(unscheduled);

  return NextResponse.json(null);
}
