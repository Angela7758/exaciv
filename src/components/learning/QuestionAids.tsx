import {streamSpeech} from '@/lib/speech';
import {useUiT} from '@/lib/i18n/internal';
import {useEffect,useRef,useState} from 'react';
import {useServerFn} from '@tanstack/react-start';
import {Volume2,Square,Languages,LoaderCircle} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {translateQuestionTexts} from '@/lib/translate.functions';
import {saveHelpPreference} from '@/lib/account-settings.functions';
import {QUESTION_HELP_LOCALES,questionHelpLocale,visibleQuestionTexts,localQuestionTranslation,type QuestionHelpLocale} from '@/lib/question-aids';
import {AUDIO_STOP_EVENT,stopLearningAudio} from '@/lib/local-audio';

export function QuestionAids({questionId,question,options,optionIds,explanation,helpEnabled,helpLocale,assistedLabel=false}:{
 questionId:string;question:string;options:string[];optionIds?:string[]|undefined;explanation?:string|undefined;helpEnabled:boolean;helpLocale:string;assistedLabel?:boolean;
}) {
 const ui=useUiT();
 const [target,setTarget]=useState<QuestionHelpLocale>(()=>questionHelpLocale(helpLocale));
 const [open,setOpen]=useState(false);
 const [translations,setTranslations]=useState<Record<string,string[]>>({});
 const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 const [speaking,setSpeaking]=useState<'original'|'translation'|null>(null);
 const abort=useRef<AbortController|null>(null);const request=useRef(0);
 const translate=useServerFn(translateQuestionTexts);const savePref=useServerFn(saveHelpPreference);
 const texts=visibleQuestionTexts(question,options,explanation);
 const sourceKey=JSON.stringify([questionId,...texts]);
 const key=JSON.stringify([sourceKey,target]);
 const current=localQuestionTranslation(target,texts)??translations[key];
 function stop(){abort.current?.abort();if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel();setSpeaking(null);}
 useEffect(()=>{setTarget(questionHelpLocale(helpLocale));},[helpLocale]);
 useEffect(()=>{const silence=()=>{abort.current?.abort();setSpeaking(null);};window.addEventListener(AUDIO_STOP_EVENT,silence);return()=>window.removeEventListener(AUDIO_STOP_EVENT,silence);},[]);
 useEffect(()=>{setOpen(false);setBusy(false);setError('');request.current++;stop();return()=>{request.current++;abort.current?.abort();if('speechSynthesis' in window)window.speechSynthesis.cancel();};},[sourceKey]);
 useEffect(()=>{if(!helpEnabled){setOpen(false);stop();request.current++;}},[helpEnabled]);
 async function load(next:QuestionHelpLocale){
  const local=localQuestionTranslation(next,texts);if(local)return;
  const cache=JSON.stringify([sourceKey,next]);if(translations[cache])return;
  const version=++request.current;setBusy(true);setError('');
  try{const result=await translate({data:{texts,target:next}});if(version===request.current)setTranslations(v=>({...v,[cache]:result.translations}));}
  catch(e){if(version===request.current)setError(e instanceof Error?e.message:ui("La traduction a échoué. Réessayez dans un instant."));}
  finally{if(version===request.current)setBusy(false);}
 }
 function toggleTranslate(){if(open){setOpen(false);request.current++;setBusy(false);stop();return;}setOpen(true);void load(target);}
 function changeTarget(next:QuestionHelpLocale){stop();request.current++;setBusy(false);setError('');setTarget(next);void savePref({data:{help_locale:next}}).catch(()=>{});void load(next);}
 function play(kind:'original'|'translation',lang:QuestionHelpLocale,passage:string[]){
  if(speaking===kind){stop();return;}stopLearningAudio();stop();const controller=new AbortController();abort.current=controller;setSpeaking(kind);setError('');
  streamSpeech(passage.join('. '),lang,controller.signal).then(()=>{if(!controller.signal.aborted)setSpeaking(null);}).catch(()=>{
   if(controller.signal.aborted)return;
   if(!('speechSynthesis' in window)){setSpeaking(null);setError(ui("La lecture audio n’est pas disponible dans ce navigateur."));return;}
   const utterance=new SpeechSynthesisUtterance(passage.join('. '));utterance.lang=QUESTION_HELP_LOCALES.find(l=>l.id===lang)?.speech??'fr-FR';
   utterance.onend=()=>setSpeaking(null);utterance.onerror=()=>setSpeaking(null);window.speechSynthesis.speak(utterance);
  });
 }
 return <div className="question-aids">
  <div className="question-aids-bar" role="toolbar" aria-label={ui("Aides pour cette question")}>
   <Button type="button" variant="outline" size="sm" onClick={()=>play('original','fr',texts)} aria-pressed={speaking==='original'}>{speaking==='original'?<Square/>:<Volume2/>}{speaking==='original'?ui("Arrêter"):ui("Écouter")}</Button>
   {helpEnabled&&<Button type="button" variant="outline" size="sm" onClick={toggleTranslate} aria-expanded={open}>{busy?<LoaderCircle className="animate-spin"/>:<Languages/>}{open?ui("Masquer la traduction"):ui("Traduire")}</Button>}
   {assistedLabel&&(speaking!==null||open)&&<span className="assisted-pill">{ui("Entraînement avec aide")}</span>}
  </div>
  {open&&helpEnabled&&<div className="question-translation" dir={target==='ar'?'rtl':'ltr'} lang={target}>
   <select aria-label={ui("Langue de traduction")} value={target} onChange={e=>changeTarget(questionHelpLocale(e.target.value))}>{QUESTION_HELP_LOCALES.map(l=><option key={l.id} value={l.id}>{l.label}</option>)}</select>
   {busy&&<p role="status">{ui("Traduction en cours…")}</p>}
   {current&&<><p className="translation-stem">{current[0]}</p><ol>{current.slice(1,1+options.length).map((text,i)=><li key={optionIds?.[i]??i} data-option-id={optionIds?.[i]??String(i)}>{text}</li>)}</ol>{explanation&&<p className="translation-explanation">{current[1+options.length]}</p>}<Button type="button" variant="ghost" size="sm" onClick={()=>play('translation',target,current)} aria-pressed={speaking==='translation'}>{speaking==='translation'?<Square/>:<Volume2/>}{speaking==='translation'?ui("Arrêter"):ui("Écouter la traduction")}</Button></>}
  </div>}
  {error&&<p role="alert" className="question-aids-note">{error}</p>}
 </div>;
}
