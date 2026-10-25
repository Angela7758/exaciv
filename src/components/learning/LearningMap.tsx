import {useI18n} from '@/lib/i18n';
import {applicableLessons,completedApplicable} from '@/lib/catalogue-coverage';
import {SafeImage} from '@/components/site/SafeImage';
import {useContentT} from '@/lib/i18n/content';
import {useUiT} from '@/lib/i18n/internal';
import {useState} from 'react';
import {useSuspenseQuery} from '@tanstack/react-query';
import {Link} from '@tanstack/react-router';
import {ArrowRight,BookOpen,CalendarDays,Check,ChevronDown,Clock,Info,Play,Settings,Target} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {catalogueOptions,learningOptions} from '@/lib/learning.queries';
import {percentage,TOPICS} from '@/config/learning';
import {PARCOURS} from '@/config/content';
import {ProgressBar} from './primitives';
import {TOPIC_ARTWORK} from '@/config/topic-artwork';
import civi from '@/assets/civi.png';

export function LearningMap(){
 const ui=useUiT();const {locale}=useI18n();const ct=useContentT();
 const {data}=useSuspenseQuery(learningOptions);
 const {data:catalogueData}=useSuspenseQuery(catalogueOptions);
 const catalogue={...catalogueData,lessons:applicableLessons(catalogueData.lessons,data.profile.parcours)};
 const next=catalogue.lessons.find(l=>!data.completions.some(c=>c.lesson_id===l.id));
 const resumeId=data.readingPositions.find(r=>!data.completions.some(v=>v.lesson_id===r.lesson_id))?.lesson_id;
 const resume=catalogue.lessons.find(l=>l.id===resumeId)??next;
 const pathway=PARCOURS.find(p=>p.id===data.profile.parcours)?.title;
 const doneCount=completedApplicable(catalogue.lessons,data.completions);
 const progress=percentage(doneCount,catalogue.lessons.length);
 const firstOpen=TOPICS.findIndex(t=>catalogue.lessons.some(l=>l.topic===t.title&&!data.completions.some(c=>c.lesson_id===l.id)));
 const [open,setOpen]=useState<number>(firstOpen===-1?0:firstOpen);
 return <>
  <header className="page-heading"><h1>{ui("Votre parcours civique")}</h1><p>{ui("Un objectif clair, une étape à la fois.")}</p></header>
  <section className="path-objective">
   <div className="path-objective-item"><span><Target/></span><div><b>{pathway?ui(pathway):ui("Mon objectif")}</b><small>{ui("Votre objectif")}</small></div></div>
   <div className="path-objective-item"><span><CalendarDays/></span><div><b>{data.profile.goal_date?new Date(data.profile.goal_date+'T12:00:00').toLocaleDateString(locale,{day:'numeric',month:'long',year:'numeric'}):ui("Date à définir")}</b><small>{ui("Examen")}</small></div></div>
   <div className="path-objective-item"><span><Clock/></span><div><b>{ui("{0} min par jour",data.profile.daily_minutes)}</b><small>{ui("Notre recommandation")}</small></div></div>
   <Button asChild variant="outline"><Link to="/app/profil"><Settings/>{ui("Modifier")}</Link></Button>
  </section>
  {resume&&<section className="path-next">
   <span className="path-next-icon"><BookOpen/></span>
   <div>
    <span className="status-pill path-next-pill">{ui("À poursuivre")}</span>
    <h2>{ct(resume.title)} · {resume.minutes} {ui("min")}</h2>
    <p>{ct(resume.body[0]??'')}</p>
    <Button asChild variant="cta"><Link to="/app/lecons/$slug" params={{slug:resume.id}}>{resumeId?ui("Reprendre"):ui("Commencer")}<ArrowRight/></Link></Button>
   </div>
   <SafeImage src={civi} alt={ui("CIVI vous accompagne")}/>
  </section>}
  <section className="path-progress">
   <header><h2>{ui("Votre progression globale")}</h2><b>{doneCount} / {catalogue.lessons.length} {ui("leçons terminées")}</b></header>
   <ProgressBar value={progress}/>
   <footer><b>{progress}%</b> {ui("Leçons terminées")}</footer>
  </section>
  <div className="path-themes">
   {TOPICS.map((t,i)=>{
    const lessons=catalogue.lessons.filter(l=>l.topic===t.title);
    const done=lessons.filter(l=>data.completions.some(c=>c.lesson_id===l.id)).length;
    const pct=percentage(done,lessons.length);
    const art=TOPIC_ARTWORK[t.art];
    const expanded=open===i;
    return <section className="path-theme" data-open={expanded} key={ct(t.title)}>
     <Button variant="ghost" type="button" aria-expanded={expanded} aria-controls={`path-theme-${i}`} onClick={()=>setOpen(expanded?-1:i)}>
      <span className="path-theme-num" aria-hidden="true">{i+1}</span>
      <span className="path-theme-art"><SafeImage src={art.src} alt=""/></span>
      <div><h2>{ct(t.title)}</h2><p className="path-theme-desc">{ct(t.description)}</p></div>
      <div className="path-theme-side"><span className="path-theme-count">{lessons.length?ui("{0} / {1} leçons terminées",done,lessons.length):ui("Bientôt disponible")}</span>{lessons.length>0&&<div className="path-theme-bar"><ProgressBar value={pct} tone={t.tone}/><b>{pct}%</b></div>}</div>
      <ChevronDown/>
     </Button>
     {expanded&&<div className="path-lessons" id={`path-theme-${i}`}>
      {lessons.length?<>
       {lessons.map(l=>{
        const isDone=data.completions.some(c=>c.lesson_id===l.id);
        const inProgress=!isDone&&data.readingPositions.some(r=>r.lesson_id===l.id);
        const state=isDone?'done':inProgress?'current':'new';
        return <div className={`path-lesson ${isDone?'done':''}`} key={l.id}>
         <span className={`path-lesson-icon ${state}`} aria-hidden="true">{isDone?<Check size={14}/>:inProgress?<Play size={12} className="fill-current"/>:null}</span>
         <div><h3>{ct(l.title)}</h3><small>{l.minutes} {ui("min")}</small></div>
         <span className="lesson-state" data-s={state}>{isDone?ui("Terminée"):state==='current'?ui("Leçon en cours"):ui("Non commencée")}</span>
         <Button asChild variant={isDone?'outline':'interactive'}><Link to="/app/lecons/$slug" params={{slug:l.id}}>{isDone?ui("Voir"):inProgress?ui("Reprendre"):ui("Commencer")}</Link></Button>
        </div>;
       })}
       <Link className="path-theme-link" to="/app/lecons" search={{theme:t.title,q:'',state:'all'}}>{ui("Voir les {0} leçons de ce thème",lessons.length)}<ArrowRight/></Link>
      </>:<p className="path-empty">{ui("Les leçons de ce thème sont en cours de préparation.")}</p>}
     </div>}
    </section>;
   })}
  </div>
  <aside className="path-note"><Info/><div><h2>{ui("Comment fonctionne votre progression ?")}</h2><p>{ui("La lecture et les résultats aux exercices sont suivis séparément.")}</p></div></aside>
 </>;
}
