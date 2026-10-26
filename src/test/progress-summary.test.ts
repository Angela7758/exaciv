import { describe, it, expect } from "vitest";
import { topicPracticeSummary, recentLearningActivity } from "@/lib/progress-summary";
const question = {
  id: "q",
  theme: "Institutions",
  question: "Q",
  options: ["A", "B"],
  answer: 1,
  explanation: "",
  source: "",
};
const session = {
  id: "s",
  kind: "practice",
  total: 1,
  completed_at: "2026-10-26T10:00:00Z",
  questions: [question],
  answers: { "0": 1 },
};
describe("Progression: real recorded activity", () => {
  it("does not invent events or proficiency for a new account", () => {
    expect(topicPracticeSummary([])).toEqual({});
    expect(recentLearningActivity([], [])).toEqual([]);
  });
  it("keeps exams and unfinished sessions out of practice totals", () => {
    expect(
      topicPracticeSummary([
        { ...session, kind: "exam" },
        { ...session, completed_at: null },
      ]),
    ).toEqual({});
  });
  it("counts valid recorded choices without confusing blanks with wrong answers", () => {
    expect(
      topicPracticeSummary([
        {
          ...session,
          questions: [question, question, question],
          answers: { "0": 1, "1": -1, "2": 5 },
        },
      ]),
    ).toEqual({ "Système institutionnel et politique": { answered: 1, correct: 1 } });
  });
  it("counts repeated exercise attempts without declaring unique mastered questions", () => {
    expect(
      topicPracticeSummary([session, { ...session, id: "second", answers: { "0": 0 } }])[
        "Système institutionnel et politique"
      ],
    ).toEqual({ answered: 2, correct: 1 });
  });
  it("sorts only real events and labels short exams honestly", () => {
    const rows = recentLearningActivity(
      [{ lesson_id: "lesson", completed_at: "2026-10-25T10:00:00Z" }],
      [
        { ...session, kind: "exam" },
        { ...session, id: "blank", answers: {} },
        { ...session, id: "ongoing", completed_at: null },
      ],
    );
    expect(rows.map((r) => r.ref)).toEqual(["s", "lesson"]);
    expect(rows[0]?.label).toBe("Test court");
  });
});
