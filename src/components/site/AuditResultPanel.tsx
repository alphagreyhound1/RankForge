import { Check, X, AlertTriangle, ExternalLink, Smartphone, Monitor } from "lucide-react";
import type { PageSpeedResult, CWVMetric, AuditOpportunity } from "@/lib/pagespeed.functions";

// ─── Score Circle ─────────────────────────────────────────────────────────────
function ScoreCircle({ score, size = 160 }: { score: number; size?: number }) {
  const r = size * 0.4;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color =
    score >= 90 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--error)";
  const cx = size / 2;
  const fontSize = size * 0.28;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
      <circle cx={cx} cy={cx} r={r} stroke="var(--border)" strokeWidth={size * 0.03} fill="none" />
      <circle
        cx={cx}
        cy={cx}
        r={r}
        stroke={color}
        strokeWidth={size * 0.03}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="butt"
        style={{ transition: "stroke-dashoffset 1.4s ease-out" }}
      />
      <text
        x={cx}
        y={cx + fontSize * 0.38}
        textAnchor="middle"
        transform={`rotate(90 ${cx} ${cx})`}
        className="font-mono"
        style={{ fontSize, fontWeight: 600, fill: "var(--ink)" }}
      >
        {score}
      </text>
    </svg>
  );
}

// ─── Rating Badge ─────────────────────────────────────────────────────────────
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

// ─── Status Icon ─────────────────────────────────────────────────────────────
function StatusIcon({ type }: { type: AuditOpportunity["type"] }) {
  if (type === "error") return <X size={16} strokeWidth={2} className="text-error shrink-0" />;
  if (type === "warning")
    return <AlertTriangle size={16} strokeWidth={2} className="text-warning shrink-0" />;
  return <Check size={16} strokeWidth={2} className="text-success shrink-0" />;
}

// ─── Mini Score Bar ───────────────────────────────────────────────────────────
function ScoreBar({ label, score }: { label: string; score: number }) {
  const color =
    score >= 90 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--error)";
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="label-mono">{label}</span>
        <span className="font-mono text-lg text-ink">{score}</span>
      </div>
      <div className="h-0.5 bg-border relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: `${score}%`,
            background: color,
            transition: "width 1.2s ease-out",
          }}
        />
      </div>
    </div>
  );
}

// ─── CWV Metric Row ───────────────────────────────────────────────────────────
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

// ─── Main Panel ───────────────────────────────────────────────────────────────
export function AuditResultPanel({
  result,
  strategy,
}: {
  result: PageSpeedResult;
  strategy: "mobile" | "desktop";
}) {
  const allIssues = [
    ...result.opportunities.map((o) => ({ ...o, section: "opportunity" as const })),
    ...result.diagnostics.slice(0, Math.max(0, 8 - result.opportunities.length)).map((d) => ({
      ...d,
      section: "diagnostic" as const,
    })),
  ].slice(0, 8);

  const passedCount = result.passed.length;
  const issueCount = allIssues.length;

  return (
    <div className="border border-ink bg-background animate-fade-up" data-testid="audit-result-panel">
      {/* Header */}
      <div className="border-b border-border px-6 md:px-10 py-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="label-mono text-success mb-1">✓ Audit Complete</div>
          <div className="font-mono text-sm text-charcoal truncate max-w-sm">{result.url}</div>
        </div>
        <div className="flex items-center gap-3">
          {strategy === "mobile" ? (
            <Smartphone size={14} className="text-charcoal" />
          ) : (
            <Monitor size={14} className="text-charcoal" />
          )}
          <span className="label-mono capitalize">{strategy} · Live data</span>
          <a
            href={`https://pagespeed.web.dev/report?url=${encodeURIComponent(result.url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="label-mono flex items-center gap-1 text-charcoal hover:text-accent"
          >
            Full report <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Overall Score */}
        <div className="p-8 md:p-10 flex flex-col items-center justify-center gap-2 min-w-[180px]">
          <div className="label-mono mb-2">Overall Score</div>
          <ScoreCircle score={result.scores.overall} size={140} />
          <div className="label-mono text-charcoal mt-2">
            {result.scores.overall >= 90
              ? "Excellent"
              : result.scores.overall >= 50
                ? "Needs work"
                : "Poor — act now"}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-8 md:p-10 grid grid-cols-1 sm:grid-cols-2 gap-6 content-center">
          <ScoreBar label="Performance" score={result.scores.performance} />
          <ScoreBar label="SEO" score={result.scores.seo} />
          <ScoreBar label="Accessibility" score={result.scores.accessibility} />
          <ScoreBar label="Best Practices" score={result.scores.bestPractices} />
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="border-t border-border">
        <div className="px-6 md:px-10 py-5 border-b border-border">
          <div className="label-mono">§ Core Web Vitals</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="px-6 md:px-10 py-2 md:border-r border-border">
            <CWVRow label="Largest Contentful Paint" abbr="LCP" metric={result.cwv.lcp} threshold="≤ 2.5s" />
            <CWVRow label="First Contentful Paint" abbr="FCP" metric={result.cwv.fcp} threshold="≤ 1.8s" />
            <CWVRow label="Speed Index" abbr="SI" metric={result.cwv.si} threshold="≤ 3.4s" />
          </div>
          <div className="px-6 md:px-10 py-2">
            <CWVRow label="Cumulative Layout Shift" abbr="CLS" metric={result.cwv.cls} threshold="≤ 0.1" />
            <CWVRow label="Total Blocking Time" abbr="TBT" metric={result.cwv.tbt} threshold="≤ 200ms" />
            <CWVRow label="Time to Interactive" abbr="TTI" metric={result.cwv.tti} threshold="≤ 3.8s" />
          </div>
        </div>
      </div>

      {/* Issues */}
      {allIssues.length > 0 && (
        <div className="border-t border-border">
          <div className="px-6 md:px-10 py-5 border-b border-border flex items-center justify-between">
            <div className="label-mono">§ Prioritized findings</div>
            <div className="label-mono text-charcoal">
              {issueCount} issues · {passedCount} passed
            </div>
          </div>
          <div>
            {allIssues.map((issue) => (
              <div
                key={issue.id}
                className="grid grid-cols-[50px_40px_1fr_80px] md:grid-cols-[60px_40px_1fr_100px] border-b border-border last:border-0 hover:bg-surface group"
              >
                <div className="p-4 md:p-5 border-r border-border font-mono text-xs text-ink self-center">
                  {issue.priority}
                </div>
                <div className="p-4 md:p-5 border-r border-border flex items-center">
                  <StatusIcon type={issue.type} />
                </div>
                <div className="p-4 md:p-5 border-r border-border">
                  <div className="font-serif text-lg md:text-xl text-ink group-hover:text-accent leading-snug">
                    {issue.title}
                  </div>
                  {issue.description && (
                    <p className="text-xs text-charcoal mt-1 leading-relaxed line-clamp-2">
                      {issue.description}
                    </p>
                  )}
                </div>
                <div className="p-4 md:p-5 self-center text-right">
                  {issue.displayValue ? (
                    <div className="font-mono text-xs text-charcoal">{issue.displayValue}</div>
                  ) : (
                    <div
                      className={`font-mono text-xs ${issue.score === null || issue.score < 0.5 ? "text-error" : "text-warning"}`}
                    >
                      {issue.score !== null ? `${Math.round(issue.score * 100)}%` : "Fail"}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <div className="border-t border-border px-6 md:px-10 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface">
        <div className="label-mono text-charcoal">
          Want the full 84-point editorial report with revenue impact modelling?
        </div>
        <a
          href="/contact"
          className="bg-ink text-background px-6 py-3 label-mono hover:bg-accent inline-flex items-center gap-2"
        >
          Book a strategy call →
        </a>
      </div>
    </div>
  );
}
