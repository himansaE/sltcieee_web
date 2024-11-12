import type { EventWithOrganization } from "@/lib/api/events.Fn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface EventCardProps {
  event: EventWithOrganization;
}

export const EventCard = ({ event }: EventCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white border border-gray-200">
      {/* Cover Image with Gradient Overlay */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </div>

      {/* Content Section */}
      <div className="relative p-6">
        {/* Organization Logo and Title */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-8 w-8 ring-2 ring-white">
            <AvatarImage
              src={getImageUrl(event.image)}
              alt={event.organizationUnit.title}
            />
            <AvatarFallback>
              {event.organizationUnit.title.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            {event.organizationUnit.title}
          </span>
        </div>

        {/* Event Title */}
        <h3 className="text-xl font-semibold text-gray-900 ">{event.title}</h3>

        <div className="flex text-gray-600 text-sm mb-3">
          {event.description}
        </div>

        {/* Event Details */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{format(new Date(event.createdAt), "PPP")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
