import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/sections";
import { ELIGIBILITY_NOTE, PARCOURS } from "@/config/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/parcours")({
  head: () => seo("Parcours", "Trois parcours distincts : naturalisation, carte de résident et carte de séjour pluriannuelle."),
  component: Page,
});

const tone = { orange: "bg-secondary-soft", blue: "bg-accent", green: "bg-success-surface" };

function Page() {
  return (
    <>
      <PageHero eyebrow="Parcours" title="Des parcours adaptés à votre situation">
        Chaque démarche a son propre contenu. {ELIGIBILITY_NOTE}
      </PageHero>
      <section className="container-page grid gap-5 pb-16">
        {PARCOURS.map((p) => (
          <article id={p.id} key={p.id} className={`scroll-mt-28 rounded-3xl p-8 ${tone[p.tone]}`}>
            <h2 className="text-2xl font-bold">{p.title}</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">{p.description}</p>
            <ul className="mt-4 grid gap-1 text-sm sm:grid-cols-2">
              <li>• Principes et valeurs de la République</li>
              <li>• Institutions et système politique</li>
              <li>• Droits et devoirs</li>
              <li>• Histoire, géographie et culture</li>
              <li>• Vie en société française</li>
            </ul>
            <Button asChild variant="cta" className="mt-6"><Link to="/test-gratuit">Tester mon niveau</Link></Button>
          </article>
        ))}
      </section>
    </>
  );
}
