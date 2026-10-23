import {useEffect,useRef,useState} from 'react';
import {Volume2,Square,LoaderCircle} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useI18n} from '@/lib/i18n';
import {useUiT} from '@/lib/i18n/internal';
import {resolveContentPassage} from '@/lib/i18n/content';
import {streamSpeech} from '@/lib/speech';

/** Reads French source texts aloud in the displayed language (falls back to French when untranslated). */
export function ListenButton({texts,language}:{texts:string[];language?:'fr'}){
  const {locale}=useI18n();const ui=useUiT();
  const [state,setState]=useState<'idle'|'loading'|'playing'>('idle');const [error,setError]=useState('');
  const abort=useRef<AbortController|null>(null);
  const key=texts.join('|');
  useEffect(()=>()=>{abort.current?.abort();},[key,locale]);
  useEffect(()=>{setState('idle');setError('');},[key,locale]);
  function toggle(){
    if(state!=='idle'){abort.current?.abort();setState('idle');return;}
    const passage=resolveContentPassage(language??locale,texts);
    const c=new AbortController();abort.current=c;setState('playing');setError('');
    streamSpeech(passage.texts.join('. '),passage.locale,c.signal).then(()=>{if(!c.signal.aborted)setState('idle');}).catch(e=>{if(c.signal.aborted)return;setState('idle');setError(e instanceof Error?e.message:ui("La lecture audio a échoué."));});
  }
  return <div className="listen-button"><Button type="button" variant="outline" size="sm" onClick={toggle} aria-pressed={state!=='idle'}>{state==='loading'?<LoaderCircle className="animate-spin"/>:state==='playing'?<Square/>:<Volume2/>}{state==='idle'?ui("Écouter"):ui("Arrêter")}</Button>{error&&<p role="alert" className="question-aids-note">{error}</p>}</div>;
}
