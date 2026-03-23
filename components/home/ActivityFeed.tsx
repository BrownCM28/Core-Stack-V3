"use client";

import { useState, useEffect } from "react";
import type { ApiActivity } from "@/lib/types";

export function ActivityFeed() {
  const [events, setEvents] = useState<ApiActivity[]>([]);

  async function fetchActivity() {
    try {
      const res = await fetch("/api/activity");
      if (res.ok) setEvents(await res.json());
    } catch {
      // silently ignore network errors
    }
  }

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-[8px] border-[1.5px] border-black overflow-hidden bg-[#0D0F12] sticky top-[calc(3.5rem+1rem)]">
      {/* Terminal header bar */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
        </span>
        <span className="font-mono text-[11px] text-accent tracking-[0.15em] uppercase">
          Live Activity
        </span>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-white/10" />
          <div className="w-2 h-2 rounded-full bg-white/10" />
          <div className="w-2 h-2 rounded-full bg-accent/50" />
        </div>
      </div>

      {/* Event list */}
      <div className="divide-y divide-white/5 min-h-[120px]">
        {events.length === 0 ? (
          <div className="px-4 py-6 text-center font-mono text-[11px] text-[#4B5563]">
            No activity yet
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="flex items-stretch group">
              <div className="w-[2px] bg-accent/30 group-hover:bg-accent flex-shrink-0 transition-colors duration-150" />
              <div className="flex-1 px-4 py-3 flex items-start gap-3 min-w-0">
                <p className="font-mono text-[11px] text-[#9CA3AF] flex-1 leading-relaxed min-w-0">
                  {event.text}
                </p>
                <span className="font-mono text-[10px] text-[#4B5563] flex-shrink-0 mt-0.5 whitespace-nowrap">
                  {event.timeAgo}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer link */}
      <div className="px-4 py-2.5 border-t border-white/10">
        <a
          href="#"
          className="font-mono text-[10px] text-[#4B5563] hover:text-accent transition-colors duration-150 tracking-wide"
        >
          View full activity log →
        </a>
      </div>
    </div>
  );
}
