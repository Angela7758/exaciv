import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/sections";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/cgv")({
  head: () => seo("Conditions d’utilisation", "Conditions d’utilisation du site ExaCiv.com."),
  component: () => (
    <>
      <PageHero eyebrow="Légal" title="Conditions d’utilisation" />
      <section className="container-page max-w-3xl space-y-4 pb-16 text-foreground/85">
        <p>Un abonnement ExaCiv donne accès à des contenus de préparation. Il ne constitue ni une inscription à l’examen officiel, ni une garantie de réussite, et n’inclut pas les frais de l’examen officiel.</p>
        <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">Document en cours de rédaction : les informations juridiques définitives (éditeur, hébergeur, contact) seront publiées avant l’ouverture des comptes.</p>
      </section>
    </>
  ),
});
