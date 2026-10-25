import {plural} from '@/lib/learner-labels';
import {useUiT} from '@/lib/i18n/internal';
import {useEffect,useRef,useState} from 'react';
import {useServerFn} from '@tanstack/react-start';
import {Sparkles,Plus,Trash2,Square,Download} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {supabase} from '@/integrations/supabase/client';
import {getLatestRevisionPlan} from '@/lib/revision-plan.functions';
import {revisionPlanSchema,type RevisionPlan} from '@/lib/revision-plan';
import type {Mistake} from '@/lib/review';

export function RevisionPlanner({mistakes,demo}:{mistakes:Mistake[];demo:boolean}){const ui=useUiT();
 const [open,setOpen]=useState(false);const [entries,setEntries]=useState([{question:'',response:''}]);const [minutes,setMinutes]=useState(15);const [plan,setPlan]=useState<RevisionPlan|null>(null);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const abort=useRef<AbortController|null>(null);const latest=useServerFn(getLatestRevisionPlan);
 useEffect(()=>()=>abort.current?.abort(),[]);
 async function show(){setOpen(true);setError('');if(!demo){try{const saved=await latest();if(saved)setPlan(saved.plan);}catch{setError(ui("Le dernier plan n’a pas pu être chargé."));}}}
 function importErrors(){setEntries(mistakes.slice(0,20).map(m=>({question:m.question.question,response:m.question.options[m.selected]??ui("Sans réponse")})));setPlan(null);}
 async function generate(){if(demo||busy)return;setError('');setBusy(true);setPlan(null);const control=new AbortController();abort.current=control;
  try{const {data}=await supabase.auth.getSession();if(!data.session)throw new Error(ui("Connectez-vous pour créer votre plan."));
   const r=await fetch('/api/revision-plan',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${data.session.access_token}`},body:JSON.stringify({mistakes:entries,minutes}),signal:control.signal});
   if(!r.ok){const e=await r.json();throw new Error(e.message??ui("La génération est indisponible."));}
   if(!r.body)throw new Error(ui("Aucun plan reçu."));const reader=r.body.getReader();const decoder=new TextDecoder();let buffer='';let received=false;
   while(true){const next=await reader.read();buffer+=decoder.decode(next.value,{stream:!next.done});const lines=buffer.split('\n');buffer=lines.pop()??'';
    for(const line of lines){if(!line.trim())continue;const event=JSON.parse(line);if(event.type==='error')throw new Error(event.message);if(event.type==='plan'){setPlan(revisionPlanSchema.parse(event.plan));received=true;}}
    if(next.done)break;
   }if(!received)throw new Error(ui("Aucun plan reçu."));
  }catch(e){setError(control.signal.aborted?ui("Génération arrêtée."):e instanceof Error?e.message:ui("La génération est indisponible."));}
  finally{setBusy(false);abort.current=null;}
 }
 function download(){if(!plan)return;const text=[plan.summary,'',...plan.priorities.map(p=>`• ${p}`),'',...plan.days.flatMap((d,i)=>[`Jour ${i+1} — ${d.title}`,...d.tasks.map(t=>`• ${t}`),`À vérifier : ${d.selfCheck}`,''])].join('\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='ExaCiv-plan-de-revision.txt';a.click();URL.revokeObjectURL(url);}
 return <><Button variant="outline" className="my-3" onClick={show}><Sparkles/>{ui("Mon plan de révision IA")}</Button><Dialog open={open} onOpenChange={v=>{if(busy&&!v)abort.current?.abort();setOpen(v);}}><DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl"><DialogTitle>{ui("Mon plan de révision personnalisé")}</DialogTitle><DialogDescription>{ui("Plan généré par IA, non officiel. Vérifiez les notions dans vos leçons et les sources officielles.")}</DialogDescription>
 {demo?<p>{ui("La génération est disponible avec vos erreurs personnelles, hors démonstration.")}</p>:<form className="space-y-4" onSubmit={e=>{e.preventDefault();void generate();}}>
 <Button type="button" variant="outline" disabled={busy||!mistakes.length} onClick={importErrors}>{ui("Utiliser mes")} {Math.min(mistakes.length,20)} {ui(plural(Math.min(mistakes.length,20),"erreur à revoir","erreurs à revoir"))}</Button>
 <fieldset disabled={busy} className="space-y-4"><legend className="text-sm text-muted-foreground mb-3">{ui("Questions et réponses incorrectes · sans informations personnelles")}</legend>{entries.map((entry,i)=><div key={i} className="space-y-2 border-b border-border pb-3"><div className="flex items-center justify-between gap-2"><span className="font-semibold text-sm">{ui("Erreur")} {i+1}</span><Button type="button" variant="ghost" size="icon" aria-label={ui("Supprimer l’erreur {0}", i+1)} disabled={entries.length===1} onClick={()=>setEntries(v=>v.filter((_,j)=>j!==i))}><Trash2 className="size-4"/></Button></div><label className="block text-sm">{ui("Question")}<textarea required maxLength={1000} aria-label={ui("Question {0}", i+1)} className="mt-1 min-h-16 w-full rounded-md border border-input bg-background p-2 text-foreground" value={entry.question} onChange={e=>setEntries(v=>v.map((x,j)=>j===i?{...x,question:e.target.value}:x))}/></label><label className="block text-sm">{ui("Votre réponse incorrecte")}<textarea required maxLength={1000} aria-label={ui("Réponse incorrecte {0}", i+1)} className="mt-1 min-h-16 w-full rounded-md border border-input bg-background p-2 text-foreground" value={entry.response} onChange={e=>setEntries(v=>v.map((x,j)=>j===i?{...x,response:e.target.value}:x))}/></label></div>)}
 <Button type="button" variant="outline" disabled={entries.length>=20} onClick={()=>setEntries(v=>[...v,{question:'',response:''}])}><Plus/>{ui("Ajouter une erreur")}</Button>
 <label className="flex items-center gap-3 text-sm">{ui("Temps quotidien")}<input aria-label={ui("Minutes par jour")} type="number" min={5} max={60} required value={minutes} onChange={e=>setMinutes(Number(e.target.value))} className="w-20 rounded-md border border-input bg-background p-2"/>{ui("min")}</label></fieldset>
 {busy?<div className="flex flex-wrap items-center gap-3"><p role="status" className="text-sm text-muted-foreground">{ui("Votre plan est en cours de préparation…")}</p><Button type="button" variant="outline" onClick={()=>abort.current?.abort()}><Square/>{ui("Arrêter")}</Button></div>:<Button type="submit" variant="interactive"><Sparkles/>{plan?ui("Générer un nouveau plan"):ui("Générer mon plan")}</Button>}
 </form>}
 {error&&<p role="alert" className="text-destructive text-sm">{error}</p>}
 {plan&&<section aria-label={ui("Plan de révision généré")} className="space-y-4 border-t border-border pt-4"><div className="flex items-center justify-between gap-3"><h2 className="font-bold text-lg">{ui("Votre programme")}</h2><Button variant="outline" size="icon" aria-label={ui("Télécharger le plan")} title={ui("Télécharger le plan")} onClick={download}><Download className="size-4"/></Button></div><p>{plan.summary}</p><h3 className="font-semibold">{ui("Priorités")}</h3><ul className="list-disc pl-5 space-y-1">{plan.priorities.map((p,i)=><li key={i}>{p}</li>)}</ul>{plan.days.map((d,i)=><div key={i} className="border-t border-border pt-3 space-y-2"><h3 className="font-semibold">{ui("Jour")} {i+1} · {d.title}</h3><ul className="list-disc pl-5 space-y-1">{d.tasks.map((t,j)=><li key={j}>{t}</li>)}</ul><p className="text-sm text-muted-foreground">{ui("À vérifier :")} {d.selfCheck}</p></div>)}</section>}
 </DialogContent></Dialog></>;
}