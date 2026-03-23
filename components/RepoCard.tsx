import { Star, GitFork, ExternalLink } from "lucide-react";

const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  Go: "#00ADD8",
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  HCL: "#844FBA",
  Shell: "#89E051",
  Rust: "#DEA584",
  "C++": "#F34B7D",
  Ruby: "#CC342D",
  Java: "#b07219",
};

interface RepoCardProps {
  repo: {
    name: string;
    description: string | null;
    language: string | null;
    topics: string[];
    stars: number;
    forks: number;
    url: string;
  };
}

export function RepoCard({ repo }: RepoCardProps) {
  const langColor = repo.language ? (LANGUAGE_COLORS[repo.language] ?? "#6B6560") : "#6B6560";

  return (
    <div className="group bg-surface border-[1.5px] border-[#E2DDD8] rounded-[8px] p-4 hover:border-accent/40 hover:-translate-y-0.5 transition-all duration-150 flex flex-col">
      {/* Repo name */}
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono font-semibold text-sm text-accent hover:underline mb-2 flex items-center gap-1.5 truncate"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="truncate">{repo.name}</span>
        <ExternalLink size={10} className="flex-shrink-0 opacity-60" />
      </a>

      {/* Description */}
      <p className="font-sans text-xs text-text-muted leading-relaxed mb-3 line-clamp-2 flex-1">
        {repo.description ?? "No description"}
      </p>

      {/* Topics */}
      {repo.topics.length > 0 && (
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
      )}

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: langColor }}
            />
            {repo.language}
          </span>
        )}
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
