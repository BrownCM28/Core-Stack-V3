import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticles } from "@/lib/wiki";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata() {
  const article = getArticleBySlug("ai-infrastructure-jobs");
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

export default function AIInfrastructureJobsPage() {
  const article = getArticleBySlug("ai-infrastructure-jobs");
  if (!article) return notFound();

  const related = getAllArticles()
    .filter((a) => a.slug !== "ai-infrastructure-jobs")
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
        <h2>What Is AI Infrastructure?</h2>
        <p>
          AI infrastructure is the physical and software layer that makes artificial intelligence
          workloads possible at scale. When a company trains a large language model, runs inference on
          millions of requests per day, or fine-tunes a foundation model for a specific use case, it is
          relying on a stack of specialized hardware and software that looks very different from
          conventional cloud infrastructure.
        </p>
        <p>
          At the hardware layer, AI infrastructure is built around GPU clusters — racks of NVIDIA H100,
          H200, or B200 accelerators connected by high-bandwidth interconnects like InfiniBand (up to
          400 Gbps HDR) or RoCE (RDMA over Converged Ethernet). These clusters require dedicated
          cooling infrastructure — often liquid cooling at densities of 50–100 kW per rack — and power
          systems engineered to operate at near-100% utilization for months at a time.
        </p>
        <p>
          At the software layer, AI infrastructure includes distributed training frameworks (PyTorch
          Distributed, DeepSpeed, Megatron-LM), job schedulers (Slurm, Kubernetes with GPU operators),
          high-performance storage systems (Lustre, GPFS, WekaFS), and observability tooling that can
          track GPU utilization, memory bandwidth, and inter-node communication efficiency across
          thousands of accelerators simultaneously.
        </p>

        <h2>Why AI Infrastructure Is the Fastest Growing Tech Sector of 2026</h2>
        <p>
          The scale of the AI buildout is difficult to overstate. Amazon, Microsoft, Google, and Meta
          collectively announced over $300 billion in capital expenditure for 2026, with a significant
          portion directed at AI data center construction and GPU procurement. AI-native infrastructure
          providers — CoreWeave, Lambda Labs, Crusoe Energy, and Together AI — have raised billions in
          venture capital to build dedicated GPU cloud infrastructure.
        </p>
        <p>
          The result is an acute shortage of engineers who understand both the hardware and software
          sides of AI infrastructure. A GPU cluster engineer who can size an InfiniBand fabric, tune
          NCCL communication parameters, and debug distributed training failures is extraordinarily
          rare. This scarcity has driven compensation for senior AI infrastructure engineers to levels
          that rival — and often exceed — those of senior software engineers at top tech companies.
        </p>
        <p>
          The Uptime Institute projects that AI-optimized data center capacity will triple by 2028.
          Every megawatt of new AI compute requires engineers to design, build, operate, and optimize
          it. The talent pipeline has not kept pace with this demand, and it will not for several years.
          For engineers with the relevant background or the willingness to develop it, this is one of
          the most favorable labor markets of the past decade.
        </p>

        <h2>Key Roles in AI Infrastructure</h2>

        <h3>GPU Cluster Engineer</h3>
        <p>
          GPU Cluster Engineers design, deploy, and operate large-scale GPU clusters for training and
          inference workloads. The role involves hardware procurement and racking, network fabric
          design and configuration (InfiniBand or RoCE), storage system integration, and ongoing
          performance optimization. Day-to-day work includes debugging distributed training failures,
          optimizing GPU utilization, and managing cluster health at scale. Salary range: $130k–$300k+
          depending on experience and employer. This is one of the most compensation-intensive roles in
          the entire technology industry.
        </p>

        <h3>HPC Systems Administrator</h3>
        <p>
          HPC (high-performance computing) systems administrators manage the software and operating
          environment of large compute clusters. This includes OS management (typically Linux/RHEL),
          job scheduler configuration (Slurm, LSF), user environment management (modules, containers),
          storage system administration, and performance monitoring. Many HPC sysadmin roles are
          transitioning to AI workloads as the demand for traditional scientific computing overlaps
          with AI training requirements. Salary range: $100k–$180k.
        </p>

        <h3>MLOps / ML Infrastructure Engineer</h3>
        <p>
          MLOps engineers build and maintain the platforms that allow ML teams to train, evaluate, and
          deploy models at scale. This includes CI/CD pipelines for model training, experiment tracking
          systems (MLflow, Weights &amp; Biases), model registries, and inference serving
          infrastructure (TorchServe, Triton Inference Server, vLLM). MLOps roles sit at the
          intersection of software engineering and infrastructure, and are among the most in-demand
          positions in AI companies. Salary range: $140k–$250k.
        </p>

        <h3>AI Data Center Facilities Engineer</h3>
        <p>
          AI data centers place extreme demands on physical infrastructure — power densities of 50–100+
          kW per rack, high-density liquid cooling systems, and power systems with near-zero tolerance
          for interruption. Facilities engineers in AI data centers must understand both traditional
          critical facilities engineering and the specific requirements of high-density GPU
          deployments. This is a premium specialization within the facilities discipline. Salary range:
          $110k–$165k, with additional premiums in markets building out AI capacity rapidly.
        </p>

        <h3>Network Engineer (AI/HPC Networking)</h3>
        <p>
          AI clusters require networking infrastructure that operates at a fundamentally different scale
          and performance level than conventional data center networking. InfiniBand fabric design,
          RDMA configuration, BGP routing at scale, and 400G Ethernet deployments are the core skills.
          Engineers with NVIDIA Mellanox InfiniBand expertise or experience with Arista&apos;s AI
          networking portfolio are in particularly short supply. Salary range: $140k–$220k.
        </p>

        <h3>AI Infrastructure Program Manager</h3>
        <p>
          AI Infrastructure Program Managers coordinate the delivery of large-scale AI data center
          buildouts — managing timelines, vendor relationships, hardware procurement pipelines (which
          can involve billion-dollar GPU orders), and cross-functional teams spanning facilities,
          network, software, and ML teams. Strong technical background required. Salary range:
          $160k–$240k.
        </p>

        <h2>Technical Skills Required</h2>

        <h3>Languages and Scripting</h3>
        <ul>
          <li>
            <strong>Python</strong> — essential for automation, data pipelines, and ML tooling
          </li>
          <li>
            <strong>Go</strong> — increasingly used in infrastructure tooling and Kubernetes operators
          </li>
          <li>
            <strong>Bash / Shell</strong> — required for cluster management, job scripts, and
            automation
          </li>
        </ul>

        <h3>Tools and Platforms</h3>
        <ul>
          <li>
            <strong>Kubernetes</strong> with GPU device plugin and MIG (Multi-Instance GPU) support
          </li>
          <li>
            <strong>Slurm</strong> — the dominant job scheduler in HPC and AI training environments
          </li>
          <li>
            <strong>Ray</strong> — distributed Python framework widely used for distributed ML
          </li>
          <li>
            <strong>NCCL</strong> (NVIDIA Collective Communications Library) — the backbone of
            multi-GPU communication
          </li>
          <li>
            <strong>CUDA</strong> — understanding GPU programming fundamentals even for infra roles
          </li>
        </ul>

        <h3>Hardware Knowledge</h3>
        <ul>
          <li>
            NVIDIA H100, H200, and B200 GPU architectures — PCIe vs NVLink topologies, MIG partitions
          </li>
          <li>
            InfiniBand networking — HDR (200Gbps) and NDR (400Gbps), fat-tree topology, subnet
            managers
          </li>
          <li>
            NVLink and NVSwitch — high-bandwidth GPU-to-GPU interconnects within a node
          </li>
          <li>
            High-performance storage — Lustre, GPFS, WekaFS, and all-flash NVMe arrays
          </li>
          <li>
            Liquid cooling systems — direct liquid cooling (DLC) and immersion cooling for high-density
            racks
          </li>
        </ul>

        <h2>How to Transition Into AI Infrastructure</h2>

        <h3>From Traditional Data Center Operations</h3>
        <p>
          If you are currently in data center facilities, NOC, or systems administration, you are well
          positioned to transition to AI infrastructure roles. Start by building Python scripting
          skills and learning Kubernetes fundamentals (CKA certification is a strong first milestone).
          Seek out GPU-adjacent work at your current employer — even configuration or monitoring work
          on GPU nodes provides relevant experience. Target mid-level roles at AI-native companies
          that are growing quickly and will train strong infrastructure generalists.
        </p>

        <h3>From DevOps / Platform Engineering</h3>
        <p>
          DevOps engineers already have most of the software infrastructure skills required. The gap is
          typically hardware knowledge — GPU architecture, InfiniBand networking, and storage systems.
          Build hands-on experience with NVIDIA tooling (nvtop, nvidia-smi, DCGM), set up a small
          CUDA development environment, and learn the basics of distributed training. Many AI companies
          are aggressively hiring DevOps engineers with Kubernetes expertise and training them on the
          GPU-specific layer.
        </p>

        <h3>From Software Engineering</h3>
        <p>
          Software engineers with strong Python backgrounds and distributed systems experience are
          natural candidates for MLOps and ML infrastructure roles. The infrastructure depth comes
          with time; the software engineering rigor is harder to develop. Focus on understanding
          Kubernetes, learning Slurm or Ray, and building experience with model training workflows.
          MLOps roles at Series B and later AI companies are frequently open to strong software
          engineers willing to invest in the infrastructure layer.
        </p>

        <h2>Where to Find AI Infrastructure Jobs</h2>
        <p>
          <strong>AI-native infrastructure providers</strong> are the most active hirers:
          <strong> CoreWeave</strong> (the largest independent GPU cloud, backed by NVIDIA),
          <strong> Lambda Labs</strong> (GPU cloud focused on ML researchers), <strong>Together
          AI</strong> (inference and fine-tuning platform), and <strong>Crusoe Energy</strong>
          (sustainable AI data centers) are all growing aggressively and hiring across every
          infrastructure discipline.
        </p>
        <p>
          <strong>Hyperscalers</strong> are building dedicated AI infrastructure teams within their
          existing organizations. AWS, Google Cloud, Microsoft Azure, and Meta AI each have large teams
          focused exclusively on the hardware and software stacks that power their AI products. These
          roles offer stability and scale but typically move more slowly in hiring.
        </p>
        <p>
          <strong>Traditional colocation providers</strong> including Equinix, Digital Realty, and
          Iron Mountain are upgrading existing facilities and building new ones to meet AI demand. They
          need facilities engineers with high-density cooling experience, power engineers familiar with
          AI-scale requirements, and project managers who can deliver AI-ready data center capacity.
        </p>

        <div className="callout">
          <strong>Browse AI infrastructure roles on CoreStack →</strong> Filter by category
          &quot;AI Infrastructure&quot; to see GPU cluster, MLOps, HPC, and AI data center roles
          updated daily.
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
