import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BarChart3, BookOpen, CheckCircle2, ChevronRight, Clock, ExternalLink, FileText, Landmark, Laptop, Lightbulb, Play, Target, Users, IdCard, X, XCircle, Award, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaqList, FinalCta, PricingCards, SectionHeading } from "@/components/site/sections";
import { OFFICIAL_SOURCE } from "@/config/content";
import { seo } from "@/lib/seo";
import { useT } from "@/lib/i18n";
import { HomeHero } from "@/components/site/HomeHero";
import { Reveal } from "@/components/site/Reveal";
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

const QUIZ_OPTIONS = ["Liberté, Égalité, Fraternité", "Unité, Paix, Solidarité", "Démocratie, Justice, Laïcité"];

function Index() {
  const t = useT();
  const parcoursCards = [
    { id: "naturalisation", title: t('home.parcours.nat.title'), text: t('home.parcours.nat.text'), icon: Users, art: artNat, card: "bg-secondary-soft", title_cls: "text-secondary-pressed", icon_cls: "text-secondary" },
    { id: "resident", title: t('home.parcours.res.title'), text: t('home.parcours.res.text'), icon: IdCard, art: artRes, card: "bg-accent", title_cls: "text-primary-interactive", icon_cls: "text-primary-interactive" },
    { id: "sejour", title: t('home.parcours.sej.title'), text: t('home.parcours.sej.text'), icon: FileText, art: artSej, card: "bg-success-surface", title_cls: "text-foreground", icon_cls: "text-success" },
  ] as const;
  return (
    <div className="approved-home">
      <HomeHero />

      {/* Stats bar */}
      <section className="container-page home-exam-strip relative z-10 -mt-14">
        <div className="grid items-center gap-4 rounded-2xl border bg-card p-5 shadow-card md:grid-cols-[1fr_1fr_1.2fr_auto]">
          <Stat icon={FileText} cls="bg-secondary-soft text-secondary" title={t('home.stats.q')} sub={t('home.stats.qsub')} />
          <Stat icon={Clock} cls="bg-accent text-primary-interactive" title={t('home.stats.d')} sub={t('home.stats.dsub')} />
          <Stat icon={CheckCircle2} cls="bg-success-soft text-success" title={t('home.stats.s')} sub={t('home.stats.ssub')} />
          <a href={OFFICIAL_SOURCE.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary-interactive underline">
            {t('home.stats.official')} <ExternalLink className="size-4" />
          </a>
        </div>
      </section>

      {/* Parcours */}
      <Reveal><section className="container-page pt-16">
        <SectionHeading title={t('home.parcours.title')} subtitle={t('home.parcours.subtitle')} />
        <div className="mt-8 grid items-stretch gap-4 md:grid-cols-3">
          {parcoursCards.map((p, i) => (
            <Link key={p.id} to="/parcours" hash={p.id} style={{ transitionDelay: `${i * 70}ms` }} className={`reveal-child group relative flex h-full min-h-48 overflow-hidden rounded-2xl p-6 card-hover ${p.card}`}>
              <img src={p.art} alt="" aria-hidden loading="lazy" className="pointer-events-none absolute bottom-0 right-0 h-[75%] w-auto rtl-mirror-off" />
              <div className="relative flex flex-1 flex-col">
                <div className="flex items-center gap-3">
                  <p.icon className={`size-8 fill-current ${p.icon_cls}`} />
                  <h3 className={`text-xl font-bold ${p.title_cls}`}>{p.title}</h3>
                </div>
                <p className="mt-2 max-w-[65%] pl-11 text-muted-foreground">{p.text}</p>
                <span className="mt-auto grid size-11 place-items-center rounded-full bg-card text-primary-interactive shadow-soft transition group-hover:translate-x-1"><ArrowRight className="size-5 rtl-flip" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section></Reveal>

      {/* Méthode */}
      <Reveal><section data-home-block="method" className="home-method mt-12 rounded-t-[2.5rem] bg-accent/40 py-14">
        <div className="container-page">
          <SectionHeading title={t('home.methode.title')} subtitle={t('home.methode.subtitle')} />
          <div className="mt-8 grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MethodCard index={0} title={t('home.methode.comprendre')} icon={Lightbulb} iconCls="text-secondary" text={t('home.methode.comprendreText')}>
              <p className="text-sm font-semibold">{t('home.methode.lessonTitle')}</p>
              <div className="relative mt-2 overflow-hidden rounded-lg"><img src={lessonImg} alt={t('home.methode.lessonTitle')} loading="lazy" className="w-full" /></div>
              <Button asChild variant="interactive" size="sm" className="mt-3 w-full">
                <Link to="/methode"><BookOpen />{t('home.methode.openLesson')}</Link>
              </Button>
            </MethodCard>
            <MethodCard index={1} title={t('home.methode.entrainer')} icon={Target} iconCls="text-critical" text={t('home.methode.entrainerText')}>
              <PracticePreview />
            </MethodCard>
            <MethodCard index={2} title={t('home.methode.corriger')} icon={FileText} iconCls="text-success" text={t('home.methode.corrigerText')}>
              <p className="flex items-center gap-2 rounded-lg bg-critical-soft px-2.5 py-2 text-xs font-medium text-critical"><XCircle className="size-5 fill-critical text-card" /> {t('home.methode.incorrect')}</p>
              <p className="mt-2 rounded-lg bg-success-soft px-2.5 py-2 text-xs">{t('home.methode.correctIs')}<br /><b lang="fr" dir="ltr">Liberté, Égalité, Fraternité</b></p>
              <p className="mt-2 text-xs text-muted-foreground">{t('home.methode.explanation')}</p>
            </MethodCard>
            <MethodCard index={3} title={t('home.methode.simuler')} icon={BarChart3} iconCls="text-primary-interactive" text={t('home.methode.simulerText')}>
              <p className="text-sm font-semibold">{t('home.methode.exam')}</p>
              <div className="relative mx-auto mt-2 size-24" role="img" aria-label={t('home.methode.exampleScore')}>
                <svg viewBox="0 0 96 96" className="score-ring size-full"><circle cx="48" cy="48" r="40" fill="none" strokeWidth="10" className="score-ring-track" /><circle cx="48" cy="48" r="40" fill="none" strokeWidth="10" strokeLinecap="round" className="score-ring-value" /></svg>
                <span dir="ltr" className="absolute inset-0 grid place-items-center text-center leading-tight"><span><span className="block text-xs">28 / 40</span><span className="text-lg font-extrabold">70%</span></span></span>
              </div>
              <p className="mt-1 text-center text-[11px] text-muted-foreground">{t('home.methode.exampleScore')}</p>
              <p className="mt-2 flex items-center gap-2 text-xs"><Clock className="size-4 text-critical" /> {t('home.methode.minutes')}</p>
              <p className="mt-1 flex items-center gap-2 text-xs"><FileText className="size-4 text-critical" /> {t('home.methode.conditions')}</p>
              <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                <Link to="/app/examen-blanc">{t('home.methode.tryExam')}<ArrowRight className="rtl-flip" /></Link>
              </Button>
            </MethodCard>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">{t('home.methode.example')}</p>
        </div>
      </section></Reveal>

      {/* Pensé pour votre parcours */}
      <Reveal><section className="container-page py-14">
        <SectionHeading title={t('home.parcours.title')} subtitle={t('home.parcours.subtitle')} />
        <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-3">
          <div className="flex h-full flex-col rounded-2xl bg-secondary-soft p-5 card-hover">
            <div className="flex gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-card"><Users className="size-6 fill-secondary text-secondary" /></span>
              <div>
                <h3 className="text-lg font-bold">{t('home.parcours.nat.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('home.parcours.nat.text')}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {[
                { id: "naturalisation", t: t('home.parcours.nat.title'), icon: Users, c: "text-secondary" },
                { id: "resident", t: t('home.parcours.res.title'), icon: IdCard, c: "text-primary-interactive" },
                { id: "sejour", t: t('home.parcours.sej.title'), icon: FileText, c: "text-success" },
              ].map((p) => (
                <Link key={p.id} to="/parcours" hash={p.id} className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 text-sm font-medium shadow-soft hover:text-primary">
                  <p.icon className={`size-5 fill-current ${p.c}`} /> <span className="flex-1">{p.t}</span> <ChevronRight className="size-4 text-primary-interactive rtl-flip" />
                </Link>
              ))}
            </div>
          </div>
          <div className="flex h-full flex-col rounded-2xl bg-accent p-5 card-hover">
            <div className="flex gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-card"><BookOpen className="size-6 fill-primary-interactive text-primary-interactive" /></span>
              <div>
                <h3 className="text-lg font-bold">Des explications accessibles</h3>
                <p className="text-sm text-muted-foreground">Des leçons claires en français, avec un soutien multilingue pour faciliter votre apprentissage.</p>
              </div>
            </div>
            <div className="mt-3 flex flex-1 items-center gap-2">
              <img src={globeImg} alt="" aria-hidden loading="lazy" className="w-36" />
              <div className="flex flex-col items-start gap-1.5 text-sm">
                {["Français", "English", "العربية", "Español", "中文", "Русский"].map((l) => <span key={l} className="rounded-full bg-card px-3 py-1 shadow-soft">{l}</span>)}
              </div>
            </div>
          </div>
          <div className="flex h-full flex-col rounded-2xl bg-success-surface p-5 card-hover">
            <div className="flex gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-card"><Laptop className="size-6 text-success" /></span>
              <div>
                <h3 className="text-lg font-bold">Vos progrès au même endroit</h3>
                <p className="text-sm text-muted-foreground">Retrouvez vos leçons, vos résultats et vos favoris sur tous vos appareils. Avancez à votre rythme, où que vous soyez.</p>
              </div>
            </div>
            <img src={devicesImg} alt="ExaCiv sur ordinateur, tablette et téléphone" loading="lazy" className="mt-auto w-full pt-3" />
          </div>
        </div>
      </section></Reveal>

      {/* Un petit pas chaque jour */}
      <Reveal><section data-home-block="steps" className="home-daily mx-3 rounded-[2rem] bg-accent/60 py-10">
        <div className="container-page grid items-center gap-8 md:grid-cols-[260px_1fr]">
          <CiviTip />
          <div>
            <h2 className="text-center text-3xl font-bold md:text-4xl">{t('home.steps.title')}</h2>
            <p className="mt-2 text-center text-lg text-muted-foreground">{t('home.steps.subtitle')}</p>
            <ol className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
              {[
                { icon: BookOpen, c: "fill-primary-interactive text-primary-interactive", t: t('home.steps.s1'), d: t('home.steps.s1d'), to: "/methode" },
                { icon: Target, c: "text-secondary", t: t('home.steps.s2'), d: t('home.steps.s2d'), to: "/test-gratuit" },
                { icon: BarChart3, c: "text-success", t: t('home.steps.s3'), d: t('home.steps.s3d'), to: "/methode" },
                { icon: Award, c: "fill-secondary text-secondary", t: t('home.steps.s4'), d: t('home.steps.s4d'), to: "/tarifs" },
              ].map((s, i) => (
                <li key={s.t} style={{ transitionDelay: `${i * 70}ms` }} className="reveal-child relative text-center">
                  <Link to={s.to} className="group block">
                    <span className="mx-auto grid size-16 place-items-center rounded-full bg-card shadow-soft transition group-hover:-translate-y-0.5"><s.icon className={`size-8 ${s.c}`} /></span>
                    <p className="mt-2 font-bold">{s.t}</p>
                    <p className="text-sm text-muted-foreground">{s.d}</p>
                  </Link>
                  {i < 3 && <ArrowRight className="step-arrow absolute -right-5 top-6 hidden size-5 text-subtle rtl-flip lg:block" />}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section></Reveal>

      {/* Pricing */}
      <Reveal><section className="container-page py-12">
        <SectionHeading title={t('home.pricing.title')} subtitle={t('home.pricing.subtitle')} />
        <div className="mt-6"><PricingCards /></div>
      </section></Reveal>

      {/* FAQ */}
      <Reveal><section data-home-block="faq" className="home-faq container-page pb-12">
        <SectionHeading title={t('home.faq.title')} subtitle={t('home.faq.subtitle')} />
        <div className="mt-6"><HomeFaq /></div>
      </section></Reveal>

      <Reveal><FinalCta /></Reveal>
    </div>
  );
}

function HomeFaq() {
  const t = useT();
  const items = [
    { q: t('home.faq.q1'), a: t('home.faq.a1') },
    { q: t('home.faq.q2'), a: t('home.faq.a2') },
    { q: t('home.faq.q3'), a: t('home.faq.a3') },
    { q: t('home.faq.q4'), a: t('home.faq.a4') },
  ];
  return <FaqList items={items} twoCol />;
}

function PracticePreview() {
  const t = useT();
  const [choice, setChoice] = useState<number | null>(null);
  const [validated, setValidated] = useState(false);
  return (
    <div>
      <p className="text-sm font-semibold">{t('home.methode.quizQuestion')}</p>
      {QUIZ_OPTIONS.map((o, i) => {
        const state = validated ? (i === 0 ? 'border-success bg-success-soft' : choice === i ? 'border-critical bg-critical-soft' : '') : choice === i ? 'border-primary-interactive bg-accent' : '';
        return (
          <button
            key={o}
            lang="fr" dir="ltr"
            type="button"
            disabled={validated}
            aria-pressed={choice === i}
            onClick={() => setChoice(i)}
            className={`mt-1.5 flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs transition ${state}`}
          >
            {validated && i === 0 ? <CheckCircle2 className="size-4 shrink-0 fill-success text-card" /> : validated && choice === i ? <XCircle className="size-4 shrink-0 fill-critical text-card" /> : <span className="size-4 shrink-0 rounded-full border-2" />}{o}
          </button>
        );
      })}
      {validated && (
        <p className={`mt-2 rounded-lg px-2.5 py-2 text-xs ${choice === 0 ? 'bg-success-soft' : 'bg-critical-soft'}`} role="status">
          <b>{choice === 0 ? t('home.methode.wellDone') : t('home.methode.incorrect')}</b> {t('home.methode.explanation')}
        </p>
      )}
      {validated ? (
        <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => { setChoice(null); setValidated(false); }}>
          <RotateCcw />{t('home.methode.retry')}
        </Button>
      ) : (
        <Button variant="interactive" size="sm" className="mt-2 w-full" disabled={choice === null} onClick={() => setValidated(true)}>
          {t('home.methode.validate')}
        </Button>
      )}
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

function MethodCard({ title, icon: Icon, iconCls, text, children, index = 0 }: { title: string; icon: typeof Landmark; iconCls: string; text: string; children: React.ReactNode; index?: number }) {
  return (
    <div style={{ transitionDelay: `${index * 70}ms` }} className="home-method-card reveal-child flex h-full flex-col rounded-2xl border bg-card p-5 text-center shadow-soft card-hover">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-muted card-icon"><Icon className={`size-7 ${iconCls}`} /></span>
      <h3 className="mt-3 text-xl font-bold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      <div className="home-method-preview mt-4 flex-1 rounded-xl border bg-card p-3 text-start shadow-soft">{children}</div>
    </div>
  );
}

function CiviTip() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative mx-auto w-56">
      <button type="button" aria-expanded={open} aria-label={t('home.steps.civiOpen')} onClick={() => setOpen(!open)} className="block w-full cursor-pointer">
        <img src={civi} alt="" aria-hidden loading="lazy" width={430} height={497} className="civi-float w-full" />
      </button>
      {open && (
        <div className="civi-tip" role="status">
          <p>{t('home.steps.civiTip')}</p>
          <button type="button" aria-label={t('common.close')} onClick={() => setOpen(false)}><X className="size-4" /></button>
        </div>
      )}
    </div>
  );
}
