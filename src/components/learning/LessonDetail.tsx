import {applicableLessons} from '@/lib/catalogue-coverage';
import {recordActivity} from '@/lib/activity';
import {useI18n} from '@/lib/i18n';
import {LessonTranslation} from './LessonTranslation';
import {RecordButton} from './RecordButton';
import {stopLearningAudio} from '@/lib/local-audio';
import {useUiT} from '@/lib/i18n/internal';
import {useEffect,useRef,useState} from 'react';
import {useSuspenseQuery,useQueryClient} from '@tanstack/react-query';
import {Link,useNavigate} from '@tanstack/react-router';
import {useServerFn} from '@tanstack/react-start';
import {BookOpen,Lightbulb,CheckCircle2,ChevronRight,ArrowRight,Target,Save,Clock,Languages,Unlock,Equal,Users} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {catalogueOptions,learningOptions} from '@/lib/learning.queries';
import {completeLesson,saveReadingPosition} from '@/lib/learning.functions';
import {startSession} from '@/lib/session.functions';
import {LearningCard} from './primitives';
import {SourceLink} from './SourceLink';
import {ListenButton} from './ListenButton';
import {BookmarkButton} from './BookmarkButton';
import {SafeImage} from '@/components/site/SafeImage';
import {LESSON_ILLUSTRATIONS} from '@/config/lesson-illustrations';
import {editorialLessonLayout,lastLessonSection,completeThenPractice} from '@/lib/lesson-reader';
export function LessonDetail({slug}:{slug:string}){return <LessonReader key={slug} slug={slug}/>;}
function LessonReader({slug}:{slug:string}){
 const ui=useUiT();const {locale}=useI18n();const {data:catalogue}=useSuspenseQuery(catalogueOptions);const {data:d}=useSuspenseQuery(learningOptions);
 const qc=useQueryClient();const complete=useServerFn(completeLesson);const save=useServerFn(saveReadingPosition);const start=useServerFn(startSession);const navigate=useNavigate();
 const [error,setError]=useState('');const [busy,setBusy]=useState(false);const [saving,setSaving]=useState(false);const [translation,setTranslation]=useState(false);
 const lessons=applicableLessons(catalogue.lessons,d.profile.parcours);const lesson=lessons.find(v=>v.id===slug);const last=lastLessonSection(lesson?.body??[]);
 const saved=d.readingPositions.find(v=>v.lesson_id===slug);const finalSaved=last!==null&&saved?.section_index===last;const [reached,setReached]=useState(finalSaved);const [persisted,setPersisted]=useState(finalSaved);
 const summaryRef=useRef<HTMLElement|null>(null);const writing=useRef(false);const savedRef=useRef(finalSaved);
 async function persist(){if(last===null||writing.current||savedRef.current)return;writing.current=true;setSaving(true);setError('');try{await save({data:{lessonId:slug,section:last}});savedRef.current=true;setPersisted(true);await qc.invalidateQueries({queryKey:['learning']});}catch(e){setError(e instanceof Error?ui(e.message):ui('Position non enregistrée.'));}finally{writing.current=false;setSaving(false);}}
 useEffect(()=>{const element=summaryRef.current;if(!element||last===null)return;const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setReached(true);void persist();}},{threshold:0.15});observer.observe(element);return()=>{observer.disconnect();stopLearningAudio();};},[slug,last]);
 if(!lesson)return <LearningCard><h1>{ui('Leçon introuvable')}</h1><Link to="/app/lecons">{ui('Retour aux leçons')}</Link></LearningCard>;
 const l=lesson;const done=d.completions.some(v=>v.lesson_id===l.id);const chapter=lessons.filter(v=>v.topic===l.topic);const chapterDone=chapter.filter(v=>d.completions.some(k=>k.lesson_id===v.id)).length;const layout=editorialLessonLayout(l.layout);const artwork=LESSON_ILLUSTRATIONS[l.id];const available=(catalogue.lessonQuestionCounts[l.id]??0)>=5;
 const status=done?'Terminée':reached||saved?'En cours':'Non commencée';
 const sourceName=catalogue.lessonSources[l.id];const sourceLabel=sourceName?`${ui('Consulter')} ${sourceName}`:ui('Voir la source officielle');
 const helpText=[...l.body,...(layout?.pillars.map(p=>`${p.title}. ${p.text}`)??[]),...(layout?[`${layout.example.title}. ${layout.example.text}`]:[])].join('\n\n');
 async function leave(){setBusy(true);setError('');try{if(reached&&!savedRef.current){await save({data:{lessonId:slug,section:last??0}});savedRef.current=true;}await qc.invalidateQueries({queryKey:['learning']});await navigate({to:'/app/lecons'});}catch(e){setError(e instanceof Error?ui(e.message):ui('Position non enregistrée.'));setBusy(false);}}
 async function verify(){setBusy(true);setError('');try{const id=await completeThenPractice(async()=>{await complete({data:{lessonId:slug}});void recordActivity('lesson',slug,locale);await qc.invalidateQueries({queryKey:['learning']});},()=>start({data:{kind:'lesson',lesson:slug}}));await qc.invalidateQueries({queryKey:['sessions']});await navigate({to:'/app/entrainement/$sessionId/feedback',params:{sessionId:id}});}catch(e){setError(e instanceof Error?ui(e.message):ui('Enregistrement impossible.'));setBusy(false);}}
 return <div className="lesson-detail-grid fidelity-lesson"><LearningCard className="detail-reading">
  <nav className="lesson-breadcrumb" aria-label={ui('Fil d’Ariane')}><BookOpen/><Link to="/app/lecons">{ui('Leçons')}</Link><span>/</span><span lang="fr">{l.topic}</span></nav>
  <header className="lesson-title-row"><h1 lang="fr" dir="ltr">{l.title}</h1><div className="lesson-header-tools"><ListenButton texts={l.body} language="fr"/><Button size="sm" variant="outline" aria-expanded={translation} onClick={()=>setTranslation(!translation)}><Languages/>{ui('Traduire')}</Button><RecordButton label="Prononcer"/><BookmarkButton kind="lesson" itemId={slug} iconOnly/></div></header>
  <p className="lesson-meta"><Clock/>{l.minutes} {ui('min')} · {ui(status)}</p>
  <div className={`lesson-overview ${layout?.objectives.length?'':'lesson-overview-no-objectives'}`}>
   {layout&&layout.objectives.length>0&&<section className="lesson-objectives" lang="fr" dir="ltr"><h2><Target/>{ui('Objectifs de la leçon')}</h2><ul>{layout.objectives.map(text=><li key={text}>{text}</li>)}</ul></section>}
   {artwork&&<SafeImage className="lesson-hero" src={artwork.src} alt={artwork.alt} width={1376} height={768}/>}
  </div>
  {!l.body.length?<p role="status">{ui('Le contenu de cette leçon est en cours de préparation. Aucun progrès ne sera enregistré.')}</p>:<>
   <div id="lesson-text" className="lesson-continuous-body" lang="fr" dir="ltr"><h2>{layout?.pillars.length?layout.pillars.map(p=>p.title).join(', '):l.title}</h2>{l.body.map((text,index)=><p className="lesson-source-text" key={index}>{text}</p>)}</div>
   {layout&&layout.pillars.length>0&&<div className="lesson-pillars" lang="fr" dir="ltr">{layout.pillars.map((p,i)=>{const Icon=p.key==='liberte'?Unlock:p.key==='egalite'?Equal:Users;return <section key={p.key} className={`lesson-pillar pillar-${i%3}`}><Icon/><div><h3>{p.title}</h3><p>{p.text}</p></div></section>;})}</div>}
   {layout?.example&&<section className="lesson-example" lang="fr" dir="ltr"><Lightbulb/><div><h3>{layout.example.title}</h3><p>{layout.example.text}</p></div></section>}
   {d.profile.translation_help!==false&&<LessonTranslation text={helpText} helpLocale={d.profile.help_locale??'fr'} bar open={translation} onOpenChange={setTranslation}/>}
   <section ref={summaryRef} className="lesson-summary" lang="fr" dir="ltr"><h2><Lightbulb/>{ui('À retenir')}</h2>{l.takeaway.length>0&&<ol>{l.takeaway.map((text,index)=><li key={text}><span>{index+1}</span>{text}</li>)}</ol>}<SourceLink url={l.source_url} label={sourceLabel}/></section>
   {error&&<p role="alert" className="text-critical">{error}</p>}
   <footer className="lesson-actions-bar"><Button variant="outline" disabled={busy} onClick={leave}><Save/>{ui('Enregistrer et quitter')}</Button><span className="lesson-save-status" role="status"><CheckCircle2/>{ui(saving?'Enregistrement…':persisted?'Sauvegardé':'Non commencée')}</span><Button variant="cta" disabled={busy||saving||!persisted||!available} onClick={verify}>{ui('Vérifier mes connaissances')}<ArrowRight/></Button></footer>
   {!available&&<p className="source-pending">{ui('Les exercices de cette leçon sont indisponibles : au moins 5 questions publiées sont nécessaires.')}</p>}
  </>}
 </LearningCard><aside className="detail-aside"><LearningCard className="chapter-list"><h2>{ui('Dans ce chapitre')} · {chapterDone} / {chapter.length}</h2><ol>{chapter.map((v,i)=>{const completed=d.completions.some(k=>k.lesson_id===v.id);const progress=d.readingPositions.some(k=>k.lesson_id===v.id)||(v.id===slug&&reached);return <li key={v.id} className={v.id===slug?'current':''}><span className="chapter-step">{i+1}</span><Link to="/app/lecons/$slug" params={{slug:v.id}}><b lang="fr">{v.title}</b><small>{ui('Leçon ·')} {v.minutes} {ui('min')}{completed?` · ${ui('Terminée')}`:progress?` · ${ui('En cours')}`:''}</small></Link>{v.id===slug&&<ChevronRight/>}</li>;})}</ol></LearningCard></aside></div>;
}
