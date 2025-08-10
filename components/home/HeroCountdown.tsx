"use client";

import { useEffect, useMemo, useState } from "react";

interface Props {
  target: string | Date; // ISO string or Date
  label?: string | null;
}

const pad = (n: number) => n.toString().padStart(2, "0");

export default function HeroCountdown({ target, label }: Props) {
  const targetTime = useMemo(() => new Date(target).getTime(), [target]);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, Math.floor((targetTime - now) / 1000));
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  const secs = diff % 60;

  if (diff <= 0) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      {label ? (
        <span className="text-sm uppercase tracking-wider text-white/70">{label}</span>
      ) : null}
      <div className="flex items-center gap-3 text-white">
        {days > 0 && (
          <TimeBox value={days} unit="d" />
        )}
        <TimeBox value={hours} unit="h" />
        <TimeBox value={mins} unit="m" />
        <TimeBox value={secs} unit="s" />
      </div>
    </div>
  );
}

function TimeBox({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex items-end gap-1 px-3 py-2 rounded-md bg-black/30 border border-white/10 backdrop-blur">
      <span className="text-2xl font-mono font-semibold">{pad(value)}</span>
      <span className="text-sm text-white/70 mb-0.5">{unit}</span>
    </div>
  );
}
