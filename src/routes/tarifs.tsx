import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { PageHero, PricingCards } from "@/components/site/sections";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/tarifs")({
  head: () => seo("Tarifs", "Découverte gratuite, Essentiel à 9,90 €/mois ou Pass Révision à 24,90 € pour 3 mois."),
  component: Page,
});

function Page() {
  const child = useMatches().some((m) => m.routeId === "/tarifs/$plan");
  if (child) return <Outlet />;
  return (
    <>
      <PageHero eyebrow="Tarifs" title="Choisissez votre rythme">Commencez gratuitement, puis avancez à votre rythme.</PageHero>
      <section className="container-page pb-16"><PricingCards /></section>
    </>
  );
}
