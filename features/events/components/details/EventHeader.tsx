import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { EventWithDetails } from "@/types/events";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  Edit,
  MoreVertical,
  Trash,
  Loader2,
} from "lucide-react";
import { eventStatusNames } from "@/lib/constant/event";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteEvent } from "@/lib/api/events.Fn";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface EventHeaderProps {
  event: EventWithDetails;
  onEdit: () => void;
}

export function EventHeader({ event, onEdit }: EventHeaderProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const router = useRouter();

  const { mutate: deleteEventMutation, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      return await deleteEvent(event.id);
    },
    onSuccess: () => {
      toast.success("Event deleted successfully");
      setIsDeleteDialogOpen(false);
      // Redirect to events list after deletion
      router.push("/admin/events");
    },
    onError: (error) => {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again.");
    },
  });

  const handleDelete = () => {
    if (confirmText.toLowerCase() !== "delete") return;
    deleteEventMutation();
  };

  return (
    <>
      <div className="relative h-[300px] rounded-xl overflow-hidden">
        {/* Background Image */}
        <Image
          src={getImageUrl(event.coverImage)}
          alt={event.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-20">
          <Badge
            className={cn(
              "px-3 py-1 text-xs font-medium capitalize",
              event.status === "draft" && "bg-slate-500",
              event.status === "comingSoon" && "bg-indigo-500",
              event.status === "dateAnnounced" && "bg-cyan-500",
              event.status === "registrationOpen" && "bg-green-500",
              event.status === "registrationClosed" && "bg-orange-500",
              event.status === "ongoing" && "bg-purple-500",
              event.status === "completed" && "bg-gray-500"
            )}
          >
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
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Event
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Event Info */}
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-white/10 backdrop-blur-md relative overflow-hidden flex-shrink-0">
              <Image
                src={getImageUrl(event.image)}
                alt={`${event.title} logo`}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium">
                {event.organizationUnit.title}
              </p>
              <h1 className="text-2xl font-bold text-white">{event.title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle>Delete Event</DialogTitle>
            </div>
            <DialogDescription asChild>
              <div className="space-y-6 pt-4 text-left">
                {/* Event Info */}
                <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
                  <div className="w-1 h-full bg-destructive/50 rounded-full" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {event.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {event.organizationUnit.title}
                    </p>
                    <div className="mt-1">
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {eventStatusNames[event.status]}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-destructive">
                    Warning: This action cannot be undone
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete this event and all associated
                    data, including gallery images and details.
                  </p>

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">
                      Type &quot;delete&quot; to confirm:
                    </p>
                    <Input
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      className="bg-background"
                      placeholder="delete"
                    />
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={confirmText.toLowerCase() !== "delete" || isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Event"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
