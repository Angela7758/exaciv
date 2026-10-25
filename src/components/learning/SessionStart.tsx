import {SafeImage} from '@/components/site/SafeImage';
import {recordActivity} from '@/lib/activity';
import {useI18n} from '@/lib/i18n';
import {useContentT} from '@/lib/i18n/content';
import {useUiT} from '@/lib/i18n/internal';
import {useState,type ReactNode} from 'react';
import {useNavigate,Link} from '@tanstack/react-router';
import {useSuspenseQuery} from '@tanstack/react-query';
import {BookOpen,Clock,ArrowRight,Play,CheckCircle2,Target,FileText,Armchair,CloudUpload,Info,ExternalLink,ListChecks,FileX} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {startPractice,startSession} from '@/lib/session.functions';
import {catalogueOptions,learningOptions} from '@/lib/learning.queries';
import {sessionsOptions} from '@/lib/session.queries';
import {LearningCard} from './primitives';
import {useServerFn} from '@tanstack/react-start';
import {useQueryClient} from '@tanstack/react-query';
import {ProgressBar} from './primitives';
import {collectMistakes} from '@/lib/review';
import {PRACTICE_THEMES,PRACTICE_COUNTS,unfinishedSession} from '@/lib/practice-entry';
import {type QuestionType} from '@/lib/practice-rules';
import {PARCOURS} from '@/config/content';
import {TOPIC_ARTWORK} from '@/config/topic-artwork';
import {MistakeLibrary} from './MistakeLibrary';
import paper from '@/assets/exam-paper-v2.png.asset.json';

export function StartSessionButton({kind='practice',lesson,children,orange=false,count,correction,chrono,questionType='all',theme,disabled=false}:{kind?:'lesson'|'practice'|'exam';lesson?:string|undefined;children?:ReactNode;orange?:boolean;count?:5|10|20;questionType?:'all'|QuestionType;theme?:string;disabled?:boolean;correction?:'immediate'|'fin';chrono?:boolean}){
 const ui=useUiT();const {locale}=useI18n();const [busy,setBusy]=useState(false);const [error,setError]=useState('');const navigate=useNavigate();const start=useServerFn(startSession);const practice=useServerFn(startPractice);const qc=useQueryClient();
 async function open(){
  setBusy(true);setError('');
  try{
   const id=kind==='practice'?await practice({data:{count:count??10,questionType,...(theme?{theme}:lesson?.startsWith('theme:')?{theme:lesson.slice(6)}:{}),correction:correction??'immediate',chrono:chrono??false}}):await start({data:{kind,...(lesson?{lesson}:{}),...(count?{count}:{})}});
   void recordActivity('session',id,locale);
   await qc.invalidateQueries({queryKey:['sessions']});
   if(kind==='exam')await navigate({to:'/app/examen-blanc/session',search:{session:id}});
   else if(kind==='practice')await navigate({to:'/app/entrainement/session/$id',params:{id},search:{...(correction==='fin'?{correction:'fin' as const}:{}),...(chrono?{chrono:true}:{})}});
   else await navigate({to:'/app/entrainement/$sessionId/feedback',params:{sessionId:id}});
  }catch(e){const available=e instanceof Error?e.message.match(/^Questions disponibles : (\d+)/)?.[1]:undefined;setError(e instanceof Error?available?ui('Questions disponibles : %. Choisissez un autre thème, un autre type ou 5 questions si disponibles.').replace('%',available):ui(e.message):ui("Impossible de démarrer."));setBusy(false);}
 }
 const label=busy?ui("Préparation…"):(children??(<span>{ui("Commencer")} <ArrowRight/></span>));
 return <>
  <Button variant={orange?'cta':'interactive'} size="lg" disabled={busy||disabled} onClick={()=>{void open();}}>{label}</Button>
  {error&&<p className="text-critical mt-3" role="alert">{error}</p>}
 </>;
}

function ExamEntry({demo}:{demo:boolean}){const ui=useUiT();const {locale}=useI18n();const {data:c}=useSuspenseQuery(catalogueOptions);const {data:all}=useSuspenseQuery(sessionsOptions);const {data:d}=useSuspenseQuery(learningOptions);const sessions=all.filter(s=>s.parcours===d.profile.parcours);const current=unfinishedSession(all,d.profile.parcours,'exam');const pathway=PARCOURS.find(p=>p.id===d.profile.parcours)?.title??ui("Naturalisation");const history=sessions.filter(s=>s.kind==='exam'&&s.completed_at);const coverage=c.coverage[d.profile.parcours]??[];const complete=coverage.length===5&&coverage.every(t=>t.total>=8);const knowledge=coverage.reduce((n,t)=>n+t.knowledge,0);const scenario=coverage.reduce((n,t)=>n+t.scenario,0);const verifiedSplit=knowledge>=28&&scenario>=12;
 return <>
  <header className="page-heading"><h1>{ui("Examen blanc")}</h1><p>{ui("Mesurez vos acquis dans une simulation en français.")}</p></header>
  <div className="exam-rules">
   {[{icon:FileText,value:'40',label:ui("questions")},{icon:Clock,value:'45',label:ui("minutes maximum")},{icon:Target,value:'32 / 40',label:ui("seuil de réussite")},{icon:CheckCircle2,value:ui("Après l’envoi"),label:ui("correction détaillée")}].map(f=><section className="exam-rule" key={f.label}><span><f.icon/></span><div><b>{f.value}</b><small>{f.label}</small></div></section>)}
  </div>
  <p className="exam-rules-note">{ui("Examen en français, sans aides.")} {ui("Le chronomètre continue après avoir quitté la page.")} <ListChecks/>{verifiedSplit?ui("28 questions de connaissance · 12 mises en situation · entraînement sans valeur officielle."):ui("5 thèmes officiels · entraînement sans valeur officielle.")}</p>
  <div className="exam-cols">
   <LearningCard className="exam-guidance"><h2>{ui("Avant de commencer")}</h2><p>{ui("Pour un entraînement optimal, voici quelques recommandations.")}</p><ul>{[{icon:Armchair,title:ui("Choisissez un moment calme"),copy:ui("Installez-vous dans un endroit tranquille, sans distraction."),tone:'orange'},{icon:Clock,title:ui("Le chronomètre démarre au début du test"),copy:ui("Vous disposez de 45 minutes pour répondre aux 40 questions."),tone:'blue'},{icon:CloudUpload,title:ui("Vos réponses sont enregistrées pendant la session"),copy:ui("Les réponses validées sont conservées pour reprendre votre session."),tone:'green'},{icon:FileText,title:ui("Les corrections seront disponibles après l’envoi"),copy:ui("Vous pourrez consulter vos réponses, les bonnes réponses et les explications."),tone:'blue'}].map((g,n)=><li key={g.title}><i className="exam-step-n" aria-hidden="true">{n+1}</i><span className={g.tone}><g.icon/></span><div><h3>{g.title}</h3><p>{g.copy}</p></div></li>)}</ul><a className="exam-rules" href="https://formation-civique.interieur.gouv.fr/examen-civique/" target="_blank" rel="noreferrer"><FileText/>{ui("Voir les règles officielles")}<ExternalLink/></a></LearningCard>
   <LearningCard className="exam-session"><SafeImage src={paper.url} alt=""/><h2>{ui("Votre session")}</h2><p>{ui("Examen blanc ·")} {demo?ui("Naturalisation"):ui(pathway)}</p>{!complete&&<p className="source-pending">{ui("Simulation complète indisponible : un thème ne possède pas encore 8 questions publiées pour votre parcours.")}</p>}{current?<Button asChild variant="cta" size="lg"><Link to="/app/examen-blanc/session" search={{session:current.id}}><Play/>{ui("Reprendre l’examen")}<ArrowRight/></Link></Button>:complete?<StartSessionButton kind="exam" orange><Play/>{ui("Commencer l’examen blanc")}<ArrowRight/></StartSessionButton>:null}<Button asChild variant="outline"><Link to="/app/entrainement">{ui("Voir les exercices disponibles")}<ArrowRight/></Link></Button><small>{current?ui("Votre session en cours est conservée."):ui("Aucune session en cours.")}</small></LearningCard>
  </div>
  <section className="exam-history"><h2>{ui("Mes résultats")}</h2>{history.length?<ul>{history.map(s=><li key={s.id}><span>{ui("Examen blanc")} · {s.correct}/{s.total}</span><time>{new Date(s.completed_at??s.started_at).toLocaleDateString(locale)}</time><Button asChild variant="outline"><Link to="/app/resultats/$sessionId" params={{sessionId:s.id}}>{ui("Voir le détail")}<ArrowRight/></Link></Button></li>)}</ul>:<p className="empty-activity">{ui("Pas encore d’examen terminé. Votre premier résultat apparaîtra ici.")}</p>}</section>
  <p className="exam-disclaimer"><Info/>{ui("Simulation indépendante. Aucune attestation officielle délivrée.")}</p>
 </>;
}

function PracticeEntry({demo}:{demo:boolean}){const ui=useUiT();const ct=useContentT();const {data:c}=useSuspenseQuery(catalogueOptions);const {data:all}=useSuspenseQuery(sessionsOptions);const {data:d}=useSuspenseQuery(learningOptions);const sessions=all.filter(s=>s.parcours===d.profile.parcours);const current=unfinishedSession(all,d.profile.parcours,'practice');const mistakes=collectMistakes(sessions).filter(m=>!m.mastered).length;const done=current?Object.keys(current.answers).length:0;
 const [tab,setTab]=useState<'new'|'mistakes'>('new');
 const [count,setCount]=useState<5|10|20>(10);const [questionType,setQuestionType]=useState<'all'|QuestionType>('all');
 const [correction,setCorrection]=useState<'immediate'|'fin'>('immediate');
 const [chrono,setChrono]=useState(false);
 const demoCounts=[8,9,8,8,0];
 return <>
  <header className="page-heading"><h1>{ui("S’entraîner")}</h1><p>{ui("Choisissez une session courte ou révisez vos erreurs.")}</p></header>
  {current&&<section className="train-resume"><span><BookOpen/></span><div><h2>{ui("Session en cours")} · {ct(current.questions[0]?.theme??ui("Entraînement"))}</h2><p>{done} / {current.total} {ui("questions répondues")}</p><ProgressBar value={done/current.total*100}/></div><Button asChild variant="cta"><Link to="/app/entrainement/session/$id" params={{id:current.id}} search={{...(current.test_rules?.correction==='fin'?{correction:'fin' as const}:{}),...(current.test_rules?.chrono?{chrono:true}:{})}}><Play/>{ui("Reprendre la session")}<ArrowRight/></Link></Button></section>}
  <div className="train-tabs" role="tablist">
   <button type="button" role="tab" aria-selected={tab==='new'} onClick={()=>setTab('new')}>{ui("Nouvelle session")}</button>
   <button type="button" role="tab" aria-selected={tab==='mistakes'} onClick={()=>setTab('mistakes')}>{ui("Mes erreurs")} · {demo?6:mistakes}</button>
  </div>
  {tab==='mistakes'?<div className="train-embedded"><MistakeLibrary demo={demo} embedded/></div>:<>
   <section className="train-settings"><h2>{ui("Réglages de la session")}</h2><div className="train-settings-grid">
    <div><p>{ui("Nombre de questions")}</p><div className="seg" role="group" aria-label={ui("Nombre de questions")}>{PRACTICE_COUNTS.map(n=><button key={n} type="button" aria-pressed={count===n} onClick={()=>setCount(n)}>{n}</button>)}</div></div>
<div><p>{ui("Type de questions")}</p><div className="seg seg-types" role="group" aria-label={ui("Type de questions")}>{([['all',ui("Tous les types")],['knowledge',ui("Connaissances")],['scenario',ui("Mises en situation")],['unclassified',ui("Non classées")]] as const).map(([id,label])=><button key={id} type="button" aria-pressed={questionType===id} onClick={()=>setQuestionType(id)}>{label}</button>)}</div></div>
    <div><p>{ui("Correction")}</p><button type="button" className="switch" role="switch" aria-checked={correction==='immediate'} onClick={()=>setCorrection(correction==='immediate'?'fin':'immediate')}><span/>{correction==='immediate'?ui("Correction immédiate"):ui("Correction à la fin")}</button></div>
    <div><p>{ui("Chronomètre")}</p><button type="button" className="switch" role="switch" aria-checked={chrono} onClick={()=>setChrono(!chrono)}><span/>{chrono?ui("Activé"):ui("Désactivé")}</button></div>
   </div><p className="train-aids-note"><Info/>{ui("Les aides de lecture et de traduction restent disponibles en entraînement.")}</p></section>
   <div className="train-grid">{PRACTICE_THEMES.map((t,i)=>{const artwork=TOPIC_ARTWORK[t.art];const total=demo?demoCounts[i]??0:(c.coverage[d.profile.parcours]??[]).find(v=>v.topic===t.title)?.[questionType==='all'?'total':questionType]??0;return <section className="train-theme" key={ct(t.title)}><SafeImage src={artwork.src} fallbackSrc={artwork.src} alt={ct(t.title)} width={1376} height={768} loading="lazy"/><div><h3>{ct(t.title)}</h3><p className="train-desc">{ct(TOPICS.find(v=>v.title===t.title)?.description??'')}</p><span className="train-count"><FileText/>{total} {ui("questions")}</span>{total>0&&total<count&&<p className="source-pending">{ui("{0} questions disponibles ; choisissez 5 si possible ou un autre filtre.",total)}</p>}{total?<StartSessionButton theme={t.title} questionType={questionType} count={count} correction={correction} chrono={chrono} disabled={total<count}>{ui("S’entraîner")}<ArrowRight/></StartSessionButton>:<p className="source-pending">{ui("Aucune question publiée pour ce parcours et ce type.")}</p>}</div></section>;})}</div>
   <section className="train-mistakes"><span><FileX/></span><div><h2>{demo?6:mistakes} {ui("questions à revoir")}</h2><p>{ui("Reprenez vos réponses incorrectes pour bien les comprendre.")}</p></div><Button asChild variant="outline"><Link to="/app/mes-erreurs" search={demo?{demo:true}:{}}>{ui("Ouvrir mes erreurs")}<ArrowRight/></Link></Button></section>
  </>}
 </>;
}

export function SessionStart({exam=false,demo=false}:{exam?:boolean;demo?:boolean}){return <div className={`session-entry ${exam?'exam-entry':'practice-entry'}`}>{exam?<ExamEntry demo={demo}/>:<PracticeEntry demo={demo}/>}</div>;}
