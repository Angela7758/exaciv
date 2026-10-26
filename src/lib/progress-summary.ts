import { officialTopic } from "@/config/official-programme";
import { sessionKindLabel } from "./learner-labels";
import { recordedAnswer, type LearningSession } from "./sessions";

type Session = Pick<
  LearningSession,
  "id" | "kind" | "total" | "completed_at" | "questions" | "answers"
>;

/** Repeated answers are attempts, never a claim that a topic is mastered. */
export function topicPracticeSummary(sessions: readonly Session[]) {
  const result: Record<string, { answered: number; correct: number }> = {};
  for (const s of sessions) {
    if (!s.completed_at || s.kind === "exam") continue;
    s.questions.forEach((q, i) => {
      const answer = recordedAnswer(s, i);
      if (answer === undefined) return;
      const topic = officialTopic(q.exam_theme ?? q.theme);
      const row = result[topic] ?? { answered: 0, correct: 0 };
      row.answered++;
      if (answer === q.answer) row.correct++;
      result[topic] = row;
    });
  }
  return result;
}

export function recentLearningActivity(
  completions: readonly { lesson_id: string; completed_at: string }[],
  sessions: readonly Session[],
) {
  return [
    ...completions.map((c) => ({
      id: `lesson:${c.lesson_id}:${c.completed_at}`,
      ref: c.lesson_id,
      kind: "lesson",
      label: "Leçon terminée",
      date: c.completed_at,
      answered: 0,
    })),
    ...sessions
      .filter(
        (s) => s.completed_at && s.questions.some((_, i) => recordedAnswer(s, i) !== undefined),
      )
      .map((s) => ({
        id: `session:${s.id}`,
        ref: s.id,
        kind: s.kind,
        label: sessionKindLabel(s),
        date: s.completed_at!,
        answered: s.questions.filter((_, i) => recordedAnswer(s, i) !== undefined).length,
      })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);
}
