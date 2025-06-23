"use client";

import React from "react";
import CountUp from "react-countup";

interface StatItemProps {
  value: string | number;
  suffix?: string;
  label: string;
  decimals?: number;
  width: string;
}

const StatItem: React.FC<StatItemProps> = ({
  value,
  label,
  suffix = "",
  decimals = 0,
  width,
}) => {
  // Determine if the value is a number or a string (like "4.9")
  const isNumeric = !isNaN(Number(value));
  const numericValue = isNumeric ? Number(value) : 0;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Fixed width container with mono font to prevent layout shifts */}
      <div className="text-center" style={{ width }}>
        <h2
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-3 font-mono tabular-nums"
          style={{
            fontVariantNumeric: "tabular-nums",
            textAlign: "center",
          }}
        >
          {isNumeric ? (
            <CountUp
              end={numericValue}
              suffix={suffix}
              decimals={decimals}
              duration={2.5}
              enableScrollSpy
              scrollSpyOnce
              delay={0.2}
              useEasing={true}
              preserveValue={true}
            />
          ) : (
            value
          )}
        </h2>
      </div>
      <p className="text-slate-300 text-base md:text-lg whitespace-nowrap">
        {label}
      </p>
    </div>
  );
};

const StatsSection: React.FC = () => {
  const stats = [
    {
      value: new Date().getFullYear() - 2018,
      label: "Years",
      width: "140px",
    },
    {
      value: 1,
      suffix: "k+",
      label: "Volunteers ",
      width: "160px",
    },
    { value: 120, suffix: "+", label: "Projects", width: "100px" },
    { value: 12, suffix: "+", label: "Awards", width: "140px" },
  ];
  return (
    <section id="stats" className="bg-black text-white py-14 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4 relative">
          {stats.map((stat, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-center">
                <StatItem
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  // decimals={stat.decimals}
                  width={stat.width}
                />
              </div>
              {/* Only show dividers between stats, not after the last one */}
              {index < stats.length - 1 && (
                <div
                  className={`hidden md:block absolute h-16 w-px bg-gray-700`}
                  style={{
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: `${(index + 1) * 25}%`,
                  }}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
