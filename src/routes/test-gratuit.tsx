import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, ListChecks, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ELIGIBILITY_NOTE, PARCOURS, type ParcoursId } from "@/config/content";
import { FREE_TEST, scoreTest } from "@/config/free-test";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/test-gratuit")({
  head: () => seo("Test gratuit", "Faites un test de découverte gratuit, sans compte, et découvrez vos points à renforcer."),
  component: FreeTest,
});

type Step = "choose" | "intro" | "quiz" | "review" | "result";

function FreeTest() {
  const [step, setStep] = useState<Step>("choose");
  const [parcours, setParcours] = useState<ParcoursId | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => FREE_TEST.map(() => null));
  const q = FREE_TEST[idx]!;
  const reset = () => { setAnswers(FREE_TEST.map(() => null)); setIdx(0); setStep("choose"); };

  return (
    <section className="container-page max-w-3xl py-14">
      {step === "choose" && (
        <div>
          <h1 className="text-4xl font-bold">Test de découverte gratuit</h1>
          <p className="mt-3 text-lg text-muted-foreground">Choisissez d’abord votre démarche.</p>
          <div className="mt-8 grid gap-3">
            {PARCOURS.map((p) => (
              <button key={p.id} onClick={() => setParcours(p.id)} aria-pressed={parcours === p.id}
                className={`rounded-2xl border-2 bg-card p-5 text-left transition hover:border-primary/50 ${parcours === p.id ? "border-primary-interactive bg-accent" : ""}`}>
                <p className="font-bold">{p.title}</p>
                <p className="text-sm text-muted-foreground">{p.short}</p>
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{ELIGIBILITY_NOTE}</p>
          <Button variant="cta" size="lg" className="mt-6" disabled={!parcours} onClick={() => setStep("intro")}>Continuer <ArrowRight /></Button>
        </div>
      )}

      {step === "intro" && (
        <div className="rounded-3xl border bg-card p-8 shadow-soft">
          <h1 className="text-3xl font-bold">Avant de commencer</h1>
          <ul className="mt-6 space-y-3">
            <li className="flex gap-3"><ListChecks className="text-primary" /> {FREE_TEST.length} questions d’entraînement</li>
            <li className="flex gap-3"><Clock className="text-primary" /> Environ 5 minutes, sans chronomètre</li>
            <li className="flex gap-3"><CheckCircle2 className="text-primary" /> Un résultat par thème pour savoir quoi réviser</li>
          </ul>
          <p className="mt-6 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            Ce test court est un échantillon de questions rédigées par ExaCiv. Ce ne sont pas des questions officielles et le résultat n’a pas de valeur officielle.
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="ghost" onClick={() => setStep("choose")}><ArrowLeft /> Retour</Button>
            <Button variant="cta" size="lg" onClick={() => setStep("quiz")}>Commencer le test</Button>
          </div>
        </div>
      )}

      {step === "quiz" && (
        <div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{q.theme}</span><span>Question {idx + 1} / {FREE_TEST.length}</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary-interactive transition-all" style={{ width: `${((idx + 1) / FREE_TEST.length) * 100}%` }} /></div>
          <div className="mt-8 rounded-3xl border bg-card p-7 shadow-soft">
            <h2 className="text-2xl font-bold">{q.question}</h2>
            <div className="mt-6 grid gap-3" role="radiogroup">
              {q.options.map((o, i) => (
                <button key={o} role="radio" aria-checked={answers[idx] === i}
                  onClick={() => setAnswers((a) => a.map((v, j) => (j === idx ? i : v)))}
                  className={`rounded-xl border-2 px-4 py-3.5 text-left font-medium transition hover:border-primary/50 ${answers[idx] === i ? "border-primary-interactive bg-accent" : ""}`}>
                  {o}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="ghost" disabled={idx === 0} onClick={() => setIdx(idx - 1)}><ArrowLeft /> Précédente</Button>
            {idx < FREE_TEST.length - 1 ? (
              <Button onClick={() => setIdx(idx + 1)}>Suivante <ArrowRight /></Button>
            ) : (
              <Button variant="cta" onClick={() => setStep("review")}>Terminer</Button>
            )}
          </div>
        </div>
      )}

      {step === "review" && (
        <div>
          <h1 className="text-3xl font-bold">Vérifiez vos réponses</h1>
          <p className="mt-2 text-muted-foreground">Vous pouvez encore modifier une réponse avant de valider.</p>
          <ul className="mt-6 space-y-2">
            {FREE_TEST.map((qq, i) => (
              <li key={qq.id}>
                <button onClick={() => { setIdx(i); setStep("quiz"); }} className="flex w-full items-center justify-between rounded-xl border bg-card px-4 py-3 text-left hover:border-primary/50">
                  <span className="text-sm">{i + 1}. {qq.question}</span>
                  <span className={`text-sm font-medium ${answers[i] === null ? "text-critical" : "text-primary"}`}>{answers[i] === null ? "Sans réponse" : "Modifier"}</span>
                </button>
              </li>
            ))}
          </ul>
          <Button variant="cta" size="lg" className="mt-6" onClick={() => setStep("result")}>Valider mes réponses</Button>
        </div>
      )}

      {step === "result" && <Result answers={answers} onRestart={reset} parcours={parcours} />}
    </section>
  );
}

function Result({ answers, onRestart, parcours }: { answers: (number | null)[]; onRestart: () => void; parcours: ParcoursId | null }) {
  const r = scoreTest(answers);
  const weak = Object.entries(r.byTheme).filter(([, v]) => v.correct < v.total).map(([k]) => k);
  return (
    <div>
      <p className="text-sm font-semibold text-primary-interactive">{PARCOURS.find((p) => p.id === parcours)?.title}</p>
      <h1 className="text-3xl font-bold">Votre résultat</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Score" value={`${r.correct} / ${r.total}`} />
        <Stat label="Bonnes réponses" value={String(r.correct)} tone="text-success" />
        <Stat label="Erreurs" value={String(r.wrong)} tone="text-critical" />
      </div>
      <div className="mt-6 rounded-3xl border bg-card p-6">
        <h2 className="font-bold">Par thème</h2>
        <ul className="mt-4 space-y-3">
          {Object.entries(r.byTheme).map(([t, v]) => (
            <li key={t}>
              <div className="flex justify-between text-sm"><span>{t}</span><span>{v.correct}/{v.total}</span></div>
              <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-success" style={{ width: `${(v.correct / v.total) * 100}%` }} /></div>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-muted-foreground">
          {weak.length ? `À renforcer en priorité : ${weak.join(", ")}.` : "Très bon début ! Poursuivez avec les leçons complètes pour consolider vos acquis."}
        </p>
      </div>

      <h2 className="mt-10 text-xl font-bold">Corrections</h2>
      <ul className="mt-4 space-y-3">
        {FREE_TEST.map((q, i) => {
          const ok = answers[i] === q.answer;
          return (
            <li key={q.id} className="rounded-2xl border bg-card p-5">
              <p className="flex items-start gap-2 font-semibold">
                {ok ? <CheckCircle2 className="size-5 shrink-0 text-success" /> : <XCircle className="size-5 shrink-0 text-critical" />}{q.question}
              </p>
              {!ok && <p className="mt-2 text-sm">Votre réponse : {answers[i] === null ? "aucune" : q.options[answers[i]!]}</p>}
              <p className="mt-1 text-sm">Bonne réponse : <b>{q.options[q.answer]}</b></p>
              <p className="mt-2 text-sm text-muted-foreground">{q.explanation}</p>
              <p className="mt-1 text-xs text-subtle">Source : {q.source}</p>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 rounded-3xl bg-accent p-6">
        <h2 className="text-xl font-bold">Envie de continuer ?</h2>
        <p className="mt-1 text-muted-foreground">Créez un compte pour sauvegarder vos progrès. Ce résultat n’est pas enregistré sans votre accord.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="cta"><Link to="/inscription">Créer un compte</Link></Button>
          <Button asChild variant="outline"><Link to="/tarifs">Voir les offres</Link></Button>
          <Button variant="ghost" onClick={onRestart}><RotateCcw /> Recommencer</Button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone = "text-foreground" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-1 text-3xl font-extrabold ${tone}`}>{value}</p>
    </div>
  );
}
