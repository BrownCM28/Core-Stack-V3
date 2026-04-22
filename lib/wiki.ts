export type WikiArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  readTime: string;
  featured: boolean;
  tags: string[];
};

export const wikiArticles: WikiArticle[] = [
  {
    slug: "data-center-careers",
    title: "The Complete Guide to Data Center Careers in 2026",
    description:
      "Everything you need to know about working in data centers — roles, salaries, certifications, and how to break in.",
    category: "Careers",
    publishedAt: "2026-04-01",
    updatedAt: "2026-04-17",
    author: "CoreStack Editorial",
    readTime: "8 min read",
    featured: true,
    tags: ["data center", "careers", "salary", "jobs"],
  },
  {
    slug: "github-for-engineers",
    title: "How Infrastructure Engineers Should Optimize Their GitHub Profile",
    description:
      "Your GitHub is your resume in the infrastructure world. Here is exactly what employers look at and how to stand out.",
    category: "Job Search",
    publishedAt: "2026-04-05",
    updatedAt: "2026-04-17",
    author: "CoreStack Editorial",
    readTime: "6 min read",
    featured: true,
    tags: ["github", "profile", "job search", "infrastructure"],
  },
  {
    slug: "certifications-guide",
    title: "Data Center Certifications: Which Ones Actually Matter",
    description:
      "AWS, BICSI, CompTIA, Cisco, Uptime Institute — a complete breakdown of which certifications move the needle for data center careers.",
    category: "Certifications",
    publishedAt: "2026-04-08",
    updatedAt: "2026-04-17",
    author: "CoreStack Editorial",
    readTime: "7 min read",
    featured: false,
    tags: ["certifications", "AWS", "BICSI", "CompTIA", "career"],
  },
  {
    slug: "salary-guide",
    title: "Data Center & AI Infrastructure Salary Guide 2026",
    description:
      "Real salary ranges for every major data center and AI infrastructure role — from facilities technician to GPU cluster engineer.",
    category: "Salary",
    publishedAt: "2026-04-10",
    updatedAt: "2026-04-17",
    author: "CoreStack Editorial",
    readTime: "5 min read",
    featured: false,
    tags: ["salary", "compensation", "data center", "AI infrastructure"],
  },
  {
    slug: "ai-infrastructure-jobs",
    title: "AI Infrastructure Jobs: What They Are and How to Get One",
    description:
      "GPU clusters, HPC, MLOps, and AI infrastructure are the fastest growing roles in tech. Here is what these jobs actually involve.",
    category: "Industry",
    publishedAt: "2026-04-12",
    updatedAt: "2026-04-17",
    author: "CoreStack Editorial",
    readTime: "6 min read",
    featured: false,
    tags: ["AI", "infrastructure", "GPU", "MLOps", "HPC"],
  },
  {
    slug: "how-to-get-hired",
    title: "How to Get Hired at a Hyperscaler: AWS, Google, Microsoft, Meta",
    description:
      "A practical guide to landing infrastructure and data center roles at the biggest tech companies in the world.",
    category: "Job Search",
    publishedAt: "2026-04-15",
    updatedAt: "2026-04-17",
    author: "CoreStack Editorial",
    readTime: "7 min read",
    featured: false,
    tags: ["hyperscaler", "AWS", "Google", "Microsoft", "hiring"],
  },
];

export function getAllArticles(): WikiArticle[] {
  return wikiArticles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticleBySlug(slug: string): WikiArticle | undefined {
  return wikiArticles.find((a) => a.slug === slug);
}

export function getFeaturedArticles(): WikiArticle[] {
  return wikiArticles.filter((a) => a.featured);
}

export function getArticlesByCategory(category: string): WikiArticle[] {
  return wikiArticles.filter((a) => a.category === category);
}

export function getAllCategories(): string[] {
  const seen: Record<string, boolean> = {};
  return wikiArticles
    .map((a) => a.category)
    .filter((c) => (seen[c] ? false : (seen[c] = true)));
}
