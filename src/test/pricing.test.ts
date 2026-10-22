import { describe, expect, it } from "vitest";
import { PAYMENTS_ENABLED, PLANS } from "@/config/pricing";
import { FREE_TEST, scoreTest } from "@/config/free-test";

describe("pricing", () => {
  it("lists the three agreed prices", () => {
    expect(PLANS.map((p) => [p.name, p.price, p.period ?? ""])).toEqual([
      ["Découverte", "0 €", ""],
      ["Essentiel", "9,90 €", "/ mois"],
      ["Pass Révision", "24,90 €", "/ 3 mois"],
    ]);
  });
  it("does not enable payments before they are configured", () => {
    expect(PAYMENTS_ENABLED).toBe(false);
  });
});

describe("free test scoring", () => {
  it("counts correct and unanswered answers", () => {
    const answers = FREE_TEST.map((q, i) => (i === 0 ? null : q.answer));
    const r = scoreTest(answers);
    expect(r.correct).toBe(FREE_TEST.length - 1);
    expect(r.wrong).toBe(1);
  });
});
