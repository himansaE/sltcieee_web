import {
  type EventsReturn,
  EventReturn,
  EventsFilter,
  getEvent,
  getEvents,
} from "@/lib/api/events.Fn";
import { useQuery } from "@tanstack/react-query";

interface UseEventsProps<T extends boolean> {
  withOrganization: T;
  initialData?: EventsReturn<T>;
  filter?: EventsFilter;
}

export function useEvents<T extends boolean>(data: UseEventsProps<T>) {
  return useQuery<EventsReturn<T>>({
    queryKey: [
      "events",
      { withOrganization: data.withOrganization, filter: data.filter },
    ],
    queryFn: () =>
      getEvents({
        withOrganization: data.withOrganization,
        filter: data.filter,
      }),
    initialData: data.initialData,
  });
}

interface UseEventProps<T extends boolean> {
  id: string;
  withOrganization: T;
  initialData?: EventReturn<T>;
}

export function useEvent<T extends boolean>(data: UseEventProps<T>) {
  return useQuery<EventReturn<T>>({
    queryKey: ["event", data.id],
    queryFn: () => getEvent<T>(data.id, data.withOrganization),
    initialData: data.initialData,
  });
}
