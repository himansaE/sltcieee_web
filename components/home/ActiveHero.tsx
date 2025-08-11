import "server-only";
// import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import { getHeroesForHome } from "@/lib/services/hero";
// import { getImageUrl } from "@/lib/utils";
// import Link from "next/link";
import HeroWithStack from "@components/home/HeroWithStack";

// Server component that renders the active hero announcement.
// Falls back to null when no hero is active; page can decide fallback UI.
export default async function ActiveHero() {
  noStore();
  try {
  const heroes = await getHeroesForHome(5);
    if (!heroes || heroes.length === 0) return<> </>;
  // first hero available is used by client to seed state; server doesn't need it here

  return (
    <section
      role="banner"
      aria-label="Homepage hero announcement"
  className="relative w-full bg-neutral-950 text-white overflow-hidden min-h-[70svh] md:min-h-[80svh]"
    >
      {/* Content */}
      <div
    className={`relative mx-auto max-w-7xl px-6 md:px-8 py-20 md:py-28`}
      >
  <HeroWithStack heroes={heroes} />
      </div>
    </section>
  );
  } catch {
    return <></>;
  }
}

// (No local CTA helpers; CTA rendering happens in the client wrapper)
