import { type EventReturn, EventsFilter, getEvents } from "@/lib/api/events.Fn";
import { useQuery } from "@tanstack/react-query";

interface UseEventsProps<T extends boolean> {
  withOrganization: T;
  initialData?: EventReturn<T>;
  filter?: EventsFilter;
}

export function useEvents<T extends boolean>(data: UseEventsProps<T>) {
  return useQuery<EventReturn<T>>({
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
