import {useState,useEffect} from 'react';
import {useSuspenseQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import {useServerFn} from '@tanstack/react-start';
import {Link} from '@tanstack/react-router';
import {ChevronLeft,ChevronRight,CalendarDays,Plus,Pencil,Trash2,CheckCircle2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Popover,PopoverContent,PopoverTrigger} from '@/components/ui/popover';
import {Dialog,DialogContent,DialogTitle} from '@/components/ui/dialog';
import {catalogueOptions,learningOptions} from '@/lib/learning.queries';
import {availableTests} from '@/lib/admin/admin.functions';
import {dateKey,localDate,shiftDate,weekDates,userTimezone,dailyActivity} from '@/lib/agenda';
import {saveAgenda,deleteAgenda} from '@/lib/agenda.functions';
import type {Database} from '@/integrations/supabase/types';
type Task=Database['public']['Tables']['learning_agenda']['Row'];
const names={lesson:'Leçon',practice:'Entraînement',exam:'Examen blanc',revision:'Révision'};
function TaskEditor({task,date,onClose}:{task:Task|null;date:string;onClose:()=>void}){
 const {data:c}=useSuspenseQuery(catalogueOptions);const qc=useQueryClient();const save=useServerFn(saveAgenda);
 const [values,setValues]=useState({title:task?.title??'',kind:(task?.kind??'lesson') as keyof typeof names,lesson_id:task?.lesson_id??null,test_id:task?.test_id??null,scheduled_date:task?.scheduled_date??date,scheduled_time:task?.scheduled_time?.slice(0,5)??'',duration_minutes:task?.duration_minutes??15,completed:task?.completed??false});
 const [tests,setTests]=useState<{id:string;title:string}[]>([]);const [testError,setTestError]=useState('');const getTests=useServerFn(availableTests);
 useEffect(()=>{void getTests().then(r=>setTests(r)).catch(()=>setTestError('Les tests sont indisponibles.'));},[]);
 const mutation=useMutation({mutationFn:()=>save({data:{...values,id:task?.id,scheduled_time:values.scheduled_time||null,timezone:userTimezone()}}),onSuccess:async()=>{await qc.invalidateQueries({queryKey:['learning']});onClose();}});
 return <Dialog open onOpenChange={o=>{if(!o)onClose();}}><DialogContent className="agenda-editor"><DialogTitle>{task?'Modifier la tâche':'Ajouter une tâche'}</DialogTitle><form onSubmit={e=>{e.preventDefault();mutation.mutate();}} className="agenda-form">
  <label>Titre<input required maxLength={180} value={values.title} onChange={e=>setValues({...values,title:e.target.value})}/></label>
  <label>Type<select value={values.kind} onChange={e=>{const kind=e.target.value as keyof typeof names;setValues({...values,kind,lesson_id:null,test_id:null});if(kind==='exam'||kind==='practice')void getTests().then(r=>setTests(r)).catch(()=>setTestError('Les tests sont indisponibles.'));}}>{Object.entries(names).map(([id,label])=><option value={id} key={id}>{label}</option>)}</select></label>
  {values.kind==='lesson'?<label>Cours associé<select value={values.lesson_id??''} onChange={e=>setValues({...values,lesson_id:e.target.value||null})}><option value="">Aucun cours</option>{c.lessons.map(l=><option value={l.id} key={l.id}>{l.title}</option>)}</select></label>:<label>Test associé<select value={values.test_id??''} onChange={e=>setValues({...values,test_id:e.target.value||null})}><option value="">Entraînement libre</option>{tests.map(t=><option key={t.id} value={t.id}>{t.title}</option>)}</select></label>}
  <label>Date<input aria-label="Date de la tâche" type="date" required value={values.scheduled_date} onChange={e=>setValues({...values,scheduled_date:e.target.value})}/></label>
  <label>Heure (facultative)<input type="time" value={values.scheduled_time} onChange={e=>setValues({...values,scheduled_time:e.target.value})}/></label>
  <label>Durée prévue (minutes)<input type="number" min={1} max={480} required value={values.duration_minutes} onChange={e=>setValues({...values,duration_minutes:Number(e.target.value)})}/></label>
  <label className="agenda-checkbox"><input type="checkbox" checked={values.completed} onChange={e=>setValues({...values,completed:e.target.checked})}/>Tâche terminée</label>
  {(mutation.error||testError)&&<p role="alert">{mutation.error instanceof Error?mutation.error.message:testError}</p>}
  <Button variant="cta" type="submit" disabled={mutation.isPending}>{mutation.isPending?'Enregistrement…':'Enregistrer la tâche'}</Button>
 </form></DialogContent></Dialog>;
}
export function AgendaTasks({date,compact=false}:{date:string;compact?:boolean}){
 const {data:d}=useSuspenseQuery(learningOptions);const qc=useQueryClient();const remove=useServerFn(deleteAgenda);const save=useServerFn(saveAgenda);const [editor,setEditor]=useState<Task|null|undefined>();
 const mutation=useMutation({mutationFn:async(v:{task:Task;remove:boolean})=>{if(v.remove)return remove({data:{id:v.task.id}});return save({data:{...v.task,kind:v.task.kind as keyof typeof names,completed:!v.task.completed}});},onSuccess:()=>qc.invalidateQueries({queryKey:['learning']})});
 const tasks=d.agenda.filter(t=>t.scheduled_date===date);
 return <div className={`agenda-tasks ${compact?'agenda-compact':''}`}><div className="agenda-task-heading"><h3>{compact?'Votre plan du jour':'Tâches planifiées'}</h3><Button variant="outline" size="sm" onClick={()=>setEditor(null)}><Plus/>Ajouter</Button></div>{!tasks.length&&<p className="text-muted-foreground">Aucune tâche prévue.</p>}
  {tasks.map(t=><div className={`agenda-task ${t.completed?'agenda-task-done':''}`} key={t.id}>
   <Button variant="ghost" size="icon" title={t.completed?'Marquer à faire':'Marquer terminée'} aria-label={t.completed?'Marquer à faire':'Marquer terminée'} aria-pressed={t.completed} disabled={mutation.isPending} onClick={()=>mutation.mutate({task:t,remove:false})}><CheckCircle2/></Button>
   <div><b>{t.title}</b><small>{names[t.kind as keyof typeof names]} · {t.scheduled_time?.slice(0,5)??'Sans horaire'} · {t.duration_minutes} min prévues</small><Button asChild variant="link" size="sm">{t.lesson_id?<Link to="/app/lecons/$slug" params={{slug:t.lesson_id}}>Lire la leçon</Link>:<Link to={t.test_id?'/app/tests':t.kind==='exam'?'/app/examen-blanc':'/app/entrainement'}>Ouvrir</Link>}</Button></div>
   <Button size="icon" variant="ghost" aria-label="Modifier la tâche" onClick={()=>setEditor(t)}><Pencil/></Button><Button size="icon" variant="ghost" aria-label="Supprimer la tâche" disabled={mutation.isPending} onClick={()=>{if(window.confirm('Supprimer cette tâche ?'))mutation.mutate({task:t,remove:true});}}><Trash2/></Button>
  </div>)}{mutation.error&&<p role="alert">{mutation.error instanceof Error?mutation.error.message:'Modification impossible.'}</p>}{editor!==undefined&&<TaskEditor key={editor?.id??date} task={editor} date={date} onClose={()=>setEditor(undefined)}/>}
 </div>;
}
export function ActivityAgenda(){
 const {data:d,isFetching}=useSuspenseQuery(learningOptions);const [zone]=useState(userTimezone);const today=dateKey(new Date(),zone);const [selected,setSelected]=useState(today);const [calendar,setCalendar]=useState(false);const dates=weekDates(selected);const rows=dates.map(key=>({key,...dailyActivity(d,key,zone)}));const max=Math.max(1,...rows.map(r=>r.activities));const detail=dailyActivity(d,selected,zone);const format=(key:string,options:Intl.DateTimeFormatOptions)=>localDate(key).toLocaleDateString('fr-FR',options);
 return <section className="activity-chart activity-agenda"><header><CalendarDays/><div><h2>Votre activité</h2><p>Activités terminées · {zone}</p></div></header><div className="agenda-week-tools"><Button variant="ghost" size="icon" aria-label="Semaine précédente" onClick={()=>setSelected(shiftDate(selected,-7))}><ChevronLeft/></Button><b>{format(dates[0]??selected,{day:'numeric',month:'long'})} – {format(dates[6]??selected,{day:'numeric',month:'long',year:'numeric'})}</b><Button variant="ghost" size="icon" aria-label="Semaine suivante" onClick={()=>setSelected(shiftDate(selected,7))}><ChevronRight/></Button></div>
 <div className="agenda-controls"><Button variant="outline" size="sm" onClick={()=>setSelected(today)}>Aujourd’hui</Button><Popover open={calendar} onOpenChange={setCalendar}><PopoverTrigger asChild><Button variant="outline" size="sm"><CalendarDays/>Agenda</Button></PopoverTrigger><PopoverContent className="w-auto p-0 pointer-events-auto"><Calendar mode="single" selected={localDate(selected)} onSelect={v=>{if(v){setSelected(`${v.getFullYear()}-${String(v.getMonth()+1).padStart(2,'0')}-${String(v.getDate()).padStart(2,'0')}`);setCalendar(false);}}}/></PopoverContent></Popover></div>
 <div className="agenda-date-strip" aria-label="Dates de la semaine">{rows.map(r=><Button variant={r.key===selected?'interactive':'ghost'} key={r.key} aria-pressed={r.key===selected} aria-current={r.key===today?'date':undefined} onClick={()=>setSelected(r.key)}><span>{format(r.key,{weekday:'short'})}</span><b>{format(r.key,{day:'numeric'})}</b><small>{r.activities>0?'●':d.agenda.some(t=>t.scheduled_date===r.key)?'○':'·'}</small></Button>)}</div>
 <p className="agenda-axis">Nombre d’activités terminées</p><div className="agenda-chart" role="img" aria-label={rows.map(r=>`${r.key} : ${r.activities} activités`).join(', ')}><div className="agenda-axis-values"><span>{max}</span><span>0</span></div>{rows.map(r=><div className="agenda-bar" key={r.key}><span style={{height:`${r.activities/max*100}%`}}/><small>{r.activities}</small></div>)}</div>
 {isFetching&&<p role="status">Actualisation…</p>}<h3>{format(selected,{weekday:'long',day:'numeric',month:'long'})} · Activités réalisées</h3><dl className="agenda-day-stats"><div><dt>Cours terminés</dt><dd>{detail.lessons}</dd></div><div><dt>Questions enregistrées</dt><dd>{detail.questions}</dd></div><div><dt>Examens blancs</dt><dd>{detail.exams}</dd></div><div><dt>Temps des sessions</dt><dd>{detail.minutes} min</dd></div></dl><p className="agenda-axis">Le temps correspond aux sessions terminées ; la lecture non chronométrée n’est pas estimée.</p><AgendaTasks date={selected}/></section>;
}