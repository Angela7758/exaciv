import {useUiT} from '@/lib/i18n/internal';
import {useEffect,useRef,useState} from 'react';
import {useServerFn} from '@tanstack/react-start';
import {useQueryClient} from '@tanstack/react-query';
import {Volume2,Square,Languages,LoaderCircle} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {translateQuestionTexts} from '@/lib/translate.functions';
import {saveHelpPreference} from '@/lib/account-settings.functions';

const HELP_LOCALES = [
  {id:'zh',label:'中文',speech:'zh-CN'},
  {id:'en',label:'English',speech:'en-GB'},
  {id:'ar',label:'العربية',speech:'ar-SA'},
  {id:'es',label:'Español',speech:'es-ES'},
  {id:'ru',label:'Русский',speech:'ru-RU'},
  {id:'pt',label:'Português',speech:'pt-PT'},
] as const;
type HelpLocale = (typeof HELP_LOCALES)[number]['id'];

function speak(text:string, lang:string, onEnd:()=>void): SpeechSynthesisUtterance | null {
  if (typeof window==='undefined' || !('speechSynthesis' in window)) return null;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  const voice = window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith(lang.slice(0,2).toLowerCase()));
  if (voice) utterance.voice = voice;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Aides pédagogiques d'une question : lecture audio française (« Écouter »)
 * et traduction à la demande (« Traduire ») vers la langue d'aide du compte.
 * La traduction ne porte que sur le contenu déjà visible (jamais la réponse).
 */
export function QuestionAids({questionId, question, options, explanation, helpEnabled, helpLocale, assistedLabel=false}:{
  questionId: string;
  question: string;
  options: string[];
  explanation?: string;
  helpEnabled: boolean;
  helpLocale: string;
  assistedLabel?: boolean;
}){const ui=useUiT();
  const [speaking,setSpeaking]=useState<'fr'|HelpLocale|null>(null);
  const [speechOk,setSpeechOk]=useState(true);
  const [open,setOpen]=useState(false);
  const [target,setTarget]=useState<HelpLocale>((HELP_LOCALES.some(l=>l.id===helpLocale)?helpLocale:'en') as HelpLocale);
  const [translations,setTranslations]=useState<Record<string,string[]>>({});
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const translate=useServerFn(translateQuestionTexts);
  const savePref=useServerFn(saveHelpPreference);
  const qc=useQueryClient();
  const cacheKey=useRef('');

  // Arrête toute lecture au changement de question ou à la sortie de page.
  useEffect(()=>{
    return ()=>{ if (typeof window!=='undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel(); };
  },[questionId]);
  useEffect(()=>{ setOpen(false); setError(''); },[questionId]);

  function toggleSpeech(lang:'fr'|HelpLocale, text:string){
    if (!('speechSynthesis' in window)) { setSpeechOk(false); return; }
    if (speaking){ window.speechSynthesis.cancel(); setSpeaking(null); return; }
    const u = speak(text, lang==='fr'?'fr-FR':(HELP_LOCALES.find(l=>l.id===lang)?.speech??lang), ()=>setSpeaking(null));
    if (!u) setSpeechOk(false); else setSpeaking(lang);
  }

  async function toggleTranslate(){
    if (open){ setOpen(false); return; }
    setOpen(true);
    const key = `${questionId}:${target}:${explanation?'x':''}`;
    cacheKey.current = key;
    if (translations[key]) return;
    setBusy(true); setError('');
    try{
      const texts=[question,...options,...(explanation?[explanation]:[])];
      const r=await translate({data:{texts,target}});
      setTranslations(t=>({...t,[key]:r.translations}));
    }catch(e){
      setError(e instanceof Error?e.message:ui("La traduction a échoué. Réessayez dans un instant."));
    }finally{setBusy(false);}
  }

  async function changeTarget(next:HelpLocale){
    setTarget(next);
    setTranslations({});
    if (open){ setOpen(false); }
    try{ await savePref({data:{help_locale:next}}); await qc.invalidateQueries({queryKey:['learning']}); }catch{ /* préférence non enregistrée : la session garde le choix */ }
  }

  const key=`${questionId}:${target}:${explanation?'x':''}`;
  const current=translations[key];
  const dir=target==='ar'?'rtl':'ltr';

  return <div className="question-aids">
    <div className="question-aids-bar" role="toolbar" aria-label={ui("Aides pour cette question")}>
      <Button type="button" variant="outline" size="sm" onClick={()=>toggleSpeech('fr',`${question}. ${options.join('. ')}`)} aria-pressed={speaking==='fr'}>
        {speaking==='fr'?<Square/>:<Volume2/>}{speaking==='fr'?ui("Arrêter"):ui("Écouter")}
      </Button>
      {helpEnabled&&<Button type="button" variant="outline" size="sm" onClick={toggleTranslate} aria-expanded={open} disabled={busy}>
        {busy?<LoaderCircle className="animate-spin"/>:<Languages/>}{open?ui("Masquer la traduction"):ui("Traduire")}
      </Button>}
      {helpEnabled&&open&&<select aria-label={ui("Langue de traduction")} value={target} onChange={e=>changeTarget(e.target.value as HelpLocale)}>
        {HELP_LOCALES.map(l=><option key={l.id} value={l.id}>{l.label}</option>)}
      </select>}
      {assistedLabel&&(speaking!==null||open)&&<span className="assisted-pill">{ui("Entraînement avec aide")}</span>}
    </div>
    {!speechOk&&<p role="status" className="question-aids-note">{ui("La lecture audio n’est pas disponible dans ce navigateur.")}</p>}
    {open&&helpEnabled&&<div className="question-translation" dir={dir} lang={target}>
      {busy&&<p className="question-aids-note">{ui("Traduction en cours…")}</p>}
      {error&&<p role="alert" className="question-aids-note">{error}</p>}
      {current&&<>
        <p className="translation-stem">{current[0]}</p>
        <ul>{current.slice(1,1+options.length).map((t,i)=><li key={i}>{t}</li>)}</ul>
        {explanation&&current[1+options.length]&&<p className="translation-explanation">{current[1+options.length]}</p>}
        <Button type="button" variant="ghost" size="sm" onClick={()=>toggleSpeech(target,[current[0],...current.slice(1,1+options.length)].join('. '))} aria-pressed={speaking===target}>
          {speaking===target?<Square/>:<Volume2/>}{speaking===target?ui("Arrêter"):ui("Écouter la traduction")}
        </Button>
      </>}
    </div>}
  </div>;
}
