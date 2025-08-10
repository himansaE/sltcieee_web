"use client";
import Image from "next/image";
import CardSwap, { Card, type CardSwapHandle } from "@/components/ui/card-swap";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";

export interface HeroCardItem {
  id: string;
  title: string;
  tag?: string;
  href?: string;
  image: string;
}

export default function HeroCardStack({
  items,
  width = 520,
  height = 380,
  onActiveChange,
  swapRef,
}: {
  items: HeroCardItem[];
  width?: number;
  height?: number;
  onActiveChange?: (idx: number) => void;
  swapRef?: React.Ref<CardSwapHandle>;
}) {
  if (!items?.length) return null;
  return (
    <div className="relative h-[380px] md:h-[450px] lg:h-[520px]">
      <CardSwap ref={swapRef} width={width} height={height} pauseOnHover onActiveChange={onActiveChange} className="pointer-events-none">
        {items.map((it, i) => (
          <Card key={it.id} className="bg-neutral-950/90 border-white/10">
            <div className="border-b border-white/15 bg-gradient-to-t from-[#0b0b0b] to-[#1a132a] rounded-t-xl">
              <div className="flex items-center gap-2 text-xs text-white/80 px-3 py-2">
                <span className="i-lucide-bolt h-3 w-3" />
                <span>{it.tag ?? "Featured"}</span>
              </div>
            </div>
            <div className="relative p-2">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                <Image src={/^https?:\/\//.test(it.image) ? it.image : getImageUrl(it.image)} alt={it.title} fill className="object-cover" />
              </div>
              <div className="p-3">
                {it.href ? (
                  <Link href={it.href} className="text-sm font-medium hover:underline">
                    {it.title}
                  </Link>
                ) : (
                  <p className="text-sm font-medium">{it.title}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </CardSwap>
    </div>
  );
}
