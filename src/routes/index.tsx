import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AuditForm } from "@/components/site/AuditForm";
import { ArrowUpRight, ArrowRight, Zap, Search, LineChart, FileText, Link2, Gauge, Sparkles, Quote } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "RankForge AI — Editorial SEO audits & organic growth" },
      { name: "description", content: "AI-driven SEO audits, technical fixes, and content forging for ambitious brands. Free 84-point audit in 24 hours." },
      { property: "og:title", content: "RankForge AI — Editorial SEO audits & organic growth" },
      { property: "og:description", content: "Free 84-point AI SEO audit delivered in 24 hours." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const HERO_TEXTURE = "https://images.pexels.com/photos/20818886/pexels-photo-20818886.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const METRICS = [
  { label: "Avg. traffic lift", value: "+312%", note: "in 6 months" },
  { label: "Sites audited", value: "1,847", note: "since 2024" },
  { label: "Core Web Vitals pass", value: "94%", note: "post-forge" },
  { label: "Median time to top-10", value: "72d", note: "target KW" },
];

const SERVICES = [
  { n: "01", title: "Technical Audit", desc: "84-point diagnostic across crawl, index, schema, speed, and mobile.", icon: Search },
  { n: "02", title: "Content Forging", desc: "AI-briefed, human-edited content mapped to intent gaps in your SERP.", icon: FileText },
  { n: "03", title: "Link Architecture", desc: "Internal linking, editorial outreach, and authority repair.", icon: Link2 },
  { n: "04", title: "Core Web Vitals", desc: "LCP, INP, CLS optimisation with a live performance budget.", icon: Gauge },
  { n: "05", title: "Analytics Forensics", desc: "GA4, Search Console, and Looker dashboards you'll actually read.", icon: LineChart },
  { n: "06", title: "AI Visibility", desc: "Rank inside ChatGPT, Perplexity, Google AI Overviews.", icon: Sparkles },
];

const CASES = [
  { client: "Meridian Journal", vertical: "Publishing", lift: "+412%", time: "5 mo", note: "From page 4 to featured snippet on 47 head terms." },
  { client: "Copperline Coffee", vertical: "E-commerce", lift: "+267%", time: "4 mo", note: "Category page overhaul lifted non-brand revenue 3.6×." },
  { client: "Halden & Co.", vertical: "B2B SaaS", lift: "+189%", time: "6 mo", note: "Programmatic content stack ranked 1,200+ long-tail terms." },
];

const PROCESS = [
  { n: "I.", t: "Diagnose", d: "We ingest your site, GSC data, and top competitors. AI models score every technical, content, and authority signal." },
  { n: "II.", t: "Prescribe", d: "You receive an editorial audit — plain language, prioritised, with revenue impact modelled per fix." },
  { n: "III.", t: "Forge", d: "We ship the fixes: technical patches, content briefs, link earning, tracking. Weekly async reports." },
  { n: "IV.", t: "Defend", d: "Rankings are perishable. We monitor drift, algorithm changes, and competitor moves — and respond." },
];

const TESTIMONIALS = [
  { q: "Every SEO agency sells the same audit template. RankForge sent us a 40-page editorial diagnosis. We hired them the same afternoon.", a: "— Lena Osei, VP Growth, Meridian" },
  { q: "They found five schema errors our previous team had been paid to fix. Traffic doubled by month three.", a: "— David Kalman, CEO, Copperline" },
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 opacity-[0.12] mix-blend-multiply pointer-events-none"
          style={{ backgroundImage: `url(${HERO_TEXTURE})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 grid-lines opacity-40 pointer-events-none" />

        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 pt-16 md:pt-28 pb-20 md:pb-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 md:col-start-1 animate-fade-up">
              <div className="flex items-center gap-4 mb-8">
                <span className="label-mono">Vol. VI · Issue 02</span>
                <span className="h-px w-16 bg-ink" />
                <span className="label-mono text-accent">The Ranking Report</span>
              </div>

              <h1 className="serif-display text-[clamp(3rem,9vw,8rem)]">
                We forge<br/>
                <em className="italic font-normal text-accent">organic rankings</em><br/>
                for brands worth<br/>
                reading<span className="text-accent">.</span>
              </h1>

              <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-14 items-end">
                <div className="md:col-start-2 max-w-lg">
                  <p className="text-base leading-relaxed text-charcoal">
                    RankForge is an AI-augmented SEO studio. We audit the technical rot,
                    prescribe the content, and forge the authority — for founders and
                    publishers who refuse to buy their traffic.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 md:mt-20 max-w-4xl">
            <div className="label-mono mb-4 flex items-center gap-3">
              <span className="animate-blink text-accent">●</span>
              Free · 84-point audit · Delivered in 24 hours
            </div>
            <AuditForm />
          </div>
        </div>
      </section>

      {/* METRICS STRIP */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {METRICS.map((m, i) => (
            <div key={i} className="py-10 md:py-14 pl-6 first:pl-0 md:pl-10">
              <div className="font-mono text-3xl md:text-5xl text-ink tracking-tight">{m.value}</div>
              <div className="label-mono mt-3">{m.label}</div>
              <div className="text-xs text-charcoal font-mono mt-1">{m.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES / BENTO */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
            <div className="md:col-span-4">
              <div className="label-mono mb-6">§ 01 — Services</div>
              <h2 className="serif-display text-5xl md:text-6xl">
                Six disciplines.<br/>
                <em className="italic font-normal">One craft.</em>
              </h2>
            </div>
            <div className="md:col-span-5 md:col-start-8 self-end">
              <p className="text-base leading-relaxed text-charcoal">
                We don't sell packages. Each engagement combines the disciplines
                below in the proportion your rankings actually require — diagnosed
                first, priced second.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-border">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.n}
                  className="group border-r border-b border-border p-8 md:p-10 hover:bg-surface cursor-pointer relative"
                  data-testid={`service-card-${s.n}`}
                >
                  <div className="flex items-start justify-between mb-8">
                    <span className="label-mono">{s.n}</span>
                    <Icon size={22} strokeWidth={1.5} className="text-charcoal group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="font-serif text-3xl text-ink mb-3">{s.title}</h3>
                  <p className="text-sm text-charcoal leading-relaxed">{s.desc}</p>
                  <div className="mt-8 flex items-center gap-2 label-mono text-charcoal group-hover:text-accent">
                    Learn more <ArrowUpRight size={14} strokeWidth={1.5} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <div className="label-mono mb-6">§ 02 — The Forge</div>
              <h2 className="serif-display text-5xl md:text-6xl sticky top-32">
                A method,<br/>
                <em className="italic font-normal text-accent">not a template.</em>
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6 space-y-0">
              {PROCESS.map((p) => (
                <div key={p.n} className="grid grid-cols-[auto_1fr] gap-6 md:gap-10 py-8 md:py-10 border-b border-border last:border-0">
                  <div className="font-serif text-4xl md:text-5xl text-accent italic font-light">{p.n}</div>
                  <div>
                    <h3 className="font-serif text-2xl md:text-3xl text-ink mb-2">{p.t}</h3>
                    <p className="text-sm md:text-base text-charcoal leading-relaxed max-w-md">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="label-mono mb-6">§ 03 — Field notes</div>
              <h2 className="serif-display text-5xl md:text-6xl">
                Rankings we've<br/>
                <em className="italic font-normal">shipped.</em>
              </h2>
            </div>
            <Link to="/audit" className="label-mono link-underline">
              <span className="link-underline-inner text-ink flex items-center gap-2">
                View sample audit <ArrowRight size={14} />
              </span>
            </Link>
          </div>

          <div className="border-t border-border">
            {CASES.map((c, i) => (
              <div key={c.client} className="grid grid-cols-1 md:grid-cols-12 gap-6 py-10 md:py-12 border-b border-border group hover:bg-surface cursor-pointer px-2 -mx-2">
                <div className="md:col-span-1 font-mono text-xs text-charcoal">0{i+1}</div>
                <div className="md:col-span-4">
                  <h3 className="font-serif text-3xl md:text-4xl text-ink group-hover:text-accent">{c.client}</h3>
                  <div className="label-mono mt-2">{c.vertical}</div>
                </div>
                <div className="md:col-span-4 text-sm text-charcoal leading-relaxed self-center">{c.note}</div>
                <div className="md:col-span-2 self-center">
                  <div className="font-mono text-3xl text-success">{c.lift}</div>
                  <div className="label-mono">Organic · {c.time}</div>
                </div>
                <div className="md:col-span-1 self-center justify-self-end">
                  <ArrowUpRight size={24} strokeWidth={1.5} className="text-charcoal group-hover:text-accent group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
          {TESTIMONIALS.map((t, i) => (
            <figure key={i} className="border-l-2 border-accent pl-8">
              <Quote className="text-accent mb-6" size={28} strokeWidth={1.5} />
              <blockquote className="font-serif text-2xl md:text-3xl leading-snug text-ink italic font-light">
                "{t.q}"
              </blockquote>
              <figcaption className="label-mono mt-8">{t.a}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-30 pointer-events-none" />
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-40">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8">
              <div className="label-mono mb-6 flex items-center gap-3">
                <Zap size={14} className="text-accent" strokeWidth={2} /> Ready to rank?
              </div>
              <h2 className="serif-display text-6xl md:text-8xl">
                Send us your URL.<br/>
                <em className="italic font-normal text-accent">We'll send back<br/>a diagnosis.</em>
              </h2>
              <p className="mt-8 max-w-xl text-base text-charcoal leading-relaxed">
                Free. No pitch deck. No sales call required. Just an honest, 84-point
                editorial audit delivered within 24 hours.
              </p>
            </div>
          </div>
          <div className="mt-12 max-w-4xl">
            <AuditForm variant="compact" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
