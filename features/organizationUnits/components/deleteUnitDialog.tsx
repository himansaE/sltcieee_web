import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AlertCircle, AlertTriangle, Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OrganizationUnitWithEvents } from "@/lib/api/organizationUnitFn";

interface DeleteUnitDialogProps {
  unit: OrganizationUnitWithEvents;
  onDeleted: () => void;
}

export function DeleteUnitDialog({ unit, onDeleted }: DeleteUnitDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const { mutate: deleteUnit, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/admin/organization-units/${unit.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Organization unit deleted successfully");
      setIsOpen(false);
      onDeleted();
    },
    onError: () => {
      toast.error("Failed to delete organization unit");
    },
  });

  const handleDelete = () => {
    if (confirmText.toLowerCase() !== "delete") return;
    deleteUnit();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle>Delete Organization Unit</DialogTitle>
            </div>
            <DialogDescription asChild>
              <div className="space-y-6 pt-4 text-left">
                {/* Unit Info */}
                <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
                  <div className="w-1 h-full bg-destructive/50 rounded-full" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {unit.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {unit.description}
                    </p>
                  </div>
                </div>

                {/* Warning Section */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    Warning: This action cannot be undone
                  </h4>
                  <div className="bg-destructive/10 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-medium">
                      The following will be permanently deleted:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-background">
                          {unit.events.length} Events
                        </Badge>
                        <span className="text-muted-foreground">
                          All associated events
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-background">
                          Content
                        </Badge>
                        <span className="text-muted-foreground">
                          Unit blogs & content
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Confirmation Input */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">
                    To confirm, type{" "}
                    <span className="font-mono bg-muted px-2 py-1 rounded">
                      delete
                    </span>{" "}
                    below:
                  </p>
                  <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type 'delete' to confirm"
                    className={cn(
                      confirmText.toLowerCase() === "delete" &&
                        "border-destructive"
                    )}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <div className="flex w-full flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="sm:flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={confirmText.toLowerCase() !== "delete" || isPending}
                className="sm:flex-[2]"
              >
                {isPending ? (
                  <Spinner className="mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                {isPending ? "Deleting..." : "Delete Organization Unit"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
