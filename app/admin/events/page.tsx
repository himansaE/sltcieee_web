export const dynamic = "force-dynamic";

import { AdminEventsPage } from "@/features/events/components/eventPage";
// import type { EventWithOrganization } from "@/lib/api/events.Fn";
// import prisma from "@/lib/prisma";

const ITEMS_PER_PAGE = 12;

export default async function EventsPage(): Promise<JSX.Element> {
  // const events = (await prisma.event.findMany({
  //   take: ITEMS_PER_PAGE,
  //   include: {
  //     organizationUnit: true,
  //   },
  //   orderBy: {
  //     date: "desc",
  //   },
  // })) as EventWithOrganization[];

  // const total = await prisma.event.count();

  return (
    <AdminEventsPage
      // events={events}
      // totalEvents={total}
      itemsPerPage={ITEMS_PER_PAGE}
    />
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | IEEE SLTC Admin",
  description:
    "Admin panel for managing IEEE SLTC events and activities, including event creation, editing, and scheduling.",
};
