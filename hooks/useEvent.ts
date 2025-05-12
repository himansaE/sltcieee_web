import { useQuery } from "@tanstack/react-query";
import { EventWithOrganization } from "@/lib/api/events.Fn";
import Request from "@lib/http";
import { EventWithDetails } from "@/types/events";

interface UseEventOptions<T extends boolean> {
  id: string;
  withOrganization: T;
  initialData?: T extends true ? EventWithDetails : EventWithOrganization;
}

export const getEvent = async <T extends boolean>(
  options: UseEventOptions<T>
): Promise<T extends true ? EventWithDetails : EventWithOrganization> => {
  const res = await Request<
    T extends true ? EventWithDetails : EventWithOrganization
  >({
    method: "get",
    url: `/api/admin/event/${options.id}`,
  });

  return res.data;
};

export function useEvent<T extends boolean>(options: UseEventOptions<T>) {
  const { id, withOrganization, initialData } = options;

  return useQuery<T extends true ? EventWithDetails : EventWithOrganization>({
    queryKey: ["event", id, { withOrganization }],
    queryFn: () => getEvent<T>({ id, withOrganization }),
    initialData,
  });
}
