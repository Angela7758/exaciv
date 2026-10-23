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
      <section className="container-page home-exam-strip relative z-10 mt-6">
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
        <div className="home-pathway-cards mt-8 grid items-stretch gap-4 md:grid-cols-3">
          {parcoursCards.map((p, i) => (
            <article key={p.id} style={{ transitionDelay: `${i * 70}ms` }} className={`reveal-child home-pathway-card relative flex h-full min-h-48 overflow-hidden rounded-2xl p-6 card-hover ${p.card}`}>
              <img src={p.art} alt="" aria-hidden loading="lazy" className="pointer-events-none absolute bottom-0 right-0 h-[75%] w-auto rtl-mirror-off" />
              <div className="relative flex flex-1 flex-col items-start">
                <h3 className={`home-pathway-title font-bold ${p.title_cls}`}>{p.title}</h3>
                <p className="mt-2 max-w-[62%] text-muted-foreground">{p.text}</p>
                <Link to="/parcours" hash={p.id} className="home-more-link mt-auto">{t('home.parcours.more')}<ArrowRight className="size-4 rtl-flip" /></Link>
              </div>
            </article>
          ))}
        </div>
      </section></Reveal>

      {/* Méthode */}
      <Reveal><section data-home-block="method" className="home-method mt-12 rounded-t-[2.5rem] bg-accent/40 py-14">
        <div className="container-page">
          <SectionHeading title={t('home.methode.title')} subtitle={t('home.methode.subtitle')} />
          <p className="home-method-examples">{t('home.methode.examples')}</p>
          <div className="home-method-grid">
            <MethodCard index={0} num="01" tone="orange" icon={Lightbulb} title={t('home.methode.comprendre')} text={t('home.methode.comprendreText')} action={<Button asChild variant="interactive"><Link to="/methode">{t('home.methode.discoverLesson')}<ArrowRight className="rtl-flip" /></Link></Button>}>
              <Link to="/methode" className="home-method-lesson" aria-label={t('home.methode.discoverLesson')}><p className="font-semibold">{t('home.methode.lessonTitle')}</p><img src={lessonImg} alt="" loading="lazy" /><div><div className="home-method-progress" aria-hidden><span /></div><p lang="fr" className="text-sm text-muted-foreground">La laïcité garantit la liberté de conscience.</p></div></Link>
            </MethodCard>
            <MethodCard index={1} num="02" tone="blue" icon={Target} title={t('home.methode.entrainer')} text={t('home.methode.entrainerText')}>
              <PracticePreview />
            </MethodCard>
            <MethodCard index={2} num="03" tone="green" icon={FileText} title={t('home.methode.corriger')} text={t('home.methode.corrigerText')}>
              <CorrectionPreview />
            </MethodCard>
            <MethodCard index={3} num="04" tone="blue" icon={BarChart3} title={t('home.methode.simuler')} text={t('home.methode.simulerText')} action={<Button asChild variant="outline"><Link to="/examen" search={{ demarche: 'naturalisation' }}>{t('home.methode.discoverExam')}<ArrowRight className="rtl-flip" /></Link></Button>}>
              <div className="home-method-exam">
                <p className="text-sm font-semibold">{t('home.methode.exam')}</p>
                <div className="home-score-ring" role="img" aria-label={`${t('home.methode.ringLabel')} : 28/40, 70%`}>
                  <svg viewBox="0 0 120 120" aria-hidden="true"><circle className="ring-track" cx="60" cy="60" r="48" /><circle className="ring-value" cx="60" cy="60" r="48" pathLength="100" strokeDasharray="70 100" /></svg>
                  <div><b>28 / 40</b><span>70%</span></div>
                </div>
                <p className="mt-2 flex items-center gap-2 text-xs"><Clock className="size-4 text-secondary" /> {t('home.methode.examDuration')}</p>
                <p className="mt-1.5 flex items-center gap-2 text-xs"><FileText className="size-4 text-primary-interactive" /> {t('home.methode.conditions')}</p>
              </div>
            </MethodCard>
          </div>
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
                <h3 className="text-lg font-bold">{t('home.value.lessons.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('home.value.lessons.text')}</p>
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
                <h3 className="text-lg font-bold">{t('home.value.progress.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('home.value.progress.text')}</p>
              </div>
            </div>
            <img src={devicesImg} alt={t('home.value.devicesAlt')} loading="lazy" className="mt-auto w-full pt-3" />
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
    { q: t('home.faq.q4'), a: t('home.faq.a4') },
    { q: t('home.faq.q3'), a: t('home.faq.a3') },
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

function MethodCard({ title, tone, text, children, action, index = 0, icon: Icon }: { title: string; tone: 'orange' | 'blue' | 'green'; text: string; children: React.ReactNode; action?: React.ReactNode; index?: number; num: string; icon: typeof BookOpen }) {
  return (
    <article style={{ transitionDelay: `${index * 70}ms` }} className={`home-method-card method-tone-${tone} reveal-child card-hover`}>
      <div className="home-method-head home-method-head-center"><span className="home-method-icon" aria-hidden><Icon /></span><h3>{title}</h3></div>
      <p className="home-method-text">{text}</p>
      <div className="home-method-preview">{children}</div>
      {action && <div className="home-method-action">{action}</div>}
    </article>
  );
}

function CorrectionPreview() {
  const t = useT();
  const [open, setOpen] = useState(true);
  return (
    <div>
      <p className="text-sm font-semibold">{t('home.methode.quizQuestion')}</p>
      <p className="mt-2 flex items-center gap-2 rounded-lg bg-critical-soft px-3 py-2 text-sm font-semibold text-critical"><XCircle className="size-4 shrink-0 fill-critical text-card" />{t('home.methode.incorrectBadge')}</p>
      <p className="mt-2 flex items-start gap-2 rounded-lg bg-success-soft px-3 py-2 text-sm"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /><span>{t('home.methode.correctIs')} <b lang="fr" dir="ltr">Liberté, Égalité, Fraternité</b></span></p>
      {open && <p className="mt-2 text-sm text-muted-foreground" role="status">{t('home.methode.explanation')}</p>}
      <div className="home-method-action"><Button variant="outline" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? t('home.methode.hideCorrection') : t('home.methode.showCorrection')}<ArrowRight className="rtl-flip" /></Button></div>
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
