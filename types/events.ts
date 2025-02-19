import type { Event, EventSession, OrganizationUnit } from "@prisma/client";

export interface EventWithDetails extends Event {
  organizationUnit: OrganizationUnit;
  EventSession: EventSession[];
}

export interface SessionFormData {
  title: string;
  description: string;
  date: Date;
  image: File | null;
  speakers?: string[];
}
