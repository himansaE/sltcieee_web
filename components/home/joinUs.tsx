"use client";

import dynamic from "next/dynamic";

// Import the 3D scene component with dynamic loading and disable SSR
const IDCard3DScene = dynamic(() => import("./idCard3D"), { ssr: false });

export default function JoinUs() {
  return (
    <section
      id="join"
      className="relative h-screen overflow-hidden bg-black text-white"
    >
      {/* Background 3D ID Card - Full width */}
      <div className="absolute inset-0 z-0">
        <IDCard3DScene />
      </div>

      {/* Foreground Content - Aligned to the left, on top */}
      {/* Removed pointer-events-none from this container to allow button interaction */}
      <div className="relative z-10 flex h-full flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-44 md:touch-none md:pointer-events-none">
        <div className="max-w-lg">
          {/* Increased bottom margin for headline */}
          <h1 className="mb-6 text-5xl font-bold md:text-6xl">
            Unlock Your True Potential With Us
          </h1>
          {/* Adjusted subtext styling and increased bottom margin */}
          <p className="mb-10 text-lg text-slate-300 md:text-xl leading-relaxed">
            Join the IEEE Student Branch at SLTC to explore cutting-edge
            technologies, collaborate with peers, and build your career.
          </p>
          <div className="flex gap-4">
            {" "}
            {/* Updated button style to match the contact us button */}
            <button
              className="group relative bg-[#0166aa] hover:bg-[#015a93] text-white font-semibold py-3 px-8 rounded-full text-base transition-all duration-300 shadow-lg shadow-[#0166aa]/30 hover:shadow-xl hover:shadow-[#0166aa]/50 transform hover:scale-105 border border-[#0166aa]/20 hover:border-[#0166aa]/30 pointer-events-auto touch-auto"
              style={{ pointerEvents: "auto" }}
            >
              {" "}
              <span className="relative z-10 flex items-center gap-1.5">
                Join Now!
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
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
