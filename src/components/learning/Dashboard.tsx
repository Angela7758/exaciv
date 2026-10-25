import {useI18n} from '@/lib/i18n';
import {latestCompleteExam} from '@/lib/exam-summary';
import {applicableLessons,completedApplicable} from '@/lib/catalogue-coverage';
import {SafeImage} from '@/components/site/SafeImage';
import {useContentT} from '@/lib/i18n/content';
import {useUiT} from '@/lib/i18n/internal';
import {Link} from '@tanstack/react-router';
import {useSuspenseQuery} from '@tanstack/react-query';
import {ArrowRight,BookOpen,CalendarDays,ChartNoAxesColumn,ChevronRight,Clock,FileText,Play,RotateCcw,Target} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {catalogueOptions,learningOptions} from '@/lib/learning.queries';
import {sessionsOptions} from '@/lib/session.queries';
import {percentage,TOPICS} from '@/config/learning';
import {ProgressBar} from './primitives';
import {PlanningAgenda} from './LearningAgenda';
import {TOPIC_ARTWORK} from '@/config/topic-artwork';
import {collectMistakes} from '@/lib/review';
import civi from '@/assets/civi.png';
export function Dashboard(){const ui=useUiT();const {locale}=useI18n();const ct=useContentT();const {data}=useSuspenseQuery(learningOptions);const {data:catalogueData}=useSuspenseQuery(catalogueOptions);const {data:allSessions}=useSuspenseQuery(sessionsOptions);
 const catalogue={...catalogueData,lessons:applicableLessons(catalogueData.lessons,data.profile.parcours)};
 const next=catalogue.lessons.find(l=>!data.completions.some(c=>c.lesson_id===l.id));
 const resumeId=data.readingPositions.find(r=>!data.completions.some(v=>v.lesson_id===r.lesson_id))?.lesson_id;
 const resume=catalogue.lessons.find(l=>l.id===resumeId)??next;
 const progress=percentage(completedApplicable(catalogue.lessons,data.completions),catalogue.lessons.length);
 const sessions=allSessions.filter(s=>s.parcours===data.profile.parcours);
 const lastPractice=sessions.find(s=>s.kind==='practice'&&s.completed_at);
 const lastExam=latestCompleteExam(sessions);
 const mistakes=collectMistakes(sessions).filter(m=>!m.mastered).length;
 const activities=[...data.completions.map(c=>({id:c.lesson_id,title:catalogue.lessons.find(l=>l.id===c.lesson_id)?.title??ui("Leçon"),date:c.completed_at,kind:ui("Leçon")})),...sessions.filter(s=>s.completed_at).map(a=>({id:a.id,title:`${a.kind==='exam'?ui("Examen blanc"):ui("Entraînement")} : ${a.correct}/${a.total}`,date:a.completed_at??a.started_at,kind:a.kind==='exam'?ui("Examen blanc"):ui("Entraînement")}))].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
 return <>
  <header className="page-heading"><h1>{ui("Votre tableau de bord")}</h1><p>{ui("Votre prochaine action, en un coup d’œil.")}</p></header>
  <div className="dash-top">
   <section className="dash-next">
    <span className="status-pill">{resume?ct(resume.topic):ui("Entraînement")}</span>
    <h2>{resume?ct(resume.title):ui("Vos leçons sont terminées")}</h2>
    {resume&&<div className="dash-next-meta"><Clock/>{resume.minutes} {ui("min")} · {ui("Leçon")} {resume.position}</div>}
    <p>{resume?ct(resume.body[0]??''):ui("Vous pouvez maintenant vous entraîner avec les questions de révision.")}</p><small>{ui("Prochaine leçon recommandée dans votre parcours.")}</small>
    {resume?<Button asChild variant="cta" size="lg"><Link to="/app/lecons/$slug" params={{slug:resume.id}}><Play className="fill-current"/>{resumeId?ui("Reprendre la leçon"):ui("Commencer la leçon")}<ChevronRight/></Link></Button>:<Button asChild variant="cta" size="lg"><Link to="/app/entrainement"><Target/>{ui("M’entraîner")}<ChevronRight/></Link></Button>}
    <SafeImage src={civi} alt=""/>
   </section>
   <section className="dash-agenda"><h2><CalendarDays/>{ui("Mon agenda")}</h2><PlanningAgenda/></section>
  </div>
  <div className="dash-stats">
   <section className="dash-stat"><header><span><BookOpen/></span>{ui("Cours terminés")}</header><b>{completedApplicable(catalogue.lessons,data.completions)}/{catalogue.lessons.length}</b><ProgressBar value={progress}/><p>{progress}% {ui("du parcours")}</p></section>
   <section className="dash-stat"><header><span><ChartNoAxesColumn/></span>{ui("Dernière session")}</header>{lastPractice?<><b>{lastPractice.correct}/{lastPractice.total}</b><p>{ui("bonnes réponses le")} {new Date(lastPractice.completed_at??lastPractice.started_at).toLocaleDateString(locale)}</p></>:<><b>—</b><p>{ui("Aucune session terminée pour le moment.")}</p></>}</section>
   <section className="dash-stat"><header><span><FileText/></span>{ui("Examen blanc")}</header>{lastExam?<><b>{lastExam.correct}/{lastExam.total}</b><p>{(lastExam.correct??0)>=(lastExam.total??40)*0.8?ui("Seuil de réussite atteint"):ui("Seuil de réussite non atteint")}</p></>:<><b>{ui("Pas encore évalué")}</b><p>{ui("Lancez une simulation complète quand vous êtes prêt.")}</p></>}</section>
  </div>
  <section className="dash-themes"><h2>{ui("Vos thèmes")}</h2>{TOPICS.map(t=>{const lessons=catalogue.lessons.filter(l=>l.topic===t.title);const done=lessons.filter(l=>data.completions.some(c=>c.lesson_id===l.id)).length;const pct=percentage(done,lessons.length);const artwork=TOPIC_ARTWORK[t.art];return <Link to="/app/lecons" search={{theme:t.title,q:'',state:'all'}} className="dash-theme" key={ct(t.title)}><SafeImage src={artwork.src} fallbackSrc={artwork.src} width={1376} height={768} loading="lazy" alt={ct(t.title)}/><div><h3>{ct(t.title)}</h3><p>{lessons.length?`${done}/${lessons.length} ${ui("leçons")}`:ui("Bientôt disponible")}</p></div>{lessons.length>0&&<div className="dash-theme-progress"><ProgressBar value={pct} tone={t.tone}/><b>{pct}%</b></div>}<ChevronRight/></Link>;})}</section>
  <div className="dash-bottom">
   <section className="dash-review"><span><RotateCcw/></span><div><h2>{ui("À revoir aujourd’hui")}</h2><p>{mistakes?ui("{0} questions à revoir",mistakes):ui("Aucune erreur à revoir pour le moment.")}</p></div><Button asChild variant="interactive"><Link to="/app/mes-erreurs">{ui("Réviser")}<ArrowRight/></Link></Button></section>
   <section className="dash-activity"><h2><Clock/>{ui("Activité récente")}</h2>{activities.length?<ul className="activity-list">{activities.map(a=><li key={a.id}><BookOpen/><span>{ct(a.title)}</span><small>{a.kind}</small><time>{new Date(a.date).toLocaleDateString(locale)}</time><ChevronRight/></li>)}</ul>:<div className="empty-activity"><BookOpen/><p>{ui("Votre première leçon vous attend.")}</p><Link to="/app/lecons">{ui("Commencer à apprendre")} <ArrowRight/></Link></div>}</section>
  </div>
 </>;
}
