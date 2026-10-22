import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/sections";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact", "Une question sur ExaCiv ? Contactez-nous."),
  component: () => (
    <>
      <PageHero eyebrow="Contact" title="Nous contacter">Une question sur ExaCiv ? Écrivez-nous, nous répondons généralement sous quelques jours ouvrés.</PageHero>
      <section className="container-page pb-16">
        <a href="mailto:contact@exaciv.com" className="inline-block rounded-2xl border bg-card px-6 py-4 text-lg font-semibold text-primary shadow-soft hover:shadow-card">contact@exaciv.com</a>
        <p className="mt-4 text-sm text-muted-foreground">Pour l’inscription à l’examen officiel, adressez-vous aux organismes habilités.</p>
      </section>
    </>
  ),
});
