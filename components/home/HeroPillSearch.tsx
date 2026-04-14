"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";

export function HeroPillSearch() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();

  function handleSearch() {
    const params = new URLSearchParams();
    if (title.trim()) params.set("search", title.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="mx-auto w-full max-w-[560px] mb-10">
      <div
        className="flex items-center h-[52px] bg-white border border-[#E2DDD8] rounded-full pr-[6px]"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        {/* Title / keyword field — 55% */}
        <div className="flex items-center gap-2 pl-4 pr-3 flex-[0_0_55%] min-w-0">
          <Search size={16} className="text-[#6B6560] flex-shrink-0" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Job title or keyword"
            className="flex-1 min-w-0 bg-transparent border-none outline-none font-sans text-sm text-[#0D0F12] placeholder:text-[#6B6560]"
          />
        </div>

        {/* Vertical divider */}
        <div className="w-px h-6 bg-[#E2DDD8] flex-shrink-0" />

        {/* Location field — remaining width */}
        <div className="flex items-center gap-2 pl-3 pr-2 flex-1 min-w-0">
          <MapPin size={16} className="text-[#6B6560] flex-shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Location"
            className="flex-1 min-w-0 bg-transparent border-none outline-none font-sans text-sm text-[#0D0F12] placeholder:text-[#6B6560]"
          />
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="flex-shrink-0 h-[38px] px-5 bg-accent border-[1.5px] border-black rounded-full font-mono font-medium text-sm text-[#0D0F12] hover:bg-[#34C47E] transition-colors duration-150"
        >
          Search
        </button>
      </div>
    </div>
  );
}
