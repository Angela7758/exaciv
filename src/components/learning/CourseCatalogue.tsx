import {applicableLessons} from '@/lib/catalogue-coverage';
import {SafeImage} from '@/components/site/SafeImage';
import {useContentT} from '@/lib/i18n/content';
import {useUiT} from '@/lib/i18n/internal';
import {useSuspenseQuery} from '@tanstack/react-query';
import {Link,useSearch,useNavigate} from '@tanstack/react-router';
import {Search,Clock,Play,ArrowRight,BookOpen} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {catalogueOptions,learningOptions} from '@/lib/learning.queries';
import {filterLessonRows} from '@/lib/account-settings';
import {TOPICS} from '@/config/learning';
import {LESSON_ILLUSTRATIONS} from '@/config/lesson-illustrations';
import valuesArt from '@/assets/reference-valeurs.png.asset.json';

type Row={id:string;title:string;topic:string;minutes:number;status:string;description:string};

export function CourseCatalogue({demo=false}:{demo?:boolean}){
 const ui=useUiT();const ct=useContentT();
 const {data:catalogueData}=useSuspenseQuery(catalogueOptions);
 const {data:d}=useSuspenseQuery(learningOptions);
 const c={...catalogueData,lessons:applicableLessons(catalogueData.lessons,d.profile.parcours)};
 const filters=useSearch({from:'/_authenticated/app/lecons/'});const navigate=useNavigate();const search=filters.q??'';const theme=filters.theme??'all';const status=filters.state??'all';const update=(patch:Partial<typeof filters>)=>{void navigate({to:'/app/lecons',search:previous=>({...previous,...patch}),replace:true});};const setSearch=(q:string)=>update({q});const setTheme=(theme:string)=>update({theme});const setStatus=(state:string)=>update({state});
 
 const demoLessons:Row[]=[{id:'laicite',title:'La laïcité et la liberté de conscience',topic:TOPICS[0].title,minutes:10,status:'current',description:'Découvrez les principes de la laïcité, son rôle dans la société et la liberté de conscience.'},{id:c.lessons.find(l=>/parlement|institution/i.test(l.title))?.id??c.lessons[0]?.id??'laicite',title:'Le rôle du Parlement',topic:TOPICS[1].title,minutes:8,status:'new',description:'Comprenez le fonctionnement, les missions et le rôle du Parlement dans la Ve République.'}];
 const rows:Row[]=demo?demoLessons:c.lessons.map(l=>({id:l.id,title:l.title,topic:l.topic,minutes:l.minutes,status:d.completions.some(x=>x.lesson_id===l.id)?'done':d.readingPositions.some(r=>r.lesson_id===l.id)?'current':'new',description:l.body[0]??''}));
 const filtered=filterLessonRows(rows.map(r=>({...r,title:ct(r.title)})),search,theme,status);
 const resumeId=demo?'laicite':d.readingPositions.find(r=>!d.completions.some(v=>v.lesson_id===r.lesson_id))?.lesson_id;
 const resume=c.lessons.find(l=>l.id===resumeId);
 const topics=[...new Set(rows.map(l=>l.topic))];
 return <>
  <header className="page-heading"><h1>{ui("Vos leçons")}</h1><p>{ui("Comprenez les notions essentielles, à votre rythme.")}</p></header>
  {resume&&<section className="cat-resume"><span><BookOpen/></span><div><h2>{ct(resume.title)}</h2><p>{ct(resume.topic)} · {resume.minutes} {ui("min")}</p></div><Button asChild variant="cta"><Link to="/app/lecons/$slug" params={{slug:resume.id}}><Play className="fill-current"/>{ui("Reprendre ma leçon")}</Link></Button></section>}
  <div className="cat-tools">
   <label><Search/><input aria-label={ui("Rechercher une leçon")} placeholder={ui("Rechercher une leçon")} value={search} onChange={e=>setSearch(e.target.value)}/></label><Button variant="outline" onClick={()=>update({q:'',theme:'all',state:'all'})}>{ui("Réinitialiser")}</Button>
   <select aria-label={ui("Thème des leçons")} value={theme} onChange={e=>setTheme(e.target.value)}><option value="all">{ui("Tous les thèmes")}</option>{topics.map(t=><option key={t} value={t}>{ct(t)}</option>)}</select>
  </div>
  <div className="cat-status" role="group" aria-label={ui("Filtrer par état")}>
   {([['all',ui("Toutes")],['new',ui("Non commencées")],['current',ui("En cours")],['done',ui("Terminées")]] as const).map(([id,label])=><Button variant="ghost" key={id} type="button" aria-pressed={status===id} onClick={()=>setStatus(id)}>{label}</Button>)}
  </div>
  {filtered.length?<div className="cat-grid">{filtered.map(l=>{
   const art=LESSON_ILLUSTRATIONS[l.id];
   const state=l.status==='done'?'done':l.status==='current'?'current':'new';
   return <article className="cat-card" key={l.id}>
    <SafeImage src={art?.src??valuesArt.url} alt={art?.alt??l.title} width={1376} height={768} loading="lazy"/>
    <div>
     <span className="status-pill">{ct(l.topic)}</span>
     <h3>{ct(l.title)}</h3>
     <p className="cat-desc">{ct(l.description)}</p>
     <div className="cat-meta"><Clock/>{l.minutes} {ui("min")}<span className="lesson-state" data-s={state}>{state==='done'?ui("Terminée"):state==='current'?ui("En cours"):ui("Non commencée")}</span></div>
     <Button asChild variant={state==='done'?'outline':'interactive'}><Link to="/app/lecons/$slug" params={{slug:l.id}}>{state==='done'?ui("Revoir la leçon"):state==='current'?ui("Continuer"):ui("Commencer")}<ArrowRight/></Link></Button>
    </div>
   </article>;
  })}</div>:<p className="cat-empty">{ui("Aucune leçon ne correspond à ces filtres.")}</p>}
 </>;
}
