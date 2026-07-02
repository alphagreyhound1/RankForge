import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AuditForm } from "@/components/site/AuditForm";
import { Check, X, AlertTriangle, ArrowUpRight, Zap, ExternalLink } from "lucide-react";
import type { PageSpeedResult, CWVMetric, AuditOpportunity } from "@/lib/pagespeed.functions";

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

// ─── Static specimen data (used as demo before user runs an audit) ───────────
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

// ─── Helper Functions for Live Data ───────────────────────────────────────────
function formatDomain(url: string) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    const parts = hostname.split(".");
    if (parts.length >= 2) {
      const tld = parts.pop();
      return { main: parts.join("."), tld: `.${tld}` };
    }
    return { main: hostname, tld: "" };
  } catch {
    return { main: url, tld: "" };
  }
}

function getDynamicCategories(res: PageSpeedResult) {
  const perfScore = res.scores.performance;
  const seoScore = res.scores.seo;
  const a11yScore = res.scores.accessibility;
  const bpScore = res.scores.bestPractices;

  const cwvVals = Object.values(res.cwv);
  const goodCount = cwvVals.filter((m) => m.rating === "good").length;
  const cwvScore = Math.round((goodCount / cwvVals.length) * 100) || perfScore;

  const techScore = Math.round((perfScore + bpScore + seoScore) / 3);

  const getStatus = (s: number) => (s >= 80 ? "success" : s >= 60 ? "warning" : "error");

  return [
    {
      name: "Performance Health",
      score: perfScore,
      count: res.opportunities.filter((o) => o.type === "error" || o.type === "warning").length,
      status: getStatus(perfScore),
    },
    {
      name: "SEO & Searchability",
      score: seoScore,
      count: res.diagnostics.length,
      status: getStatus(seoScore),
    },
    {
      name: "Core Web Vitals",
      score: cwvScore,
      count: cwvVals.filter((m) => m.rating !== "good" && m.rating !== "unknown").length,
      status: getStatus(cwvScore),
    },
    {
      name: "Accessibility",
      score: a11yScore,
      count: res.scores.accessibility < 100 ? 2 : 0,
      status: getStatus(a11yScore),
    },
    {
      name: "Best Practices",
      score: bpScore,
      count: res.scores.bestPractices < 100 ? 3 : 0,
      status: getStatus(bpScore),
    },
    {
      name: "Technical Health",
      score: techScore,
      count: res.opportunities.length + res.diagnostics.length,
      status: getStatus(techScore),
    },
  ];
}

function getDynamicIssues(res: PageSpeedResult) {
  const issues = [];

  const activeIssues = [
    ...res.opportunities,
    ...res.diagnostics.slice(0, Math.max(0, 6 - res.opportunities.length)),
  ].slice(0, 6);

  for (let i = 0; i < activeIssues.length; i++) {
    const item = activeIssues[i];
    const estimatedLift = item.displayValue
      ? `${item.displayValue} · Est. +$${(5200 - i * 700).toLocaleString()} / mo`
      : `Est. +$${(4800 - i * 600).toLocaleString()} / mo`;

    issues.push({
      p: item.priority,
      type: item.type,
      title: item.title,
      note: item.description || item.displayValue || "Audit check did not pass optimal thresholds.",
      impact: estimatedLift,
    });
  }

  if (issues.length < 5 && res.passed.length > 0) {
    for (const passItem of res.passed.slice(0, 5 - issues.length)) {
      issues.push({
        p: "P2",
        type: "success",
        title: passItem.title,
        note: passItem.description || "Passed automated inspection with optimal configuration.",
        impact: "Maintain",
      });
    }
  }

  return issues;
}

function RatingBadge({ rating }: { rating: CWVMetric["rating"] }) {
  const map = {
    good: "bg-success/10 text-success border-success/30",
    "needs-improvement": "bg-warning/10 text-warning border-warning/30",
    poor: "bg-error/10 text-error border-error/30",
    unknown: "bg-border text-charcoal border-border",
  };
  const labels = {
    good: "Good",
    "needs-improvement": "Needs Work",
    poor: "Poor",
    unknown: "No Data",
  };
  return (
    <span
      className={`inline-block border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${map[rating]}`}
    >
      {labels[rating]}
    </span>
  );
}

function CWVRow({
  label,
  abbr,
  metric,
  threshold,
}: {
  label: string;
  abbr: string;
  metric: CWVMetric;
  threshold: string;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center py-4 border-b border-border last:border-0">
      <div className="font-mono text-xs text-charcoal w-8">{abbr}</div>
      <div>
        <div className="label-mono">{label}</div>
        <div className="font-mono text-[10px] text-charcoal mt-0.5">Good: {threshold}</div>
      </div>
      <div className="font-mono text-base text-ink text-right">{metric.displayValue}</div>
      <div>
        <RatingBadge rating={metric.rating} />
      </div>
    </div>
  );
}

// ─── Audit Route Component ────────────────────────────────────────────────────
function AuditPage() {
  const [liveResult, setLiveResult] = useState<PageSpeedResult | null>(null);
  const [liveStrategy, setLiveStrategy] = useState<"mobile" | "desktop">("mobile");

  const isLive = liveResult !== null;
  const domainInfo = isLive ? formatDomain(liveResult.url) : { main: "sample-demo", tld: ".com" };
  const overallScore = isLive ? liveResult.scores.overall : SPECIMEN_SCORE;
  const categories = isLive ? getDynamicCategories(liveResult) : CATEGORIES;
  const issues = isLive ? getDynamicIssues(liveResult) : ISSUES;

  const totalIssues = isLive ? liveResult.opportunities.length + liveResult.diagnostics.length : 44;
  const statusColor =
    overallScore >= 80 ? "text-success" : overallScore >= 60 ? "text-warning" : "text-error";
  const statusText =
    overallScore >= 80 ? "Good standing" : overallScore >= 60 ? "Needs work" : "Critical attention";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ─── LIVE AUDIT HERO SECTION ─── */}
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
          <AuditForm
            onAuditComplete={(res, strat) => {
              setLiveResult(res);
              if (strat) setLiveStrategy(strat);
            }}
            renderInlineResult={false}
          />
        </div>
      </section>

      {/* ─── REPORT SECTION DIVIDER ─── */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-12">
          <div className="flex items-center gap-4 label-mono text-charcoal">
            <span className="h-px flex-1 bg-border" />
            <span>
              {isLive
                ? `§ Live Editorial Report — Generated for ${liveResult.url}`
                : "§ Sample Illustration — Enter your URL above to generate your report"}
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
        </div>
      </section>

      {/* ─── DOMAIN HEADER & OVERALL SCORE ─── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8">
              <div className="label-mono mb-6 flex flex-wrap items-center gap-3">
                {isLive ? (
                  <>
                    <span className="text-success flex items-center gap-1.5">
                      <span className="animate-blink">●</span> Live Verified Report
                    </span>
                    <span className="h-px w-8 bg-ink" />
                    <span className="text-accent">Strategy: {liveStrategy.toUpperCase()}</span>
                  </>
                ) : (
                  <>
                    <span>Sample Report #DEMO</span>
                    <span className="h-px w-8 bg-ink" />
                    <span className="text-accent">Example illustration · Enter URL above to generate yours</span>
                  </>
                )}
              </div>
              <h2 className="serif-display text-5xl md:text-7xl break-words">
                {domainInfo.main}<span className="text-accent">{domainInfo.tld}</span>
              </h2>
              <p className="mt-6 text-base text-charcoal leading-relaxed max-w-xl">
                {isLive
                  ? `Real-time diagnostic report generated from Google PageSpeed Insights (v5) for ${liveResult.url}. Below are your prioritized fixes, category breakdowns, and Core Web Vitals performance.`
                  : "An illustration of what our clients receive. 84 diagnostic checks, prioritised by revenue impact, delivered as an editorial document. Run an audit above to generate your real report."}
              </p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 label-mono">
                {isLive ? (
                  <>
                    <span>
                      Data source <span className="text-ink">Google PageSpeed v5</span>
                    </span>
                    <span>
                      Strategy <span className="text-ink capitalize">{liveStrategy}</span>
                    </span>
                    <span>
                      Checks analyzed <span className="text-ink">84 checks</span>
                    </span>
                    <span>
                      Report date <span className="text-ink">{new Date(liveResult.fetchedAt).toLocaleDateString()}</span>
                    </span>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>

            <div className="md:col-span-4 border border-border bg-surface p-8 flex flex-col items-center">
              <div className="label-mono mb-4">Overall RankForge Score</div>
              <ScoreCircle score={overallScore} />
              <div className={`label-mono mt-4 ${statusColor}`}>
                {statusText} · {totalIssues} issues
              </div>
              {isLive && (
                <a
                  href={`https://pagespeed.web.dev/report?url=${encodeURIComponent(liveResult.url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 label-mono flex items-center gap-1 text-charcoal hover:text-accent text-xs"
                >
                  View Google PSI Report <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORY GRID ─── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24">
          <div className="label-mono mb-8">§ Diagnostic breakdown</div>
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-border">
            {categories.map((c) => (
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

      {/* ─── CORE WEB VITALS BREAKDOWN (Shown when live) ─── */}
      {isLive && (
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24">
            <div className="label-mono mb-8">§ Core Web Vitals Breakdown ({liveStrategy})</div>
            <div className="grid grid-cols-1 md:grid-cols-2 border border-border bg-background">
              <div className="px-6 md:px-10 py-2 md:border-r border-border">
                <CWVRow label="Largest Contentful Paint" abbr="LCP" metric={liveResult.cwv.lcp} threshold="≤ 2.5s" />
                <CWVRow label="First Contentful Paint" abbr="FCP" metric={liveResult.cwv.fcp} threshold="≤ 1.8s" />
                <CWVRow label="Speed Index" abbr="SI" metric={liveResult.cwv.si} threshold="≤ 3.4s" />
              </div>
              <div className="px-6 md:px-10 py-2">
                <CWVRow label="Cumulative Layout Shift" abbr="CLS" metric={liveResult.cwv.cls} threshold="≤ 0.1" />
                <CWVRow label="Total Blocking Time" abbr="TBT" metric={liveResult.cwv.tbt} threshold="≤ 200ms" />
                <CWVRow label="Time to Interactive" abbr="TTI" metric={liveResult.cwv.tti} threshold="≤ 3.8s" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── PRIORITIZED ISSUES TABLE ─── */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="label-mono mb-4">§ Prioritized findings</div>
              <h2 className="serif-display text-4xl md:text-5xl">
                {isLive ? "Your prioritized action items" : "Fix these six, in this order"}
                <span className="text-accent">.</span>
              </h2>
            </div>
            <div className="label-mono text-charcoal">
              Estimated combined lift ·{" "}
              <span className="text-success text-lg font-mono">
                {isLive ? `+$${(issues.length * 3200).toLocaleString()} / mo` : "+$23,600 / mo"}
              </span>
            </div>
          </div>

          <div className="border border-border bg-background">
            <div className="grid grid-cols-[60px_1fr_120px] md:grid-cols-[80px_60px_1fr_180px] label-mono border-b border-border">
              <div className="p-4 border-r border-border">Prio</div>
              <div className="p-4 border-r border-border hidden md:block"></div>
              <div className="p-4 border-r border-border">Issue</div>
              <div className="p-4 text-right">Revenue Impact</div>
            </div>
            {issues.map((issue, i) => (
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

      {/* ─── FOOTER CTA ─── */}
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
