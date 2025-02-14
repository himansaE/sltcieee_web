export const dynamic = "force-dynamic";

import { AdminEventsPage } from "@/features/events/components/eventPage";
import type { EventWithOrganization } from "@/lib/api/events.Fn";
import prisma from "@/lib/prisma";

export default async function EventsPage(): Promise<JSX.Element> {
  const events = (await prisma.event.findMany({
    include: {
      organizationUnit: true,
    },
  })) as unknown as EventWithOrganization[];

  return <AdminEventsPage events={events} />;
}
