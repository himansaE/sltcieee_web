"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

export type CarouselItem = {
  id: string;
  title: string;
  tag?: string;
  href?: string;
  image: string;
};

export function HeroCarousel({
  items,
  badgeEnabled,
  badgeText,
  countdown,
}: {
  items: CarouselItem[];
  badgeEnabled?: boolean;
  badgeText?: string | null;
  countdown?: React.ReactNode;
}) {
  const [idx, setIdx] = React.useState(0);
  const total = items?.length || 0;
  if (!total) return null;

  const current = items[idx];

  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  const imageSrc = /^https?:\/\//i.test(current.image)
    ? current.image
    : getImageUrl(current.image);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Left: dynamic text based on current item */}
      <div className="flex flex-col gap-5 md:gap-6 rounded-2xl p-6 md:p-10 shadow-lg bg-black/25 backdrop-blur-md border border-white/10 items-start">
        {badgeEnabled && badgeText ? (
          <span className="inline-block w-fit rounded-full bg-white/10 text-white/90 border border-white/20 px-3 py-1 text-[11px] uppercase tracking-wide">
            {badgeText}
          </span>
        ) : null}

        <h1 className="text-4xl sm:text-5xl md:text-6xl/[1.05] font-extrabold tracking-tight text-balance drop-shadow-sm">
          {current.title}
        </h1>

        {current.tag ? (
          <p className="text-white/80 text-lg md:text-xl max-w-3xl">{current.tag}</p>
        ) : null}

        {current.href ? (
          <div className="mt-2">
            <Button asChild className="rounded-full bg-[#0166aa] hover:bg-[#015a93] text-white shadow-lg shadow-[#0166aa]/30">
              <Link href={current.href}>Open</Link>
            </Button>
          </div>
        ) : null}

        {countdown ? <div className="mt-6">{countdown}</div> : null}
      </div>

      {/* Right: single card with nav */}
      <div className="relative">
        <div className="relative aspect-[4/3] w-full max-w-[560px] mx-auto overflow-hidden rounded-xl border border-white/10 bg-black/30">
          <Image src={imageSrc} alt={current.title} fill className="object-cover" />
        </div>
        {/* Controls */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button variant="outline" onClick={prev} className="rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-white/70 min-w-[56px] text-center">{idx + 1} / {total}</span>
          <Button variant="outline" onClick={next} className="rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HeroCarousel;
