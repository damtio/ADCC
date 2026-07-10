"use client";

import { useEffect, useState } from "react";
import { ADCC_WEEKEND_DATE } from "@/lib/utils";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft | null {
  const target = new Date(ADCC_WEEKEND_DATE + "T00:00:00").getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex flex-col items-center rounded-lg border border-[#2B2B2B] bg-[#151515] px-3 py-2 sm:px-4 sm:py-3"
        >
          <span className="text-xl font-bold text-red-500 sm:text-2xl">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] tracking-wider text-zinc-500 uppercase sm:text-xs">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
