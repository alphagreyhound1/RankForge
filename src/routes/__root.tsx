import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 paper-texture">
      <div className="max-w-md text-left border border-border p-12 bg-background">
        <div className="label-mono mb-4">Error / 404</div>
        <h1 className="serif-display text-7xl">Not found.</h1>
        <p className="mt-4 text-sm text-charcoal font-sans leading-relaxed">
          This page has been unindexed, redirected, or never existed. Rankings do not lie.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block border border-ink px-6 py-3 label-mono text-ink hover:bg-ink hover:text-background"
        >
          ← Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-left border border-border p-12">
        <div className="label-mono mb-4">Runtime / 500</div>
        <h1 className="serif-display text-5xl">Something crawled wrong.</h1>
        <p className="mt-4 text-sm text-charcoal">
          The page failed to load. Try again or return to base.
        </p>
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="border border-ink px-6 py-3 label-mono hover:bg-ink hover:text-background"
          >
            Retry
          </button>
          <a href="/" className="border border-border px-6 py-3 label-mono text-charcoal hover:border-ink hover:text-ink">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RankForge AI — Editorial SEO auditing for ambitious brands" },
      { name: "description", content: "AI-driven SEO audits, technical fixes, and content forging. We diagnose why your site isn't ranking — then fix it." },
      { name: "author", content: "RankForge AI" },
      { property: "og:title", content: "RankForge AI — Editorial SEO auditing" },
      { property: "og:description", content: "AI-driven SEO audits, technical fixes, and content forging." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "RankForge AI" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Outfit:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
