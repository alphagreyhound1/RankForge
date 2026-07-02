import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AuditForm } from "@/components/site/AuditForm";
import { Check, X, AlertTriangle, ArrowUpRight, Zap } from "lucide-react";

export const Route = createFileRoute("/audit")({
  component: AuditPage,
  head: () => ({
    meta: [
      { title: "Live SEO Audit — RankForge AI" },
      {
        name: "description",
        content:
          "Run a live, free 84-point SEO audit on any website. Real Core Web Vitals, performance scores, and prioritized fixes — powered by Google PageSpeed Insights.",
      },
      { property: "og:title", content: "Live SEO Audit — RankForge AI" },
      { property: "og:description", content: "Free live SEO audit with real PageSpeed data." },
      { property: "og:url", content: "/audit" },
    ],
    links: [{ rel: "canonical", href: "/audit" }],
  }),
});

// ─── Static specimen data ─────────────────────────────────────────────────────
const SPECIMEN_SCORE = 62;

function ScoreCircle({ score }: { score: number }) {
  const c = 2 * Math.PI * 90;
  const offset = c - (score / 100) * c;
  const color =
    score >= 80 ? "var(--success)" : score >= 60 ? "var(--warning)" : "var(--error)";
  return (
    <svg width="220" height="220" viewBox="0 0 220 220" className="rotate-[-90deg]">
      <circle cx="110" cy="110" r="90" stroke="var(--border)" strokeWidth="6" fill="none" />
      <circle
        cx="110"
        cy="110"
        r="90"
        stroke={color}
        strokeWidth="6"
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="butt"
        style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
      />
      <text
        x="110"
        y="118"
        textAnchor="middle"
        transform="rotate(90 110 110)"
        className="font-mono"
        style={{ fontSize: 56, fontWeight: 500, fill: "var(--ink)" }}
      >
        {score}
      </text>
    </svg>
  );
}

const CATEGORIES = [
  { name: "Technical Health", score: 58, count: 12, status: "warning" },
  { name: "Content Quality", score: 71, count: 8, status: "warning" },
  { name: "Core Web Vitals", score: 42, count: 5, status: "error" },
  { name: "Backlink Profile", score: 78, count: 4, status: "success" },
  { name: "On-Page SEO", score: 65, count: 9, status: "warning" },
  { name: "AI Visibility", score: 31, count: 6, status: "error" },
];

const ISSUES = [
  {
    p: "P0",
    type: "error",
    title: "LCP fails on 84% of landing pages",
    note: "Hero image 2.4MB. Serve as WebP, preload, and use responsive srcset.",
    impact: "+$8,400 / mo",
  },
  {
    p: "P0",
    type: "error",
    title: "Missing canonical tags on 342 URLs",
    note: "Duplicate content dilutes ranking signal across 6 templates.",
    impact: "+$5,200 / mo",
  },
  {
    p: "P1",
    type: "warning",
    title: "Schema markup incomplete",
    note: "Product schema missing on 87% of product pages. No FAQ or Article schema anywhere.",
    impact: "+$3,100 / mo",
  },
  {
    p: "P1",
    type: "warning",
    title: "Thin content on 128 category pages",
    note: "Category pages average 42 words. Competitors average 640 words with topical clusters.",
    impact: "+$4,600 / mo",
  },
  {
    p: "P2",
    type: "warning",
    title: "Internal linking bottleneck",
    note: "128 orphan pages. Homepage funnels 71% of link equity to just 4 URLs.",
    impact: "+$2,300 / mo",
  },
  {
    p: "P2",
    type: "success",
    title: "Backlink profile is clean",
    note: "0 toxic domains, DR 42, natural anchor distribution. Continue current outreach.",
    impact: "Maintain",
  },
];

const StatusIcon = ({ type }: { type: string }) => {
  if (type === "error") return <X size={18} strokeWidth={2} className="text-error" />;
  if (type === "warning") return <AlertTriangle size={18} strokeWidth={2} className="text-warning" />;
  return <Check size={18} strokeWidth={2} className="text-success" />;
};

function AuditPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ─── LIVE AUDIT SECTION ─── */}
      <section className="border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-30 pointer-events-none" />
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-14">
            <div className="md:col-span-7">
              <div className="label-mono mb-6 flex items-center gap-3">
                <Zap size={14} className="text-accent" strokeWidth={2} />
                Live · Free · No signup
              </div>
              <h1 className="serif-display text-5xl md:text-7xl">
                Audit any site.<br />
                <em className="italic font-normal text-accent">Right now.</em>
              </h1>
              <p className="mt-6 text-base text-charcoal leading-relaxed max-w-xl">
                Enter any URL and get real Core Web Vitals, Lighthouse scores, and prioritized
                fixes — powered by Google PageSpeed Insights. Results in ~10 seconds.
              </p>
            </div>
            <div className="md:col-span-4 md:col-start-9 self-end">
              <div className="grid grid-cols-2 gap-4 label-mono">
                <div className="border border-border p-4">
                  <div className="font-mono text-3xl text-ink mb-1">84</div>
                  <div className="text-charcoal">checks run</div>
                </div>
                <div className="border border-border p-4">
                  <div className="font-mono text-3xl text-ink mb-1">~10s</div>
                  <div className="text-charcoal">to results</div>
                </div>
                <div className="border border-border p-4">
                  <div className="font-mono text-3xl text-ink mb-1">6</div>
                  <div className="text-charcoal">categories</div>
                </div>
                <div className="border border-border p-4">
                  <div className="font-mono text-3xl text-success mb-1">Free</div>
                  <div className="text-charcoal">forever</div>
                </div>
              </div>
            </div>
          </div>
          <div className="label-mono mb-4 flex items-center gap-3">
            <span className="animate-blink text-accent">●</span>
            Live analysis · Powered by Google PageSpeed Insights
          </div>
          <AuditForm />
        </div>
      </section>

      {/* ─── SPECIMEN SECTION ─── */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-12">
          <div className="flex items-center gap-4 label-mono text-charcoal">
            <span className="h-px flex-1 bg-border" />
            <span>§ Specimen — what a full editorial report looks like</span>
            <span className="h-px flex-1 bg-border" />
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8">
              <div className="label-mono mb-6 flex flex-wrap items-center gap-3">
                <span>Sample Report #A-0472</span>
                <span className="h-px w-8 bg-ink" />
                <span className="text-accent">Confidential · Demonstration only</span>
              </div>
              <h2 className="serif-display text-5xl md:text-7xl">
                copperline<span className="text-accent">.</span>coffee
              </h2>
              <p className="mt-6 text-base text-charcoal leading-relaxed max-w-xl">
                A specimen of what our clients receive on day two. 84 diagnostic checks,
                prioritised by revenue impact, delivered as an editorial document.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 label-mono">
                <span>
                  Domain age <span className="text-ink">4.2y</span>
                </span>
                <span>
                  Pages crawled <span className="text-ink">1,284</span>
                </span>
                <span>
                  Keywords tracked <span className="text-ink">2,401</span>
                </span>
                <span>
                  Report date <span className="text-ink">Q2 · 2026</span>
                </span>
              </div>
            </div>

            <div className="md:col-span-4 border border-border bg-surface p-8 flex flex-col items-center">
              <div className="label-mono mb-4">Overall RankForge Score</div>
              <ScoreCircle score={SPECIMEN_SCORE} />
              <div className="label-mono mt-4 text-warning">Needs work · 44 issues</div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24">
          <div className="label-mono mb-8">§ Diagnostic breakdown</div>
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-border">
            {CATEGORIES.map((c) => (
              <div key={c.name} className="border-r border-b border-border p-6 md:p-8 hover:bg-surface">
                <div className="flex items-start justify-between mb-6">
                  <span className="label-mono">{c.name}</span>
                  <StatusIcon type={c.status} />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-5xl text-ink">{c.score}</span>
                  <span className="label-mono text-charcoal">/ 100</span>
                </div>
                <div className="mt-6 h-1 bg-border relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0"
                    style={{
                      width: `${c.score}%`,
                      background:
                        c.status === "success"
                          ? "var(--success)"
                          : c.status === "warning"
                            ? "var(--warning)"
                            : "var(--error)",
                    }}
                  />
                </div>
                <div className="mt-4 label-mono">{c.count} issues flagged</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ISSUES TABLE */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="label-mono mb-4">§ Prioritized findings</div>
              <h2 className="serif-display text-4xl md:text-5xl">
                Fix these six, in this order<span className="text-accent">.</span>
              </h2>
            </div>
            <div className="label-mono text-charcoal">
              Estimated combined lift ·{" "}
              <span className="text-success text-lg font-mono">+$23,600 / mo</span>
            </div>
          </div>

          <div className="border border-border bg-background">
            <div className="grid grid-cols-[60px_1fr_120px] md:grid-cols-[80px_60px_1fr_180px] label-mono border-b border-border">
              <div className="p-4 border-r border-border">Prio</div>
              <div className="p-4 border-r border-border hidden md:block"></div>
              <div className="p-4 border-r border-border">Issue</div>
              <div className="p-4 text-right">Revenue Impact</div>
            </div>
            {ISSUES.map((issue, i) => (
              <div
                key={i}
                className="grid grid-cols-[60px_1fr_120px] md:grid-cols-[80px_60px_1fr_180px] border-b border-border last:border-0 hover:bg-surface cursor-pointer group"
              >
                <div className="p-4 md:p-6 border-r border-border font-mono text-sm text-ink self-center">
                  {issue.p}
                </div>
                <div className="p-4 md:p-6 border-r border-border hidden md:flex items-center">
                  <StatusIcon type={issue.type} />
                </div>
                <div className="p-4 md:p-6 border-r border-border">
                  <h3 className="font-serif text-xl md:text-2xl text-ink group-hover:text-accent">
                    {issue.title}
                  </h3>
                  <p className="text-sm text-charcoal mt-2 leading-relaxed">{issue.note}</p>
                </div>
                <div className="p-4 md:p-6 text-right self-center">
                  <div
                    className={`font-mono text-sm md:text-base ${issue.impact === "Maintain" ? "text-charcoal" : "text-success"}`}
                  >
                    {issue.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-10">
            <div className="md:col-span-7">
              <div className="label-mono mb-6">Want yours?</div>
              <h2 className="serif-display text-5xl md:text-7xl">
                Get a report<br />
                <em className="italic font-normal text-accent">just like this.</em>
              </h2>
            </div>
            <div className="md:col-span-4 md:col-start-9">
              <p className="text-base text-charcoal leading-relaxed">
                Free, personal, delivered by a strategist — not a PDF generator. Drop your URL
                below.
              </p>
            </div>
          </div>
          <AuditForm />
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-2 label-mono link-underline"
          >
            <span className="link-underline-inner text-ink">Or book a strategy call</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
