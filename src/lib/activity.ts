import {supabase} from '@/integrations/supabase/client';

export type ActivityKind = 'lesson' | 'video' | 'session';
export const PROGRESS_LOCALES = ['en', 'es', 'ar', 'ru', 'pt'] as const;

/** Tags a real learning action with the interface language; duplicates are ignored. Never blocks learning. */
export async function recordActivity(kind: ActivityKind, ref: string, locale: string) {
  try {
    const {data} = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;
    await supabase.from('learning_activity').upsert({user_id: userId, kind, ref, locale}, {onConflict: 'user_id,kind,ref,locale', ignoreDuplicates: true});
  } catch { /* statistic only */ }
}

export type LanguageRow = {locale: string; lessons: number; videos: number; correct: number; total: number};

/** Lessons count only real completions; accuracy only finished sessions started in that language. */
export function summarizeByLocale(
  activity: {locale: string; kind: string; ref: string}[],
  completedLessons: string[],
  sessions: {id: string; correct: number | null; total: number; completed_at: string | null}[],
): LanguageRow[] {
  const done = new Set(completedLessons);
  const byId = new Map(sessions.map(s => [s.id, s]));
  return PROGRESS_LOCALES.map(locale => {
    const rows = activity.filter(a => a.locale === locale);
    const finished = rows.filter(a => a.kind === 'session').map(a => byId.get(a.ref)).filter(s => s?.completed_at && s.correct !== null);
    return {
      locale,
      lessons: new Set(rows.filter(a => a.kind === 'lesson' && done.has(a.ref)).map(a => a.ref)).size,
      videos: new Set(rows.filter(a => a.kind === 'video').map(a => a.ref)).size,
      correct: finished.reduce((n, s) => n + (s?.correct ?? 0), 0),
      total: finished.reduce((n, s) => n + (s?.total ?? 0), 0),
    };
  });
}
