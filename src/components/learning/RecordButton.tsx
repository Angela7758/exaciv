import {useEffect,useRef,useState} from 'react';
import {Mic,Square,Play,RotateCcw} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useUiT} from '@/lib/i18n/internal';

/** Local-only pronunciation practice: records the learner, keeps audio in memory, never uploads it. */
export function RecordButton(){
  const ui=useUiT();
  const [state,setState]=useState<'idle'|'recording'|'ready'>('idle');
  const [url,setUrl]=useState<string|null>(null);
  const [error,setError]=useState('');
  const rec=useRef<MediaRecorder|null>(null);const audio=useRef<HTMLAudioElement|null>(null);
  useEffect(()=>()=>{rec.current?.stream.getTracks().forEach(t=>t.stop());if(url)URL.revokeObjectURL(url);},[url]);
  async function start(){
    setError('');
    if(typeof navigator==='undefined'||!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){setError(ui("L’enregistrement n’est pas disponible dans ce navigateur."));return;}
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const r=new MediaRecorder(stream);const chunks:Blob[]=[];
      r.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
      r.onstop=()=>{stream.getTracks().forEach(t=>t.stop());const blob=new Blob(chunks,{type:r.mimeType||'audio/webm'});setUrl(old=>{if(old)URL.revokeObjectURL(old);return URL.createObjectURL(blob);});setState('ready');};
      rec.current=r;r.start();setState('recording');
    }catch{setError(ui("Autorisez le micro pour enregistrer votre voix."));}
  }
  function stop(){rec.current?.state==='recording'&&rec.current.stop();}
  function play(){if(!url)return;audio.current?.pause();audio.current=new Audio(url);void audio.current.play();}
  return <span className="record-button">
    {state==='recording'
      ?<Button type="button" variant="outline" size="sm" onClick={stop} aria-pressed="true" className="recording"><Square/>{ui("Arrêter l’enregistrement")}</Button>
      :<Button type="button" variant="outline" size="sm" onClick={start}>{state==='ready'?<RotateCcw/>:<Mic/>}{state==='ready'?ui("Réenregistrer"):ui("Enregistrer")}</Button>}
    {state==='ready'&&<Button type="button" variant="outline" size="sm" onClick={play}><Play/>{ui("Écouter ma voix")}</Button>}
    {error&&<span role="alert" className="question-aids-note">{error}</span>}
  </span>;
}
