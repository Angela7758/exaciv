import {createClient} from '@supabase/supabase-js';

const MODEL = 'google/gemini-3.1-flash-tts-preview';
const VOICE = 'Kore';
const LANGS: Record<string,string> = {fr:'French',zh:'Mandarin Chinese',en:'English',ar:'Arabic',es:'Spanish',ru:'Russian',pt:'European Portuguese'};

export async function handleSpeech(request: Request) {
  const token = request.headers.get('Authorization')?.replace(/^Bearer /, '');
  if (!token) return Response.json({message: 'Connectez-vous pour écouter.'}, {status: 401});
  const url = process.env['SUPABASE_URL']; const key = process.env['SUPABASE_PUBLISHABLE_KEY']; const aiKey = process.env['LOVABLE_API_KEY'];
  if (!url || !key || !aiKey) return Response.json({message: 'La lecture audio n’est pas configurée.'}, {status: 503});
  const client = createClient(url, key, {auth: {persistSession: false, autoRefreshToken: false}});
  const {data, error} = await client.auth.getUser(token);
  if (error || !data.user) return Response.json({message: 'Reconnectez-vous pour écouter.'}, {status: 401});
  let body: {text?: unknown; lang?: unknown};
  try { body = await request.json(); } catch { return Response.json({message: 'Saisie invalide.'}, {status: 400}); }
  const text = typeof body.text === 'string' ? body.text.trim() : '';
  const lang = typeof body.lang === 'string' && LANGS[body.lang] ? body.lang : null;
  if (!text || text.length > 4000 || !lang) return Response.json({message: 'Texte ou langue invalide.'}, {status: 400});
  const upstream = await fetch('https://ai.gateway.lovable.dev/v1/audio/speech', {
    method: 'POST',
    headers: {Authorization: `Bearer ${aiKey}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      model: MODEL,
      contents: [{role: 'user', parts: [{text: `Read aloud in ${LANGS[lang]}, calmly and clearly, with native pronunciation: ${text}`}]}],
      generationConfig: {responseModalities: ['AUDIO'], speechConfig: {voiceConfig: {prebuiltVoiceConfig: {voiceName: VOICE}}}},
      stream_format: 'sse',
    }),
  });
  if (!upstream.ok) {
    const detail = await upstream.text();
    console.error(`Speech failed [${upstream.status}]: ${detail}`);
    const message = upstream.status === 402 ? 'Crédits IA épuisés : lecture audio indisponible.' : upstream.status === 429 ? 'Trop de demandes, réessayez dans un instant.' : 'La lecture audio a échoué.';
    return Response.json({message}, {status: upstream.status});
  }
  return new Response(upstream.body, {status: upstream.status, headers: {'Content-Type': upstream.headers.get('Content-Type') ?? 'text/event-stream', 'Cache-Control': 'no-cache'}});
}
