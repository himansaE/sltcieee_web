"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Plus, Users } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/utils";
import { SessionsList } from "./sessions/sessionsList";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AddSessionDialog } from "./sessions/AddSessionDialog";

export function EventDetailsPage({ event }: { event: any }) {
  const [isAddingSession, setIsAddingSession] = useState(false);

  return (
    <div className="container mx-auto py-6">
      {/* Event Header */}
      <div className="relative h-[300px] rounded-xl overflow-hidden mb-8">
        <Image
          src={getImageUrl(event.coverImage)}
          alt={event.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 relative rounded-lg overflow-hidden bg-white">
              <Image
                src={getImageUrl(event.image)}
                alt={event.organizationUnit.title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">
                {event.organizationUnit.title}
              </Badge>
              <h1 className="text-2xl font-bold text-white">{event.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Event Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">
              Event Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-muted-foreground">
                    {format(new Date(event.date), "PPP")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-muted-foreground">
                    {format(new Date(event.date), "p")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Type</p>
                  <p className="text-muted-foreground">{event.eventType}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Sessions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Sessions</h2>
              <Button onClick={() => setIsAddingSession(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Session
              </Button>
            </div>

            <SessionsList sessions={event.EventSession} eventId={event.id} />
          </div>
        </div>
      </div>

      <AddSessionDialog
        open={isAddingSession}
        onOpenChange={setIsAddingSession}
        eventId={event.id}
      />
    </div>
  );
}
