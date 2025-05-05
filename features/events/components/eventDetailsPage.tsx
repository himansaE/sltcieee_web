"use client";

import { EventHeader } from "./details/EventHeader";
import { EventDetailsSection } from "./details/EventDetailsSection";
import { EventDetailsSkeleton } from "./details/EventDetailsSkeleton";
import { EventErrorState } from "./details/EventErrorState";
import { EventGallerySection } from "./gallery/EventGallerySection";
import { Suspense, useState } from "react";
import AddNewEvent from "./addEvent";
import { useEvent } from "@/hooks/useEvent";
import { EventWithDetails } from "@/types/events";
import { MarkdownRender } from "@/features/markdown/render";
import { Button } from "@/components/ui/button";
import { Edit, Save as SaveIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { updateEvent } from "@/lib/api/events.Fn";
import { toast } from "sonner";
import { SimpleMDXEditor } from "@/features/mdxEditor/components/simpleEditor.";
import Spinner from "@/components/ui/spinner";

export function EventDetailsPage({
  event: ssrEvent,
}: {
  event: EventWithDetails;
}) {
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [descriptionEditState, setDescriptionEditState] = useState(false);
  const [description, setDescription] = useState(ssrEvent.description || "");

  const { mutateAsync: updateEventMutation, isPending: isUpdatingEvent } =
    useMutation({
      mutationFn: updateEvent,
    });

  const {
    data: event,
    isLoading,
    error,
    refetch,
  } = useEvent<true>({
    withOrganization: true,
    initialData: ssrEvent,
    id: ssrEvent.id,
  });

  const updateDescription = async () => {
    if (!description) {
      toast.error("Description cannot be empty.");
      return;
    }
    if (!event) {
      toast.error("Event not found.");
      return;
    }

    try {
      const msg = toast.loading("Updating description...");
      await updateEventMutation({
        id: event.id,
        data: {
          description: description,
        },
      });
      toast.success("Description updated successfully", { id: msg });
      setDescriptionEditState(false);
      refetch();
    } catch {
      toast.error("Failed to update description. Please try again.", {
        description: "There was an error updating your description.",
      });
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
        <EventHeader event={event} onEdit={() => setIsEditingEvent(true)} />

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
                      className="w-24"
                    >
                      {isUpdatingEvent ? (
                        <>
                          <Spinner className="text-white" />
                          Saving
                        </>
                      ) : (
                        <>
                          <SaveIcon className="h-4 w-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setDescriptionEditState(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
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
                <div className="p-4 py-5">
                  <MarkdownRender
                    content={event.description || "No description available."}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mt-8">
          <EventGallerySection event={event} />
        </div>

        <AddNewEvent
          mode="edit"
          event={event}
          open={isEditingEvent}
          onOpenChange={setIsEditingEvent}
          refetchEvents={refetch}
          redirectOnEdit={true}
        />
      </div>
    </Suspense>
  );
}
