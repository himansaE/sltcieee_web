"use client";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { EventStatus, EventType } from "@prisma/client";
import { eventStatusNames, eventTypeNames } from "@/lib/constant/event";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { updateEventStatus } from "@/lib/api/events.Fn";

interface EventDetailsSectionProps {
  date: Date;
  location: string;
  eventType: EventType;
  status: EventStatus;
  eventId: string;
  simpleDescription?: string | null;
}

export function EventDetailsSection({
  date,
  location,
  eventType,
  status,
  eventId,
  simpleDescription,
}: EventDetailsSectionProps) {
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState(status);

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: updateEventStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      toast.success("Event status updated");
    },
    onError: () => {
      toast.error("Failed to update event status");
    },
  });

  return (
    <div className="bg-white rounded-xl border p-6 space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-xl font-semibold">Event Details</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">Date</p>
            <p className="text-muted-foreground">
              {format(new Date(date), "PPP")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">Time</p>
            <p className="text-muted-foreground">
              {format(new Date(date), "p")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-muted-foreground">{location}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">Type</p>
            <p className="text-muted-foreground">{eventTypeNames[eventType]}</p>
          </div>
        </div>

        {simpleDescription && (
          <div className="flex items-start gap-3 text-sm">
            <Users className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="font-medium">Short Description</p>
              <p className="text-muted-foreground break-words">
                {simpleDescription}
              </p>
            </div>
          </div>
        )}

        <Separator />

        <p className="font-medium">Edit Event status</p>

        <Select
          value={newStatus}
          onValueChange={(value) => setNewStatus(value as EventStatus)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(eventStatusNames).map(([key, label]) => (
              <SelectItem key={key} value={key} className="capitalize">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="default"
          className="w-full"
          disabled={status === newStatus || isUpdatingStatus}
          onClick={() =>
            updateStatus({
              id: eventId,
              status: newStatus,
            })
          }
          loading={isUpdatingStatus}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
