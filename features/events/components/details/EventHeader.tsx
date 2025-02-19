import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import type { EventWithDetails } from "@/types/events";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

interface EventHeaderProps {
  event: EventWithDetails;
}

export function EventHeader({ event }: EventHeaderProps) {
  return (
    <div className="relative h-[300px] rounded-xl overflow-hidden mb-8 group">
      <Image
        src={getImageUrl(event.coverImage)}
        alt={event.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 relative rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
              <Image
                src={getImageUrl(event.image)}
                alt={event.organizationUnit.title}
                fill
                className="object-contain p-2"
              />
            </div>
            <div>
              <Badge variant="secondary" className="mb-2 backdrop-blur-sm">
                {event.organizationUnit.title}
              </Badge>
              <h1 className="text-2xl font-bold text-white">{event.title}</h1>
            </div>
          </div>

          <div className="flex gap-4 text-white/80 text-sm backdrop-blur-sm bg-black/20 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(event.date), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(event.date), "h:mm a")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
