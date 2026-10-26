import {useEffect,useRef,useState} from 'react';
import {Mic,Square,Play,RotateCcw} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useUiT} from '@/lib/i18n/internal';
import {AUDIO_STOP_EVENT,stopLearningAudio} from '@/lib/local-audio';

/** Local-only pronunciation practice: records the learner, keeps audio in memory, never uploads it. */
export function RecordButton({label}:{label?:string}){
  const ui=useUiT();
  const [state,setState]=useState<'idle'|'recording'|'ready'>('idle');
  const [url,setUrl]=useState<string|null>(null);
  const [error,setError]=useState('');
  const rec=useRef<MediaRecorder|null>(null);const audio=useRef<HTMLAudioElement|null>(null);
  const mounted=useRef(true);const currentUrl=useRef<string|null>(null);
  useEffect(()=>{mounted.current=true;const silence=()=>audio.current?.pause();window.addEventListener(AUDIO_STOP_EVENT,silence);return()=>{mounted.current=false;if(rec.current){rec.current.onstop=null;if(rec.current.state==='recording')rec.current.stop();rec.current.stream.getTracks().forEach(t=>t.stop());}audio.current?.pause();if(currentUrl.current)URL.revokeObjectURL(currentUrl.current);window.removeEventListener(AUDIO_STOP_EVENT,silence);};},[]);
  async function start(){
    stopLearningAudio();
    setError('');
    if(typeof navigator==='undefined'||!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){setError(ui("L’enregistrement n’est pas disponible dans ce navigateur."));return;}
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      if(!mounted.current){stream.getTracks().forEach(t=>t.stop());return;}
      const r=new MediaRecorder(stream);const chunks:Blob[]=[];
      r.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
      r.onstop=()=>{stream.getTracks().forEach(t=>t.stop());if(!mounted.current)return;const blob=new Blob(chunks,{type:r.mimeType||'audio/webm'});if(currentUrl.current)URL.revokeObjectURL(currentUrl.current);const next=URL.createObjectURL(blob);currentUrl.current=next;setUrl(next);setState('ready');};
      rec.current=r;r.start();setState('recording');
    }catch{setError(ui("Autorisez le micro pour enregistrer votre voix."));}
  }
  function stop(){rec.current?.state==='recording'&&rec.current.stop();}
  function play(){if(!url)return;stopLearningAudio();audio.current=new Audio(url);void audio.current.play().catch(()=>setError(ui("La lecture audio a échoué.")));}
  return <span className="record-button">
    {state==='recording'
      ?<Button type="button" variant="outline" size="sm" onClick={stop} aria-pressed="true" className="recording"><Square/>{ui("Arrêter l’enregistrement")}</Button>
      :<Button type="button" variant="outline" size="sm" onClick={start}>{state==='ready'?<RotateCcw/>:<Mic/>}{state==='ready'?ui("Réenregistrer"):ui(label??"S’entraîner à prononcer")}</Button>}
    {state==='ready'&&<Button type="button" variant="outline" size="sm" onClick={play}><Play/>{ui("Écouter ma voix")}</Button>}
    {error&&<span role="alert" className="question-aids-note">{error}</span>}
  </span>;
}
