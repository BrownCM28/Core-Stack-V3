import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticles } from "@/lib/wiki";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata() {
  const article = getArticleBySlug("data-center-careers");
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

export default function DataCenterCareersPage() {
  const article = getArticleBySlug("data-center-careers");
  if (!article) return notFound();

  const related = getAllArticles()
    .filter((a) => a.slug !== "data-center-careers")
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
        <h2>What Is a Data Center Career?</h2>
        <p>
          Data centers are the physical backbone of the modern internet — the buildings, power systems,
          cooling infrastructure, and networking equipment that make cloud computing, AI workloads, and
          global communications possible. Working in a data center means working on the infrastructure
          that billions of people depend on every day, often without knowing it exists.
        </p>
        <p>
          In 2026, the data center industry is experiencing unprecedented growth. Hyperscalers like
          Amazon Web Services, Microsoft Azure, and Google Cloud are spending hundreds of billions of
          dollars on new facilities. The AI buildout — driven by demand for GPU compute for training and
          inference — has created a parallel wave of specialized AI data centers requiring skills in
          high-density power, liquid cooling, and GPU cluster management. The Uptime Institute estimates
          the global data center industry now employs over 2.5 million people, and demand is growing
          faster than the talent pipeline can fill it.
        </p>
        <p>
          This means the data center industry is one of the few sectors where skilled workers
          consistently have leverage in negotiations, where entry-level roles come with strong salaries,
          and where career progression can be rapid. Whether you are a recent graduate, a transitioning
          military veteran, or an experienced engineer looking to pivot, there has never been a better
          time to build a career in data center operations.
        </p>

        <h2>Core Role Categories</h2>

        <h3>Facilities Engineering</h3>
        <p>
          Facilities engineers are responsible for the physical infrastructure of data centers — the
          building systems that keep the lights on and the servers running. This includes overseeing
          preventive maintenance programs, managing contractors, and ensuring compliance with local code
          and safety requirements. Demand is high across all market sizes, from colocation providers to
          hyperscaler campuses. Most positions require at least two to three years of facilities or
          building operations experience.
        </p>

        <h3>Critical Power and Electrical</h3>
        <p>
          Electrical engineers and power specialists manage the systems that ensure uninterrupted power
          delivery to compute hardware — UPS systems, switchgear, PDUs, generators, and transfer
          switches. This is one of the highest-demand specializations in the industry because power
          failures are catastrophic and skilled electrical professionals with data center experience are
          scarce. Many top roles require an electrical license or significant journeyman experience.
        </p>

        <h3>Cooling and Mechanical (HVAC)</h3>
        <p>
          As data centers push higher power densities — particularly in AI facilities running 50–100 kW
          per rack — cooling becomes one of the most technically demanding disciplines in the building.
          Cooling engineers manage CRAC/CRAH units, chillers, cooling towers, and increasingly, liquid
          cooling systems including direct liquid cooling (DLC) and immersion cooling. Professionals
          with experience in high-density or liquid cooling command significant salary premiums.
        </p>

        <h3>DCIM and Systems Administration</h3>
        <p>
          Data center infrastructure management (DCIM) professionals bridge the gap between IT and
          facilities — using software platforms like Nlyte, Sunbird, or Vertiv Trellis to monitor power
          usage, temperature, and asset capacity in real time. Systems administrators in data center
          environments manage server provisioning, OS deployments, and hardware lifecycle. Strong
          scripting skills (Python, PowerShell) and familiarity with IPMI or BMC management add
          significant value.
        </p>

        <h3>Construction and Project Management</h3>
        <p>
          Data center construction and commissioning is a specialized field with its own project
          management discipline. Project managers in this space oversee multi-hundred-million-dollar
          builds, coordinating between structural, electrical, mechanical, and IT teams on extremely
          tight timelines. Many hyperscaler construction projects run 24 hours a day, seven days a
          week. Experience with critical environment commissioning — specifically Integrated Systems
          Testing (IST) — is highly valued.
        </p>

        <h3>Network Operations (NOC)</h3>
        <p>
          Network operations center (NOC) engineers monitor network health, respond to incidents, and
          maintain the connectivity infrastructure that ties servers together and connects them to the
          internet. NOC roles are often an excellent entry point for candidates new to the data center
          industry, requiring strong problem-solving skills and familiarity with networking
          fundamentals. Many NOC engineers go on to specialize in network engineering or infrastructure
          automation.
        </p>

        <h3>AI Infrastructure and GPU Systems</h3>
        <p>
          The fastest-growing specialty in the industry. AI infrastructure engineers design, deploy, and
          operate the GPU clusters, high-speed interconnects, and storage systems that run large-scale
          machine learning workloads. These roles require a unique combination of hardware knowledge
          (NVIDIA H100/B200, InfiniBand networking, NVLink) and software skills (CUDA, Kubernetes,
          Slurm, distributed training frameworks). Salaries at the top end of this category rival those
          of senior software engineers at major technology companies.
        </p>

        <h2>Salary Ranges by Role (2026)</h2>
        <table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Entry Level</th>
              <th>Mid Level</th>
              <th>Senior Level</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Facilities Engineer</td>
              <td>$70k–$85k</td>
              <td>$85k–$110k</td>
              <td>$110k–$140k</td>
              <td>Higher in major metros</td>
            </tr>
            <tr>
              <td>Electrical / Power</td>
              <td>$75k–$95k</td>
              <td>$95k–$125k</td>
              <td>$125k–$160k</td>
              <td>Union roles often higher</td>
            </tr>
            <tr>
              <td>Cooling / HVAC</td>
              <td>$70k–$90k</td>
              <td>$90k–$120k</td>
              <td>$120k–$150k</td>
              <td>Liquid cooling commands premium</td>
            </tr>
            <tr>
              <td>DCIM Admin</td>
              <td>$80k–$100k</td>
              <td>$100k–$130k</td>
              <td>$130k–$155k</td>
              <td>Software skills add value</td>
            </tr>
            <tr>
              <td>Construction PM</td>
              <td>$90k–$115k</td>
              <td>$115k–$145k</td>
              <td>$145k–$180k</td>
              <td>Contract rates often higher</td>
            </tr>
            <tr>
              <td>NOC Engineer</td>
              <td>$60k–$75k</td>
              <td>$75k–$100k</td>
              <td>$100k–$130k</td>
              <td>Entry point for many</td>
            </tr>
            <tr>
              <td>AI Infra / GPU</td>
              <td>$120k–$150k</td>
              <td>$150k–$200k</td>
              <td>$200k–$280k</td>
              <td>Fastest growing, highest paid</td>
            </tr>
          </tbody>
        </table>

        <h2>How to Break Into Data Centers</h2>
        <p>
          The data center industry is more accessible than many people assume. Unlike traditional tech
          roles that often require a computer science degree, data center operations values hands-on
          experience, relevant certifications, and demonstrated mechanical or electrical aptitude just
          as highly — sometimes more so.
        </p>
        <p>
          <strong>Start with certifications.</strong> CompTIA Server+ and CompTIA Network+ are the most
          accessible entry points and signal baseline competency to employers. For facilities-focused
          roles, an OSHA 10 or OSHA 30 certification demonstrates safety awareness that hiring managers
          look for. Many community colleges now offer associate degrees in data center technology or
          network administration that combine theoretical training with hands-on lab work.
        </p>
        <p>
          <strong>Military veterans have a significant advantage.</strong> Former military personnel with
          experience in communications, signal corps, electrical systems, or facilities management find
          that their skills translate directly to data center operations. Many hyperscalers and
          colocation providers run dedicated veteran hiring programs. Organizations like Helmets to
          Hardhats can help identify apprenticeship pathways in the electrical trades.
        </p>
        <p>
          <strong>Target companies that hire junior talent.</strong> Not all data center employers
          expect years of experience. Colocation providers like Equinix, Digital Realty, and QTS
          actively recruit for entry-level facilities technician and NOC analyst roles. Managed service
          providers and smaller regional data centers often offer more training than hyperscalers but
          are equally valuable as starting points.
        </p>

        <h2>Career Progression Paths</h2>

        <h3>Path 1: NOC to Infrastructure Engineering (3–5 years)</h3>
        <p>
          Start as a NOC Analyst at a colocation provider. Learn monitoring tools, incident response,
          and basic network troubleshooting. Obtain CompTIA Network+ and CompTIA Server+. After two
          years, promote to Senior NOC Analyst or move laterally to Systems Administrator and begin
          studying for Cisco CCNA. By year four or five, transition to an Infrastructure Engineer or
          Network Engineer role with full responsibility for a site&apos;s connectivity stack. Target
          salary at exit: $110k–$130k.
        </p>

        <h3>Path 2: Facilities Technician to Critical Facilities Manager (5–8 years)</h3>
        <p>
          Begin as a Facilities Technician at a Tier II or III data center. Learn preventive
          maintenance procedures, CMMS systems, and vendor management. After two to four years, move
          into a Senior Facilities Technician or Shift Lead role. Pursue BICSI RCDD or Uptime Institute
          ATD certification. By year five to seven, take on a Critical Facilities Engineer or Assistant
          Manager role with budget responsibility. Target exit role: Critical Facilities Manager
          overseeing a full site. Target salary: $130k–$160k.
        </p>

        <h3>Path 3: Junior AI Infrastructure to Principal GPU Cluster Engineer (4–6 years)</h3>
        <p>
          Enter as a Junior AI Infrastructure Engineer or HPC Systems Administrator. Spend the first
          two years in deep technical learning — GPU cluster management, Slurm, storage systems. Obtain
          CKA certification. Take ownership of cluster deployments and build automation tooling. By year
          five or six, reach Senior or Principal AI Infrastructure Engineer with influence over
          architecture decisions and compensation in the $200k–$280k range including equity.
        </p>

        <h2>Where the Jobs Are</h2>
        <p>
          <strong>Northern Virginia (Ashburn, VA)</strong> is by far the largest data center market in
          the world, housing the highest concentration of hyperscaler and colocation capacity on the
          planet. Dominion Energy&apos;s power grid and proximity to the internet&apos;s major backbone
          routes have made this corridor the default choice for AWS, Microsoft, Google, and hundreds of
          colocation operators. Job density here is unmatched.
        </p>
        <p>
          <strong>Phoenix, AZ</strong> has become the second-largest U.S. data center market, driven by
          land availability, favorable power costs, and a lower risk of natural disasters. Multiple
          hyperscalers are expanding aggressively here, creating a significant labor shortage that has
          pushed salaries above the national average.
        </p>
        <p>
          <strong>Dallas-Fort Worth, TX</strong> is one of the fastest-growing markets in the country,
          with major investments from QTS, CyrusOne, and hyperscalers. The absence of state income tax
          makes Texas an attractive location for engineers and companies alike.
        </p>
        <p>
          <strong>Chicago, IL</strong> is the primary data center hub for the Midwest, with a strong
          colocation ecosystem and excellent fiber connectivity. It remains a more affordable city to
          live in than either coast while still offering competitive salaries.
        </p>
        <p>
          <strong>International markets</strong> including London, Frankfurt, Amsterdam, Singapore, and
          Tokyo all have active hiring across every role category. Remote work is possible for some
          software-heavy roles, but most data center positions require on-site presence.
        </p>

        <div className="callout">
          <strong>Browse open data center roles on CoreStack →</strong> Updated daily from top employers
          across Northern Virginia, Phoenix, Dallas, and beyond.
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
