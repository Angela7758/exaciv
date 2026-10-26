import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BookOpen, FileText, Flame, Star, Target, ArrowRight } from "lucide-react";
import { SafeImage } from "@/components/site/SafeImage";
import { useContentT } from "@/lib/i18n/content";
import { useUiT } from "@/lib/i18n/internal";
import { useI18n } from "@/lib/i18n";
import { latestCompleteExam } from "@/lib/exam-summary";
import { sessionsOptions } from "@/lib/session.queries";
import { catalogueOptions, learningOptions } from "@/lib/learning.queries";
import { applicableLessons, completedApplicable } from "@/lib/catalogue-coverage";
import { earnedXp, streakDays, percentage, TOPICS } from "@/config/learning";
import { TOPIC_ARTWORK } from "@/config/topic-artwork";
import { plural } from "@/lib/learner-labels";
import { recordedAnswer } from "@/lib/sessions";
import { ActivityAgenda } from "./LearningAgenda";
import { ProgressBar } from "./primitives";
import { topicPracticeSummary, recentLearningActivity } from "@/lib/progress-summary";
import civi from "@/assets/civi.png";

export function ProgressAnalytics({ demo = false }: { demo?: boolean }) {
  const ui = useUiT();
  const ct = useContentT();
  const { locale } = useI18n();
  const { data: c } = useSuspenseQuery(catalogueOptions);
  const { data: d } = useSuspenseQuery(learningOptions);
  const { data: sessions } = useSuspenseQuery(sessionsOptions);
  const lessons = applicableLessons(c.lessons, d.profile.parcours);
  const completions = d.completions.filter((x) => lessons.some((l) => l.id === x.lesson_id));
  const done = completedApplicable(lessons, completions),
    total = lessons.length;
  const exam = latestCompleteExam(sessions.filter((s) => s.parcours === d.profile.parcours));
  const days = streakDays(d.completions.map((x) => x.completed_at));
  const goal = d.profile.goal_date
    ? new Date(d.profile.goal_date + "T12:00:00").toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ui("À définir");
  const practice = topicPracticeSummary(d.sessions),
    events = recentLearningActivity(completions, d.sessions);
  const label =
    d.profile.parcours === "resident"
      ? "Carte de résident"
      : d.profile.parcours === "sejour"
        ? "Carte de séjour pluriannuelle"
        : "Naturalisation";
  const examCorrect = exam
    ? exam.questions.filter((q, i) => recordedAnswer(exam, i) === q.answer).length
    : 0;
  return (
    <div className="approved-pages progress-v2">
      <header className="progress-heading">
        <div>
          <h1>{ui("Votre progression")}</h1>
          <p className="approved-subtitle">
            {ui("Suivez vos apprentissages et organisez vos révisions.")}
          </p>
        </div>
        {demo && <span className="progress-badge">{ui("Aperçu avec vos données réelles")}</span>}
      </header>
      <section className="progress-overview" aria-label={ui("Votre progression")}>
        <div className="progress-overview-main">
          <h2>
            <BookOpen />
            {ui("Leçons publiées terminées")}
          </h2>
          <div className="progress-total">
            <strong>
              {done} / {total}
            </strong>
            <b>{percentage(done, total)} %</b>
          </div>
          <ProgressBar value={percentage(done, total)} />
          <p>{ui("Ce taux mesure les leçons terminées, pas votre préparation à l’examen.")}</p>
          <div className="progress-rewards">
            <span>
              <Flame />
              {days} {ui(plural(days, "jour", "jours"))} {ui("de suite")}
            </span>
            <span>
              <Star />
              {earnedXp(d.completions)} XP
            </span>
          </div>
        </div>
        <div className="progress-companion">
          <SafeImage src={civi} alt={ui("CIVI vous encourage")} />
          <p>{ui("Un petit pas chaque jour pour avancer avec confiance.")}</p>
        </div>
        <div className="progress-context">
          <section>
            <FileText />
            <div>
              <h2>{ui("Dernier examen blanc")}</h2>
              <p>{exam ? `${examCorrect} / ${exam.total}` : ui("Pas encore évalué")}</p>
              {exam ? (
                <Link
                  to="/app/examen-blanc/resultats/$id"
                  params={{ id: exam.id }}
                  search={{ review: false }}
                >
                  {ui("Voir le détail")}
                  <ArrowRight />
                </Link>
              ) : (
                <Link to="/app/examen-blanc">
                  {ui("Examen blanc")}
                  <ArrowRight />
                </Link>
              )}
            </div>
          </section>
          <section>
            <Target />
            <div>
              <h2>
                {ui("Votre objectif")} : {ui(label)}
              </h2>
              <p>
                {ui("Date prévue")} : {goal}
              </p>
              <Link to="/app/mon-compte">
                {ui("Modifier mon objectif")}
                <ArrowRight />
              </Link>
            </div>
          </section>
        </div>
      </section>
      <section className="progress-themes">
        <h2>{ui("Progression par thème")}</h2>
        <p>{ui("La lecture et les résultats aux exercices sont suivis séparément.")}</p>
        <p>
          {ui(
            "Les réponses répétées sont comptées comme des tentatives, pas comme des questions maîtrisées.",
          )}
        </p>
        <div className="progress-columns" aria-hidden="true">
          <span>{ui("Thème")}</span>
          <span>{ui("Leçons terminées")}</span>
          <span>{ui("Questions enregistrées")}</span>
          <span />
        </div>
        {TOPICS.map((topic) => {
          const rows = lessons.filter((l) => l.topic === topic.title);
          const count = { done: completedApplicable(rows, completions), total: rows.length };
          const score = practice[topic.title];
          return (
            <article className="progress-theme-row" key={topic.title}>
              <div className="progress-theme-name">
                <SafeImage src={TOPIC_ARTWORK[topic.art].src} alt="" loading="lazy" />
                <div>
                  <h3>{ct(topic.title)}</h3>
                  <p>{ct(topic.description)}</p>
                </div>
              </div>
              <div className="progress-theme-reading">
                <small>{ui("Leçons terminées")}</small>
                {count.total ? (
                  <>
                    <b>
                      {count.done} / {count.total}{" "}
                      <span>{percentage(count.done, count.total)} %</span>
                    </b>
                    <ProgressBar value={percentage(count.done, count.total)} />
                  </>
                ) : (
                  <span className="progress-badge">{ui("Bientôt disponible")}</span>
                )}
              </div>
              <div className="progress-theme-practice">
                <small>{ui("Questions enregistrées")}</small>
                {score?.answered ? (
                  <>
                    <b>
                      {score.correct} / {score.answered}
                    </b>
                    <span>{ui("bonnes réponses")}</span>
                  </>
                ) : (
                  <span>{ui("Pas encore évalué")}</span>
                )}
              </div>
              <div className="progress-theme-action">
                {count.total > 0 && (
                  <Link
                    to="/app/lecons"
                    search={{ theme: topic.title, q: "", state: "all" }}
                    aria-label={`${ui(count.done ? "Continuer" : "Commencer")} · ${ct(topic.title)}`}
                  >
                    {ui(count.done ? "Continuer" : "Commencer")}
                    <ArrowRight />
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </section>
      <div className="progress-bottom">
        <section className="progress-recent">
          <h2>{ui("Activité récente")}</h2>
          {events.length ? (
            <ol>
              {events.map((e) => (
                <li key={e.id}>
                  <BookOpen aria-hidden="true" />
                  <div>
                    <time dateTime={e.date}>
                      {new Date(e.date).toLocaleDateString(locale, {
                        day: "numeric",
                        month: "long",
                      })}
                    </time>
                    <b>{ui(e.label)}</b>
                    <p>
                      {e.kind === "lesson"
                        ? ct(lessons.find((l) => l.id === e.ref)?.title ?? "Leçon terminée")
                        : ui("{0} questions enregistrées", e.answered)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p>{ui("Votre première leçon vous attend.")}</p>
          )}
          <Link to="/app/parcours">
            {ui("Continuer mon parcours")}
            <ArrowRight />
          </Link>
        </section>
        <ActivityAgenda compact />
      </div>
    </div>
  );
}
