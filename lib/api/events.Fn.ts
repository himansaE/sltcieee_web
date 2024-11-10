import type { Event } from "@prisma/client";
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
