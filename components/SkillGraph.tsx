"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";

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
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Dockerfile: "#384D54",
};

const DEFAULT_COLOR = "#6B6560";

interface SkillGraphProps {
  skillLanguages: Record<string, number>;
  skillTopics: string[];
}

export function SkillGraph({ skillLanguages, skillTopics }: SkillGraphProps) {
  const data = Object.entries(skillLanguages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  if (data.length === 0 && skillTopics.length === 0) {
    return (
      <div>
        <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-4">
          Stack
        </p>
        <p className="font-sans text-xs text-text-muted">No data yet.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-4">
        Stack
      </p>

      {data.length > 0 && (
        <div className="mb-5">
          <ResponsiveContainer width="100%" height={data.length * 28 + 8}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 24, bottom: 0, left: 0 }}
            >
              <XAxis
                type="number"
                hide
                domain={[0, Math.max(...data.map((d) => d.count))]}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={88}
                tick={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  fill: "#9B9590",
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(62,207,142,0.06)" }}
                contentStyle={{
                  background: "#1E2128",
                  border: "1.5px solid #2A2D35",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: "#E8E4DF",
                }}
                formatter={(value) => [
                  `${value} repo${value !== 1 ? "s" : ""}`,
                  "",
                ]}
                labelFormatter={() => ""}
              />
              <Bar dataKey="count" radius={[0, 3, 3, 0]} maxBarSize={14}>
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={LANGUAGE_COLORS[entry.name] ?? DEFAULT_COLOR}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {skillTopics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skillTopics.slice(0, 20).map((topic) => (
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
      )}
    </div>
  );
}
