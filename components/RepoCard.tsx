import { Star, GitFork } from "lucide-react";
import { LANGUAGE_COLORS } from "@/lib/mock-profile";
import type { Repo } from "@/lib/mock-profile";

interface RepoCardProps {
  repo: Repo;
}

export function RepoCard({ repo }: RepoCardProps) {
  const langColor = LANGUAGE_COLORS[repo.language] ?? "#6B6560";

  return (
    <div className="group bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] p-4 hover:border-accent/40 hover:-translate-y-0.5 transition-all duration-150 flex flex-col">
      {/* Repo name */}
      <a
        href="#"
        className="font-mono font-semibold text-sm text-accent hover:underline mb-2 block truncate"
      >
        {repo.name}
      </a>

      {/* Description */}
      <p className="font-sans text-xs text-text-muted leading-relaxed mb-3 line-clamp-2 flex-1">
        {repo.description}
      </p>

      {/* Topics */}
      <div className="flex flex-wrap gap-1 mb-3">
        {repo.topics.slice(0, 3).map((topic) => (
          <span
            key={topic}
            className="font-mono text-[10px] text-text-muted bg-[#F0ECE8] rounded-[3px] px-1.5 py-0.5"
          >
            {topic}
          </span>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
        <span className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: langColor }}
          />
          {repo.language}
        </span>
        <span className="flex items-center gap-1">
          <Star size={11} />
          {repo.stars.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <GitFork size={11} />
          {repo.forks}
        </span>
      </div>
    </div>
  );
}
