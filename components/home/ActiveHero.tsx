import "server-only";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import HeroCountdown from "./HeroCountdown";
import { unstable_noStore as noStore } from "next/cache";
import { getHeroesForHome } from "@/lib/services/hero";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import HeroWithStack from "@components/home/HeroWithStack";

// Server component that renders the active hero announcement.
// Falls back to null when no hero is active; page can decide fallback UI.
export default async function ActiveHero() {
  noStore();
  try {
  const heroes = await getHeroesForHome(5);
    if (!heroes || heroes.length === 0) return<> </>;
  const hero = heroes[0];

  // derive background styles
  const overlayClass = overlayToClass(hero.overlay ?? "MEDIUM");
  const isGradient = false; // gradients disabled per request; always use image
  const bgImage = hero.desktopImageUrl || "";

  return (
    <section
      role="banner"
      aria-label="Homepage hero announcement"
      className="relative w-full bg-neutral-950 text-white overflow-hidden min-h-[70svh] md:min-h-[80svh]"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        {bgImage ? (
          <Image
            src={resolveImage(bgImage)}
            alt={hero.imageAlt ?? "Hero background"}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : null}
        {/* Overlays: base opacity + subtle bottom gradient for readability */}
        <div className={`absolute inset-0 ${overlayClass}`} />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        {/* Decorative grid for a modern subtle texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Content */}
      <div
    className={`relative mx-auto max-w-7xl px-6 md:px-8 py-20 md:py-28`}
      >
  <HeroWithStack heroes={heroes as any[]} />
      </div>
    </section>
  );
  } catch {
    return <></>;
  }
}

function CTA({ text, url, style }: { text: string; url: string; style: "PRIMARY" | "SECONDARY" }) {
  if (style === "SECONDARY") {
    return (
      <Button
        asChild
        variant="ghost"
        className="rounded-full border border-white/30 bg-white/0 text-white hover:bg-white/10 hover:text-white"
      >
        <Link href={url}>{text}</Link>
      </Button>
    );
  }
  // PRIMARY with brand color 0166AA
  return (
    <Button
      asChild
      className="rounded-full bg-[#0166aa] hover:bg-[#015a93] text-white shadow-lg shadow-[#0166aa]/30"
    >
      <Link href={url}>{text}</Link>
    </Button>
  );
}


function overlayToClass(o: string | null | undefined) {
  switch (o) {
    case "LIGHT":
      return "bg-black/20";
    case "DARK":
      return "bg-black/60";
    case "MEDIUM":
    default:
      return "bg-black/40";
  }
}

function gradientToClass(g: string | null | undefined) {
  switch (g) {
    case "SLTC_TEAL_BLUE":
  return "bg-gradient-to-br from-[#0166aa] via-[#0181d6] to-[#014e7e]";
    case "IEEE_BLUE":
    default:
  return "bg-gradient-to-br from-[#0166aa] to-[#014e7e]";
  }
}

function contentLayoutToClass(layout: string | null | undefined) {
  switch (layout) {
    case "CENTER":
  return "text-center items-center justify-center";
    case "LEFT":
    default:
  return "text-left items-start justify-center";
  }
}

function resolveImage(url: string) {
  return /^https?:\/\//i.test(url) ? url : getImageUrl(url);
}
