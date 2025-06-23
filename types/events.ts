import type {
  Event,
  EventSession,
  EventGalleryItem,
  OrganizationUnit,
} from "@prisma/client";

export interface EventWithDetails extends Event {
  organizationUnit: OrganizationUnit;
  EventSession: EventSession[];
  galleryItems: EventGalleryItem[];
  simpleDescription?: string | null;
}

export interface SessionFormData {
  title: string;
  description: string;
  date: Date;
  image: File | null;
  speakers?: string[];
}

export type PublicEvent = Event & {
  simpleDescription?: string | null;
};
