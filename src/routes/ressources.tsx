import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { PageHero } from "@/components/site/sections";
import { RESOURCES } from "@/config/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/ressources")({
  head: () => seo("Ressources", "Conseils et fiches pour réviser l’examen civique."),
  component: Page,
});

function Page() {
  if (useMatches().some((m) => m.routeId === "/ressources/$slug")) return <Outlet />;
  return (
    <>
      <PageHero eyebrow="Ressources" title="Conseils et fiches de révision" />
      <section className="container-page grid gap-5 pb-16 md:grid-cols-3">
        {RESOURCES.map((r) => (
          <Link key={r.slug} to="/ressources/$slug" params={{ slug: r.slug }} className="rounded-3xl border bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
            <h2 className="text-lg font-bold">{r.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{r.excerpt}</p>
            <span className="mt-4 inline-block text-sm font-medium text-primary">Lire →</span>
          </Link>
        ))}
      </section>
    </>
  );
}
