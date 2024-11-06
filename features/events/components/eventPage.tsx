import type React from "react";
import AddNewEvent from "./addEvent";
import type { Event } from "@/lib/types";
type AdminEventsPageProps = {
  events: Event[];
};

export const AdminEventsPage: React.FC<AdminEventsPageProps> = () => {
  return (
    <div className="px-5 py-4">
      <div className="flex justify-between flex-row">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <AddNewEvent />
      </div>
    </div>
  );
};
