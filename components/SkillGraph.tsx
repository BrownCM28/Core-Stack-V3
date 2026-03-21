import { cn } from "@/lib/utils";
import type { Language } from "@/lib/mock-profile";

interface SkillGraphProps {
  languages: Language[];
  topics: string[];
}

export function SkillGraph({ languages, topics }: SkillGraphProps) {
  const maxCount = Math.max(...languages.map((l) => l.count));

  return (
    <div>
      <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-4">
        Stack
      </p>

      {/* Language bar chart */}
      <div className="flex flex-col gap-2.5 mb-5">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-3">
            <span className="font-mono text-xs text-text-muted w-[88px] flex-shrink-0 text-right">
              {lang.name}
            </span>
            <div className="flex-1 h-2 bg-[#E8E4DF] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(lang.count / maxCount) * 100}%`,
                  backgroundColor: lang.color,
                }}
              />
            </div>
            <span className="font-mono text-[11px] text-text-muted w-4 flex-shrink-0 text-right">
              {lang.count}
            </span>
          </div>
        ))}
      </div>

      {/* Topic pills */}
      <div className="flex flex-wrap gap-1.5">
        {topics.map((topic) => (
          <span
            key={topic}
            className={cn(
              "inline-block font-mono text-[11px] text-accent",
              "border border-accent/30 rounded-[4px] px-2 py-0.5",
              "hover:bg-accent/10 transition-colors duration-150 cursor-default"
            )}
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}
