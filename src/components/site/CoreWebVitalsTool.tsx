import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { runPageSpeedAudit } from "@/lib/pagespeed.functions";
import type { PageSpeedResult, CWVMetric } from "@/lib/pagespeed.functions";
import { Loader2, Smartphone, Monitor, ArrowRight, ExternalLink } from "lucide-react";
import { toast } from "sonner";

// ─── Gauge ────────────────────────────────────────────────────────────────────
function MetricGauge({
  label,
  abbr,
  metric,
  good,
  needsImprovement,
  unit = "",
}: {
  label: string;
  abbr: string;
  metric: CWVMetric;
  good: string;
  needsImprovement: string;
  unit?: string;
}) {
  const colorMap = {
    good: { ring: "var(--success)", bg: "bg-success/10", text: "text-success", label: "Good" },
    "needs-improvement": {
      ring: "var(--warning)",
      bg: "bg-warning/10",
      text: "text-warning",
      label: "Needs Work",
    },
    poor: { ring: "var(--error)", bg: "bg-error/10", text: "text-error", label: "Poor" },
    unknown: { ring: "var(--border)", bg: "bg-surface", text: "text-charcoal", label: "No Data" },
  };

  const config = colorMap[metric.rating];
  const pct = metric.score !== null ? metric.score * 100 : 0;
  const c = 2 * Math.PI * 38;
  const offset = c - (pct / 100) * c;

  return (
    <div
      className={`border border-border p-6 flex flex-col items-center gap-3 hover:border-ink transition-colors ${metric.rating !== "unknown" ? config.bg : ""}`}
      data-testid={`cwv-metric-${abbr.toLowerCase()}`}
    >
      {/* Circular gauge */}
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        className="rotate-[-90deg]"
        aria-label={`${label}: ${metric.displayValue}`}
      >
        <circle cx="48" cy="48" r="38" stroke="var(--border)" strokeWidth="5" fill="none" />
        {metric.score !== null && (
          <circle
            cx="48"
            cy="48"
            r="38"
            stroke={config.ring}
            strokeWidth="5"
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
          />
        )}
        <text
          x="48"
          y="52"
          textAnchor="middle"
          transform="rotate(90 48 48)"
          className="font-mono"
          style={{ fontSize: 11, fontWeight: 600, fill: "var(--ink)" }}
        >
          {abbr}
        </text>
      </svg>

      {/* Value */}
      <div className="text-center">
        <div className={`font-mono text-2xl font-semibold text-ink`}>{metric.displayValue}</div>
        <div className="label-mono text-charcoal mt-0.5">{label}</div>
      </div>

      {/* Badge */}
      <div
        className={`px-3 py-1 font-mono text-[10px] uppercase tracking-widest border ${
          metric.rating === "good"
            ? "border-success/40 text-success"
            : metric.rating === "needs-improvement"
              ? "border-warning/40 text-warning"
              : metric.rating === "poor"
                ? "border-error/40 text-error"
                : "border-border text-charcoal"
        }`}
      >
        {config.label}
      </div>

      {/* Thresholds */}
      <div className="text-center label-mono text-charcoal text-[10px] leading-relaxed">
        <div>Good: {good}</div>
        <div>Needs work: {needsImprovement}</div>
      </div>
    </div>
  );
}

// ─── Score Pill ───────────────────────────────────────────────────────────────
function ScorePill({ label, score }: { label: string; score: number }) {
  const color =
    score >= 90 ? "text-success" : score >= 50 ? "text-warning" : "text-error";
  return (
    <div className="border border-border px-4 py-3 flex items-center justify-between gap-4">
      <span className="label-mono">{label}</span>
      <span className={`font-mono text-xl ${color}`}>{score}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function CoreWebVitalsTool() {
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PageSpeedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAudit = useServerFn(runPageSpeedAudit);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http")) normalizedUrl = `https://${normalizedUrl}`;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await runAudit({ data: { url: normalizedUrl, strategy } });
      setResult(res);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Analysis failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const cwvMetrics = result
    ? [
        { label: "Largest Contentful Paint", abbr: "LCP", metric: result.cwv.lcp, good: "≤ 2.5s", needsImprovement: "≤ 4.0s" },
        { label: "First Contentful Paint", abbr: "FCP", metric: result.cwv.fcp, good: "≤ 1.8s", needsImprovement: "≤ 3.0s" },
        { label: "Cumulative Layout Shift", abbr: "CLS", metric: result.cwv.cls, good: "≤ 0.1", needsImprovement: "≤ 0.25" },
        { label: "Total Blocking Time", abbr: "TBT", metric: result.cwv.tbt, good: "≤ 200ms", needsImprovement: "≤ 600ms" },
        { label: "Speed Index", abbr: "SI", metric: result.cwv.si, good: "≤ 3.4s", needsImprovement: "≤ 5.8s" },
        { label: "Time to Interactive", abbr: "TTI", metric: result.cwv.tti, good: "≤ 3.8s", needsImprovement: "≤ 7.3s" },
      ]
    : [];

  return (
    <div className="border border-border bg-background" data-testid="cwv-tool">
      {/* Form */}
      <div className="border-b border-border">
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] divide-y md:divide-y-0 md:divide-x divide-border"
        >
          <label className="p-5 block">
            <span className="label-mono block mb-2">Enter your URL</span>
            <input
              type="text"
              required
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className="w-full bg-transparent font-mono text-sm text-ink placeholder:text-charcoal/60 focus:outline-none disabled:opacity-50"
              data-testid="cwv-url-input"
            />
          </label>
          {/* Strategy toggle */}
          <div className="p-5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStrategy("mobile")}
              disabled={loading}
              title="Mobile"
              className={`p-2 border transition-colors disabled:opacity-50 ${
                strategy === "mobile"
                  ? "border-ink bg-ink text-background"
                  : "border-border text-charcoal hover:border-ink"
              }`}
            >
              <Smartphone size={14} />
            </button>
            <button
              type="button"
              onClick={() => setStrategy("desktop")}
              disabled={loading}
              title="Desktop"
              className={`p-2 border transition-colors disabled:opacity-50 ${
                strategy === "desktop"
                  ? "border-ink bg-ink text-background"
                  : "border-border text-charcoal hover:border-ink"
              }`}
            >
              <Monitor size={14} />
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-ink text-background px-8 py-5 label-mono flex items-center justify-center gap-3 hover:bg-accent disabled:opacity-70"
            data-testid="cwv-submit"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Analysing…
              </>
            ) : (
              <>
                Check <ArrowRight size={16} strokeWidth={1.5} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="border-b border-border px-6 py-5 bg-error/5">
          <div className="label-mono text-error mb-1">Analysis failed</div>
          <p className="text-sm text-charcoal">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="px-6 py-16 flex flex-col items-center gap-4 text-center">
          <Loader2 size={32} className="animate-spin text-accent" />
          <div className="label-mono">Measuring Core Web Vitals…</div>
          <p className="text-sm text-charcoal">This takes 5–15 seconds</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <>
          {/* Summary scores */}
          <div className="border-b border-border px-6 md:px-10 py-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="label-mono text-success mb-1">✓ Vitals measured</div>
              <div className="font-mono text-sm text-charcoal">{result.url}</div>
            </div>
            <div className="flex items-center gap-3">
              {strategy === "mobile" ? (
                <Smartphone size={14} className="text-charcoal" />
              ) : (
                <Monitor size={14} className="text-charcoal" />
              )}
              <a
                href={`https://pagespeed.web.dev/report?url=${encodeURIComponent(result.url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="label-mono flex items-center gap-1 text-charcoal hover:text-accent"
              >
                Full PageSpeed report <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* Lighthouse scores */}
          <div className="border-b border-border p-6 md:px-10">
            <div className="label-mono mb-4">Lighthouse Scores</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ScorePill label="Performance" score={result.scores.performance} />
              <ScorePill label="SEO" score={result.scores.seo} />
              <ScorePill label="Accessibility" score={result.scores.accessibility} />
              <ScorePill label="Best Practices" score={result.scores.bestPractices} />
            </div>
          </div>

          {/* CWV gauges */}
          <div className="p-6 md:p-10">
            <div className="label-mono mb-6">Core Web Vitals</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {cwvMetrics.map((m) => (
                <MetricGauge key={m.abbr} {...m} />
              ))}
            </div>
          </div>

          {/* Top issues if any */}
          {result.opportunities.length > 0 && (
            <div className="border-t border-border p-6 md:p-10">
              <div className="label-mono mb-4">Top performance opportunities</div>
              <div className="space-y-3">
                {result.opportunities.slice(0, 4).map((opp) => (
                  <div
                    key={opp.id}
                    className="grid grid-cols-[auto_1fr_auto] gap-4 items-start border border-border p-4"
                  >
                    <span className="font-mono text-xs text-charcoal">{opp.priority}</span>
                    <div>
                      <div className="label-mono text-ink">{opp.title}</div>
                      {opp.description && (
                        <p className="text-xs text-charcoal mt-1 line-clamp-2">
                          {opp.description}
                        </p>
                      )}
                    </div>
                    {opp.displayValue && (
                      <span className="font-mono text-xs text-charcoal text-right">
                        {opp.displayValue}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
