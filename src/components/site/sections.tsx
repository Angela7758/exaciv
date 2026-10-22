import { Link } from "@tanstack/react-router";
import { Check, ExternalLink, Info, Play } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PLANS, PRICING_NOTE } from "@/config/pricing";
import { FAQ } from "@/config/content";
import civi from "@/assets/civi.png";

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
  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.id} className={`flex flex-col rounded-3xl border bg-card p-7 shadow-soft ${p.variant === "cta" ? "ring-2 ring-secondary/60" : ""}`}>
            <h3 className="text-xl font-bold">{p.name}</h3>
            <p className="mt-2">
              <span className="text-4xl font-extrabold">{p.price}</span>
              {p.period && <span className="ml-1 text-muted-foreground">{p.period}</span>}
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary-interactive" /> {f}
                </li>
              ))}
            </ul>
            <Button asChild variant={p.variant} size="lg" className="mt-7 w-full">
              {p.id === "decouverte" ? (
                <Link to="/test-gratuit">{p.cta}</Link>
              ) : (
                <Link to="/tarifs/$plan" params={{ plan: p.id }}>{p.cta}</Link>
              )}
            </Button>
          </div>
        ))}
      </div>
      <p className="mt-5 text-center text-sm text-muted-foreground">{PRICING_NOTE}</p>
    </div>
  );
}

export function FaqList({ limit }: { limit?: number }) {
  const items = limit ? FAQ.slice(0, limit) : FAQ;
  return (
    <Accordion type="single" collapsible className="mx-auto max-w-3xl space-y-3">
      {items.map((f, i) => (
        <AccordionItem key={f.q} value={`f${i}`} className="rounded-2xl border bg-card px-5">
          <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
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
      ))}
    </Accordion>
  );
}

export function FinalCta() {
  return (
    <section className="container-page py-16">
      <div className="relative overflow-hidden rounded-3xl bg-cta-band px-8 py-12 text-primary-foreground md:px-14">
        <div className="relative z-10 max-w-xl">
          <h2 className="text-3xl font-bold md:text-4xl">Prêt à commencer ?</h2>
          <p className="mt-3 text-lg opacity-90">Faites un premier test et découvrez vos points à renforcer.</p>
          <Button asChild variant="cta" size="xl" className="mt-7">
            <Link to="/test-gratuit"><Play className="fill-current" /> Faire un test gratuit</Link>
          </Button>
        </div>
        <img src={civi} alt="" aria-hidden loading="lazy" width={1024} height={1024} className="absolute -bottom-6 right-4 hidden w-56 md:block" />
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
