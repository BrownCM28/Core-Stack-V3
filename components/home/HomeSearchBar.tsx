"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HomeSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set("search", query.trim());
    }
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-[640px]">
      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search roles, companies, or keywords..."
          className="input-field flex-1"
          aria-label="Search jobs"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent border-[1.5px] border-black text-[#0D0F12] font-mono font-semibold text-sm rounded-[6px] hover:bg-[#34C47E] transition-all"
        >
          <Search size={14} />
          Search
        </button>
      </div>
    </form>
  );
}
