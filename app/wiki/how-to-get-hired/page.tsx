import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticles } from "@/lib/wiki";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata() {
  const article = getArticleBySlug("how-to-get-hired");
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

export default function HowToGetHiredPage() {
  const article = getArticleBySlug("how-to-get-hired");
  if (!article) return notFound();

  const related = getAllArticles()
    .filter((a) => a.slug !== "how-to-get-hired")
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
        <h2>Understanding How Hyperscalers Hire</h2>
        <p>
          Getting hired at a hyperscaler — Amazon Web Services, Google, Microsoft, or Meta — for data
          center or infrastructure roles is a fundamentally different process from joining a startup or
          a smaller employer. The scale of these organizations means hiring is highly structured,
          slower-moving, and often opaque from the outside. Understanding the mechanics before you
          apply will save you significant time and frustration.
        </p>
        <p>
          Most hyperscaler data center roles fall into one of two hiring tracks. The first is direct
          employment — applying to an internal team through the company&apos;s careers site, going
          through a formal interview process, and receiving a full-time offer with equity, benefits,
          and full company resources. The second is contractor or vendor employment — working on a
          hyperscaler&apos;s site or supporting their infrastructure through a third-party staffing
          firm or managed service provider. Both paths are legitimate and often lead to direct offers
          over time.
        </p>
        <p>
          Direct hiring timelines at hyperscalers typically run 8–16 weeks from first contact to offer.
          This includes a recruiter screen, one or two technical phone screens, and a final panel
          interview (often five or six back-to-back conversations in a single day). Being patient and
          responsive throughout this process — and continuing to apply to other roles in parallel — is
          the right strategy.
        </p>

        <h2>Company-by-Company Breakdown</h2>

        <h3>Amazon (AWS)</h3>
        <p>
          Amazon is the world&apos;s largest data center operator by a significant margin. Their data
          center operations organization (DCO) hires thousands of facilities technicians, critical
          systems engineers, network engineers, and construction project managers annually. The hiring
          process at Amazon is structured around their Leadership Principles — expect every interview
          question to be behavioral and tied explicitly to LP examples. The STAR format (Situation,
          Task, Action, Result) is essential. Amazon&apos;s data centers are concentrated in Northern
          Virginia, the Pacific Northwest, Ohio, and internationally in Dublin and Frankfurt, with
          rapid expansion in Singapore, Malaysia, and Australia. The best entry path is through
          Amazon&apos;s facilities technician roles in Ashburn, which have active pipelines and lower
          experience requirements than engineering positions.
        </p>

        <h3>Google (GCP)</h3>
        <p>
          Google&apos;s data center operations team is smaller and more selective than Amazon&apos;s,
          with a stronger emphasis on automation and software-defined infrastructure. Google&apos;s
          data centers are among the most energy-efficient in the world, and they value candidates who
          understand sustainable operations alongside traditional critical facilities skills.
          Interviews at Google are more technically rigorous than at other hyperscalers — expect
          in-depth questions about electrical systems, cooling fundamentals, and for software-adjacent
          roles, coding assessments. Google&apos;s major data center hubs include The Dalles (Oregon),
          Council Bluffs (Iowa), Lenoir (NC), and internationally in Belgium, Singapore, and Taiwan.
        </p>

        <h3>Microsoft (Azure)</h3>
        <p>
          Microsoft operates one of the most geographically distributed data center fleets in the
          world, with facilities in over 60 regions globally. Their hiring process for data center
          roles runs through their Global Infrastructure organization. Microsoft places significant
          emphasis on security clearance compatibility for government cloud roles (Azure Government),
          which creates additional hiring pathways for candidates with existing clearances. The
          interview process is collaborative and behavioral — Microsoft&apos;s culture emphasizes
          &quot;growth mindset&quot; and is less intense on LP-style grilling than Amazon. Referrals
          carry significant weight at Microsoft; professional connections through LinkedIn or BICSI/
          Uptime Institute communities dramatically increase response rates.
        </p>

        <h3>Meta</h3>
        <p>
          Meta operates some of the most advanced data centers in the world, including facilities that
          run at the cutting edge of cooling efficiency and AI compute density. Their data center
          infrastructure team is highly engineering-focused, and hiring tends to reward candidates
          with strong analytical skills alongside domain expertise. Meta uses a structured interview
          process that includes a Jedi (judgment, empathy, doing, integrity) behavioral component
          alongside technical depth. Their major data center campuses are in Prineville (Oregon),
          Forest City (NC), Fort Worth (TX), Altoona (IA), and internationally in Sweden and Denmark.
          Meta has been particularly aggressive in hiring AI infrastructure engineers to support their
          Llama and PyTorch infrastructure.
        </p>

        <h3>Apple</h3>
        <p>
          Apple&apos;s data center operations are notably private — the company does not publicize its
          data center locations to the same degree as other hyperscalers. Their hiring process is
          relationship-driven and highly selective. Apple data center roles often come through
          professional networks rather than inbound applications. The company values discretion,
          attention to detail, and the ability to work in a compartmentalized environment where
          information is on a strict need-to-know basis. If you have connections inside Apple&apos;s
          infrastructure organization, leverage them. Cold applications rarely result in outreach.
          Facilities are known to exist in Maiden (NC), Reno (NV), Prineville (OR), and internationally
          in Denmark.
        </p>

        <h2>The Application Strategy That Works</h2>
        <p>
          <strong>Apply directly on company careers pages.</strong> Third-party job boards often list
          stale or duplicated hyperscaler roles. Go directly to the source — AWS Jobs, Google Careers,
          LinkedIn Jobs filtered by company, and Microsoft Careers. Set up job alerts so new postings
          reach you within 24 hours of going live.
        </p>
        <p>
          <strong>Match ATS keywords precisely.</strong> Applicant tracking systems filter resumes
          before a human ever reads them. Read each job description carefully and mirror its language
          in your resume. If the job posting says &quot;critical environments&quot; and your resume
          says &quot;mission-critical facilities,&quot; the ATS may not connect them. Use exact
          terminology from the posting.
        </p>
        <p>
          <strong>Network through professional communities.</strong> BICSI, the Uptime Institute, and
          Data Center Dynamics events are where hyperscaler infrastructure leaders gather. Attending
          even one conference per year and making genuine professional connections dramatically
          increases your chances of getting referred. On LinkedIn, connect with data center
          professionals at your target companies and engage thoughtfully with their content over
          weeks before asking for a referral conversation.
        </p>
        <p>
          <strong>Set up CoreStack job alerts.</strong> CoreStack aggregates roles from hyperscaler
          career pages daily. Configure alerts for your target role categories and locations — new
          postings trigger immediate notifications, giving you a head start on applications before
          roles become highly competitive.
        </p>

        <h2>Interview Process for Data Center Roles</h2>
        <p>
          <strong>For facilities and electrical roles</strong>, interviews typically include a technical
          screening call covering your background and experience with specific systems (UPS,
          switchgear, cooling), followed by a practical assessment — either a written scenario
          (&quot;describe how you would respond to a UPS bypass event&quot;) or a site walkthrough.
          Panel interviews include facilities management, operations leadership, and sometimes HR.
          Common questions: describe a major infrastructure failure you managed, explain your approach
          to preventive maintenance, how do you prioritize competing maintenance tasks under pressure?
        </p>
        <p>
          <strong>For network and systems roles</strong>, expect a Hackerrank or similar technical
          screen for software-adjacent positions, followed by deeper architecture and troubleshooting
          conversations. Common questions: design a redundant network for a Tier III data center, walk
          me through debugging a BGP route flap, explain the tradeoffs between InfiniBand and RoCE for
          AI clustering.
        </p>
        <p>
          <strong>For construction and project management roles</strong>, interviews focus on your
          track record delivering critical infrastructure projects — budget ownership, timeline
          management, contractor oversight, and commissioning experience. Bring specific numbers:
          budget sizes, team sizes, delivery timelines, and any quantified efficiency improvements.
        </p>

        <h2>What Disqualifies Candidates</h2>
        <p>
          <strong>Background check issues.</strong> All hyperscaler data center roles require
          background checks, and many require the ability to obtain site security badges or government
          clearances. Criminal records, particularly those involving fraud or violent offenses, are
          common disqualifiers. Be transparent about your history during the process — surprises at
          the background check stage are far more damaging than proactive disclosure.
        </p>
        <p>
          <strong>Missing safety certifications.</strong> For facilities and construction roles, OSHA
          30 certification is frequently listed as required, not preferred. Applying without it —
          especially if the job posting specifies it — signals that you did not read the description
          carefully. If you are close to an otherwise strong offer and missing OSHA 30, ask if there
          is an onboarding grace period while you complete it.
        </p>
        <p>
          <strong>Compensation misalignment.</strong> Hyperscalers use structured compensation bands.
          If your salary expectations significantly exceed the band for a role, the hiring process will
          stall at the offer stage. Research the compensation range before you apply — CoreStack salary
          data and the Levels.fyi database are good starting points for hyperscaler bands.
        </p>
        <p>
          <strong>Location inflexibility.</strong> The vast majority of data center roles require
          on-site presence. If you are applying for a role at a Northern Virginia data center and you
          are not willing to relocate, do not apply. Raising location concerns after receiving an offer
          wastes everyone&apos;s time and damages your professional reputation with that employer.
        </p>

        <h2>Your CoreStack Profile as a Hiring Asset</h2>
        <p>
          CoreStack profiles give engineers a persistent professional identity that travels beyond any
          single job application. When you enable &quot;Open to Work&quot; on your CoreStack profile,
          you become searchable to employers actively browsing the talent directory. Premium employers
          receive monthly CoreStack Score reports that include the top-ranked open-to-work candidates
          in their target categories — meaning your profile can generate inbound employer interest
          without you sending a single application.
        </p>
        <p>
          Set your Open to Work preferences precisely: specify your target roles, locations you are
          willing to work in, and whether you are open to relocation. Vague or incomplete settings
          reduce the relevance of matches. Connect your GitHub so your skill graph is accurate and
          up to date. Add all your certifications — even entry-level ones — because the scoring
          algorithm weights credential breadth alongside GitHub signal.
        </p>

        <div className="callout">
          <strong>Create your CoreStack profile and set Open to Work →</strong> Premium employers
          receive monthly talent reports featuring the top-ranked engineers in your category — before
          they even post a job.
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
