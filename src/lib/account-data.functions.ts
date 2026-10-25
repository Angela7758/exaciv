import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Json } from "@/integrations/supabase/types";
import {
  ERASE_BEFORE_USER_DELETE,
  LAST_ADMIN_ERROR,
  SESSION_EXPORT_COLUMNS,
  assembleExport,
  canDeleteAccount,
  deleteAccountSchema,
} from "./account-data";

// The user id always comes from the verified token (requireSupabaseAuth), never from the request body.
// The service-role client is only used on the server, after authentication, and every query is scoped to that id.

export const exportMyData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;
    const who = await context.supabase.auth.getUser();
    if (who.error) throw new Error("Compte indisponible.");

    const results = await Promise.all([
      db.from("profiles").select("*").eq("id", userId),
      db.from("learning_completions").select("*").eq("user_id", userId),
      db.from("learning_attempts").select("*").eq("user_id", userId),
      db.from("learning_sessions").select(SESSION_EXPORT_COLUMNS).eq("user_id", userId),
      db.from("learning_mistake_reviews").select("*").eq("user_id", userId),
      db.from("learning_reading_positions").select("*").eq("user_id", userId),
      db.from("learning_activity").select("*").eq("user_id", userId),
      db.from("learning_agenda").select("*").eq("user_id", userId),
      db.from("revision_plans").select("*").eq("user_id", userId),
      db.from("question_reports").select("*").eq("user_id", userId),
      db.from("user_roles").select("*").eq("user_id", userId),
      db.from("learning_bookmarks").select("*").eq("user_id", userId),
    ]);
    if (results.some((r) => r.error)) throw new Error("Export impossible.");

    const names = [
      "profile",
      "lesson_completions",
      "quiz_attempts",
      "sessions",
      "mistake_reviews",
      "reading_positions",
      "activity",
      "agenda",
      "revision_plans",
      "question_reports",
      "roles",
      "bookmarks",
    ];
    const tables: Record<string, Json[]> = Object.fromEntries(
      names.map((name, i) => [name, (results[i]?.data ?? []) as unknown as Json[]]),
    );
    return assembleExport({
      account: { email: who.data.user.email ?? "", created_at: who.data.user.created_at ?? null },
      tables,
    });
  });

export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(deleteAccountSchema)
  .handler(async ({ context }) => {
    const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;

    const roles = await db.from("user_roles").select("role").eq("user_id", userId);
    if (roles.error) throw new Error("Suppression impossible.");
    const roleNames = roles.data.map((r) => r.role);
    if (roleNames.includes("admin")) {
      const others = await db
        .from("user_roles")
        .select("id", { count: "exact", head: true })
        .eq("role", "admin")
        .neq("user_id", userId);
      if (others.error) throw new Error("Suppression impossible.");
      if (!canDeleteAccount(roleNames, others.count ?? 0)) throw new Error(LAST_ADMIN_ERROR);
    }

    // Tables without ON DELETE CASCADE first, then the auth user (which cascades to profile, sessions, attempts...).
    for (const table of ERASE_BEFORE_USER_DELETE) {
      const r = await db.from(table).delete().eq("user_id", userId);
      if (r.error) throw new Error("Suppression impossible.");
    }
    const removed = await db.auth.admin.deleteUser(userId);
    if (removed.error) throw new Error("Suppression impossible.");
    return { success: true };
  });
