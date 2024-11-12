import type { Event, OrganizationUnit } from "@prisma/client";
import Request from "@lib/http";

type EventCreateRequest = Omit<Event, "id" | "slug" | "createdAt">;

export const createEvent = async (event: EventCreateRequest) => {
  const res = await Request<Event>({
    method: "post",
    url: "/api/admin/event",
    data: event,
  });

  return res.data;
};

export type EventWithOrganization = Event & {
  organizationUnit: OrganizationUnit;
};

export type EventReturn<T extends boolean> = T extends true
  ? EventWithOrganization[]
  : Event[];

interface GetEventsParams {
  withOrganization?: boolean;
}

export const getEvents = async <T extends boolean = false>({
  withOrganization = false as T,
}: GetEventsParams = {}): Promise<EventReturn<T>> => {
  const res = await Request<EventReturn<T>>({
    method: "get",
    url: "/api/admin/events",
    params: { withOrganization },
  });

  return res.data;
};
