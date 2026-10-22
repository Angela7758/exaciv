import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Lightbulb, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/sections";
import { seo } from "@/lib/seo";
import civi from "@/assets/civi-lecon.png";

export const Route = createFileRoute("/methode")({
  head: () => seo("La méthode", "Découvrir, s’entraîner, progresser, être prêt : la méthode ExaCiv en quatre étapes."),
  component: Page,
});

const STEPS = [
  { icon: Lightbulb, t: "Découvrir", d: "Des leçons courtes et illustrées, centrées sur les thèmes du programme." },
  { icon: Target, t: "S’entraîner", d: "Des QCM par thème, avec une correction expliquée et sourcée pour chaque question." },
  { icon: BarChart3, t: "Progresser", d: "Vos erreurs sont regroupées pour réviser là où c’est utile." },
  { icon: Trophy, t: "Être prêt", d: "Des examens blancs chronométrés pour vous mettre en condition." },
];

function Page() {
  return (
    <>
      <PageHero eyebrow="Méthode" title="Un petit pas chaque jour">Une méthode progressive pour apprendre sereinement et gagner en confiance.</PageHero>
      <section className="container-page grid items-center gap-10 pb-16 md:grid-cols-[1fr_260px]">
        <ol className="grid gap-4 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <li key={s.t} className="rounded-3xl border bg-card p-6 shadow-soft">
              <s.icon className="size-8 text-secondary" />
              <h2 className="mt-3 text-xl font-bold">{i + 1}. {s.t}</h2>
              <p className="mt-1 text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
        <img src={civi} alt="CIVI" loading="lazy" width={430} height={497} className="mx-auto w-56" />
        <Button asChild variant="cta" size="lg" className="w-fit"><Link to="/test-gratuit">Commencer par un test gratuit</Link></Button>
      </section>
    </>
  );
}
