"use client";

import dynamic from "next/dynamic";

// Import the 3D scene component with dynamic loading and disable SSR
const IDCard3DScene = dynamic(() => import("./idCard3D"), { ssr: false });

export default function JoinUs() {
  return (
    <section className="relative h-screen overflow-hidden bg-black text-white">
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
            {/* Updated button style to match the image */}
            <button
              className="rounded-full bg-slate-100 px-8 py-3 font-semibold text-black hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75 pointer-events-auto touch-auto "
              style={{ pointerEvents: "auto" }}
            >
              Join Now!
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
