import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// ─── Input ────────────────────────────────────────────────────────────────────
const PageSpeedInputSchema = z.object({
  url: z.string().url("Please enter a valid URL including https://"),
  strategy: z.enum(["mobile", "desktop"]).default("mobile"),
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type CWVRating = "good" | "needs-improvement" | "poor" | "unknown";

export type CWVMetric = {
  displayValue: string;
  score: number | null;
  rating: CWVRating;
  numericValue?: number;
};

export type AuditOpportunity = {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  priority: "P0" | "P1" | "P2";
  type: "error" | "warning" | "success";
};

export type PageSpeedResult = {
  url: string;
  strategy: "mobile" | "desktop";
  fetchedAt: string;
  scores: {
    overall: number;
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  cwv: {
    lcp: CWVMetric;
    fcp: CWVMetric;
    cls: CWVMetric;
    tbt: CWVMetric;
    si: CWVMetric;
    tti: CWVMetric;
  };
  opportunities: AuditOpportunity[];
  diagnostics: AuditOpportunity[];
  passed: AuditOpportunity[];
  hasApiKey: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function scoreToRating(score: number | null): CWVRating {
  if (score === null) return "unknown";
  if (score >= 0.9) return "good";
  if (score >= 0.5) return "needs-improvement";
  return "poor";
}

function scoreToType(score: number | null): "error" | "warning" | "success" {
  if (score === null || score < 0.5) return "error";
  if (score < 0.9) return "warning";
  return "success";
}

function scoreToPriority(score: number | null, index: number): "P0" | "P1" | "P2" {
  if (score === null || score < 0.5) return index < 2 ? "P0" : "P1";
  if (score < 0.9) return "P1";
  return "P2";
}

// Strip markdown links from descriptions
function stripMarkdown(text: string): string {
  return (text ?? "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/`([^`]+)`/g, "$1");
}

// ─── Server Function ──────────────────────────────────────────────────────────
export const runPageSpeedAudit = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PageSpeedInputSchema.parse(input))
  .handler(async ({ data }): Promise<PageSpeedResult> => {
    const apiKey = process.env.PAGESPEED_API_KEY?.trim() || "";
    const hasApiKey = apiKey.length > 0;

    const params = new URLSearchParams({ url: data.url, strategy: data.strategy });
    ["performance", "accessibility", "best-practices", "seo"].forEach((cat) =>
      params.append("category", cat),
    );
    if (hasApiKey) params.set("key", apiKey);

    const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`;

    let res: Response;
    try {
      res = await fetch(endpoint, { signal: AbortSignal.timeout(45_000) });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg.includes("timeout") || msg.includes("abort")) {
        throw new Error("The PageSpeed analysis timed out. The site may be slow to respond.");
      }
      throw new Error(`Could not reach PageSpeed API: ${msg}`);
    }

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      let detail = "";
      try {
        const parsed = JSON.parse(body) as { error?: { message?: string } };
        detail = parsed?.error?.message ?? body;
      } catch {
        detail = body;
      }
      if (res.status === 400) {
        throw new Error(
          `Invalid URL or the site could not be reached. Make sure the URL is publicly accessible.`,
        );
      }
      if (res.status === 429) {
        throw new Error(
          "Rate limit exceeded. Please add a PageSpeed API key in your .env file for higher limits.",
        );
      }
      throw new Error(`PageSpeed API error (${res.status}): ${detail}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json = (await res.json()) as any;
    const lr = json.lighthouseResult;
    const cats = lr.categories as Record<string, { score: number | null }>;

    const perfScore = Math.round((cats["performance"]?.score ?? 0) * 100);
    const a11yScore = Math.round((cats["accessibility"]?.score ?? 0) * 100);
    const bpScore = Math.round((cats["best-practices"]?.score ?? 0) * 100);
    const seoScore = Math.round((cats["seo"]?.score ?? 0) * 100);
    const overall = Math.round((perfScore + a11yScore + bpScore + seoScore) / 4);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const audits = lr.audits as Record<string, any>;

    const getMetric = (auditId: string): CWVMetric => {
      const audit = audits[auditId];
      if (!audit) return { displayValue: "N/A", score: null, rating: "unknown" };
      return {
        displayValue: audit.displayValue ?? "N/A",
        score: typeof audit.score === "number" ? audit.score : null,
        rating: scoreToRating(typeof audit.score === "number" ? audit.score : null),
        numericValue: typeof audit.numericValue === "number" ? audit.numericValue : undefined,
      };
    };

    const opportunities: AuditOpportunity[] = [];
    const diagnostics: AuditOpportunity[] = [];
    const passed: AuditOpportunity[] = [];

    let oppIndex = 0;
    for (const [id, audit] of Object.entries(audits)) {
      // Skip audits without titles or purely informative ones
      if (!audit.title) continue;
      if (audit.scoreDisplayMode === "notApplicable" || audit.scoreDisplayMode === "manual") continue;

      const score: number | null = typeof audit.score === "number" ? audit.score : null;

      const item: AuditOpportunity = {
        id,
        title: audit.title as string,
        description: stripMarkdown(audit.description as string),
        score,
        displayValue: audit.displayValue as string | undefined,
        priority: scoreToPriority(score, oppIndex),
        type: scoreToType(score),
      };

      if (score === 1) {
        passed.push(item);
      } else if (audit.details?.type === "opportunity" && score !== null && score < 1) {
        opportunities.push(item);
        oppIndex++;
      } else if (score !== null && score < 0.9 && audit.scoreDisplayMode !== "informative") {
        diagnostics.push(item);
      }
    }

    // Sort failures first
    opportunities.sort((a, b) => (a.score ?? 1) - (b.score ?? 1));
    diagnostics.sort((a, b) => (a.score ?? 1) - (b.score ?? 1));

    return {
      url: data.url,
      strategy: data.strategy,
      fetchedAt: new Date().toISOString(),
      scores: {
        overall,
        performance: perfScore,
        accessibility: a11yScore,
        bestPractices: bpScore,
        seo: seoScore,
      },
      cwv: {
        lcp: getMetric("largest-contentful-paint"),
        fcp: getMetric("first-contentful-paint"),
        cls: getMetric("cumulative-layout-shift"),
        tbt: getMetric("total-blocking-time"),
        si: getMetric("speed-index"),
        tti: getMetric("interactive"),
      },
      opportunities: opportunities.slice(0, 8),
      diagnostics: diagnostics.slice(0, 8),
      passed: passed.slice(0, 6),
      hasApiKey,
    };
  });
