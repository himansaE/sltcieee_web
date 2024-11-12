import { type EventReturn, getEvents } from "@/lib/api/events.Fn";
import { useQuery } from "@tanstack/react-query";

interface UseEventsProps<T extends boolean> {
  withOrganization: T;
  initialData?: EventReturn<T>;
}

export function useEvents<T extends boolean>(data: UseEventsProps<T>) {
  return useQuery({
    queryKey: ["events", data.withOrganization],
    queryFn: () => getEvents({ withOrganization: data.withOrganization }),
    initialData: data.initialData,
  });
}
