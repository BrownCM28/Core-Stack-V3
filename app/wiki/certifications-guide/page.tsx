import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticles } from "@/lib/wiki";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata() {
  const article = getArticleBySlug("certifications-guide");
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

export default function CertificationsGuidePage() {
  const article = getArticleBySlug("certifications-guide");
  if (!article) return notFound();

  const related = getAllArticles()
    .filter((a) => a.slug !== "certifications-guide")
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
        <p className="font-sans text-lg text-[#6B6560] leading-relaxed mb-4">
          {article.description}
        </p>
        <div className="flex items-center gap-3 font-mono text-xs text-[#6B6560] pb-6 border-b border-[#E2DDD8]">
          <span>{article.author}</span>
          <span>·</span>
          <span>{article.readTime}</span>
          <span>·</span>
          <span>Updated {article.updatedAt}</span>
        </div>
      </div>

      {/* Article content */}
      <div className="wiki-content">
        <h2>Do Certifications Actually Matter in Data Centers?</h2>
        <p>
          The short answer is yes — but not all certifications carry equal weight across every role. In
          data center operations, certifications serve two distinct functions: they signal baseline
          competency to hiring managers who cannot otherwise verify your skills, and they demonstrate
          that you are willing to invest in your professional development.
        </p>
        <p>
          Roles in critical power, facilities management, and structured cabling value certifications
          most highly. An electrical engineer with a licensed journeyman card and an Uptime Institute
          ATD certification is immediately distinguishable from one without. For DCIM administrators
          and systems engineers, certifications from CompTIA, Cisco, or AWS provide similar clarity.
        </p>
        <p>
          AI infrastructure and GPU cluster engineering roles, by contrast, are more skills-based.
          Employers in this space are often looking for demonstrated experience with specific hardware
          and software stacks — a strong GitHub profile, hands-on CUDA or InfiniBand experience, and
          knowledge of distributed systems can outweigh a certification list. That said, CKA
          (Certified Kubernetes Administrator) and HashiCorp Terraform Associate are increasingly
          expected at the mid-level in this space.
        </p>

        <h2>Tier 1 — Essential Certifications</h2>
        <p>These are the baseline credentials that most data center employers recognize and value:</p>

        <h3>CompTIA Server+</h3>
        <p>
          CompTIA Server+ covers server hardware, storage, networking, and security fundamentals
          relevant to data center environments. It is vendor-neutral, widely recognized, and a strong
          entry-level credential for facilities technicians, NOC analysts, and systems administrators.
          Cost is approximately $370 for the exam. No formal renewal requirement — the certification
          does not expire. Salary impact: $5k–$10k uplift at entry level in markets where it is not
          yet common.
        </p>

        <h3>CompTIA Network+</h3>
        <p>
          Network+ validates foundational networking knowledge — TCP/IP, switching, routing, wireless,
          and network troubleshooting. For NOC engineers, network operations roles, and any position
          that involves monitoring or maintaining connectivity infrastructure, Network+ is effectively
          a floor. Cost is approximately $370. Valid for three years; renewal via continuing education
          or re-examination. One of the highest ROI certifications for early-career infrastructure
          professionals.
        </p>

        <h3>AWS Cloud Practitioner / Solutions Architect</h3>
        <p>
          AWS certifications have become near-universal in cloud-adjacent data center roles. Cloud
          Practitioner ($100) is an introductory credential appropriate for anyone in the industry
          regardless of role. Solutions Architect Associate ($300) is the standard for cloud
          infrastructure, DCIM, and DevOps positions. Both are valid for three years. AWS certs
          consistently produce salary premiums of $10k–$20k in the mid-market.
        </p>

        <h3>Cisco CCNA</h3>
        <p>
          The Cisco Certified Network Associate remains the gold standard for networking roles in data
          center environments. It covers switching, routing, and fundamental network automation. Cost
          is $330 for the exam. Valid for three years. For NOC engineers looking to advance to network
          engineering roles, CCNA is often a hard requirement at mid-level. For AI infrastructure
          roles that involve InfiniBand or high-speed Ethernet, CCNA combined with vendor-specific
          networking training (Mellanox/NVIDIA, Arista) provides a competitive edge.
        </p>

        <h2>Tier 2 — Industry-Specific (High Value)</h2>

        <h3>BICSI RCDD (Registered Communications Distribution Designer)</h3>
        <p>
          BICSI RCDD is the premier credential for data center design professionals focused on
          structured cabling, telecommunications infrastructure, and network design. It requires
          passing a comprehensive exam and demonstrating experience in the field. Cost is approximately
          $400 for BICSI members. The RCDD designation is recognized globally and commands a salary
          premium of $15k–$30k for design and project roles. It is essentially required for
          senior-level cabling and infrastructure design positions.
        </p>

        <h3>BICSI DCDC (Data Center Design Consultant)</h3>
        <p>
          The DCDC is BICSI&apos;s data center-specific design credential, covering power, cooling,
          cabling, and architectural design for data centers. It requires significant documented
          experience and a rigorous examination. It is highly valued for design engineers and
          construction project managers working on Tier III and IV facilities. DCDC holders are in
          short supply relative to demand, making this one of the highest-value credentials in the
          facilities space.
        </p>

        <h3>Uptime Institute ATD / ATS</h3>
        <p>
          Uptime Institute&apos;s Accredited Tier Designer (ATD) and Accredited Tier Specialist (ATS)
          certifications are the recognized credentials for professionals working with Tier-classified
          data centers. They are particularly valuable for engineers involved in commissioning,
          auditing, or designing Tier III and IV facilities. Cost varies by training program. These
          credentials open doors to roles with major colocation providers and hyperscalers that build
          to Tier standards.
        </p>

        <h3>OSHA 30</h3>
        <p>
          The OSHA 30-hour Construction Industry certification is effectively mandatory for facilities,
          construction, and project management roles at data center construction sites. It demonstrates
          safety competency and is required by many contractors and hyperscalers for site access. Cost
          is $150–$250 for an authorized training course. It should be on every facilities and
          construction professional&apos;s credential list.
        </p>

        <h2>Tier 3 — Emerging and Premium</h2>

        <h3>CKA (Certified Kubernetes Administrator)</h3>
        <p>
          The CKA, offered by the Cloud Native Computing Foundation, validates the ability to deploy,
          configure, and manage Kubernetes clusters. It is increasingly required for platform
          engineering, DevOps, and AI infrastructure roles. Cost is $395 and includes one free retake.
          Valid for two years. CKA holders at the senior level command $15k–$30k salary premiums over
          peers without the certification.
        </p>

        <h3>HashiCorp Terraform Associate</h3>
        <p>
          Terraform Associate validates foundational IaC skills using HashiCorp Terraform — the
          dominant infrastructure provisioning tool in cloud-native environments. It is increasingly
          expected for DevOps, cloud infrastructure, and AI infrastructure roles. Cost is $70.5 and
          valid for two years. It is an excellent complement to AWS SA and CKA for engineers building
          a cloud-native infrastructure credential stack.
        </p>

        <h3>NVIDIA Deep Learning Institute Certifications</h3>
        <p>
          NVIDIA DLI certifications cover GPU programming, CUDA, and AI infrastructure topics relevant
          to engineers working with GPU clusters. While not yet required for most AI infrastructure
          roles, they demonstrate genuine engagement with the hardware stack that underlies modern AI
          workloads. As the market matures, expect these to become more widely recognized by 2027.
        </p>

        <h3>AWS Data Engineer Associate</h3>
        <p>
          The AWS Data Engineer Associate certification validates skills in data pipeline construction,
          storage optimization, and data processing at scale. For DCIM professionals, data center ops
          engineers working with telemetry data, and anyone adjacent to AI training data pipelines, it
          is a relevant and increasingly valued credential.
        </p>

        <h2>Certification Path by Role</h2>
        <table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Start Here</th>
              <th>Then Get</th>
              <th>Advanced</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>NOC Analyst</td>
              <td>CompTIA Network+</td>
              <td>CompTIA Server+, CCNA</td>
              <td>AWS SA Associate</td>
            </tr>
            <tr>
              <td>Facilities Tech</td>
              <td>OSHA 30</td>
              <td>CompTIA Server+</td>
              <td>Uptime ATD</td>
            </tr>
            <tr>
              <td>Electrical / Power</td>
              <td>OSHA 30</td>
              <td>NFPA 70E (Arc Flash)</td>
              <td>Uptime ATD, BICSI DCDC</td>
            </tr>
            <tr>
              <td>Network Engineer</td>
              <td>CompTIA Network+</td>
              <td>CCNA</td>
              <td>CCIE, Arista ACE</td>
            </tr>
            <tr>
              <td>DCIM / Systems Admin</td>
              <td>CompTIA Server+</td>
              <td>AWS Cloud Practitioner</td>
              <td>AWS SA, Terraform Assoc.</td>
            </tr>
            <tr>
              <td>Construction PM</td>
              <td>OSHA 30</td>
              <td>BICSI RCDD</td>
              <td>BICSI DCDC, PMP</td>
            </tr>
            <tr>
              <td>AI Infra Engineer</td>
              <td>CKA</td>
              <td>Terraform Associate</td>
              <td>NVIDIA DLI, AWS SA</td>
            </tr>
          </tbody>
        </table>

        <h2>How CoreStack Displays Your Certifications</h2>
        <p>
          CoreStack profiles include a dedicated certifications section that displays your credentials
          as visual badges — with the issuing organization, certification name, issue date, and
          credential URL for verification. Employers browsing the talent directory see your
          certifications immediately, alongside your GitHub skill graph and open-to-work status.
        </p>
        <p>
          To add certifications to your CoreStack profile, navigate to your dashboard and select
          &quot;Add Certification.&quot; You will need the certification name, issuing organization,
          issue date, and optionally a credential ID and verification URL. Once added, your
          certifications appear on your public profile instantly. There is no limit to how many you can
          add, and expired certifications can be marked as such to keep your profile accurate.
        </p>

        <div className="callout">
          <strong>Tip:</strong> Employers using CoreStack&apos;s Premium Score reports weight
          certifications in candidate rankings. A BICSI RCDD or Uptime ATD on your profile can move
          you significantly higher in monthly talent reports delivered to facilities employers.
        </div>
      </div>

      {/* Tags */}
      <div className="mt-10 pt-6 border-t border-[#E2DDD8]">
        <span className="font-mono text-xs text-[#6B6560] uppercase tracking-widest mr-3">Tags</span>
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-xs bg-[#F5F2EE] text-[#6B6560] px-2 py-1 rounded mr-2"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Related articles */}
      <div className="mt-10 pt-6 border-t border-[#E2DDD8]">
        <h3 className="font-display text-xl font-normal text-[#0D0F12] mb-4">More from the Wiki</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {related.map((a) => (
            <Link
              key={a.slug}
              href={`/wiki/${a.slug}`}
              className="block border border-[#E2DDD8] rounded-lg p-4 hover:border-[#3ECF8E] transition-colors"
            >
              <span className="font-mono text-xs border border-[#3ECF8E] text-[#3ECF8E] rounded-full px-2 py-0.5 inline-block mb-2">
                {a.category}
              </span>
              <p className="font-display text-sm font-normal text-[#0D0F12] leading-snug mb-1">
                {a.title}
              </p>
              <p className="font-mono text-xs text-[#6B6560]">{a.readTime}</p>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
