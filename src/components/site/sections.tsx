import { Link } from "@tanstack/react-router";
import { BarChart3, BookOpen, CheckCircle2, Crown, ExternalLink, Info, Play } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PLANS, PRICING_NOTE } from "@/config/pricing";
import { useT } from "@/lib/i18n";
import { FAQ } from "@/config/content";
import civi from "@/assets/civi.png";
import ctaBg from "@/assets/hero-paris.jpg";

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <section className="container-page pb-6 pt-14 md:pt-20">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-primary-interactive">{eyebrow}</p>}
      <h1 className="mt-2 max-w-3xl text-4xl font-bold md:text-5xl">{title}</h1>
      {children && <div className="mt-4 max-w-2xl text-lg text-muted-foreground">{children}</div>}
    </section>
  );
}

export function PricingCards() {
  const look = {
    decouverte: { card: "bg-card", icon: BookOpen, iconCls: "bg-accent text-primary-interactive" },
    essentiel: { card: "bg-accent/50 border-secondary", icon: BarChart3, iconCls: "bg-accent text-primary-interactive" },
    pass: { card: "bg-success-surface", icon: Crown, iconCls: "bg-success-soft text-success" },
  } as const;
  return (
    <div>
      <div className="grid items-stretch gap-4 pt-3 md:grid-cols-3">
        {PLANS.map((p, pi) => {
          const l = look[p.id];
          return (
            <div key={p.id} style={{ transitionDelay: `${pi * 70}ms` }} className={`reveal-child card-hover relative flex h-full flex-col rounded-2xl border p-6 shadow-soft ${l.card}`}>
              {p.id === "essentiel" && <span className="pricing-popular-home">Le plus choisi</span>}
              <div className="flex items-start gap-4">
                <span className={`grid size-14 shrink-0 place-items-center rounded-full ${l.iconCls}`}><l.icon className={`size-7 ${p.id === "essentiel" ? "" : "fill-current"}`} strokeWidth={p.id === "essentiel" ? 3 : 2} /></span>
                <div>
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <p className="mt-1">
                    <span className="text-3xl font-extrabold">{p.price}</span>
                    {p.period && <span className="ml-1 text-lg">{p.period}</span>}
                  </p>
                </div>
              </div>
              <ul className="mt-4 flex-1 space-y-1.5 pl-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="size-4 shrink-0 fill-primary-interactive text-card" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant={p.variant} size="lg" className="mt-6 w-full text-base">
                {p.id === "decouverte" ? (
                  <Link to="/test-gratuit">{p.cta}</Link>
                ) : (
                  <Link to="/tarifs/$plan" params={{ plan: p.id }}>{p.cta}</Link>
                )}
              </Button>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">{PRICING_NOTE}</p>
    </div>
  );
}

type FaqEntry={q:string;a:string;link?:(typeof FAQ)[number]['link']};
function FaqItem({ f, i }: { f: FaqEntry; i: number }) {
  return (
    <AccordionItem value={`f${i}`} style={{ transitionDelay: `${i * 70}ms` }} className="reveal-child rounded-xl border bg-card px-5 shadow-soft">
      <AccordionTrigger data-slot="accordion-trigger" className="text-start text-sm font-semibold [&>svg]:text-primary-interactive">{f.q}</AccordionTrigger>
      <AccordionContent data-slot="accordion-content" className="rounded-lg bg-muted p-3 text-muted-foreground">
        <p>{f.a}</p>
        {f.link &&
          (f.link.external ? (
            <a href={f.link.to} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 font-medium text-primary hover:underline">
              {f.link.label} <ExternalLink className="size-3.5" />
            </a>
          ) : (
            <Link to={f.link.to} className="mt-2 inline-block font-medium text-primary hover:underline">{f.link.label} →</Link>
          ))}
      </AccordionContent>
    </AccordionItem>
  );
}

export function FaqList({ limit, twoCol, indices, initiallyClosed=false, items:custom }: { limit?: number; twoCol?: boolean; indices?:number[]; initiallyClosed?:boolean; items?:FaqEntry[] }) {
  const items: FaqEntry[] = custom ?? (indices ? indices.map(i=>FAQ[i]).filter((f):f is (typeof FAQ)[number]=>Boolean(f)) : limit ? FAQ.slice(0, limit) : FAQ);
  if (twoCol) {
    const left = items.filter((_, i) => i % 2 === 0);
    const right = items.filter((_, i) => i % 2 === 1);
    return (
      <Accordion type="single" collapsible {...(!initiallyClosed?{defaultValue:"f0"}:{})} className="grid items-start gap-3 md:grid-cols-2">
        <div className="space-y-3">{left.map((f) => <FaqItem key={f.q} f={f} i={items.indexOf(f)} />)}</div>
        <div className="space-y-3">{right.map((f) => <FaqItem key={f.q} f={f} i={items.indexOf(f)} />)}</div>
      </Accordion>
    );
  }
  return (
    <Accordion type="single" collapsible className="mx-auto max-w-3xl space-y-3">
      {items.map((f, i) => <FaqItem key={f.q} f={f} i={i} />)}
    </Accordion>
  );
}

export function FinalCta() {
  const t = useT();
  return (
    <section data-home-block="cta" className="home-final-cta relative overflow-hidden">
      <img src={ctaBg} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-cta-band opacity-80" />
      <div className="home-final-layout container-page relative flex flex-col items-center gap-6 py-12 text-center text-primary-foreground md:flex-row md:items-center md:gap-10 md:text-start">
        <div className="home-final-copy order-1 min-w-0">
          <h2 className="text-4xl font-bold md:text-5xl">{t('home.cta.title')}</h2>
          <p className="mt-2 text-lg opacity-95">{t('home.cta.text')}</p>
        </div>
        <Button data-slot="button" asChild variant="cta" size="xl" className="order-2 shrink-0">
          <Link to="/test-gratuit"><Play className="fill-current" /> {t('home.cta.button')}</Link>
        </Button>
        <img src={civi} alt="" aria-hidden loading="lazy" width={430} height={497} className="order-3 w-32 shrink-0 self-end md:w-48" />
      </div>
    </section>
  );
}

export function IndependenceNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border bg-accent/60 p-4 text-sm text-foreground/80">
      <Info className="mt-0.5 size-4 shrink-0 text-primary" />
      <p>
        ExaCiv est une plateforme indépendante de préparation. Elle n’est ni un site gouvernemental ni un centre d’examen.
        Les règles de l’examen et l’inscription relèvent des{" "}
        <a href="https://www.service-public.fr/" target="_blank" rel="noreferrer" className="font-medium text-primary underline">sources officielles</a>.
      </p>
    </div>
  );
}
