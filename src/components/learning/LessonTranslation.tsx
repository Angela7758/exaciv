import {useState,useEffect,useRef} from 'react';
import {useServerFn} from '@tanstack/react-start';
import {Languages,Volume2,Square} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {translateQuestionTexts} from '@/lib/translate.functions';
import {QUESTION_HELP_LOCALES,questionHelpLocale,type QuestionHelpLocale} from '@/lib/question-aids';
import {streamSpeech} from '@/lib/speech';
import {AUDIO_STOP_EVENT,stopLearningAudio} from '@/lib/local-audio';
import {useUiT} from '@/lib/i18n/internal';
export function LessonTranslation({text,helpLocale}:{text:string;helpLocale:string}){
 const ui=useUiT();const [open,setOpen]=useState(false);const [target,setTarget]=useState<QuestionHelpLocale>(questionHelpLocale(helpLocale));const [translated,setTranslated]=useState<Record<string,string>>({});const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [playing,setPlaying]=useState(false);const controller=useRef<AbortController|null>(null);const revision=useRef(0);const translate=useServerFn(translateQuestionTexts);
 useEffect(()=>{const stop=()=>{controller.current?.abort();setPlaying(false);};window.addEventListener(AUDIO_STOP_EVENT,stop);return()=>{revision.current++;stop();window.removeEventListener(AUDIO_STOP_EVENT,stop);};},[text]);
 async function load(lang:QuestionHelpLocale){revision.current++;const v=revision.current;const cacheKey=JSON.stringify([text,lang]);setError('');if(lang==='fr'||translated[cacheKey]){setBusy(false);return;}setBusy(true);try{const r=await translate({data:{texts:[text],target:lang}});const result=r.translations[0];if(!result)throw new Error('Traduction indisponible');if(v===revision.current)setTranslated(p=>({...p,[cacheKey]:result}));}catch{if(v===revision.current)setError(ui('Traduction indisponible ; l’original français reste affiché.'));}finally{if(v===revision.current)setBusy(false);}}
 const passage=target==='fr'?text:translated[JSON.stringify([text,target])];
 function toggle(){stopLearningAudio();setOpen(!open);if(!open)void load(target);else revision.current++;}
 function play(){if(playing){stopLearningAudio();return;}stopLearningAudio();if(!passage)return;const c=new AbortController();controller.current=c;setPlaying(true);void streamSpeech(passage,target,c.signal).catch(()=>{if(!c.signal.aborted)setError(ui('Lecture indisponible.'));}).finally(()=>{if(!c.signal.aborted)setPlaying(false);});}
 return <div className="lesson-translation-aid"><Button variant="outline" size="sm" onClick={toggle} aria-expanded={open}><Languages/>{ui(open?'Masquer la traduction':'Traduire')}</Button>{open&&<div className="question-translation" dir={target==='ar'?'rtl':'ltr'} lang={target}><p className="question-aids-note">{ui("Traduction d’aide non relue ; l’original français reste la référence.")}</p><select aria-label={ui('Langue de traduction')} value={target} onChange={e=>{stopLearningAudio();const v=questionHelpLocale(e.target.value);setTarget(v);void load(v);}}>{QUESTION_HELP_LOCALES.map(l=><option key={l.id} value={l.id}>{l.label}</option>)}</select>{busy?<p role="status">{ui('Traduction en cours…')}</p>:passage&&<><p>{passage}</p><Button variant="ghost" size="sm" onClick={play} aria-pressed={playing}>{playing?<Square/>:<Volume2/>}{ui(playing?'Arrêter':'Écouter la traduction')}</Button></>}{error&&<p role="alert">{error}</p>}</div>}</div>;
}