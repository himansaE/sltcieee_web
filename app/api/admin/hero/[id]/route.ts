import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HeroAnnouncementSchema } from "@/lib/validation/hero";
import { checkAuth } from "@/lib/auth/server";
import type { Prisma, Role } from "@prisma/client";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const role = await checkAuth(["admin", "content"] as Role[]);
  if (!role) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const item = await prisma.heroAnnouncement.findUnique({ where: { id: params.id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const role = await checkAuth(["admin", "content"] as Role[]);
  if (!role) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const json = await req.json();
  const parsed = HeroAnnouncementSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const updated = await prisma.heroAnnouncement.update({
    where: { id: params.id },
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
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const role = await checkAuth(["admin", "content"] as Role[]);
  if (!role) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.heroAnnouncement.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
