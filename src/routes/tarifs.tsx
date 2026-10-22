import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import {PublicPricing} from "@/components/site/PublicPricing";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/tarifs")({
  head: () => seo("Tarifs", "Découverte gratuite, Essentiel à 9,90 €/mois ou Pass Révision à 24,90 € pour 3 mois."),
  component: Page,
});

function Page() {
  const child = useMatches().some((m) => m.routeId === "/tarifs/$plan");
  if (child) return <Outlet />;
  return <PublicPricing/>;
}
