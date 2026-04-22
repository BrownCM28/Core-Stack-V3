import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticles } from "@/lib/wiki";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata() {
  const article = getArticleBySlug("github-for-engineers");
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

export default function GitHubForEngineersPage() {
  const article = getArticleBySlug("github-for-engineers");
  if (!article) return notFound();

  const related = getAllArticles()
    .filter((a) => a.slug !== "github-for-engineers")
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
        <h2>Why GitHub Matters for Infrastructure Roles</h2>
        <p>
          The infrastructure and data center industry has undergone a fundamental shift in how employers
          evaluate candidates. In the past, hiring decisions were based primarily on resumes,
          certifications, and interview performance. Today, the best infrastructure employers —
          particularly those building AI data centers, cloud platforms, and hyperscale facilities —
          want to see proof of work. GitHub is where proof lives.
        </p>
        <p>
          This is not about having a polished portfolio site. It is about signal. When a recruiter or
          hiring manager opens your GitHub profile, they form an immediate impression of your technical
          capabilities, your working style, and the kind of problems you choose to solve. A strong
          GitHub profile can move you from the &quot;maybe&quot; pile to the &quot;phone screen&quot;
          pile without a single word spoken.
        </p>
        <p>
          CoreStack was built around this insight. Every engineer who signs up connects their GitHub
          account, and the platform automatically analyzes their public repositories to build a skill
          graph — showing languages, frameworks, and tools weighted by actual code usage across recent
          projects.
        </p>

        <h2>What Employers Actually Look At</h2>
        <p>
          <strong>Repository quality over quantity.</strong> Having 40 repositories is meaningless if
          most of them are empty or one-commit experiments. Employers look for repositories that have
          been developed over time, have thoughtful READMEs, and solve real problems. Four
          well-maintained repositories signal more than 40 abandoned ones.
        </p>
        <p>
          <strong>Language relevance.</strong> For infrastructure roles, the languages that carry the
          most weight are Terraform (HCL), Python, Go, Shell scripting (Bash), and YAML (Kubernetes
          manifests, Ansible playbooks). If your GitHub is dominated by JavaScript personal projects
          but you are applying for an infrastructure automation role, there is a signal mismatch. Fill
          the gap with repositories that demonstrate the skills the role requires.
        </p>
        <p>
          <strong>Topics and tags.</strong> Many engineers overlook this feature. GitHub lets you add
          topics to repositories — keywords like &quot;terraform&quot;, &quot;kubernetes&quot;,
          &quot;ansible&quot;, &quot;infrastructure&quot;, &quot;monitoring&quot;. These topics are
          indexed and searchable. They also tell employers at a glance what the repo is about before
          they read a line of code.
        </p>
        <p>
          <strong>Contribution consistency.</strong> Employers look at contribution graphs. A consistent
          pattern of green squares — even if they are just small commits — demonstrates that you are
          actively working on code. Long gaps followed by bursts of activity look different than
          sustained engagement. You do not need to commit every day, but a completely dark contribution
          graph for the past year is a red flag.
        </p>
        <p>
          <strong>README quality as a proxy for communication.</strong> Infrastructure engineering
          requires clear documentation. How you write a README — whether you explain what the project
          does, how to install it, and what problem it solves — is a proxy for how you will write
          runbooks, incident reports, and technical documentation on the job. A well-written README
          signals good communication skills.
        </p>
        <p>
          <strong>Stars and forks as social proof.</strong> While you cannot manufacture this signal,
          repositories that have attracted stars or forks from other engineers demonstrate that your
          work has been useful to others. Contributing to open source infrastructure projects and having
          pull requests merged is the fastest way to build this credibility.
        </p>

        <h2>The CoreStack Skill Graph</h2>
        <p>
          When you connect your GitHub to CoreStack, the platform analyzes your public repositories to
          generate a weighted skill graph. The algorithm looks at the primary language of each
          repository, the topics you have tagged, and the relative size and recency of each repository.
          More recent and more substantial repositories carry more weight than old or small ones.
        </p>
        <p>
          The skill graph is displayed prominently on your CoreStack profile and is one of the first
          things employers see when browsing talent. It shows language percentages — for example,
          &quot;Python 34%, HCL 28%, Go 18%, Shell 20%&quot; — and topic tags derived from your actual
          code usage.
        </p>
        <p>
          To improve your skill graph score: add topics to all your repositories, ensure your most
          relevant infrastructure repositories are public, and keep their READMEs updated. The
          algorithm re-syncs automatically, so improvements you make to your GitHub will be reflected
          on your CoreStack profile shortly after.
        </p>

        <h2>Repos That Signal Strong Infrastructure Candidates</h2>
        <p>
          The repositories that generate the most positive employer response for infrastructure roles
          fall into a few clear categories:
        </p>
        <ul>
          <li>
            <strong>Infrastructure as Code templates.</strong> A repository containing well-structured
            Terraform modules, a Pulumi project, or an Ansible collection that provisions cloud
            resources or configures servers shows you can write production-quality IaC. Even a personal
            project — a Terraform configuration for a home lab — demonstrates relevant skills.
          </li>
          <li>
            <strong>Monitoring and observability stacks.</strong> A Docker Compose or Kubernetes
            manifest that sets up a Prometheus and Grafana monitoring stack, complete with pre-built
            dashboards and alert rules, is exactly the kind of practical work hiring managers recognize.
            Custom exporters or integrations earn bonus points.
          </li>
          <li>
            <strong>Automation scripts.</strong> Python and Bash scripts that automate real
            infrastructure tasks — backup routines, log aggregation, certificate renewal,
            API-driven provisioning — are highly valued. Simple tools that solve a specific problem are
            often more impressive than complex code that nobody uses.
          </li>
          <li>
            <strong>Kubernetes configurations and operators.</strong> A repository containing
            production-quality Kubernetes manifests, Helm charts, or a custom Kubernetes operator
            demonstrates familiarity with container orchestration at a level most candidates claim but
            few can prove.
          </li>
        </ul>
        <p>
          A good README for an infrastructure repository follows this structure: what the project does
          (one paragraph), prerequisites (OS, tools required), quick start (install and run in three
          commands), configuration (environment variables or config file options), and contributing
          guidelines.
        </p>

        <h2>What to Do If You Are New to GitHub</h2>
        <p>
          If you are early in your career and your GitHub profile is sparse, the goal is to build
          genuine, useful repositories — not to fake activity.
        </p>
        <p>
          <strong>Start with documenting your home lab setup.</strong> If you run a Proxmox server, a
          Raspberry Pi cluster, or any home networking setup, create a repository that documents it
          with Infrastructure as Code. This is real, practical work that demonstrates genuine interest
          and capability.
        </p>
        <p>
          <strong>Contribute to open source infrastructure projects.</strong> Projects like Prometheus,
          Grafana, Ansible, Terraform providers, and Kubernetes tools all have active communities that
          welcome new contributors. Start with documentation improvements or small bug fixes. A merged
          pull request in a well-known open source project is a credibility signal that stands on its
          own.
        </p>
        <p>
          <strong>Build tools for problems you actually encounter.</strong> If you find yourself doing
          something manually more than twice, automate it and put the code on GitHub. Real problems
          produce better code than toy examples, and the authenticity shows.
        </p>

        <h2>Common Mistakes to Avoid</h2>
        <ul>
          <li>
            <strong>Private repositories</strong> do not help your profile. If your best work is
            private, create a sanitized public version that demonstrates the structure and approach
            without exposing sensitive data.
          </li>
          <li>
            <strong>No README</strong> is a missed opportunity. Every repository should have at least a
            three-sentence README explaining what it does and how to use it.
          </li>
          <li>
            <strong>No topics or tags</strong> means your repos are invisible to search. Add relevant
            topics to every repository.
          </li>
          <li>
            <strong>Forked repositories</strong> with no original commits do not demonstrate your
            skills. Only count forks where you have made meaningful contributions.
          </li>
          <li>
            <strong>Commit messages</strong> that say only &quot;fix&quot; or &quot;update&quot; show
            poor development practice. Write clear messages that explain what changed and why.
          </li>
        </ul>

        <div className="callout">
          <strong>Connect GitHub on CoreStack and your skill graph is built automatically.</strong>{" "}
          Employers browsing talent see your languages, tools, and repos — without you doing anything
          extra.
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
