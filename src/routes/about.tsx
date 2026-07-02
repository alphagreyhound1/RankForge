import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — RankForge AI" },
      { name: "description", content: "RankForge is an AI-augmented SEO studio. We forge organic rankings for founders, publishers, and product teams." },
      { property: "og:title", content: "About — RankForge AI" },
      { property: "og:description", content: "An AI-augmented SEO studio for founders and publishers." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

const PRINCIPLES = [
  { n: "I.", t: "Editorial over algorithmic", d: "We write reports a CEO could read on a train. No dashboards for their own sake." },
  { n: "II.", t: "AI as apprentice, not oracle", d: "Models do the scale work. Strategists do the judgment. Never the reverse." },
  { n: "III.", t: "Revenue, not rankings", d: "Every recommendation is scored by projected revenue impact before it ships." },
  { n: "IV.", t: "Slow craft, fast delivery", d: "Reports in 24 hours. Retainers built over quarters. No shortcuts to authority." },
];

const TEAM = [
  { name: "Ines Halden", role: "Founder / Head of Strategy", bio: "12 years in editorial SEO. Former Head of Growth at Meridian." },
  { name: "Marco Kim", role: "Principal Engineer", bio: "Built crawlers at Ahrefs. Obsessive about Core Web Vitals." },
  { name: "Priya Sharma", role: "Head of Content", bio: "Former features editor. Runs our content forge and briefs system." },
  { name: "Tomas Weber", role: "Data Scientist", bio: "Trains the ranking-prediction models. Writes SQL like poetry." },
];

const ARCHITECTURE_IMG = "https://images.pexels.com/photos/13044635/pexels-photo-13044635.jpeg";
const PRESS_IMG = "https://images.pexels.com/photos/36559330/pexels-photo-36559330.jpeg";

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7">
              <div className="label-mono mb-8">§ About the studio</div>
              <h1 className="serif-display text-6xl md:text-8xl">
                A press,<br/>
                not a<br/>
                <em className="italic font-normal text-accent">platform.</em>
              </h1>
            </div>
            <div className="md:col-span-4 md:col-start-9 self-end">
              <p className="text-base text-charcoal leading-relaxed">
                RankForge was founded in 2024 by three editors and two engineers who
                were tired of SEO agencies that read like they were written by SEO
                agencies. We forge rankings the way old print houses forged type —
                slowly, deliberately, and with our names on the work.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-2">
          <div className="border-r border-border p-10 md:p-16 order-2 md:order-1">
            <div className="label-mono mb-6">Origin</div>
            <h2 className="serif-display text-4xl md:text-5xl mb-8">
              We named it <em className="italic font-normal text-accent">RankForge</em> because forging is a physical act.
            </h2>
            <div className="space-y-6 text-base text-charcoal leading-relaxed">
              <p>
                Heat, pressure, repetition — a forge doesn't produce metal, it produces
                <em> shape</em>. That's how organic ranking works. It's not something you
                buy. It's something you shape, over time, under discipline.
              </p>
              <p>
                Every audit we ship is set in real type. Every strategy is written by
                a human before an AI ever refines it. And every client relationship
                begins with the same question: what does the ranking actually earn you?
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2 min-h-[400px] md:min-h-0 bg-cover bg-center" style={{ backgroundImage: `url(${PRESS_IMG})` }} />
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-32">
          <div className="label-mono mb-8">§ Principles</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {PRINCIPLES.map((p) => (
              <div key={p.n} className="border-t-2 border-ink pt-8">
                <div className="font-serif italic text-4xl text-accent mb-3">{p.n}</div>
                <h3 className="font-serif text-3xl text-ink mb-3">{p.t}</h3>
                <p className="text-base text-charcoal leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-2">
          <div className="min-h-[400px] md:min-h-0 bg-cover bg-center" style={{ backgroundImage: `url(${ARCHITECTURE_IMG})` }} />
          <div className="border-l border-border p-10 md:p-16">
            <div className="label-mono mb-6">§ The team</div>
            <h2 className="serif-display text-4xl md:text-5xl mb-10">
              Five humans<span className="text-accent">.</span><br/>
              <em className="italic font-normal">Two models.</em>
            </h2>
            <div className="space-y-6">
              {TEAM.map((t) => (
                <div key={t.name} className="grid grid-cols-[auto_1fr] gap-6 pb-6 border-b border-border last:border-0">
                  <div className="grid h-14 w-14 place-items-center border border-ink font-mono text-sm text-ink shrink-0">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-ink">{t.name}</h3>
                    <div className="label-mono mb-2">{t.role}</div>
                    <p className="text-sm text-charcoal">{t.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
