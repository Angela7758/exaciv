import { createFileRoute } from "@tanstack/react-router";
import { FaqList, PageHero } from "@/components/site/sections";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () => seo("Questions fréquentes", "Les réponses aux questions les plus courantes sur ExaCiv et l’examen civique."),
  component: () => (
    <>
      <PageHero eyebrow="FAQ" title="Questions fréquentes" />
      <section className="container-page pb-16"><FaqList /></section>
    </>
  ),
});
