"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HomepageSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch() {
    const q = query.trim();
    if (!q) return;
    router.push(`/jobs?search=${encodeURIComponent(q)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <section className="bg-background py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="flex w-full max-w-[640px] gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search roles, companies, or keywords..."
            className="input-field flex-1"
          />
          <button
            onClick={handleSearch}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] hover:shadow-[0_0_16px_rgba(62,207,142,0.25)] transition-all duration-150 whitespace-nowrap"
          >
            <Search size={14} />
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
