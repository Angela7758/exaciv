import {createServerFn} from '@tanstack/react-start';
import {z} from 'zod';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';

const HELP_LOCALES = ['zh','en','ar','es','ru','pt'] as const;
const LOCALE_NAMES: Record<(typeof HELP_LOCALES)[number], string> = {
  zh: 'Chinese (Simplified)',
  en: 'English',
  ar: 'Arabic',
  es: 'Spanish',
  ru: 'Russian',
  pt: 'Portuguese',
};

const translateSchema = z.object({
  texts: z.array(z.string().min(1).max(2000)).min(1).max(12),
  target: z.enum(HELP_LOCALES),
});

/**
 * Traduit des extraits de questions (énoncé, options, explication déjà révélée)
 * vers la langue d'aide choisie. Appel authentifié, clé IA strictement serveur.
 */
export const translateQuestionTexts = createServerFn({method: 'POST'})
  .middleware([requireSupabaseAuth])
  .inputValidator(translateSchema)
  .handler(async ({data}) => {
    const apiKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey) throw new Error('La traduction n’est pas configurée.');
    const targetName = LOCALE_NAMES[data.target];
    const response = await fetch('https://ai.gateway.lovable.dev/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Lovable-API-Key': apiKey,
        'Content-Type': 'application/json',
        'X-Lovable-AIG-SDK': 'fetch',
      },
      body: JSON.stringify({
        model: 'openai/gpt-6-astra',
        stream: true,
        store: false,
        reasoning: {effort: 'low'},
        instructions:
          'You are a careful translator for a French civic exam preparation app. ' +
          `Translate each French text into ${targetName}. Keep the meaning exact, do not add or remove information, ` +
          'do not reveal or hint at which option is correct. Return the translations in the same order.',
        input: [
          {
            role: 'user',
            content: [{type: 'input_text', text: JSON.stringify({texts: data.texts})}],
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'translations',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                translations: {type: 'array', items: {type: 'string'}},
              },
              required: ['translations'],
              additionalProperties: false,
            },
          },
        },
      }),
    });
    if (!response.ok || !response.body) {
      throw new Error('La traduction a échoué. Réessayez dans un instant.');
    }
    // Consomme le flux SSE et reconstruit le texte final.
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let output = '';
    for (;;) {
      const {done, value} = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, {stream: true});
      const events = buffer.split('\n\n');
      buffer = events.pop() ?? '';
      for (const event of events) {
        for (const line of event.split('\n')) {
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === '[DONE]') continue;
          try {
            const parsed = JSON.parse(payload) as {type?: string; delta?: string};
            if (parsed.type === 'response.output_text.delta' && typeof parsed.delta === 'string') output += parsed.delta;
          } catch {
            // fragment JSON incomplet : ignoré
          }
        }
      }
    }
    if (!output) throw new Error('La traduction a échoué. Réessayez dans un instant.');
    let translations: string[];
    try {
      const parsed = JSON.parse(output) as {translations?: unknown};
      if (!Array.isArray(parsed.translations)) throw new Error('bad shape');
      translations = parsed.translations.map(String);
    } catch {
      throw new Error('La traduction a échoué. Réessayez dans un instant.');
    }
    if (translations.length !== data.texts.length) {
      throw new Error('La traduction est incomplète. Réessayez dans un instant.');
    }
    return {translations};
  });
