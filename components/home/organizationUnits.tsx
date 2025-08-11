"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import Request from "@/lib/http";

// types.ts (or define within the component file if preferred)
interface GlowStyle {
  boxShadow: string;
}

export interface SurroundingLogoData {
  src: string;
  alt: string;
  name: string;
  description: string;
  borderColorClass: string;
  glowStyle: GlowStyle;
  lineColorClass: string;
  positionClasses: string;
  hight: string;
  textAlignment: string;
  textColorClass: string; // Added textColorClass for text color
  slug?: string; // Will be fetched from DB and merged in
  matchKeys?: string[]; // keywords to match DB units by title/description
}

export interface Line {
  id: string;
  top: number;
  left: number;
  width: number;
  angle: number;
  colorClass: string;
}

// Data for surrounding logos, using your specified values
const surroundingLogosData: SurroundingLogoData[] = [
  {
    src: "/logos/SLTC IES Logos/IES-Logo_White.png",
    alt: "Industrial Electronics Society Logo",
    name: "IEEE Industrial Electronics Society Student Branch Chapter of SLTC",
    description:
      "Dedicated to advancing industrial practices and the application of industrial electronics and electrical engineering through research, innovation, and education",
    borderColorClass: "border-orange-500",
    glowStyle: { boxShadow: "0px 4px 160.4px 0px rgb(245, 131, 59)" },
    lineColorClass: "bg-orange-500/70",
    positionClasses: "top-[25px] right-[0px] md:top-[150px] md:right-[100px]",
    textAlignment: "text-left",
    hight: "h-[60px] w-[180px]",
    textColorClass: "text-orange-500",
    matchKeys: ["IES", "Industrial Electronics"],
  },
  {
    src: "/logos/SLTC WIE Logos/WIE New Logo white.png",
    alt: "WIE SLTC Logo",
    name: "IEEE WIE Student Branch Affinity Group of SLTC",
    description:
      "Empower women in STEM & IT by building leadership skills, career growth, and the expertise needed to succeed in engineering and technology.",
    borderColorClass: "border-purple-500",
    glowStyle: { boxShadow: " 0px 4px 146.7px 0px rgb(240, 135, 255)" },
    lineColorClass: "bg-purple-500/70",
    positionClasses:
      "top-[150px] right-[100px] md:top-[325px] md:right-[180px]",
    textAlignment: "text-right",
    hight: "h-[80px] w-[180px]",
    textColorClass: "text-purple-500",
    matchKeys: ["WIE", "Women in Engineering"],
  },
  {
    src: "/logos/SLTC IAS Logos/IAS New Logo 2024 White.png",
    alt: "IAS SLTC Logo",
    name: "IEEE Industry Applications Society Student Branch Chapter of SLTC",
    description:
      "Connects theory with real-world practice, focusing on technical excellence, innovation, and career development through industry partnerships.",
    borderColorClass: "border-green-500",
    glowStyle: { boxShadow: "0px 4px 146px 0px rgb(0, 142, 73)" },
    lineColorClass: "bg-green-500/70",
    positionClasses:
      "top-[275px] right-[100px] md:top-[500px] md:right-[180px]",
    textAlignment: "text-left",
    hight: "h-[60px] w-[180px]",
    textColorClass: "text-green-500",
    matchKeys: ["IAS", "Industry Applications"],
  },
  {
    src: "/logos/SLTC CS Logos/IEEE-CS_LogoTM-White.png",
    alt: "CS SLTC Logo",
    name: "IEEE Computer Society Student Branch Chapter of SLTC",
    description:
      "Empowers students in enhancing their technical and professional skills, with a strong focus on Computing and IT, inspiring innovation and preparing them for diverse careers in the tech industry.",
    borderColorClass: "border-yellow-500",
    glowStyle: { boxShadow: "0px 4px 146.5px 0px rgb(250, 164, 26)" },
    lineColorClass: "bg-yellow-500/70",
    positionClasses:
      "top-[400px] right-[0px] md:top-[670px] md:right-[100px] -z-1", // Note: -z-1 used as per original
    textAlignment: "text-right",
    hight: "h-[50px] w-[180px]",
    textColorClass: "text-yellow-500",
    matchKeys: ["CS", "Computer Society"],
  },
];

type UnitLite = { slug: string; title: string; description: string; image: string };

export default function OrganizationUnits() {
  const mainLogoSrc = "/sb-icon-color.webp";

  const mainLogoRef = useRef<HTMLDivElement | null>(null);
  const surroundingLogoRefs = useRef<React.RefObject<HTMLDivElement>[]>(
    surroundingLogosData.map(() => React.createRef<HTMLDivElement>())
  );
  const graphicalContentRef = useRef<HTMLDivElement | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<number>(0);
  // Keep a local copy of the logos so we can enrich with fetched slugs without changing items
  const [logos, setLogos] = useState<SurroundingLogoData[]>(surroundingLogosData);
  // Fetch slugs from DB and merge into the fixed logos list
  useEffect(() => {
    (async () => {
      try {
        const res = await Request.get("/api/organization-units");
        const fetched: UnitLite[] = res?.data?.units || [];

        // Helper to safely build a regex
        const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        // Pass: only match by clear keywords in title/description; do not add new items
        const merged = logos.map((logo) => {
          const match = fetched.find((u) => {
            const title = u.title || "";
            const desc = u.description || "";

            return (logo.matchKeys || []).some((rawKey) => {
              const key = rawKey.trim();
              // Treat short acronyms (CS, IAS, IES, WIE) with word-boundary regex to avoid matching inside words like 'electronics'
              const isAcronym = /^[A-Za-z]{2,4}$/.test(key.replace(/\s+/g, ""));
              if (isAcronym) {
                const re = new RegExp(`\\b${escapeRegExp(key)}\\b`, "i");
                return re.test(title) || re.test(desc);
              }
              // Longer phrases: fallback to case-insensitive substring check
              const keyLc = key.toLowerCase();
              return (
                title.toLowerCase().includes(keyLc) ||
                desc.toLowerCase().includes(keyLc)
              );
            });
          });

          return { ...logo, slug: match?.slug } as SurroundingLogoData;
        });

        setLogos(merged);
      } catch (e) {
        console.error("Failed to fetch organization unit slugs", e);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateLines = useCallback(() => {
    if (
      !mainLogoRef.current ||
      !graphicalContentRef.current ||
      !surroundingLogoRefs.current.every((ref) => ref.current)
    ) {
      return;
    }

    const mainLogoElement = mainLogoRef.current;
    const graphicalContentElement = graphicalContentRef.current;
    const graphicalContentRect =
      graphicalContentElement.getBoundingClientRect();

    const mainLogoRect = mainLogoElement.getBoundingClientRect();
    const mainLogoCenterX =
      mainLogoRect.left + mainLogoRect.width / 2 - graphicalContentRect.left;
    const mainLogoCenterY =
      mainLogoRect.top + mainLogoRect.height / 2 - graphicalContentRect.top;

  const newLinesData: Line[] = logos
      .map((logoData, index) => {
        const surroundingLogoElement =
          surroundingLogoRefs.current[index]?.current;
        if (!surroundingLogoElement) return null;

        const surroundingLogoRect =
          surroundingLogoElement.getBoundingClientRect();
        const surroundingLogoCenterX =
          surroundingLogoRect.left +
          surroundingLogoRect.width / 2 -
          graphicalContentRect.left;
        const surroundingLogoCenterY =
          surroundingLogoRect.top +
          surroundingLogoRect.height / 2 -
          graphicalContentRect.top;

        const deltaX = surroundingLogoCenterX - mainLogoCenterX;
        const deltaY = surroundingLogoCenterY - mainLogoCenterY;
        const width = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        return {
    id: `line-${index}-${logoData.alt.replace(/\s+/g, "-")}`,
          top: mainLogoCenterY,
          left: mainLogoCenterX,
          width: width,
          angle: angle,
          colorClass: logoData.lineColorClass || "bg-white/70",
        };
      })
      .filter((line): line is Line => line !== null);

    setLines(newLinesData);
  }, [logos]);

  useEffect(() => {
    const timerId = setTimeout(calculateLines, 150);
    window.addEventListener("resize", calculateLines);

    return () => {
      clearTimeout(timerId);
      window.removeEventListener("resize", calculateLines);
    };
  }, [calculateLines]);

  const handleImageLoad = () => {
    calculateLines();
  };
  useEffect(() => {
    setSelectedUnit(0);

    const startAutoPlay = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (isAutoPlay) {
        intervalRef.current = setInterval(() => {
          setSelectedUnit((prev) => (prev + 1) % logos.length);
        }, 10000); // Change every 10 seconds
      }
    };

    startAutoPlay();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlay]);

  // Navigation functions
  const goToPrevious = () => {
  setSelectedUnit((prev) => (prev === 0 ? logos.length - 1 : prev - 1));
  };

  const goToNext = () => {
  setSelectedUnit((prev) => (prev + 1) % logos.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  const goToUnit = (index: number) => {
    setSelectedUnit(index);
  };
  return (
    <section
      id="organization-units"
      className="relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-950 via-black to-black text-white py-16 md:py-24 overflow-hidden"
    >
      <div className="mx-auto grid md:grid-cols-2 gap-x-12 gap-y-16 items-center">
        {" "}
        {/* Left Text Content */}
        <div className="space-y-7 px-4 sm:px-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Chapters & Affinity
          </h2>
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="group flex items-center justify-center w-8 h-8 transition-all duration-300 hover:scale-105"
              aria-label="Previous organization unit"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-white group-hover:text-[#76bde3] transition-colors duration-300" />
            </button>

            {/* Progress Indicator Line Buttons */}
            <div className="flex items-center gap-1.5">
        {logos.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-0.5 rounded-full transition-all duration-500 ease-out cursor-pointer",
                    selectedUnit === index
          ? `w-6 ${logos[selectedUnit]?.lineColorClass || "bg-[#0166aa]"}`
                      : "w-1.5 bg-gray-600 hover:bg-gray-500"
                  )}
                  onClick={() => goToUnit(index)}
                />
              ))}
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={toggleAutoPlay}
              className={cn(
                "group flex items-center justify-center w-4 h-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
              )}
              aria-label={isAutoPlay ? "Pause auto-play" : "Start auto-play"}
            >
              {isAutoPlay ? (
                <Pause className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <Play className="w-4 h-4 text-white ml-0.5 group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="group flex items-center justify-center w-4 h-4  transition-all duration-300 hover:scale-105"
              aria-label="Next organization unit"
            >
              <ChevronRight className="w-3.5 h-3.5 text-white group-hover:text-[#76bde3] transition-colors duration-300" />
            </button>
          </div>
          {/* Enhanced content with smooth animations */}
          <div className="transition-all duration-700 ease-in-out transform">
            <h3
              className={cn(
                "text-2xl sm:text-3xl lg:text-4xl font-semibold transition-all duration-700 ease-in-out",
                logos[selectedUnit]?.textColorClass ||
                  "text-white"
              )}
            >
              {logos[selectedUnit]?.name || "IEEE Student Branch of SLTC"}
            </h3>
          </div>
          <div className="transition-all duration-700 ease-in-out">
            <div className="flex flex-col md:items-start gap-4">
              <p className="text-slate-300 leading-relaxed text-lg sm:text-xl line-clamp-3 flex-1">
                {logos[selectedUnit]?.description ||
                  "Explore our diverse chapters and affinity groups, each dedicated to advancing knowledge and innovation in their respective fields. Join us to connect, collaborate, and contribute to the future of technology."}
              </p>
              <Link
                href={logos?.[selectedUnit]?.slug ? `/org/${logos[selectedUnit].slug}` : "/org"}
                className={cn(
                  "group relative bg-[#0166aa] hover:bg-[#015a93]",
                  "text-white font-semibold py-2 px-6 mt-4 rounded-full text-base",
                  "transition-all duration-300 shadow-lg shadow-[#0166aa]/30",
                  "hover:shadow-xl hover:shadow-[#0166aa]/50 transform hover:scale-105",
                  "border border-[#0166aa]/20 hover:border-[#0166aa]/30",
                  "shrink-0"
                )}
                aria-label={logos?.[selectedUnit]?.slug ? `View more about ${logos[selectedUnit].name}` : "View all units"}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  View more
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
                {/* Button glow effect */}
                <div className="absolute inset-0 rounded-full bg-[#0166aa] opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
              </Link>
            </div>
          </div>
        </div>
        {/* Right Graphical Content */}
        <div
          ref={graphicalContentRef}
          className="relative flex justify-center items-center h-[450px] sm:h-[550px] md:h-[600px] lg:h-[800px] mt-12 md:mt-0"
        >
          {/* Central Logo - Restored to your original positioning */}
          <div
            ref={mainLogoRef}
            className="absolute right-0 z-20 rounded-full shadow-lg shadow-[#0166aa]/50 flex items-center justify-center border-2 border-[#005A96] translate-x-1/2"
            style={{ boxShadow: "-1px 1px 221.8px #005A96" }}
          >
            <Image
              src={mainLogoSrc}
              alt="Central IEEE SLTC Logo"
              width={180} // Your specified width
              height={180} // Your specified height
              className="rounded-full bg-black"
              priority
              onLoad={handleImageLoad}
            />
          </div>

          {/* Surrounding Logos */}
          {logos.map((logo, index) => (
            <div
              key={logo.alt} // Using a property from logo for a more stable key
              ref={surroundingLogoRefs.current[index]}
              // The -translate-x-1/2 -translate-y-1/2 here centers the logo pill on the coordinates defined by logo.positionClasses
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 ${logo.positionClasses}  ${selectedUnit === index ? "z-10" : "z-0"} h-[80px]`}
            >
              <div
                className={`flex items-center bg-[#121212] backdrop-blur-sm p-3 rounded-full border-2 ${logo.borderColorClass} overflow-hidden h-[80px] w-[180px]`}
                style={logo.glowStyle}
                // If logo.textAlignment (e.g., 'text-left', 'text-right') should apply here, you'd add it to className.
                // Currently, the pill only contains an image.
                // Example: className={`... ${logo.textAlignment}`} if text were present and alignment needed.
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={140} // Intrinsic width for layout within the pill
                  height={70} // Intrinsic height for layout within the pill
                  className={`object-contain flex-shrink-0 p-1 ${logo.hight}`}
                  unoptimized
                  onLoad={handleImageLoad}
                />
              </div>
            </div>
          ))}

          {/* Dynamically Generated Connecting Lines */}
          {lines.map((line) => (
            <div
              key={line.id}
              className={`absolute h-0.5 ${line.colorClass} opacity-70 z-0`}
              style={
                {
                  top: `${line.top}px`,
                  left: `${line.left}px`,
                  width: `${line.width}px`,
                  transform: `rotate(${line.angle}deg)`,
                  transformOrigin: "left center",
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
