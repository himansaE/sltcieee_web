"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroCountdown from "./HeroCountdown";
import type { CardSwapHandle } from "@/components/ui/card-swap";
import HeroCardStack from "@/components/home/HeroCardStack";
import { cn, getImageUrl } from "@/lib/utils";
import DarkVeil from "@/components/background/DarkVeil";
// import { UrlObject } from "url";

type CTA = { text: string; url: string; style: "PRIMARY" | "SECONDARY" };
type HeroLike = {
  id?: string;
  internalTitle?: string;
  headline?: string;
  subHeadline?: string | null;
  buttons?: CTA[];
  desktopImageUrl?: string | null;
  badgeEnabled?: boolean;
  badgeText?: string | null;
  countdownEnabled?: boolean;
  countdownTo?: string | Date | null;
  countdownLabel?: string | null;
};

export default function HeroWithStack({ heroes }: { heroes: unknown[] }) {
  const heroesArr = heroes as HeroLike[];
  // Build stack items purely from hero announcements; do not show events.
  const items = heroesArr.map((h, idx) => ({
    id: h.id ?? String(idx),
    title: h.headline ?? h.internalTitle ?? "",
    tag: h.subHeadline ?? "",
    href:
      Array.isArray(h.buttons) && h.buttons.length > 0
        ? h.buttons[0]?.url
        : undefined,
    image: h.desktopImageUrl || "/sb-icon-color.webp",
  badge: h.badgeEnabled && h.badgeText ? h.badgeText : undefined,
  }));

  const [active, setActive] = React.useState(0);
  const swapRef = React.useRef<CardSwapHandle>(null);

  const currentHero = heroesArr[active] ?? heroesArr[0];
  const current = items[active] ?? items[0];

  return (
    <div className="relative">
      {/* Background synced to active hero with Dark Veil */}
      <div className="absolute inset-0 -z-10">
        {/* Base image */}
        {current?.image ? (
          <img
            src={/^https?:\/\//.test(current.image) ? current.image : getImageUrl(current.image)}
            alt={current.title || "Hero"}
            className="w-full h-full object-cover"
          />
        ) : null}
        {/* Subtle darkening for legibility (placed below the effect now) */}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        {/* Dark Veil effect overlay (topmost in background stack) */}
        <div className="absolute inset-0 pointer-events-none">
          <DarkVeil
            hueShift={-20}
            noiseIntensity={0.12}
            scanlineIntensity={0.18}
            scanlineFrequency={8.0}
            warpAmount={0.04}
            speed={0.55}
          />
        </div>
      </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Left: text bound to visible card */}
      <div className="flex flex-col gap-5 md:gap-6 rounded-2xl p-6 pt-16 md:pt-10 md:p-10 items-start">
    {currentHero?.badgeEnabled && currentHero?.badgeText ? (
          <span className="inline-block w-fit rounded-full bg-white/10 text-white/90 border border-white/20 px-3 py-1 text-[11px] uppercase tracking-wide">
      {currentHero.badgeText}
          </span>
        ) : null}

        <h1 className="text-4xl sm:text-5xl md:text-6xl/[1.05] font-extrabold tracking-tight text-balance drop-shadow-sm">
          {current.title}
        </h1>
        {current.tag ? <p className="text-white/80 text-lg md:text-xl max-w-3xl text-pretty">{current.tag}</p> : null}

    {Array.isArray(currentHero?.buttons) && currentHero.buttons.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-3">
  {currentHero.buttons.map((b: CTA, i: number) => {
              const isSecondary = b.style === "SECONDARY";
              const btnClass = isSecondary
                ? "rounded-full border border-white/30 bg-white/0 text-white hover:bg-white/10 hover:text-white"
                : "rounded-full bg-[#0166aa] hover:bg-[#015a93] text-white shadow-lg shadow-[#0166aa]/30";
              return (
                <Button key={i} asChild className={cn(btnClass,"min-w-32")}>
                  <Link href={b.url}>{b.text}</Link>
                </Button>
              );
            })}
          </div>
        ) : null}

    {currentHero?.countdownEnabled && currentHero?.countdownTo ? (
          <div className="mt-8">
      <HeroCountdown target={currentHero.countdownTo} label={currentHero.countdownLabel} />
          </div>
        ) : null}
      </div>

      {/* Right: Card stack with controls */}
  <div className="relative">
        <HeroCardStack items={items} onActiveChange={setActive} swapRef={swapRef} />
       
      </div>
    </div>
  </div>
  );
}
