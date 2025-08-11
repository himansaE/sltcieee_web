"use client";
import React from "react";
import HeroForm from "./HeroForm";
import { useCreateHero } from "@/lib/api/hero.Fn";

export default function HeroCreateClient() {
  const create = useCreateHero();
  return (
    <div className="relative">
      <HeroForm
        onSubmit={(data) =>
          create.mutate(data as any, {
            onSuccess: () => {
              // Best-effort close: send Escape to Radix Dialog
              document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" } as any));
            },
          })
        }
        submitLabel={create.isPending ? "Creating..." : "Create Announcement"}
      />

      {create.isPending && (
        <div
          aria-hidden
          className="absolute inset-0 bg-background/70 pointer-events-auto flex items-center justify-center rounded-md"
        >
          <span className="text-sm text-muted-foreground">Saving…</span>
        </div>
      )}
    </div>
  );
}
