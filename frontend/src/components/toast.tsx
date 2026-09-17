"use client";

import { useEffect, useState } from "react";
import { consumeQueuedToast } from "@/lib/toast";

export default function Toast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // sessionStorage はマウント時に一度だけ読む外部ソースであり、購読対象ではないため許容する
    const queued = consumeQueuedToast();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (queued) setMessage(queued);
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-6 z-[100] flex justify-center px-4"
    >
      <div className="animate-fade-in-up rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background shadow-xl">
        {message}
      </div>
    </div>
  );
}
