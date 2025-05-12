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
}

export interface SessionFormData {
  title: string;
  description: string;
  date: Date;
  image: File | null;
  speakers?: string[];
}
