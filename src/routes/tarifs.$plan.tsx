import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAYMENTS_ENABLED, PLANS, PRICING_NOTE } from "@/config/pricing";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/tarifs/$plan")({
  loader: ({ params }) => {
    const plan = PLANS.find((p) => p.id === params.plan && p.id !== "decouverte");
    if (!plan) throw notFound();
    return plan;
  },
  head: ({ loaderData }) => seo(loaderData ? `Offre ${loaderData.name}` : "Offre", "Détails de l’offre ExaCiv choisie."),
  component: Page,
});

function Page() {
  const plan = Route.useLoaderData();
  return (
    <section className="container-page max-w-xl py-16">
      <h1 className="text-3xl font-bold">Offre {plan.name}</h1>
      <p className="mt-2 text-2xl font-extrabold">{plan.price} <span className="text-base font-normal text-muted-foreground">{plan.period}</span></p>
      <ul className="mt-4 list-inside list-disc text-muted-foreground">{plan.features.map((f) => <li key={f}>{f}</li>)}</ul>
      {!PAYMENTS_ENABLED && (
        <div className="mt-6 flex gap-3 rounded-2xl border bg-secondary-soft p-4 text-sm">
          <Info className="size-5 shrink-0 text-secondary-pressed" />
          <p>Le paiement en ligne n’est pas encore ouvert. Aucun montant ne sera débité. En attendant, faites le test gratuit pour découvrir ExaCiv.</p>
        </div>
      )}
      <div className="mt-6 flex gap-3">
        <Button asChild variant="cta"><Link to="/test-gratuit">Faire le test gratuit</Link></Button>
        <Button asChild variant="ghost"><Link to="/tarifs">Retour aux offres</Link></Button>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">{PRICING_NOTE}</p>
    </section>
  );
}
