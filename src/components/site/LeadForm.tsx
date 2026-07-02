import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitLead } from "@/lib/leads.functions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const SERVICES = ["SEO Audit", "Technical SEO", "Content Forging", "Link Building", "Local SEO", "Ongoing Retainer"];

export function LeadForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "", website: "", service: SERVICES[0], message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const submit = useServerFn(submitLead);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email.includes("@")) { toast.error("Enter a valid email."); return; }
    setLoading(true);
    try {
      await submit({ data: { ...form, source: "contact-page" } });
      setDone(true);
      toast.success("Message received. We'll be in touch within one business day.");
    } catch {
      toast.error("Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const field = (k: keyof typeof form, label: string, type = "text", required = false) => (
    <label className="block border-b border-border py-4">
      <span className="label-mono block mb-2">{label}{required && " *"}</span>
      <input
        type={type}
        required={required}
        value={form[k]}
        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
        className="w-full bg-transparent font-mono text-sm text-ink focus:outline-none"
        data-testid={`lead-field-${k}`}
      />
    </label>
  );

  if (done) {
    return (
      <div className="border border-ink p-10 bg-background">
        <div className="label-mono text-success mb-4">✓ Transmission complete</div>
        <h3 className="serif-display text-4xl mb-3">Message received.</h3>
        <p className="text-sm text-charcoal leading-relaxed max-w-md">
          A strategist will personally review your submission and respond within one business day
          with a proposed audit scope and calendar.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-border bg-background p-8 md:p-12" data-testid="lead-form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        {field("name", "Full name", "text", true)}
        {field("email", "Email address", "email", true)}
        {field("company", "Company")}
        {field("website", "Website URL")}
      </div>

      <label className="block border-b border-border py-4">
        <span className="label-mono block mb-2">Service of interest</span>
        <select
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
          className="w-full bg-transparent font-mono text-sm text-ink focus:outline-none"
          data-testid="lead-field-service"
        >
          {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>

      <label className="block border-b border-border py-4">
        <span className="label-mono block mb-2">Tell us about your goals</span>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full bg-transparent font-sans text-sm text-ink focus:outline-none resize-none"
          placeholder="Traffic goals, current stack, timelines…"
          data-testid="lead-field-message"
        />
      </label>

      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="label-mono text-charcoal">Response within 1 business day</p>
        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-background px-8 py-4 label-mono hover:bg-accent-hover disabled:opacity-70 flex items-center gap-3"
          data-testid="lead-submit-button"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Send transmission →"}
        </button>
      </div>
    </form>
  );
}
