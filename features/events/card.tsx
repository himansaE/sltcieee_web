import type { EventWithOrganization } from "@/lib/api/events.Fn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, MoreVertical, Users } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { eventStatusNames, eventTypeNames } from "@/lib/constant/event";
import Link from "next/link";

interface EventCardProps {
  event: EventWithOrganization;
}

export const EventCard = ({ event }: EventCardProps) => {
  const eventDate = new Date(event.date);

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white border border-border transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
      {/* Status Indicator */}

      <div className="absolute top-4 left-4 z-20">
        <Badge variant="default" className="bg-primary/90 backdrop-blur-sm">
          {eventStatusNames[event.status]}
        </Badge>
      </div>

      {/* Actions Menu */}
      <div className="absolute top-4 right-4 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-white/50 backdrop-blur-sm hover:bg-white/75"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Event</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cover Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10" />
        <Image
          src={getImageUrl(event.coverImage)}
          alt={event.title}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          fill
          unoptimized
        />

        {/* Organization Badge */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full pl-1 pr-3 py-1">
            <Avatar className="h-6 w-6 ring-2 ring-white">
              <AvatarImage
                src={getImageUrl(event.image)}
                alt={event.organizationUnit.title}
                className="object-contain bg-transparent"
              />
              <AvatarFallback className="text-xs">
                {event.organizationUnit.title.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-gray-800">
              {event.organizationUnit.title}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 text-ellipsis">
            {event.description}
          </p>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{format(eventDate, "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>{format(eventDate, "h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span>{eventTypeNames[event.eventType]}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/admin/events/${event.slug}`}>View Event</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
