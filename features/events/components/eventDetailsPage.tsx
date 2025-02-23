"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, SaveIcon, Trash } from "lucide-react";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { useState, Suspense } from "react";
import { eventStatusNames } from "@/lib/constant/event";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SimpleMDXEditor } from "@/features/mdxEditor/components/simpleEditor.";
import { MarkdownRender } from "@/features/markdown/render";
import { EventDetailsSection } from "./details/EventDetailsSection";
import { EventWithOrganization, updateEvent } from "@/lib/api/events.Fn";
import { useEvent } from "@/hooks/useEvents";
import { EventDetailsSkeleton } from "./details/EventDetailsSkeleton";
import { EventErrorState } from "./details/EventErrorState";
import { EventGallerySection } from "./details/EventGallerySection";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AddNewEvent from "./addEvent";

export function EventDetailsPage({
  event: ssrEvent,
}: {
  event: EventWithOrganization;
}) {
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [descriptionEditState, setDescriptionEditState] = useState(false);
  const [description, setDescription] = useState(ssrEvent.description);

  const queryClient = useQueryClient();

  const {
    data: event,
    isLoading,
    error,
    refetch: refetchEvent,
  } = useEvent<true>({
    withOrganization: true,
    initialData: ssrEvent,
    id: ssrEvent.id,
  });

  const { mutateAsync: updateEventMutation, isPending: isUpdatingEvent } =
    useMutation({
      mutationFn: updateEvent,
    });

  const updateDescription = async () => {
    if (!event) return;
    try {
      await updateEventMutation({
        id: event.id,
        data: {
          description: description,
        },
      });
      queryClient.invalidateQueries({ queryKey: ["event", event.id] });
      toast.success("Event description updated");
      setDescriptionEditState(false);
    } catch (error) {
      console.error("Failed to update event description", error);
      toast.error("Failed to update event description");
    }
  };

  if (isLoading) {
    return <EventDetailsSkeleton />;
  }

  if (error || !event) {
    return <EventErrorState />;
  }

  return (
    <Suspense fallback={<EventDetailsSkeleton />}>
      <div className="container mx-auto py-6 space-y-8">
        {/* Event Header */}

        <div className="relative h-[300px] rounded-xl overflow-hidden mb-8">
          <div className="absolute top-4 left-4 z-20">
            <Badge variant="default" className="bg-primary/90 backdrop-blur-sm">
              {eventStatusNames[event.status]}
            </Badge>
          </div>

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
              <DropdownMenuContent align="end" className="">
                <DropdownMenuItem onClick={() => setIsEditingEvent(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
          <div className="lg:col-span-1">
            <EventDetailsSection
              date={new Date(event.date)}
              location={event.location}
              eventType={event.eventType}
              status={event.status}
              eventId={event.id}
            />
          </div>

          {/* Right Column - Description */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border min-h-full flex flex-col overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold">Description</h2>
                {descriptionEditState ? (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setDescriptionEditState(false)}
                      disabled={isUpdatingEvent}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="default"
                      onClick={updateDescription}
                      disabled={isUpdatingEvent}
                      loading={isUpdatingEvent}
                      className="w-24"
                    >
                      <SaveIcon />
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setDescriptionEditState(true)}
                  >
                    <Edit /> Edit
                  </Button>
                )}
              </div>
              {descriptionEditState ? (
                <div className="flex-1 flex [&>div]:flex-1 [&>div>.mdxeditor]:h-full [&>div>.mdxeditor]:border-none [&>div_.mdxeditor-toolbar]:rounded-none">
                  <SimpleMDXEditor
                    markdown={description}
                    onChange={(value) => setDescription(value)}
                    readOnly={isUpdatingEvent}
                    className={cn(isUpdatingEvent && "opacity-50")}
                  />
                </div>
              ) : (
                <div className="p-4 py-5 ">
                  <MarkdownRender content={event.description} />
                </div>
              )}
            </div>
          </div>
        </div>

        <EventGallerySection event={event} />
      </div>
      <AddNewEvent
        mode="edit"
        event={event}
        open={isEditingEvent}
        onOpenChange={setIsEditingEvent}
        refetchEvents={refetchEvent}
        redirectOnEdit={true}
      />
    </Suspense>
  );
}
