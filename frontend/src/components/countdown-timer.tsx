"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-2xl font-extrabold tabular-nums sm:text-3xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-xs text-foreground-soft">{label}</span>
    </div>
  );
}

export default function CountdownTimer({
  label,
  targetDate,
}: {
  label: string;
  targetDate: string;
}) {
  const router = useRouter();
  const [now, setNow] = useState(() => Date.now());
  const refreshedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const remaining = new Date(targetDate).getTime() - now;

  useEffect(() => {
    if (remaining <= 0 && !refreshedRef.current) {
      refreshedRef.current = true;
      router.refresh();
    }
  }, [remaining, router]);

  if (remaining <= 0) return null;

  const { days, hours, minutes, seconds } = formatRemaining(remaining);

  return (
    <div className="rounded-2xl border border-rule bg-card p-6 text-center">
      <p className="font-mono text-xs font-medium uppercase tracking-widest text-g-blue">
        {label}
      </p>
      <div className="mt-3 flex justify-center gap-4 sm:gap-6">
        <Unit value={days} label="日" />
        <Unit value={hours} label="時間" />
        <Unit value={minutes} label="分" />
        <Unit value={seconds} label="秒" />
      </div>
    </div>
  );
}
