import Link from "next/link";
import { getAllArticles, getFeaturedArticles } from "@/lib/wiki";

export const revalidate = false;

export const metadata = {
  title: "CoreStack Wiki — Data Center & Infrastructure Knowledge Base",
  description:
    "Guides, salary data, certification breakdowns, and career advice for data center and AI infrastructure professionals.",
};

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[parseInt(month) - 1]} ${day}, ${year}`;
}

export default function WikiIndexPage() {
  const featured = getFeaturedArticles();
  const all = getAllArticles();

  return (
    <div>
      {/* Page header */}
      <p className="font-mono text-xs uppercase tracking-widest text-[#3ECF8E] mb-2">
        KNOWLEDGE BASE
      </p>
      <h1 className="font-display text-4xl font-normal text-[#0D0F12] mb-3">
        CoreStack Wiki
      </h1>
      <p className="font-sans text-[#6B6560] text-lg leading-relaxed mb-10 max-w-xl">
        Guides, salary data, and career resources for data center construction,
        operations, and AI infrastructure professionals.
      </p>

      {/* Featured articles */}
      <p className="font-mono text-xs uppercase tracking-widest text-[#6B6560] mb-4">
        FEATURED
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {featured.map((article) => (
          <Link
            key={article.slug}
            href={`/wiki/${article.slug}`}
            className="block bg-white border border-[#E2DDD8] rounded-xl p-6 hover:border-[#3ECF8E] transition-colors cursor-pointer"
          >
            <span className="font-mono text-xs border border-[#3ECF8E] text-[#3ECF8E] rounded-full px-2 py-0.5 inline-block mb-3">
              {article.category}
            </span>
            <h2 className="font-display text-xl font-normal text-[#0D0F12] mb-2 leading-snug">
              {article.title}
            </h2>
            <p className="font-sans text-sm text-[#6B6560] leading-relaxed mb-4">
              {article.description}
            </p>
            <div className="font-mono text-xs text-[#6B6560]">
              {article.readTime} · {formatDate(article.publishedAt)}
            </div>
          </Link>
        ))}
      </div>

      {/* All articles */}
      <p className="font-mono text-xs uppercase tracking-widest text-[#6B6560] mb-4">
        ALL ARTICLES
      </p>
      <div className="flex flex-col">
        {all.map((article) => (
          <Link
            key={article.slug}
            href={`/wiki/${article.slug}`}
            className="flex items-start gap-4 py-4 border-b border-[#E2DDD8] last:border-0 hover:bg-[#F5F2EE] -mx-4 px-4 rounded transition-colors cursor-pointer"
          >
            <span className="font-mono text-xs bg-[#F5F2EE] text-[#6B6560] px-2 py-0.5 rounded flex-shrink-0 mt-0.5">
              {article.category}
            </span>
            <div className="min-w-0">
              <p className="font-display text-base font-normal text-[#0D0F12] mb-1">
                {article.title}
              </p>
              <p className="font-sans text-sm text-[#6B6560] line-clamp-1">
                {article.description}
              </p>
              <p className="font-mono text-xs text-[#6B6560] mt-1">
                {article.readTime} · Updated {article.updatedAt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
