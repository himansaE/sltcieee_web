"use client";

import { useState } from "react";
import { useUser, useDeleteUser } from "@/lib/api/users.Fn";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DeleteUserDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({
  userId,
  open,
  onOpenChange,
}: DeleteUserDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const { data: user, isLoading } = useUser(userId);
  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser();

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "??";
  };

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== "delete") return;

    try {
      await deleteUser(userId);
      toast.success("User deleted successfully");
      onOpenChange(false);
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "An error occurred while deleting the user";
      toast.error(errorMsg);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Delete User</DialogTitle>
          </div>
          <DialogDescription asChild>
            <div className="space-y-6 pt-4 text-left">
              {isLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !user ? (
                <div className="py-6 text-center text-destructive">
                  User not found or failed to load
                </div>
              ) : (
                <>
                  {/* User Info */}
                  <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
                    <div className="w-1 h-full bg-destructive/50 rounded-full" />
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar>
                        <AvatarImage src={user.image || ""} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {user.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                        <div className="mt-1">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "mt-1 text-xs",
                              user.role === "admin" && "bg-blue-500 text-white",
                              user.role === "content" && "bg-yellow-500 text-white",
                              user.role === "user" && "bg-slate-500 text-white"
                            )}
                          >
                            {user.role.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-destructive">
                      Warning: This action cannot be undone
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This will permanently delete this user account and all associated data.
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
                </>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={
              isLoading ||
              isDeleting ||
              !user ||
              confirmText.toLowerCase() !== "delete"
            }
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete User"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}