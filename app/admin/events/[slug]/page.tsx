import { EventDetailsPage } from "@/features/events/components/eventDetailsPage";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EventDetail({
  params,
}: {
  params: { slug: string };
}) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    include: {
      organizationUnit: true,
      EventSession: true,
      galleryItems: true,
    },
  });

  if (!event) {
    notFound();
  }

  return <EventDetailsPage event={event} />;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    include: { organizationUnit: true },
  });

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: `${event.title} | IEEE SLTC Admin`,
    description: event.description.substring(0, 160),
  };
}
