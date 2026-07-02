import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitLead } from "@/lib/leads.functions";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

export function AuditForm({ variant = "hero" }: { variant?: "hero" | "compact" }) {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const submit = useServerFn(submitLead);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }
    setLoading(true);
    try {
      await submit({ data: { email: email.trim(), website: url.trim() || null, source: `audit-${variant}` } });
      setDone(true);
      toast.success("Audit requested. Report en route within 24 hours.");
      setUrl(""); setEmail("");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="border border-ink bg-background p-6 md:p-8" data-testid="audit-form-success">
        <div className="label-mono text-success mb-2">✓ Received — 001</div>
        <p className="font-serif text-2xl text-ink">Your audit is queued.</p>
        <p className="mt-2 text-sm text-charcoal">Check your inbox — we deliver full reports within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-ink bg-background/70 backdrop-blur-xl backdrop-saturate-150" data-testid="audit-form">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] divide-y md:divide-y-0 md:divide-x divide-border">
        <label className="p-4 md:p-6 block">
          <span className="label-mono block mb-2">01 / Your website</span>
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
        <label className="p-4 md:p-6 block">
          <span className="label-mono block mb-2">02 / Where to send it</span>
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
        <button
          type="submit"
          disabled={loading}
          className="bg-ink text-background px-6 md:px-10 py-4 md:py-6 label-mono flex items-center justify-center gap-3 hover:bg-accent disabled:opacity-70"
          data-testid="audit-submit-button"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <>Run audit <ArrowRight size={16} strokeWidth={1.5} /></>}
        </button>
      </div>
      <div className="border-t border-border px-6 py-3 flex items-center justify-between text-xs">
        <span className="label-mono text-charcoal">Free · No credit card · 24h delivery</span>
        <span className="font-mono text-charcoal hidden sm:inline">→ 84 pt inspection</span>
      </div>
    </form>
  );
}
