// Shared API types — used by API routes and client components

export interface ApiJob {
  id: string;
  title: string;
  company: string;
  companyLogo: string | null;
  location: string;
  remote: boolean;
  type: string; // "Full-time" | "Contract" | "Full-time / Contract"
  level: string;
  salary: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  category: string;
  tags: string[];
  featured: boolean;
  postedAt: string; // ISO string
  expiresAt: string | null;
  source: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  applicationCount?: number;
}

export interface ApiActivity {
  id: string;
  text: string;
  timeAgo: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

export function mapJobType(type: string): string {
  switch (type) {
    case "FULL_TIME": return "Full-time";
    case "CONTRACT": return "Contract";
    case "BOTH": return "Full-time / Contract";
    default: return type;
  }
}

export function mapLevel(level: string): string {
  switch (level) {
    case "ENTRY": return "Entry";
    case "MID": return "Mid";
    case "SENIOR": return "Senior";
    case "LEAD": return "Lead";
    case "PRINCIPAL": return "Principal";
    default: return level;
  }
}

export function timeAgoFromISO(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export function formatSalary(min: number | null, max: number | null, raw: string | null): string {
  if (raw) return raw;
  if (min != null && max != null) return `$${min}k–$${max}k`;
  return "Salary not listed";
}
