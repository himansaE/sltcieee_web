"use client";
import React, { useMemo, useState } from "react";
import { useDeleteHero, useHeroAnnouncements, useUpdateHero } from "@/lib/api/hero.Fn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import HeroForm from "./HeroForm";
import { format } from "date-fns";

export default function HeroListClient() {
  const { data, isLoading, isError } = useHeroAnnouncements();
  const del = useDeleteHero();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const editingItem = useMemo(() => data?.find(d => d.id === editingId), [data, editingId]);
  const update = useUpdateHero(editingId || "");

  if (isLoading) return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;
  if (isError) return <div className="p-4 text-sm text-red-500">Failed to load announcements</div>;

  return (
    <div className="space-y-4">
      {data?.length ? (
        data.map((item) => (
          <Card key={item.id} className="p-4 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-base font-semibold">{item.internalTitle}</div>
              <div className="text-sm text-muted-foreground">{item.headline}</div>
              <div className="text-xs text-muted-foreground">Updated: {format(new Date(item.updatedAt), "PPpp")}</div>
              {item.scheduleEnabled && (
                <div className="text-xs text-[#0166aa]">Active window: {item.startAt ? format(new Date(item.startAt), "PPpp") : "?"} → {item.endAt ? format(new Date(item.endAt), "PPpp") : "?"}</div>
              )}
            </div>
            <div className="flex gap-2">
              <Dialog open={open && editingId === item.id} onOpenChange={(v)=>{ if (!v) { setOpen(false); setEditingId(null);} }}>
                <DialogTrigger asChild>
                  <Button variant="black" onClick={()=>{ setEditingId(item.id); setOpen(true); }}>Edit</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Announcement</DialogTitle>
                  </DialogHeader>
                  {editingItem && (
                    <HeroForm
                      initialValues={{
                        internalTitle: editingItem.internalTitle,
                        headline: editingItem.headline,
                        subHeadline: editingItem.subHeadline,
                        buttons: editingItem.buttons as any,
                        backgroundType: editingItem.backgroundType as any,
                        desktopImageUrl: editingItem.desktopImageUrl,
                        imageAlt: editingItem.imageAlt,
                        overlay: editingItem.overlay as any,
                        contentLayout: editingItem.contentLayout as any,
                        countdownEnabled: editingItem.countdownEnabled,
                        countdownTo: editingItem.countdownTo ? new Date(editingItem.countdownTo) as any : undefined,
                        countdownLabel: editingItem.countdownLabel,
                        badgeEnabled: editingItem.badgeEnabled,
                        badgeText: editingItem.badgeText,
                        scheduleEnabled: editingItem.scheduleEnabled,
                        startAt: editingItem.startAt ? new Date(editingItem.startAt) as any : undefined,
                        endAt: editingItem.endAt ? new Date(editingItem.endAt) as any : undefined,
                      }}
                      submitLabel="Update Announcement"
                      onSubmit={(payload)=> update.mutate(payload as any, { onSuccess: ()=> { setOpen(false); setEditingId(null); } })}
                    />
                  )}
                </DialogContent>
              </Dialog>
              <Button variant="destructive" onClick={()=> setConfirmId(item.id)}>Delete</Button>
              <AlertDialog
                open={confirmId === item.id}
                onOpenChange={(o)=>{
                  // Prevent closing while deletion pending
                  if (!o && del.isPending) return;
                  if (!o) setConfirmId(null);
                }}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this announcement?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The hero announcement will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={del.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={del.isPending}
                      onClick={async ()=>{
                        try {
                          await del.mutateAsync(item.id);
                          setConfirmId(null);
                        } catch (e) {
                          // keep dialog open; user can retry or cancel
                        }
                      }}
                    >
                      {del.isPending ? (
                        <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Deleting...</span>
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        ))
      ) : (
        <div className="p-4 text-sm text-muted-foreground">No announcements yet.</div>
      )}
    </div>
  );
}
