import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticles } from "@/lib/wiki";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata() {
  const article = getArticleBySlug("salary-guide");
  if (!article) return { title: "Not Found" };
  return {
    title: `${article.title} — CoreStack Wiki`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
  };
}

export default function SalaryGuidePage() {
  const article = getArticleBySlug("salary-guide");
  if (!article) return notFound();

  const related = getAllArticles()
    .filter((a) => a.slug !== "salary-guide")
    .slice(0, 2);

  return (
    <article>
      {/* Article header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-xs border border-[#3ECF8E] text-[#3ECF8E] rounded-full px-2 py-0.5">
            {article.category}
          </span>
        </div>
        <h1 className="font-display text-4xl font-normal text-[#0D0F12] leading-tight mb-4">
          {article.title}
        </h1>
        <p className="font-sans text-lg text-[#6B7280] leading-relaxed mb-4">
          {article.description}
        </p>
        <div className="flex items-center gap-3 font-mono text-xs text-[#6B7280] pb-6 border-b border-[#E0E0E0]">
          <span>{article.author}</span>
          <span>·</span>
          <span>{article.readTime}</span>
          <span>·</span>
          <span>Updated {article.updatedAt}</span>
        </div>
      </div>

      {/* Article content */}
      <div className="wiki-content">
        <h2>How We Collect Salary Data</h2>
        <p>
          The salary ranges in this guide are aggregated from job postings collected by CoreStack across
          direct company career pages, Greenhouse, Lever, and Workday ATS feeds. We cross-reference
          this data with Bureau of Labor Statistics Occupational Employment and Wage Statistics (OEWS)
          reports, public salary databases including Levels.fyi and Glassdoor, and compensation data
          shared anonymously by engineers in the CoreStack community.
        </p>
        <p>
          Ranges reflect total base salary for full-time employees in the United States. Equity (RSUs,
          options), bonuses, and benefits are not included unless noted. Ranges are updated quarterly;
          this edition reflects data collected through Q1 2026.
        </p>

        <h2>Data Center Salaries by Role (2026)</h2>
        <table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Entry</th>
              <th>Mid</th>
              <th>Senior</th>
              <th>Remote Premium</th>
              <th>Contract Rate (hr)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>NOC Analyst</td>
              <td>$55k–$70k</td>
              <td>$70k–$95k</td>
              <td>$95k–$120k</td>
              <td>Rare — site presence required</td>
              <td>$35–$55</td>
            </tr>
            <tr>
              <td>Facilities Technician</td>
              <td>$55k–$72k</td>
              <td>$72k–$95k</td>
              <td>$95k–$125k</td>
              <td>Not available</td>
              <td>$40–$65</td>
            </tr>
            <tr>
              <td>Facilities Engineer</td>
              <td>$70k–$85k</td>
              <td>$85k–$110k</td>
              <td>$110k–$145k</td>
              <td>Not available</td>
              <td>$55–$85</td>
            </tr>
            <tr>
              <td>Critical Facilities Manager</td>
              <td>$95k–$115k</td>
              <td>$115k–$145k</td>
              <td>$145k–$185k</td>
              <td>Not available</td>
              <td>$75–$110</td>
            </tr>
            <tr>
              <td>Electrical Engineer</td>
              <td>$75k–$95k</td>
              <td>$95k–$125k</td>
              <td>$125k–$165k</td>
              <td>Not available</td>
              <td>$60–$95</td>
            </tr>
            <tr>
              <td>Cooling / HVAC Engineer</td>
              <td>$70k–$90k</td>
              <td>$90k–$120k</td>
              <td>$120k–$155k</td>
              <td>Not available</td>
              <td>$55–$90</td>
            </tr>
            <tr>
              <td>DCIM / Systems Admin</td>
              <td>$80k–$100k</td>
              <td>$100k–$130k</td>
              <td>$130k–$160k</td>
              <td>Hybrid possible</td>
              <td>$60–$95</td>
            </tr>
            <tr>
              <td>Network Engineer</td>
              <td>$80k–$105k</td>
              <td>$105k–$140k</td>
              <td>$140k–$180k</td>
              <td>Occasional (10–15% premium)</td>
              <td>$70–$110</td>
            </tr>
            <tr>
              <td>Construction PM</td>
              <td>$90k–$115k</td>
              <td>$115k–$150k</td>
              <td>$150k–$195k</td>
              <td>Not available</td>
              <td>$80–$125</td>
            </tr>
            <tr>
              <td>DevOps / Platform Eng</td>
              <td>$100k–$125k</td>
              <td>$125k–$160k</td>
              <td>$160k–$210k</td>
              <td>Common (10–20% premium)</td>
              <td>$85–$130</td>
            </tr>
            <tr>
              <td>MLOps / AI Infra Eng</td>
              <td>$120k–$155k</td>
              <td>$155k–$200k</td>
              <td>$200k–$270k</td>
              <td>Common (10–20% premium)</td>
              <td>$100–$165</td>
            </tr>
            <tr>
              <td>GPU Cluster Engineer</td>
              <td>$130k–$165k</td>
              <td>$165k–$220k</td>
              <td>$220k–$300k+</td>
              <td>Occasional</td>
              <td>$120–$180</td>
            </tr>
          </tbody>
        </table>

        <h2>Salaries by Location</h2>
        <table>
          <thead>
            <tr>
              <th>Metro Area</th>
              <th>Avg Salary vs National</th>
              <th>Cost of Living Index</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Northern Virginia (Ashburn)</td>
              <td>+12–18%</td>
              <td>High (130)</td>
              <td>Most competitive market; jobs and pay highest</td>
            </tr>
            <tr>
              <td>Phoenix, AZ</td>
              <td>+8–14%</td>
              <td>Moderate (105)</td>
              <td>Fast growth; strong purchasing power</td>
            </tr>
            <tr>
              <td>Dallas-Fort Worth, TX</td>
              <td>+5–10%</td>
              <td>Moderate (100)</td>
              <td>No state income tax; excellent real-dollar comp</td>
            </tr>
            <tr>
              <td>Chicago, IL</td>
              <td>+3–8%</td>
              <td>Moderate (108)</td>
              <td>Strong union presence in electrical roles</td>
            </tr>
            <tr>
              <td>San Francisco Bay Area</td>
              <td>+25–40%</td>
              <td>Very High (185)</td>
              <td>High nominal salary; purchasing power similar to TX</td>
            </tr>
            <tr>
              <td>New York Metro</td>
              <td>+20–30%</td>
              <td>Very High (175)</td>
              <td>Strong for network and DCIM roles</td>
            </tr>
            <tr>
              <td>London, UK</td>
              <td>+15–25% (GBP)</td>
              <td>High (155)</td>
              <td>Largest European market; strong demand</td>
            </tr>
            <tr>
              <td>Singapore</td>
              <td>Comparable (SGD)</td>
              <td>High (145)</td>
              <td>APAC hub; strong demand for facilities and ops</td>
            </tr>
          </tbody>
        </table>

        <h2>Contract vs Full-Time Compensation</h2>
        <p>
          Data center professionals frequently have the option to work as full-time employees or
          independent contractors through staffing agencies. Understanding how to compare these
          compensation structures is essential to making informed decisions.
        </p>
        <p>
          Contract rates are typically 20–35% higher than equivalent full-time hourly equivalents. This
          premium compensates for the lack of employer-provided benefits — health insurance, 401(k)
          matching, paid time off, and equity. A contractor billing $85/hour for 2,000 hours annually
          earns $170,000 gross, but after self-employment taxes (15.3%) and benefits costs ($15–25k
          annually), net compensation may be closer to $120k–$130k — comparable to a full-time
          employee earning $105k–$115k with full benefits.
        </p>
        <p>
          <strong>When contracting makes sense:</strong> If you have in-demand specialized skills (GPU
          cluster engineering, commissioning expertise, BICSI RCDD), contracting can yield
          significantly higher income during periods of high demand. Hyperscaler construction projects
          frequently use large contract workforces, creating predictable windows of high-paying
          contract work.
        </p>
        <p>
          <strong>When full-time is better:</strong> For earlier-career professionals, full-time roles
          offer mentorship, defined career progression, and employer-funded training and
          certifications. The stability and structured development typically outweigh the modest
          contract premium at the entry and mid levels.
        </p>

        <h2>Negotiation Tips for Infrastructure Roles</h2>
        <p>
          <strong>Certifications justify higher offers.</strong> If you are pursuing a facilities or
          electrical role and you hold a BICSI RCDD, Uptime ATD, or licensed journeyman card, name it
          explicitly in salary negotiations. These credentials represent real cost savings for
          employers who would otherwise need to fund training, and they command premiums of $10k–$25k
          in offers.
        </p>
        <p>
          <strong>Competing offers are your strongest tool.</strong> In a market with a documented
          talent shortage, a competing offer letter is the single most effective negotiating instrument.
          If you are entertaining multiple opportunities, let each employer know you are actively
          interviewing. Do not share specific numbers unless you are comfortable with transparency.
        </p>
        <p>
          <strong>Sign-on bonuses are negotiable.</strong> Particularly for roles that require
          relocation to Northern Virginia, Phoenix, or other high-cost markets, sign-on bonuses of
          $10k–$30k are common. If an employer cannot move on base salary, ask about sign-on bonus as
          a one-time flexibility mechanism.
        </p>
        <p>
          <strong>Geographic adjustments matter.</strong> Remote or hybrid roles that were benchmarked
          against local pay rates may have room to negotiate upward if your cost of living is higher
          than the employer assumed. Bring data — use the table above to make your case.
        </p>

        <h2>The AI Infrastructure Premium</h2>
        <p>
          The most striking salary data in 2026 is the compensation gap between traditional data center
          roles and AI infrastructure specializations. GPU cluster engineers, HPC systems
          administrators, and MLOps engineers are earning 50–100% more than peers in equivalent
          traditional data center roles with similar years of experience.
        </p>
        <p>
          The root cause is supply and demand. The AI buildout — fueled by hyperscaler capex exceeding
          $200 billion annually and AI-native companies like CoreWeave, Lambda Labs, and Together AI
          growing at triple-digit rates — has created demand for a very specific skill set that the
          existing workforce cannot fill. NVIDIA CUDA expertise, InfiniBand networking, distributed
          training frameworks, and GPU cluster management at scale are skills that take years to
          develop and are held by a small number of practitioners globally.
        </p>
        <p>
          This premium is expected to persist through at least 2027, with the Uptime Institute
          projecting continued double-digit demand growth for AI data center professionals through the
          end of the decade. Engineers who can transition from traditional data center operations to
          AI infrastructure specializations — particularly those with strong Python and systems
          programming backgrounds — are likely to see the largest salary increases of their careers.
        </p>

        <div className="callout">
          <strong>CoreStack salary data is updated quarterly.</strong> Browse open roles with salary
          ranges published directly from employers — no estimates, no black boxes.
        </div>
      </div>

      {/* Tags */}
      <div className="mt-10 pt-6 border-t border-[#E0E0E0]">
        <span className="font-mono text-xs text-[#6B7280] uppercase tracking-widest mr-3">Tags</span>
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-xs bg-[#F0F0F0] text-[#6B7280] px-2 py-1 rounded mr-2"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Related articles */}
      <div className="mt-10 pt-6 border-t border-[#E0E0E0]">
        <h3 className="font-display text-xl font-normal text-[#0D0F12] mb-4">More from the Wiki</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {related.map((a) => (
            <Link
              key={a.slug}
              href={`/wiki/${a.slug}`}
              className="block border border-[#E0E0E0] rounded-lg p-4 hover:border-[#3ECF8E] transition-colors"
            >
              <span className="font-mono text-xs border border-[#3ECF8E] text-[#3ECF8E] rounded-full px-2 py-0.5 inline-block mb-2">
                {a.category}
              </span>
              <p className="font-display text-sm font-normal text-[#0D0F12] leading-snug mb-1">
                {a.title}
              </p>
              <p className="font-mono text-xs text-[#6B7280]">{a.readTime}</p>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
