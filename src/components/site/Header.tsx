import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/tools", label: "Free Tools" },
  { to: "/audit", label: "Audit Report" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <Link to="/" className="flex items-center gap-2 group" data-testid="logo-link">
          <span className="grid h-8 w-8 place-items-center border border-ink text-ink font-mono text-sm font-semibold group-hover:bg-ink group-hover:text-background">R/</span>
          <span className="font-serif text-2xl tracking-tight text-ink">RankForge<span className="text-accent">.</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {NAV.map((item) => {
            const active = path === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="link-underline label-mono text-charcoal hover:text-ink"
                activeProps={{ className: "label-mono text-ink" }}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span className={`link-underline-inner ${active ? "text-ink" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <Link
          to="/contact"
          className="hidden md:inline-block bg-ink text-background px-5 py-3 label-mono hover:bg-accent"
          data-testid="header-cta"
        >
          Book audit →
        </Link>

        <button
          className="md:hidden border border-border p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block border-b border-border px-6 py-4 label-mono text-charcoal hover:bg-surface hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="block bg-ink text-background px-6 py-4 label-mono text-center"
          >
            Book audit →
          </Link>
        </div>
      )}
    </header>
  );
}
