import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/sections";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/mentions-legales")({
  head: () => seo("Mentions légales", "Mentions légales du site ExaCiv.com."),
  component: () => (
    <>
      <PageHero eyebrow="Légal" title="Mentions légales" />
      <section className="container-page max-w-3xl space-y-4 pb-16 text-foreground/85">
        <p>ExaCiv.com est une plateforme indépendante de préparation à l’examen civique, non affiliée à l’administration française.</p>
        <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">Document en cours de rédaction : les informations juridiques définitives (éditeur, hébergeur, contact) seront publiées avant l’ouverture des comptes.</p>
      </section>
    </>
  ),
});
