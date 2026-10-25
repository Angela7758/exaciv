import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const sql = readFileSync('drizzle/migrations/0031_restrict_question_answer_columns.sql', 'utf8');
const grant = /GRANT SELECT \(([^)]*)\)\s+ON public\.learning_questions TO anon, authenticated/.exec(sql);
const source = readFileSync('src/lib/learning.functions.ts', 'utf8');

describe('question answers are not readable with the public key', () => {
  it('revokes table-wide SELECT from anon and authenticated', () => {
    expect(sql).toMatch(/REVOKE SELECT ON public\.learning_questions FROM anon, authenticated;/);
  });
  it('only grants non-sensitive columns', () => {
    const columns = (grant?.[1] ?? '').split(',').map((c) => c.trim());
    expect(columns.length).toBeGreaterThan(0);
    for (const secret of ['answer', 'correct_option_id', 'explanation', 'options', 'option_ids', 'question', 'source']) {
      expect(columns).not.toContain(secret);
    }
  });
  it('the public catalogue query never selects every column', () => {
    expect(source).not.toMatch(/from\('learning_questions'\)\.select\('\*'\)\.eq\('published',true\)\.order/);
  });
});
