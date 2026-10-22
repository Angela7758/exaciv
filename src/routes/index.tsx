import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, BookOpen, CheckCircle2, ChevronRight, Clock, ExternalLink, FileText, Landmark, Laptop, Lightbulb, Play, Star, Target, Trophy, Users, IdCard, XCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaqList, FinalCta, PricingCards, SectionHeading } from "@/components/site/sections";
import { OFFICIAL_SOURCE } from "@/config/content";
import { seo } from "@/lib/seo";
import heroImg from "@/assets/hero-paris.jpg";
import civi from "@/assets/civi.png";
import artNat from "@/assets/art-naturalisation.png";
import artRes from "@/assets/art-resident.png";
import artSej from "@/assets/art-sejour.png";
import lessonImg from "@/assets/lesson-laicite.png";
import globeImg from "@/assets/globe.png";
import devicesImg from "@/assets/devices.png";

export const Route = createFileRoute("/")({
  head: () => seo("Préparez l’examen civique avec confiance", "Des leçons claires, des QCM et des examens blancs adaptés à votre démarche : naturalisation, carte de résident, carte de séjour pluriannuelle."),
  component: Index,
});

const PARCOURS_CARDS = [
  { id: "naturalisation", title: "Naturalisation", text: "Préparez l’examen civique pour votre demande de naturalisation par décret.", icon: Users, art: artNat, card: "bg-secondary-soft", title_cls: "text-secondary-pressed", icon_cls: "text-secondary" },
  { id: "resident", title: "Carte de résident", text: "Approfondissez vos connaissances sur les valeurs et les institutions françaises.", icon: IdCard, art: artRes, card: "bg-accent", title_cls: "text-primary-interactive", icon_cls: "text-primary-interactive" },
  { id: "sejour", title: "Carte de séjour pluriannuelle", text: "Consolidez vos repères sur la vie en société française.", icon: FileText, art: artSej, card: "bg-success-surface", title_cls: "text-foreground", icon_cls: "text-success" },
] as const;

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative -mt-20 overflow-hidden pt-20">
        <img src={heroImg} alt="" aria-hidden width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="container-page relative grid items-center gap-10 pb-28 pt-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-primary-interactive">Préparation à l’examen civique</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.1] md:text-[3.4rem]">
              Préparez l’examen civique avec <span className="text-secondary">confiance</span>
            </h1>
            <p className="mt-5 max-w-lg text-xl text-foreground">
              Des leçons claires, des QCM et des examens blancs adaptés à votre démarche.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild variant="cta" size="xl"><Link to="/test-gratuit"><Play className="fill-current" /> Faire un test gratuit</Link></Button>
              <Button asChild variant="outline" size="xl"><Link to="/methode">Découvrir la méthode <ArrowRight /></Link></Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Sans carte bancaire · Résultat immédiat</p>
            <div className="mt-6 inline-flex flex-wrap gap-5 rounded-xl bg-card/90 px-4 py-2.5 text-sm shadow-soft">
              {["Clair et accessible", "Conforme au programme", "À votre rythme"].map((t) => (
                <span key={t} className="flex items-center gap-1.5"><CheckCircle2 className="size-4 fill-success text-card" /> {t}</span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-lg md:block">
            {/* path chips */}
            <div className="absolute -left-20 top-6 z-10 space-y-8">
              <Chip icon={Landmark} label="1. Institutions françaises" done />
              <Chip icon={Users} label="2. Libertés et droits" className="ml-8" />
              <Chip icon={Star} label="3. Vie démocratique et citoyenneté" />
            </div>
            <div className="ml-16 rounded-3xl border bg-card/95 p-5 shadow-card">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold"><BookOpen className="mr-1 inline size-4 fill-foreground" />Leçon 4 - <span className="text-primary-interactive">Laïcité</span></span>
                <span className="flex items-center gap-2 font-semibold">3/5
                  <span className="flex gap-1">{["bg-primary-interactive", "bg-primary-interactive", "bg-primary-interactive", "bg-secondary", "bg-muted"].map((c, i) => <span key={i} className={`h-1.5 w-5 rounded-full ${c}`} />)}</span>
                </span>
              </div>
              <div className="mt-4 rounded-2xl border p-4">
                <p className="font-semibold">La laïcité garantit la liberté de conscience.</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <span className="flex items-center gap-2 rounded-xl border-2 border-success bg-success-soft px-3 py-2.5 font-medium"><CheckCircle2 className="size-5 fill-success text-card" /> Vrai</span>
                  <span className="flex items-center gap-2 rounded-xl border px-3 py-2.5"><span className="size-5 rounded-full border-2" /> Faux</span>
                </div>
                <span className="mt-3 block w-3/4 rounded-xl bg-primary-interactive py-2.5 text-center text-sm font-semibold text-primary-foreground">Valider ma réponse</span>
                <p className="mt-3 w-3/4 rounded-xl bg-muted p-3 text-xs text-muted-foreground"><FileText className="mr-1 inline size-4" />La laïcité permet à chacun de croire ou de ne pas croire, et de pratiquer sa religion librement dans le respect des lois.</p>
              </div>
            </div>
            <img src={civi} alt="CIVI, la mascotte ExaCiv" width={430} height={497} className="animate-float absolute -bottom-24 -right-6 w-52" />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="container-page relative z-10 -mt-14">
        <div className="grid items-center gap-4 rounded-2xl border bg-card p-5 shadow-card md:grid-cols-[1fr_1fr_1.2fr_auto]">
          <Stat icon={FileText} cls="bg-secondary-soft text-secondary" title="40 questions" sub="QCM sur la vie en société française" />
          <Stat icon={Clock} cls="bg-accent text-primary-interactive" title="45 minutes maximum" sub="Durée de l’épreuve" />
          <Stat icon={CheckCircle2} cls="bg-success-soft text-success" title="32 bonnes réponses minimum" sub="Pour la naturalisation par décret" />
          <a href={OFFICIAL_SOURCE.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary-interactive underline">
            Voir les règles officielles <ExternalLink className="size-4" />
          </a>
        </div>
      </section>

      {/* Parcours */}
      <section className="container-page pt-16">
        <SectionHeading title="Des parcours adaptés à votre situation" subtitle="Un contenu ciblé selon votre démarche, avec les mêmes exigences et un accompagnement sur mesure." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PARCOURS_CARDS.map((p) => (
            <Link key={p.id} to="/parcours" hash={p.id} className={`group relative flex min-h-48 overflow-hidden rounded-2xl p-6 ${p.card}`}>
              <img src={p.art} alt="" aria-hidden loading="lazy" className="pointer-events-none absolute bottom-0 right-0 h-[75%] w-auto" />
              <div className="relative flex flex-1 flex-col">
                <div className="flex items-center gap-3">
                  <p.icon className={`size-8 fill-current ${p.icon_cls}`} />
                  <h3 className={`text-xl font-bold ${p.title_cls}`}>{p.title}</h3>
                </div>
                <p className="mt-2 max-w-[65%] pl-11 text-muted-foreground">{p.text}</p>
                <span className="mt-auto grid size-11 place-items-center rounded-full bg-card text-primary-interactive shadow-soft transition group-hover:translate-x-1"><ArrowRight className="size-5" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Méthode */}
      <section className="mt-12 rounded-t-[2.5rem] bg-accent/40 py-14">
        <div className="container-page">
          <SectionHeading title="Une méthode qui donne envie de continuer" subtitle="Des étapes simples et efficaces pour progresser sereinement vers l’examen." />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MethodCard n="01" title="Comprendre" icon={Lightbulb} iconCls="text-secondary" text="Des leçons claires, illustrées et centrées sur les thèmes officiels.">
              <p className="text-sm font-semibold">La laïcité en France</p>
              <div className="relative mt-2 overflow-hidden rounded-lg"><img src={lessonImg} alt="Leçon vidéo sur la laïcité" loading="lazy" className="w-full" /></div>
              <div className="mt-2 flex items-center gap-2 text-xs"><span className="h-1.5 flex-1 rounded-full bg-muted"><span className="block h-full w-3/5 rounded-full bg-primary-interactive" /></span>4:32</div>
            </MethodCard>
            <MethodCard n="02" title="S’entraîner" icon={Target} iconCls="text-critical" text="Des QCM interactifs pour tester vos connaissances à chaque étape.">
              <p className="text-sm font-semibold">Quelle est la devise de la République française ?</p>
              {["Liberté, Égalité, Fraternité", "Unité, Paix, Solidarité", "Démocratie, Justice, Laïcité"].map((o, i) => (
                <div key={o} className={`mt-1.5 flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs ${i === 0 ? "border-success bg-success-soft" : ""}`}>
                  {i === 0 ? <CheckCircle2 className="size-4 fill-success text-card" /> : <span className="size-4 rounded-full border-2" />}{o}
                </div>
              ))}
              <span className="mt-2 block rounded-lg bg-primary-interactive py-2 text-center text-sm font-semibold text-primary-foreground">Valider</span>
            </MethodCard>
            <MethodCard n="03" title="Corriger" icon={FileText} iconCls="text-success" text="Des explications simples et détaillées pour bien comprendre vos erreurs.">
              <p className="flex items-center gap-2 rounded-lg bg-critical-soft px-2.5 py-2 text-xs font-medium text-critical"><XCircle className="size-5 fill-critical text-card" /> Réponse incorrecte</p>
              <p className="mt-2 rounded-lg bg-success-soft px-2.5 py-2 text-xs">La bonne réponse est :<br /><b>Liberté, Égalité, Fraternité</b></p>
              <p className="mt-2 text-xs text-muted-foreground">C’est la devise de la République française. Elle exprime les valeurs fondamentales de la France depuis la Révolution française de 1789.</p>
            </MethodCard>
            <MethodCard n="04" title="Simuler" icon={BarChart3} iconCls="text-primary-interactive" text="Des examens blancs dans les conditions réelles pour gagner en confiance.">
              <p className="text-sm font-semibold">Examen blanc</p>
              <div className="mx-auto mt-2 grid size-24 place-items-center rounded-full border-[10px] border-primary-interactive text-center leading-tight">
                <span><span className="block text-xs">28 / 40</span><span className="text-lg font-extrabold">70%</span></span>
              </div>
              <p className="mt-2 flex items-center gap-2 text-xs"><Clock className="size-4 text-critical" /> 45 minutes</p>
              <p className="mt-1 flex items-center gap-2 text-xs"><FileText className="size-4 text-critical" /> Conditions réelles</p>
            </MethodCard>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">Exemples d’interface à titre d’illustration.</p>
        </div>
      </section>

      {/* Pensé pour votre parcours */}
      <section className="container-page py-14">
        <SectionHeading title="Pensé pour votre parcours" subtitle="Des outils et un accompagnement adaptés à votre situation, pour avancer sereinement." />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-secondary-soft p-5">
            <div className="flex gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-card"><Users className="size-6 fill-secondary text-secondary" /></span>
              <div>
                <h3 className="text-lg font-bold">Selon votre démarche</h3>
                <p className="text-sm text-muted-foreground">Un contenu adapté à votre situation : naturalisation, carte de résident ou carte de séjour pluriannuelle.</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {[
                { id: "naturalisation", t: "Naturalisation", icon: Users, c: "text-secondary" },
                { id: "resident", t: "Carte de résident", icon: IdCard, c: "text-primary-interactive" },
                { id: "sejour", t: "Carte de séjour pluriannuelle", icon: FileText, c: "text-success" },
              ].map((p) => (
                <Link key={p.id} to="/parcours" hash={p.id} className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 text-sm font-medium shadow-soft hover:text-primary">
                  <p.icon className={`size-5 fill-current ${p.c}`} /> <span className="flex-1">{p.t}</span> <ChevronRight className="size-4 text-primary-interactive" />
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-accent p-5">
            <div className="flex gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-card"><BookOpen className="size-6 fill-primary-interactive text-primary-interactive" /></span>
              <div>
                <h3 className="text-lg font-bold">Des explications accessibles</h3>
                <p className="text-sm text-muted-foreground">Des leçons claires en français, avec un soutien multilingue pour faciliter votre apprentissage.</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <img src={globeImg} alt="" aria-hidden loading="lazy" className="w-36" />
              <div className="flex flex-col items-start gap-1.5 text-sm">
                {["🇫🇷 Français", "🇬🇧 English", "العربية", "🇪🇸 Español", "…"].map((l) => <span key={l} className="rounded-full bg-card px-3 py-1 shadow-soft">{l}</span>)}
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-success-surface p-5">
            <div className="flex gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-card"><Laptop className="size-6 text-success" /></span>
              <div>
                <h3 className="text-lg font-bold">Vos progrès au même endroit</h3>
                <p className="text-sm text-muted-foreground">Retrouvez vos leçons, vos résultats et vos favoris sur tous vos appareils. Avancez à votre rythme, où que vous soyez.</p>
              </div>
            </div>
            <img src={devicesImg} alt="ExaCiv sur ordinateur, tablette et téléphone" loading="lazy" className="mt-3 w-full" />
          </div>
        </div>
      </section>

      {/* Un petit pas chaque jour */}
      <section className="mx-3 rounded-[2rem] bg-accent/60 py-10">
        <div className="container-page grid items-center gap-8 md:grid-cols-[260px_1fr]">
          <img src={civi} alt="" aria-hidden loading="lazy" width={430} height={497} className="mx-auto w-56" />
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">Un petit pas chaque jour</h2>
            <p className="mt-2 max-w-md text-lg text-muted-foreground">Une méthode progressive pour apprendre sereinement et gagner en confiance.</p>
            <ol className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
              {[
                { icon: BookOpen, c: "fill-primary-interactive text-primary-interactive", t: "1. Découvrir", d: "Des leçons claires et illustrées", to: "/methode" },
                { icon: Target, c: "text-secondary", t: "2. S’entraîner", d: "Des QCM pour tester vos connaissances", to: "/test-gratuit" },
                { icon: BarChart3, c: "text-success", t: "3. Progresser", d: "Un suivi de vos résultats", to: "/methode" },
                { icon: Award, c: "fill-secondary text-secondary", t: "4. Être prêt", d: "Des examens blancs pour vous évaluer", to: "/tarifs" },
              ].map((s, i) => (
                <li key={s.t} className="relative text-center">
                  <Link to={s.to} className="group block">
                    <span className="mx-auto grid size-16 place-items-center rounded-full bg-card shadow-soft transition group-hover:-translate-y-0.5"><s.icon className={`size-8 ${s.c}`} /></span>
                    <p className="mt-2 font-bold">{s.t}</p>
                    <p className="text-sm text-muted-foreground">{s.d}</p>
                  </Link>
                  {i < 3 && <ArrowRight className="absolute -right-5 top-6 hidden size-5 text-subtle lg:block" />}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container-page py-12">
        <SectionHeading title="Choisissez votre rythme" subtitle="Commencez gratuitement, puis avancez à votre rythme." />
        <div className="mt-6"><PricingCards /></div>
      </section>

      {/* FAQ */}
      <section className="container-page pb-12">
        <SectionHeading title="Questions fréquentes" subtitle="Des réponses aux questions les plus courantes pour vous aider à y voir plus clair." />
        <div className="mt-6"><FaqList limit={4} twoCol /></div>
      </section>

      <FinalCta />
    </>
  );
}

function Chip({ icon: Icon, label, done, className = "" }: { icon: typeof Landmark; label: string; done?: boolean; className?: string }) {
  return (
    <div className={`flex w-40 items-center gap-2 rounded-xl bg-card px-3 py-2 text-xs font-semibold shadow-card ${className}`}>
      <Icon className="size-5 shrink-0 fill-foreground/80 text-foreground" />
      <span className="flex-1 leading-tight">{label}</span>
      {done ? <CheckCircle2 className="size-4 shrink-0 fill-success text-card" /> : <span className="size-3.5 shrink-0 rounded-full border-2 border-primary-interactive" />}
    </div>
  );
}

function Stat({ icon: Icon, cls, title, sub }: { icon: typeof Landmark; cls: string; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 md:border-r md:pr-4">
      <span className={`grid size-12 shrink-0 place-items-center rounded-full ${cls}`}><Icon className="size-6" /></span>
      <div>
        <p className="text-lg font-bold">{title}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

function MethodCard({ n, title, icon: Icon, iconCls, text, children }: { n: string; title: string; icon: typeof Landmark; iconCls: string; text: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-2xl border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-4">
        <span className="grid size-11 place-items-center rounded-full bg-accent font-bold text-primary-interactive">{n}</span>
        <span className="grid size-12 place-items-center rounded-full bg-muted"><Icon className={`size-7 ${iconCls}`} /></span>
      </div>
      <h3 className="mt-3 text-center text-xl font-bold">{title}</h3>
      <p className="mt-1 text-center text-sm text-muted-foreground">{text}</p>
      <div className="mt-4 flex-1 rounded-xl border bg-card p-3 shadow-soft">{children}</div>
    </div>
  );
}
