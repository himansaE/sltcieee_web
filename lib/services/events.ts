import prisma from "@/lib/prisma";

// Returns a few upcoming or most recent events for use in homepage hero cards
export async function getHeroCardEvents(limit = 3) {
  const now = new Date();
  // Try upcoming first
  const upcoming = await prisma.event.findMany({
    where: { date: { gte: now } },
    orderBy: { date: "asc" },
    take: limit,
    select: { id: true, title: true, coverImage: true, slug: true },
  });
  if (upcoming.length >= Math.min(1, limit)) return upcoming;

  // Fallback to latest past events if no upcoming
  const latest = await prisma.event.findMany({
    orderBy: { date: "desc" },
    take: limit,
    select: { id: true, title: true, coverImage: true, slug: true },
  });
  return latest;
}
