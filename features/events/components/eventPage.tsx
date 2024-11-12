"use client";
import type React from "react";
import AddNewEvent from "./addEvent";
import type { EventWithOrganization } from "@/lib/api/events.Fn";
import { EventCard } from "../card";
import { useEvents } from "@/hooks/useEvents";
import { DivList } from "@/components/widgets/divList";
type AdminEventsPageProps = {
  events: EventWithOrganization[];
};

export const AdminEventsPage: React.FC<AdminEventsPageProps> = ({
  events: initialEventData,
}) => {
  const { data: events } = useEvents({
    withOrganization: true,
    initialData: initialEventData,
  });

  if (!events) return <></>;

  return (
    <div className="px-5 py-4">
      <div className="flex justify-between flex-row">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <AddNewEvent />
      </div>
      <div
        className="grid auto-rows-max gap-6 py-10"
        style={{
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(400px, 100%), 1fr))",
        }}
      >
        {events.map((event) => (
          <EventCard key={event.id} event={event as EventWithOrganization} />
        ))}
        <DivList count={5} />
      </div>
    </div>
  );
};
