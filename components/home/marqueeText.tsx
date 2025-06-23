"use client";

import { useRef } from "react";

export interface MarqueeTextItem {
  text: string;
  type: "filled" | "stroke";
}

interface MarqueeTextProps {
  texts: MarqueeTextItem[];
  speed?: number;
  className?: string;
}

export default function MarqueeText({
  texts,
  speed = 30,
  className = "",
}: MarqueeTextProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Create a seamless loop by ensuring we have enough repetitions
  const repeatedTexts = [...texts, ...texts, ...texts];

  // Debug log
  console.log("MarqueeText rendering with texts:", texts);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="py-6 relative">
        <div
          ref={marqueeRef}
          className="animate-marquee whitespace-nowrap flex items-center"
          style={{
            animationDuration: `${speed}s`,
          }}
        >
          {" "}
          {repeatedTexts.map((item, index) => (
            <span
              key={index}
              className={`text-5xl md:text-6xl font-bold font-primary transition-all duration-300 ${
                item.type === "filled"
                  ? "text-white drop-shadow-2xl"
                  : "text-white ml-4"
              }`}
              style={{
                WebkitTextStroke: item.type === "stroke" ? "2px white" : "none",
                WebkitTextFillColor:
                  item.type === "stroke" ? "transparent" : "white",
                paintOrder: item.type === "stroke" ? "stroke fill" : "normal",
                textShadow:
                  item.type === "filled"
                    ? "0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,255,255,0.3)"
                    : "none",
                marginRight: "2rem", // Add consistent spacing
              }}
            >
              {item.text}
            </span>
          ))}
        </div>

        {/* Gradient Overlays for smooth fade effect */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none z-10"></div>

        {/* Additional glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}
