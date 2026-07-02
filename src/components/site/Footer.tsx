import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="label-mono mb-4">Est. 2024 / Global</div>
            <h2 className="serif-display text-4xl md:text-5xl">
              Rankings are earned<br/>
              <em className="italic font-normal text-accent">not requested.</em>
            </h2>
            <p className="mt-6 max-w-md text-sm text-charcoal leading-relaxed">
              RankForge is an AI-augmented SEO studio. We audit, forge, and defend
              organic visibility for founders, publishers and product teams.
            </p>
          </div>

          <div className="md:col-span-2 md:col-start-8">
            <div className="label-mono mb-4">Studio</div>
            <ul className="space-y-3 text-sm text-ink font-sans">
              <li><Link to="/about" className="hover:text-accent">About</Link></li>
              <li><Link to="/tools" className="hover:text-accent">Free Tools</Link></li>
              <li><Link to="/audit" className="hover:text-accent">Sample Audit</Link></li>
              <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="label-mono mb-4">Contact</div>
            <ul className="space-y-3 text-sm text-ink font-sans">
              <li className="font-mono text-charcoal">hello@rankforge.ai</li>
              <li className="font-mono text-charcoal">+1 (415) 555—0142</li>
              <li className="text-charcoal">Remote — SF · LDN · SGP</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="label-mono">© {new Date().getFullYear()} RankForge AI — All rights reserved</div>
          <div className="flex gap-6 label-mono text-charcoal">
            <span>Privacy</span>
            <span>Terms</span>
            <span className="text-ink">v.06.2</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
