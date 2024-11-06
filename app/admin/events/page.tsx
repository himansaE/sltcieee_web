// "use server";
// import { WithAuth } from "@/components/withAuth";
import { WithAuth } from "@/components/withAuth";
import AddNewEvent from "@/features/events/components/addEvent";
import { AdminEventsPage } from "@/features/events/components/eventPage";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
// import { Role } from "@prisma/client";

async function EventsPage(): Promise<JSX.Element> {
  const events = await prisma.event.findMany();

  return (
    <div className="px-5 py-4">
      <div className="flex justify-between flex-row">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <AddNewEvent />
      </div>
      <AdminEventsPage events={events} />
    </div>
  );
}

export default WithAuth(EventsPage, [Role.admin]);
