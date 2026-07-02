import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { LeadForm } from "@/components/site/LeadForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — RankForge AI" },
      { name: "description", content: "Book an SEO audit or strategy call with RankForge AI. Response within one business day." },
      { property: "og:title", content: "Contact — RankForge AI" },
      { property: "og:description", content: "Book an SEO audit or strategy call." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

const CONTACT = [
  { icon: Mail, label: "Email", val: "hello@rankforge.ai" },
  { icon: Phone, label: "Direct line", val: "+1 (415) 555—0142" },
  { icon: MapPin, label: "Studio", val: "Remote · SF · LDN · SGP" },
  { icon: Clock, label: "Response", val: "< 1 business day" },
];

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-6">
              <div className="label-mono mb-6">§ Book an audit</div>
              <h1 className="serif-display text-6xl md:text-8xl">
                Let's<br/>
                <em className="italic font-normal text-accent">talk<br/>rankings.</em>
              </h1>
              <p className="mt-8 max-w-md text-base text-charcoal leading-relaxed">
                Tell us about your site, your goals, and your ceiling. A strategist
                reads every submission personally.
              </p>

              <div className="mt-12 md:mt-16 grid grid-cols-2 gap-6">
                {CONTACT.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.label} className="border-t border-ink pt-4">
                      <Icon size={18} strokeWidth={1.5} className="text-accent mb-3" />
                      <div className="label-mono mb-1">{c.label}</div>
                      <div className="font-mono text-sm text-ink">{c.val}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="md:col-span-6">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
