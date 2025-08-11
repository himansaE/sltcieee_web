import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma";
import { HeroAnnouncementSchema } from "@lib/validation/hero";
import { checkAuth } from "@lib/auth/server";
import type { Prisma, Role } from "@prisma/client";

// GET: list hero announcements (all) – admin/content
export async function GET() {
  const role = await checkAuth(["admin", "content"] as Role[]);
  if (!role) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const items = await prisma.heroAnnouncement.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

// POST: create hero announcement
export async function POST(req: NextRequest) {
  const role = await checkAuth(["admin", "content"] as Role[]);
  if (!role) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const json = await req.json();
  const parsed = HeroAnnouncementSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const created = await prisma.heroAnnouncement.create({
    data: {
      internalTitle: data.internalTitle,
      headline: data.headline,
      subHeadline: data.subHeadline,
      buttons: data.buttons as Prisma.InputJsonValue,
  backgroundType: data.backgroundType,
  desktopImageUrl: data.desktopImageUrl,
  imageAlt: data.imageAlt,
  overlay: data.overlay,
  contentLayout: data.contentLayout,
      countdownEnabled: data.countdownEnabled,
      countdownTo: data.countdownTo ?? null,
      countdownLabel: data.countdownLabel,
      badgeEnabled: data.badgeEnabled,
      badgeText: data.badgeText,
      scheduleEnabled: data.scheduleEnabled,
      startAt: data.startAt ?? null,
      endAt: data.endAt ?? null,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
