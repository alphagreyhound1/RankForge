import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitLead } from "@/lib/leads.functions";
import { runPageSpeedAudit } from "@/lib/pagespeed.functions";
import type { PageSpeedResult } from "@/lib/pagespeed.functions";
import { AuditResultPanel } from "@/components/site/AuditResultPanel";
import { toast } from "sonner";
import { ArrowRight, Loader2, Smartphone, Monitor } from "lucide-react";

const LOADING_MESSAGES = [
  "Crawling your URL…",
  "Running 84 diagnostic checks…",
  "Measuring Core Web Vitals…",
  "Scoring performance & SEO…",
  "Modelling revenue impact…",
  "Preparing your report…",
];

export function AuditForm({
  variant = "hero",
  onAuditComplete,
  renderInlineResult = true,
}: {
  variant?: "hero" | "compact";
  onAuditComplete?: (result: PageSpeedResult | null, strategy: "mobile" | "desktop") => void;
  renderInlineResult?: boolean;
}) {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [result, setResult] = useState<PageSpeedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitLeadFn = useServerFn(submitLead);
  const runAudit = useServerFn(runPageSpeedAudit);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }

    // Normalise URL
    let normalizedUrl = url.trim();
    if (normalizedUrl && !normalizedUrl.startsWith("http")) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    if (!normalizedUrl) {
      toast.error("Please enter a website URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // Cycle through loading messages
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIndex]);
    }, 3500);

    try {
      // Run both concurrently — save lead & fetch audit
      const [auditResult] = await Promise.all([
        runAudit({ data: { url: normalizedUrl, strategy } }),
        submitLeadFn({
          data: {
            email: email.trim(),
            website: normalizedUrl,
            source: `audit-${variant}`,
          },
        }).catch((err) => {
          // Lead save failure is non-fatal — audit still shows
          console.warn("Lead save failed:", err);
        }),
      ]);

      setResult(auditResult);
      if (onAuditComplete) {
        onAuditComplete(auditResult, strategy);
      }
      toast.success("Audit complete! Scroll down to view your results.");
      setUrl("");
      setEmail("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingMsg(LOADING_MESSAGES[0]);
    }
  };

  // Show results panel below form
  if (result) {
    return (
      <div className="space-y-6">
        {/* Re-run form */}
        <form
          onSubmit={onSubmit}
          className="border border-border bg-background/70 backdrop-blur-xl"
          data-testid="audit-form"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] divide-y md:divide-y-0 md:divide-x divide-border">
            <label className="p-4 md:p-5 block">
              <span className="label-mono block mb-1">Website</span>
              <input
                type="text"
                required
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-transparent font-mono text-sm text-ink placeholder:text-charcoal/60 focus:outline-none"
                data-testid="audit-url-input"
              />
            </label>
            <label className="p-4 md:p-5 block">
              <span className="label-mono block mb-1">Email</span>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent font-mono text-sm text-ink placeholder:text-charcoal/60 focus:outline-none"
                data-testid="audit-email-input"
              />
            </label>
            {/* Strategy toggle */}
            <div className="p-4 md:p-5 flex items-center gap-2 border-t md:border-t-0 border-border">
              <button
                type="button"
                onClick={() => setStrategy("mobile")}
                className={`p-2 border transition-colors ${strategy === "mobile" ? "border-ink bg-ink text-background" : "border-border text-charcoal hover:border-ink"}`}
                title="Mobile"
              >
                <Smartphone size={14} />
              </button>
              <button
                type="button"
                onClick={() => setStrategy("desktop")}
                className={`p-2 border transition-colors ${strategy === "desktop" ? "border-ink bg-ink text-background" : "border-border text-charcoal hover:border-ink"}`}
                title="Desktop"
              >
                <Monitor size={14} />
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-ink text-background px-6 md:px-8 py-4 md:py-5 label-mono flex items-center justify-center gap-3 hover:bg-accent disabled:opacity-70"
              data-testid="audit-submit-button"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  Re-run <ArrowRight size={16} strokeWidth={1.5} />
                </>
              )}
            </button>
          </div>
        </form>
        {renderInlineResult && <AuditResultPanel result={result} strategy={strategy} />}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={onSubmit}
        className="border border-ink bg-background/70 backdrop-blur-xl backdrop-saturate-150"
        data-testid="audit-form"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] divide-y md:divide-y-0 md:divide-x divide-border">
          <label className="p-4 md:p-6 block">
            <span className="label-mono block mb-2">01 / Your website</span>
            <input
              type="text"
              required
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className="w-full bg-transparent font-mono text-sm text-ink placeholder:text-charcoal/60 focus:outline-none disabled:opacity-50"
              data-testid="audit-url-input"
            />
          </label>
          <label className="p-4 md:p-6 block">
            <span className="label-mono block mb-2">02 / Where to send it</span>
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full bg-transparent font-mono text-sm text-ink placeholder:text-charcoal/60 focus:outline-none disabled:opacity-50"
              data-testid="audit-email-input"
            />
          </label>
          {/* Strategy toggle */}
          <div className="p-4 md:p-6 flex items-center gap-2 justify-center border-t md:border-t-0 border-border">
            <button
              type="button"
              onClick={() => setStrategy("mobile")}
              disabled={loading}
              className={`p-2 border transition-colors disabled:opacity-50 ${strategy === "mobile" ? "border-ink bg-ink text-background" : "border-border text-charcoal hover:border-ink"}`}
              title="Audit for mobile"
            >
              <Smartphone size={14} />
            </button>
            <button
              type="button"
              onClick={() => setStrategy("desktop")}
              disabled={loading}
              className={`p-2 border transition-colors disabled:opacity-50 ${strategy === "desktop" ? "border-ink bg-ink text-background" : "border-border text-charcoal hover:border-ink"}`}
              title="Audit for desktop"
            >
              <Monitor size={14} />
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-ink text-background px-6 md:px-10 py-4 md:py-6 label-mono flex items-center justify-center gap-3 hover:bg-accent disabled:opacity-70 min-w-[140px]"
            data-testid="audit-submit-button"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                Run audit <ArrowRight size={16} strokeWidth={1.5} />
              </>
            )}
          </button>
        </div>

        {/* Status bar */}
        <div className="border-t border-border px-6 py-3 flex items-center justify-between text-xs">
          {loading ? (
            <span className="label-mono text-accent flex items-center gap-2">
              <span className="animate-blink">●</span>
              {loadingMsg}
            </span>
          ) : (
            <span className="label-mono text-charcoal">
              Free · No credit card · Results in ~10 seconds
            </span>
          )}
          <span className="font-mono text-charcoal hidden sm:inline">→ 84 pt inspection</span>
        </div>
      </form>

      {/* Error state */}
      {error && (
        <div className="border border-error/40 bg-error/5 px-6 py-4" data-testid="audit-error">
          <div className="label-mono text-error mb-1">Analysis failed</div>
          <p className="text-sm text-charcoal">{error}</p>
        </div>
      )}
    </div>
  );
}
