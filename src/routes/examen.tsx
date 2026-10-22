import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IndependenceNotice, PageHero } from "@/components/site/sections";
import { ELIGIBILITY_NOTE, OFFICIAL_SOURCE, PARCOURS } from "@/config/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/examen")({
  head: () => seo("L’examen civique", "Format, thèmes et démarches concernées par l’examen civique, avec les liens vers les sources officielles."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="L’examen" title="Comprendre l’examen civique">
        Un questionnaire à choix multiples sur les principes et valeurs de la République, les institutions, les droits et devoirs, l’histoire et la vie en société.
      </PageHero>
      <section className="container-page space-y-8 pb-16">
        <IndependenceNotice />
        <div className="grid gap-5 md:grid-cols-3">
          {PARCOURS.map((p) => (
            <div key={p.id} className="rounded-3xl border bg-card p-6 shadow-soft">
              <h2 className="text-xl font-bold">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border bg-card p-6">
          <h2 className="text-xl font-bold">Les règles officielles</h2>
          <p className="mt-2 text-muted-foreground">
            Le nombre de questions, la durée, le seuil de réussite, les dispenses et les modalités d’inscription sont fixés par les textes officiels et peuvent différer selon la démarche. {ELIGIBILITY_NOTE}
          </p>
          <a href={OFFICIAL_SOURCE.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 font-medium text-primary hover:underline">
            Consulter {OFFICIAL_SOURCE.label} <ExternalLink className="size-4" />
          </a>
        </div>
        <Button asChild variant="cta" size="lg"><Link to="/test-gratuit">Faire un test gratuit</Link></Button>
      </section>
    </>
  );
}
