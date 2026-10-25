import { z } from "zod";
import type { Json } from "@/integrations/supabase/types";

/** Word the user must type to confirm the irreversible deletion of their account. */
export const DELETE_CONFIRMATION = "SUPPRIMER";
export const deleteAccountSchema = z.object({ confirm: z.literal(DELETE_CONFIRMATION) });

/**
 * User-owned tables that are NOT linked to profiles / auth.users with ON DELETE CASCADE.
 * Deleting the auth user would leave their rows behind, so they are erased explicitly first.
 * A test (account-data.test.ts) fails if a new user-owned table is added without cascade
 * and without being listed here.
 */
export const ERASE_BEFORE_USER_DELETE = [
  "revision_plans",
  "learning_activity",
  "question_reports",
  "learning_agenda",
] as const;

/** Session metadata only: the stored question snapshots (with answers) are course content, not personal data. */
export const SESSION_EXPORT_COLUMNS =
  "id,kind,parcours,lesson_id,answers,correct,total,current_index,started_at,completed_at,deadline,test_id";

/** The last administrator cannot delete their own account: nobody could manage the platform afterwards. */
export function canDeleteAccount(roles: readonly string[], otherAdmins: number): boolean {
  return !(roles.includes("admin") && otherAdmins === 0);
}

export const LAST_ADMIN_ERROR = "LAST_ADMIN";

export interface ExportParts {
  account: { email: string; created_at: string | null };
  tables: Record<string, Json[]>;
}

export function assembleExport(parts: ExportParts, now: Date = new Date()) {
  return {
    generated_at: now.toISOString(),
    source: "ExaCiv",
    account: parts.account,
    data: parts.tables,
    notes: [
      "Copie des données personnelles associées à votre compte ExaCiv.",
      "Les contenus pédagogiques (leçons, questions et réponses) ne sont pas inclus : ils ne sont pas des données personnelles.",
    ],
  };
}
