import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, BookOpen, Check, CheckCircle2, ClipboardCheck, Clock, FileText, Landmark, Laptop, Lightbulb, Play, Target, Trophy, Users, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaqList, FinalCta, IndependenceNotice, PricingCards, SectionHeading } from "@/components/site/sections";
import { PARCOURS } from "@/config/content";
import { seo } from "@/lib/seo";
import heroImg from "@/assets/hero-paris.jpg";
import civi from "@/assets/civi.png";
import civiProgression from "@/assets/civi-progression.png";

export const Route = createFileRoute("/")({
  head: () => seo("Préparez l’examen civique avec confiance", "Leçons claires, QCM et examens blancs pour préparer l’examen civique : naturalisation, carte de résident, carte de séjour pluriannuelle."),
  component: Index,
});

const toneCls = {
  orange: "bg-secondary-soft text-secondary-pressed",
  blue: "bg-accent text-primary",
  green: "bg-success-soft text-success",
};

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative -mt-20 overflow-hidden pt-20">
        <img src={heroImg} alt="" aria-hidden width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="container-page relative grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-interactive">Préparation à l’examen civique</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-6xl">
              Préparez l’examen civique avec <span className="text-secondary">confiance</span>.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-foreground/80">
              Leçons, QCM, examens blancs et suivi de vos progrès réunis au même endroit. Apprenez à votre rythme.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="cta" size="xl"><Link to="/test-gratuit"><Play className="fill-current" /> Faire un test gratuit</Link></Button>
              <Button asChild variant="outline" size="xl"><Link to="/parcours">Découvrir le parcours <ArrowRight /></Link></Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Sans compte · Sans carte bancaire · Résultat immédiat</p>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="rounded-3xl border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold"><BookOpen className="mr-1 inline size-4" />Leçon 4 · <span className="text-primary-interactive">Laïcité</span></span>
                <span className="text-muted-foreground">3 / 5</span>
              </div>
              <div className="mt-2 flex gap-1">{[1, 1, 1, 0, 0].map((d, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${d ? "bg-primary-interactive" : "bg-muted"}`} />)}</div>
              <p className="mt-5 font-semibold">La laïcité garantit la liberté de conscience.</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <span className="flex items-center gap-2 rounded-xl border-2 border-success bg-success-soft px-3 py-2.5 font-medium"><CheckCircle2 className="size-4 text-success" /> Vrai</span>
                <span className="rounded-xl border px-3 py-2.5 text-muted-foreground">Faux</span>
              </div>
              <p className="mt-3 rounded-xl bg-muted p-3 text-sm text-muted-foreground">La laïcité permet à chacun de croire ou de ne pas croire, et de pratiquer sa religion dans le respect des lois.</p>
            </div>
            <img src={civi} alt="CIVI, la mascotte ExaCiv" width={430} height={497} className="animate-float absolute -bottom-28 -right-4 w-32 md:w-40" />
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="container-page relative z-10 mt-8"><IndependenceNotice /></section>

      {/* Pensé pour votre parcours */}
      <section className="container-page py-20">
        <SectionHeading title="Pensé pour votre parcours" subtitle="Des outils et un accompagnement adaptés à votre situation." />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <div className="rounded-3xl bg-secondary-soft p-6">
            <Users className="size-8 text-secondary" />
            <h3 className="mt-3 text-xl font-bold">Selon votre démarche</h3>
            <p className="mt-1 text-sm text-muted-foreground">Un contenu distinct pour chaque démarche.</p>
            <div className="mt-5 space-y-2">
              {PARCOURS.map((p) => (
                <Link key={p.id} to="/parcours" hash={p.id} className="flex items-center justify-between rounded-xl bg-card px-4 py-3 font-medium shadow-soft hover:text-primary">
                  {p.title} <ArrowRight className="size-4" />
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-accent p-6">
            <BookOpen className="size-8 text-primary" />
            <h3 className="mt-3 text-xl font-bold">Des explications accessibles</h3>
            <p className="mt-1 text-sm text-muted-foreground">Des leçons en français clair, avec des aides dans d’autres langues pour mieux comprendre.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Français", "English", "العربية", "Español", "中文"].map((l) => <span key={l} className="rounded-full bg-card px-3 py-1.5 text-sm shadow-soft">{l}</span>)}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">L’examen officiel se passe en français.</p>
          </div>
          <div className="rounded-3xl bg-success-surface p-6">
            <Laptop className="size-8 text-success" />
            <h3 className="mt-3 text-xl font-bold">Vos progrès au même endroit</h3>
            <p className="mt-1 text-sm text-muted-foreground">Leçons, résultats et favoris liés à votre compte, sur ordinateur, tablette ou téléphone.</p>
            <div className="mt-5 space-y-2 rounded-2xl bg-card p-4 shadow-soft">
              {["Principes et valeurs", "Institutions", "Droits et devoirs"].map((t, i) => (
                <div key={t} className="flex items-center gap-3 text-sm">
                  <Check className={`size-4 ${i < 2 ? "text-success" : "text-subtle"}`} />
                  <span className="flex-1">{t}</span>
                  <span className="h-1.5 w-16 rounded-full bg-muted"><span className="block h-full rounded-full bg-success" style={{ width: `${[100, 70, 30][i]}%` }} /></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Un petit pas chaque jour */}
      <section className="bg-accent/60 py-16">
        <div className="container-page grid items-center gap-10 md:grid-cols-[220px_1fr]">
          <img src={civiProgression} alt="" aria-hidden loading="lazy" width={430} height={497} className="mx-auto w-48" />
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">Un petit pas chaque jour</h2>
            <p className="mt-2 text-lg text-muted-foreground">Une méthode progressive pour apprendre sereinement.</p>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Lightbulb, t: "Découvrir", d: "Des leçons claires et illustrées par thème.", to: "/methode" },
                { icon: Target, t: "S’entraîner", d: "Des QCM pour tester vos connaissances.", to: "/test-gratuit" },
                { icon: BarChart3, t: "Progresser", d: "Un suivi de vos résultats par thème.", to: "/methode" },
                { icon: Trophy, t: "Être prêt", d: "Des examens blancs dans des conditions proches du réel.", to: "/tarifs" },
              ].map((s, i) => (
                <li key={s.t}>
                  <Link to={s.to} className="block h-full rounded-2xl bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
                    <s.icon className="size-7 text-secondary" />
                    <p className="mt-3 font-bold">{i + 1}. {s.t}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Product preview */}
      <section className="container-page py-20">
        <SectionHeading title="Une méthode qui donne envie de continuer" subtitle="Comprendre, s’entraîner, corriger, simuler." />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Preview n="01" title="Comprendre" icon={Landmark}>
            <p className="font-semibold">La laïcité en France</p>
            <div className="mt-3 h-24 rounded-xl bg-accent" />
            <div className="mt-3 h-1.5 rounded-full bg-muted"><div className="h-full w-3/5 rounded-full bg-primary-interactive" /></div>
          </Preview>
          <Preview n="02" title="S’entraîner" icon={Target}>
            <p className="text-sm font-semibold">Quelle est la devise de la République ?</p>
            {["Liberté, Égalité, Fraternité", "Unité, Paix, Solidarité"].map((o, i) => (
              <div key={o} className={`mt-2 rounded-lg border px-3 py-2 text-sm ${i === 0 ? "border-success bg-success-soft" : ""}`}>{o}</div>
            ))}
          </Preview>
          <Preview n="03" title="Corriger" icon={FileText}>
            <p className="flex items-center gap-2 rounded-lg bg-critical-soft px-3 py-2 text-sm font-medium text-critical"><XCircle className="size-4" /> Réponse incorrecte</p>
            <p className="mt-2 rounded-lg bg-success-soft px-3 py-2 text-sm">Bonne réponse : <b>Liberté, Égalité, Fraternité</b></p>
            <p className="mt-2 text-xs text-muted-foreground">Source : Constitution, art. 2</p>
          </Preview>
          <Preview n="04" title="Simuler" icon={ClipboardCheck}>
            <p className="font-semibold">Examen blanc</p>
            <div className="mx-auto mt-3 grid size-24 place-items-center rounded-full border-8 border-primary-interactive/80 text-lg font-bold">Score</div>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Clock className="size-4" /> Chronométré</p>
          </Preview>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">Aperçus d’interface à titre d’illustration.</p>
      </section>

      {/* Pricing */}
      <section className="bg-card py-20">
        <div className="container-page">
          <SectionHeading title="Choisissez votre rythme" subtitle="Commencez gratuitement, puis avancez à votre rythme." />
          <div className="mt-12"><PricingCards /></div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page py-20">
        <SectionHeading title="Questions fréquentes" />
        <div className="mt-10"><FaqList /></div>
      </section>

      <FinalCta />
    </>
  );
}

function Preview({ n, title, icon: Icon, children }: { n: string; title: string; icon: typeof Landmark; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-accent text-sm font-bold text-primary">{n}</span>
        <Icon className="size-6 text-secondary" />
      </div>
      <h3 className="mt-3 text-lg font-bold">{title}</h3>
      <div className="mt-4 rounded-2xl border bg-background p-4">{children}</div>
    </div>
  );
}
