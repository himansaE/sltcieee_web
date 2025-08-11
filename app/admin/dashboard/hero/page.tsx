import React from "react";
import HeroCreateClient from "@/features/dashboard/components/HeroCreateClient";
import HeroListClient from "@/features/dashboard/components/HeroListClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Hero Announcement | Admin" };

export default function Page() {
  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Hero Announcements</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="black">New Announcement</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
            </DialogHeader>
            <HeroCreateClient />
          </DialogContent>
        </Dialog>
      </div>
      <HeroListClient />
    </section>
  );
}

// client wrapped in separate file
