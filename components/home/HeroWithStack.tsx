"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroCountdown from "./HeroCountdown";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CardSwapHandle } from "@/components/ui/card-swap";
import HeroCardStack from "@/components/home/HeroCardStack";

export default function HeroWithStack({ heroes }: { heroes: any[] }) {
  // Build stack items purely from hero announcements; do not show events.
  const items = heroes.map((h, idx) => ({
    id: h.id ?? String(idx),
    title: h.headline ?? h.internalTitle ?? "",
    tag: h.subHeadline ?? "",
    href:
      Array.isArray(h.buttons) && h.buttons.length > 0
        ? h.buttons[0]?.url
        : undefined,
    image: h.desktopImageUrl || "/sb-icon-color.webp",
  }));

  const [active, setActive] = React.useState(0);
  const swapRef = React.useRef<CardSwapHandle>(null);

  const currentHero = heroes[active] ?? heroes[0];
  const current = items[active] ?? items[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Left: text bound to visible card */}
      <div className="flex flex-col gap-5 md:gap-6 rounded-2xl p-6 md:p-10 shadow-lg bg-black/25 backdrop-blur-md border border-white/10 items-start">
    {currentHero?.badgeEnabled && currentHero?.badgeText ? (
          <span className="inline-block w-fit rounded-full bg-white/10 text-white/90 border border-white/20 px-3 py-1 text-[11px] uppercase tracking-wide">
      {currentHero.badgeText}
          </span>
        ) : null}

        <h1 className="text-4xl sm:text-5xl md:text-6xl/[1.05] font-extrabold tracking-tight text-balance drop-shadow-sm">
          {current.title}
        </h1>
        {current.tag ? <p className="text-white/80 text-lg md:text-xl max-w-3xl text-pretty">{current.tag}</p> : null}

        {current.href ? (
          <div className="mt-2">
            <Button asChild className="rounded-full bg-[#0166aa] hover:bg-[#015a93] text-white shadow-lg shadow-[#0166aa]/30">
              <Link href={current.href}>Open</Link>
            </Button>
          </div>
        ) : null}

    {currentHero?.countdownEnabled && currentHero?.countdownTo ? (
          <div className="mt-8">
      <HeroCountdown target={currentHero.countdownTo} label={currentHero.countdownLabel} />
          </div>
        ) : null}
      </div>

      {/* Right: Card stack with controls */}
      <div className="relative min-h-[380px]">
        <HeroCardStack items={items} onActiveChange={setActive} swapRef={swapRef} />
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => swapRef.current?.prev()} className="rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-white/70 min-w-[56px] text-center">{(active % items.length) + 1} / {items.length}</span>
          <Button variant="outline" onClick={() => swapRef.current?.next()} className="rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
