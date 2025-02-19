import type { Event, EventType, Prisma } from "@prisma/client";
import Request from "@lib/http";

export interface EventCreateRequest {
  title: string;
  description: string;
  image: string;
  coverImage: string;
  date: Date;
  organizationUnitId: string;
  eventType: EventType;
  location: string;
  customLocation?: string;
}

export const createEvent = async (event: EventCreateRequest) => {
  const res = await Request<Event>({
    method: "post",
    url: "/api/admin/event",
    data: event,
  });

  return res.data;
};

export type EventWithOrganization = Prisma.EventGetPayload<{
  include: { organizationUnit: true };
}>;

export interface PaginatedResponse<T> {
  data: T;
  total: number;
  page: number;
  itemsPerPage: number;
  pageCount: number;
}

export type EventReturn<T extends boolean> = PaginatedResponse<
  T extends true ? EventWithOrganization[] : Event[]
>;

export interface EventsFilter {
  organizationUnitId?: string;
  search?: string;
  sortBy?: "date" | "title";
  sortOrder?: "asc" | "desc";
  page?: number;
  itemsPerPage?: number;
}

export const getEvents = async <T extends boolean = false>({
  withOrganization = false as T,
  filter,
}: {
  withOrganization?: T;
  filter?: EventsFilter;
} = {}): Promise<EventReturn<T>> => {
  const searchParams = new URLSearchParams();

  // Add all filter parameters
  if (filter?.search) searchParams.set("search", filter.search);
  if (filter?.organizationUnitId)
    searchParams.set("organizationUnitId", filter.organizationUnitId);
  if (filter?.sortBy) searchParams.set("sortBy", filter.sortBy);
  if (filter?.sortOrder) searchParams.set("sortOrder", filter.sortOrder);
  if (filter?.page) searchParams.set("page", filter.page.toString());
  if (filter?.itemsPerPage)
    searchParams.set("itemsPerPage", filter.itemsPerPage.toString());
  searchParams.set("withOrganization", withOrganization.toString());

  const res = await Request<EventReturn<T>>({
    method: "get",
    url: `/api/admin/event?${searchParams.toString()}`,
  });

  return res.data;
};
