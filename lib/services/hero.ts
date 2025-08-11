import prisma from "@/lib/prisma";

export async function getActiveHero() {
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
  if (scheduled.length > 0) return scheduled[0];

  const unscheduled = await prisma.heroAnnouncement.findFirst({
    where: { scheduleEnabled: false },
    orderBy: { updatedAt: "desc" },
  });
  return unscheduled ?? null;
}

// Returns a list of hero announcements for the homepage card stack.
// Preference: currently active scheduled heroes; if none, fall back to latest unscheduled ones.
export async function getHeroesForHome(limit = 5) {
  const now = new Date();
  const scheduled = await prisma.heroAnnouncement.findMany({
    where: {
      scheduleEnabled: true,
      startAt: { lte: now },
      endAt: { gte: now },
    },
    orderBy: [{ startAt: "desc" }, { updatedAt: "desc" }],
    take: limit,
  });
  if (scheduled.length > 0) return scheduled;

  const unscheduled = await prisma.heroAnnouncement.findMany({
    where: { scheduleEnabled: false },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
  return unscheduled;
}
