import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CoreWebVitalsTool } from "@/components/site/CoreWebVitalsTool";
import {
  ArrowUpRight,
  Search,
  FileText,
  Link2,
  Gauge,
  Hash,
  Globe,
  Bot,
  Image,
  Code2,
  X,
} from "lucide-react";

export const Route = createFileRoute("/tools")({
  component: ToolsPage,
  head: () => ({
    meta: [
      { title: "Free SEO Tools — RankForge AI" },
      {
        name: "description",
        content:
          "A collection of free, no-signup SEO tools. Live Core Web Vitals checker, meta preview, schema validators, keyword clustering, and more.",
      },
      { property: "og:title", content: "Free SEO Tools — RankForge AI" },
      { property: "og:description", content: "Free, no-signup SEO tools from RankForge." },
      { property: "og:url", content: "/tools" },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
});

type ToolDef = {
  n: string;
  title: string;
  desc: string;
  tag: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  span: string;
  live?: boolean;
};

const TOOLS: ToolDef[] = [
  {
    n: "01",
    title: "Meta Tag Composer",
    desc: "Preview title & description across Google, Bing, ChatGPT results.",
    tag: "content",
    icon: FileText,
    span: "md:col-span-2",
  },
  {
    n: "02",
    title: "Schema Validator",
    desc: "Paste JSON-LD, get an editorial breakdown of what Google will parse.",
    tag: "technical",
    icon: Code2,
    span: "md:col-span-1",
  },
  {
    n: "03",
    title: "Core Web Vitals",
    desc: "LCP, INP, CLS scored live against Google thresholds for mobile & desktop.",
    tag: "performance",
    icon: Gauge,
    span: "md:col-span-1",
    live: true,
  },
  {
    n: "04",
    title: "Keyword Clusterer",
    desc: "Group 10k keywords into intent-mapped topical clusters in seconds.",
    tag: "research",
    icon: Hash,
    span: "md:col-span-2",
  },
  {
    n: "05",
    title: "Internal Link Graph",
    desc: "Visualise orphan pages and authority flow through your architecture.",
    tag: "technical",
    icon: Link2,
    span: "md:col-span-1",
  },
  {
    n: "06",
    title: "Backlink Diff",
    desc: "Compare your backlink profile against three competitors, side by side.",
    tag: "authority",
    icon: Globe,
    span: "md:col-span-1",
  },
  {
    n: "07",
    title: "AI Visibility Score",
    desc: "Are you cited in ChatGPT, Perplexity, and Google AI Overviews?",
    tag: "ai search",
    icon: Bot,
    span: "md:col-span-2",
  },
  {
    n: "08",
    title: "Image SEO Auditor",
    desc: "Alt text quality, filesize, format, and CLS impact per image.",
    tag: "media",
    icon: Image,
    span: "md:col-span-1",
  },
  {
    n: "09",
    title: "SERP Snapshot",
    desc: "Live top-10 for any keyword, annotated with SERP features present.",
    tag: "research",
    icon: Search,
    span: "md:col-span-1",
  },
];

// ─── Coming Soon Overlay ──────────────────────────────────────────────────────
function ComingSoonModal({ tool, onClose }: { tool: ToolDef; onClose: () => void }) {
  const Icon = tool.icon;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${tool.title} - Coming Soon`}
    >
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-background border border-ink max-w-md w-full p-10 animate-fade-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-charcoal hover:text-ink"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <div className="flex items-start justify-between mb-8">
          <div>
            <span className="label-mono block">Tool / {tool.n}</span>
            <span className="label-mono block text-accent mt-1">{tool.tag}</span>
          </div>
          <Icon size={22} strokeWidth={1.5} className="text-charcoal" />
        </div>
        <h2 className="font-serif text-4xl text-ink mb-3">{tool.title}</h2>
        <p className="text-sm text-charcoal leading-relaxed mb-8">{tool.desc}</p>
        <div className="border-t border-border pt-6">
          <div className="label-mono text-warning mb-3">⏳ Coming soon</div>
          <p className="text-sm text-charcoal leading-relaxed mb-6">
            This tool is in active development. Drop your email to get early access when it
            launches.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-ink text-background px-6 py-3 label-mono hover:bg-accent"
            onClick={onClose}
          >
            Get notified →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── CWV Modal ────────────────────────────────────────────────────────────────
function CWVModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Core Web Vitals Checker"
    >
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-background border border-ink w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-up">
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <span className="label-mono block">Tool / 03 · performance</span>
            <h2 className="font-serif text-2xl text-ink mt-1">Core Web Vitals Checker</h2>
          </div>
          <button
            onClick={onClose}
            className="text-charcoal hover:text-ink p-2"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-0">
          <CoreWebVitalsTool />
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function ToolsPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleToolClick = (tool: ToolDef) => {
    setActiveModal(tool.n);
  };

  const closeModal = () => setActiveModal(null);

  const activeTool = TOOLS.find((t) => t.n === activeModal);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8">
              <div className="label-mono mb-6">Vol. II · Utilities</div>
              <h1 className="serif-display text-6xl md:text-8xl">
                Free tools<span className="text-accent">.</span>
                <br />
                <em className="italic font-normal">No signup.</em>
              </h1>
            </div>
            <div className="md:col-span-4 md:col-start-9 self-end">
              <p className="text-base text-charcoal leading-relaxed">
                Nine SEO utilities we built for ourselves. Tool 03 is live — the rest are
                launching soon.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="animate-blink text-success">●</span>
                <span className="label-mono">
                  <span className="text-success">1 live</span>
                  <span className="text-charcoal"> · 8 coming soon</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {TOOLS.map((t, i) => {
              const Icon = t.icon;
              const isLive = t.live === true;
              return (
                <div
                  key={t.n}
                  className={`group border border-border bg-background p-6 md:p-8 cursor-pointer hover:-translate-y-1 hover:border-ink hover:shadow-[0_10px_40px_-20px_rgba(28,27,26,0.3)] transition-all relative ${t.span}`}
                  data-testid={`tool-card-${t.n}`}
                  style={{ animation: `fade-up 0.6s ${i * 60}ms cubic-bezier(0.4,0,0.2,1) both` }}
                  onClick={() => handleToolClick(t)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleToolClick(t)}
                  aria-label={`Open ${t.title}`}
                >
                  {/* Live badge */}
                  {isLive && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 label-mono text-success">
                      <span className="animate-blink">●</span>
                      Live
                    </div>
                  )}
                  {!isLive && (
                    <div className="absolute top-4 right-4 label-mono text-charcoal/60 text-[10px]">
                      Soon
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-10">
                    <div>
                      <span className="label-mono block">Tool / {t.n}</span>
                      <span className="label-mono block text-accent mt-1">{t.tag}</span>
                    </div>
                    <Icon
                      size={22}
                      strokeWidth={1.5}
                      className={`${isLive ? "text-accent" : "text-charcoal group-hover:text-accent"} transition-colors mt-6`}
                    />
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl text-ink group-hover:text-accent mb-3 leading-tight">
                    {t.title}
                  </h2>
                  <p className="text-sm text-charcoal leading-relaxed">{t.desc}</p>
                  <div className="mt-8 pt-6 border-t border-border flex items-center justify-between label-mono">
                    <span className={`${isLive ? "text-accent" : "text-charcoal group-hover:text-ink"}`}>
                      {isLive ? "Open tool" : "Coming soon"}
                    </span>
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.5}
                      className="text-charcoal group-hover:text-accent group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <div className="label-mono mb-6">Need more than a tool?</div>
            <h2 className="serif-display text-5xl md:text-7xl">
              Get a full
              <br />
              <em className="italic font-normal text-accent">editorial audit.</em>
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9 self-end">
            <p className="text-base text-charcoal leading-relaxed mb-6">
              These free tools tell you <em>what</em>. Our full audit tells you <em>why</em>,{" "}
              <em>what to do next</em>, and models the revenue impact of each fix.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-ink text-background px-6 py-4 label-mono hover:bg-accent"
            >
              Book your audit →
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Modals */}
      {activeModal && activeTool && (
        <>
          {activeTool.live ? (
            <CWVModal onClose={closeModal} />
          ) : (
            <ComingSoonModal tool={activeTool} onClose={closeModal} />
          )}
        </>
      )}
    </div>
  );
}
