import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import {
  DELETE_CONFIRMATION,
  ERASE_BEFORE_USER_DELETE,
  SESSION_EXPORT_COLUMNS,
  assembleExport,
  canDeleteAccount,
  deleteAccountSchema,
} from "@/lib/account-data";

describe("account deletion safeguards", () => {
  it("requires the exact confirmation word", () => {
    expect(deleteAccountSchema.safeParse({ confirm: DELETE_CONFIRMATION }).success).toBe(true);
    expect(deleteAccountSchema.safeParse({ confirm: "supprimer" }).success).toBe(false);
    expect(deleteAccountSchema.safeParse({ confirm: "" }).success).toBe(false);
    expect(deleteAccountSchema.safeParse({}).success).toBe(false);
  });

  it("never lets the last administrator delete their own account", () => {
    expect(canDeleteAccount(["admin"], 0)).toBe(false);
    expect(canDeleteAccount(["admin", "editor"], 0)).toBe(false);
    expect(canDeleteAccount(["admin"], 1)).toBe(true);
    expect(canDeleteAccount(["editor"], 0)).toBe(true);
    expect(canDeleteAccount([], 0)).toBe(true);
  });
});

describe("personal data export", () => {
  const out = assembleExport(
    { account: { email: "a@b.fr", created_at: "2026-10-01T00:00:00Z" }, tables: { profile: [{ id: "1" }], sessions: [] } },
    new Date("2026-10-25T10:00:00Z"),
  );
  it("contains the account, the data and a note about excluded content", () => {
    expect(out.generated_at).toBe("2026-10-25T10:00:00.000Z");
    expect(out.account.email).toBe("a@b.fr");
    expect(out.data["profile"]).toEqual([{ id: "1" }]);
    expect(out.notes.join(" ")).toMatch(/contenus pédagogiques/);
  });
  it("does not export the stored question snapshots (course content with answers)", () => {
    expect(SESSION_EXPORT_COLUMNS.split(",")).not.toContain("questions");
  });
});

describe("no personal data is left behind when an account is deleted", () => {
  // Parse every migration: a table with a user_id column that is not linked to profiles / auth.users
  // with ON DELETE CASCADE keeps its rows after the auth user is deleted, so it must be erased explicitly.
  const dir = "drizzle/migrations";
  const orphanProne: string[] = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    const sql = readFileSync(`${dir}/${file}`, "utf8");
    for (const m of sql.matchAll(/CREATE TABLE (?:IF NOT EXISTS )?public\.(\w+)\s*\(/gi)) {
      let depth = 1;
      let i = (m.index ?? 0) + m[0].length;
      const start = i;
      while (depth > 0 && i < sql.length) {
        if (sql[i] === "(") depth++;
        if (sql[i] === ")") depth--;
        i++;
      }
      const body = sql.slice(start, i - 1);
      const name = m[1] as string;
      const ownsUser = /\buser_id\b/.test(body);
      const cascades = /REFERENCES\s+(auth\.users|public\.profiles)\s*\([^)]*\)\s*ON DELETE CASCADE/i.test(body);
      if (ownsUser && !cascades) orphanProne.push(name);
    }
  }

  it("finds the known orphan-prone tables", () => {
    expect(orphanProne.length).toBeGreaterThan(0);
  });
  it("erases every user-owned table that has no cascade", () => {
    for (const table of orphanProne) expect(ERASE_BEFORE_USER_DELETE).toContain(table);
  });
});
