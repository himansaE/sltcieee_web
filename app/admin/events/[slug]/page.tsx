import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import type { EventWithDetails } from "@/types/events";
import { EventDetailsPage } from "@/features/events/components/eventDetailsPage";

interface EventPageProps {
  params: { slug: string };
}

export default async function EventPage({ params }: EventPageProps) {
  const event = (await prisma.event.findUnique({
    where: { slug: params.slug },
    include: {
      organizationUnit: true,
      EventSession: {
        orderBy: {},
      },
    },
  })) as EventWithDetails | null;

  if (!event) {
    notFound();
  }

  return <EventDetailsPage event={event} />;
}

export async function generateMetadata({ params }: EventPageProps) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
  });

  return {
    title: `${event?.title || "Event"} | IEEE SLTC Admin`,
  };
}
