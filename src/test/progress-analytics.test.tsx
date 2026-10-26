import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
const fixture = vi.hoisted(() => ({
  catalogue: {
    lessons: [
      {
        id: "resident",
        topic: "Droits et devoirs",
        title: "Cours résident",
        pathways: ["resident"],
      },
      {
        id: "nat",
        topic: "Droits et devoirs",
        title: "Cours naturalisation",
        pathways: ["naturalisation"],
      },
    ],
  },
  learning: {
    profile: { parcours: "resident", goal_date: null },
    completions: [
      { lesson_id: "resident", completed_at: "2026-10-25T10:00:00Z" },
      { lesson_id: "nat", completed_at: "2026-10-25T10:00:00Z" },
    ],
    sessions: [],
  },
}));
vi.mock("@tanstack/react-query", () => ({
  useSuspenseQuery: (q: { queryKey: string[] }) => ({
    data:
      q.queryKey[0] === "catalogue"
        ? fixture.catalogue
        : q.queryKey[0] === "learning"
          ? fixture.learning
          : [],
  }),
}));
vi.mock("@/lib/learning.queries", () => ({
  catalogueOptions: { queryKey: ["catalogue"] },
  learningOptions: { queryKey: ["learning"] },
}));
vi.mock("@/lib/session.queries", () => ({ sessionsOptions: { queryKey: ["sessions"] } }));
vi.mock("@/lib/i18n", () => ({ useI18n: () => ({ locale: "fr" }) }));
vi.mock("@/lib/i18n/internal", () => ({
  useUiT:
    () =>
    (s: string, ...v: unknown[]) =>
      s.replace(/\{(\d+)\}/g, (_, i) => String(v[Number(i)])),
}));
vi.mock("@/lib/i18n/content", () => ({ useContentT: () => (s: string) => s }));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));
vi.mock("@/components/site/SafeImage", () => ({
  SafeImage: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
vi.mock("@/components/learning/LearningAgenda", () => ({
  ActivityAgenda: () => <section>Agenda</section>,
}));
import { ProgressAnalytics } from "@/components/learning/ProgressAnalytics";
afterEach(cleanup);
describe("Progression pathway and empty assessment regression", () => {
  it("uses only applicable published lessons and their completion intersection", () => {
    const { container } = render(<ProgressAnalytics />);
    expect(container.querySelector(".progress-total strong")?.textContent).toBe("1 / 1");
    expect(container.querySelector(".progress-total b")?.textContent).toBe("100 %");
    expect(screen.queryByText("Cours naturalisation")).toBeNull();
  });
  it("does not invent a zero score or activity placeholders", () => {
    render(<ProgressAnalytics />);
    expect(screen.getAllByText("Pas encore évalué").length).toBeGreaterThan(0);
    expect(screen.queryByText("0 / 40")).toBeNull();
    expect(screen.queryByText("Aucune activité ce jour")).toBeNull();
  });
  it("does not fabricate scores even with the historical demo URL", () => {
    render(<ProgressAnalytics demo />);
    expect(screen.getByText("Aperçu avec vos données réelles")).toBeDefined();
    expect(screen.queryByText("34 / 40")).toBeNull();
  });
});
