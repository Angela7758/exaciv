import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/sections";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/cookies")({
  head: () => seo("Cookies", "Cookies du site ExaCiv.com."),
  component: () => (
    <>
      <PageHero eyebrow="Légal" title="Cookies" />
      <section className="container-page max-w-3xl space-y-4 pb-16 text-foreground/85">
        <p>ExaCiv n’utilise actuellement aucun cookie publicitaire ni de mesure d’audience tierce.</p>
        <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">Document en cours de rédaction : les informations juridiques définitives (éditeur, hébergeur, contact) seront publiées avant l’ouverture des comptes.</p>
      </section>
    </>
  ),
});
