import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { RESOURCES } from "@/config/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/ressources/$slug")({
  loader: ({ params }) => {
    const r = RESOURCES.find((x) => x.slug === params.slug);
    if (!r) throw notFound();
    return r;
  },
  head: ({ loaderData }) => seo(loaderData?.title ?? "Ressource", loaderData?.excerpt ?? "Fiche de révision ExaCiv."),
  component: Page,
});

function Page() {
  const r = Route.useLoaderData();
  return (
    <article className="container-page max-w-2xl py-16">
      <Link to="/ressources" className="text-sm text-primary hover:underline">← Ressources</Link>
      <h1 className="mt-3 text-4xl font-bold">{r.title}</h1>
      <div className="mt-6 space-y-4 text-lg text-foreground/85">{r.body.map((p) => <p key={p}>{p}</p>)}</div>
    </article>
  );
}
