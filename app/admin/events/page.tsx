// "use server";
// import { WithAuth } from "@/components/withAuth";
import { AdminEventsPage } from "@/features/events/components/eventPage";
import prisma from "@/lib/prisma";
// import { Role } from "@prisma/client";

async function EventsPage(): Promise<JSX.Element> {
  const events = await prisma.event.findMany();

  return <AdminEventsPage events={events} />;
}

export default EventsPage;
