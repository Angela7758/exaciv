import {useEffect,useState} from 'react';
import {useSuspenseQuery,useQueryClient} from '@tanstack/react-query';
import {Link,useNavigate} from '@tanstack/react-router';
import {useServerFn} from '@tanstack/react-start';
import {ArrowRight,ChartNoAxesColumn,Clock,CloudCheck,ExternalLink,Landmark} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {officialTopic} from '@/config/official-programme';
import {useUiT} from '@/lib/i18n/internal';
import {sessionOptions} from '@/lib/session.queries';
import {learningOptions} from '@/lib/learning.queries';
import {submitAnswer,advanceSession,finishSession} from '@/lib/session.functions';
import {recordedAnswer,type LearningSession} from '@/lib/sessions';
import {canValidatePractice,nextPracticeView,practiceQuestionState} from '@/lib/practice-navigation';
import {QuestionReport} from '@/components/admin/QuestionReport';
import {QuestionAids} from './QuestionAids';
import {BookmarkButton} from './BookmarkButton';
import {AnswerCorrection} from './AnswerCorrection';

export function PracticeSession({id,demo=false,correction,chrono=false}:{id:string;demo?:boolean;correction?:'fin'|undefined;chrono?:boolean|undefined}){
 if(demo)return <div className="learning-card">—</div>;
 return <ActualPractice id={id} correction={correction} chrono={chrono}/>;
}
function ActualPractice({id,correction,chrono}:{id:string;correction?:'fin'|undefined;chrono?:boolean|undefined}){
 const {data:s}=useSuspenseQuery(sessionOptions(id));const {data:d}=useSuspenseQuery(learningOptions);
 return <PracticeView session={s} profile={d.profile} correction={s.test_rules?.correction==='fin'?'fin':correction} chrono={s.test_rules?.chrono??chrono}/>;
}
function PracticeView({session:s,profile,correction,chrono=false}:{session:LearningSession;profile:{translation_help?:boolean;help_locale?:string};correction?:'fin'|undefined;chrono?:boolean|undefined}){
 const ui=useUiT();const id=s.id;const [viewIndex,setViewIndex]=useState<number|null>(null);const index=viewIndex??s.current_index;const q=s.questions[index];
 const [drafts,setDrafts]=useState<Record<number,number>>({});const [error,setError]=useState('');const [busy,setBusy]=useState(false);const [now,setNow]=useState(0);
 const qc=useQueryClient();const navigate=useNavigate();const submit=useServerFn(submitAnswer);const advance=useServerFn(advanceSession);const finish=useServerFn(finishSession);
 useEffect(()=>{const restored:Record<number,number>={};try{for(let i=0;i<s.total;i++){const value=sessionStorage.getItem(`exaciv-practice-draft-${id}-${i}`);const n=value===null?null:Number(value);if(practiceQuestionState(s,i,n)==='saved'&&n!==null)restored[i]=n;}}catch{}setDrafts(restored);},[id]);
 useEffect(()=>{if(!chrono)return;setNow(Date.now());const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[chrono]);
 if(!q)return <section className="learning-card">{ui('Question indisponible.')}</section>;
 const recorded=recordedAnswer(s,index);const selected=recorded??drafts[index]??null;const showCorrection=recorded!==undefined&&correction!=='fin';
 const elapsed=chrono&&now?Math.max(0,Math.floor((now-new Date(s.started_at).getTime())/1000)):null;
 async function refresh(){await Promise.all([qc.invalidateQueries({queryKey:['session',id]}),qc.invalidateQueries({queryKey:['sessions']})]);}
 async function validate(){if(!canValidatePractice(s,index,selected))return;setBusy(true);setError('');try{await submit({data:{id,index,answer:selected as number}});try{sessionStorage.removeItem(`exaciv-practice-draft-${id}-${index}`);}catch{}setDrafts(v=>{const copy={...v};delete copy[index];return copy;});if(correction==='fin'){if(index===s.total-1){await finish({data:{id}});await qc.invalidateQueries({queryKey:['learning']});await navigate({to:'/app/resultats/$sessionId',params:{sessionId:id}});}else{await advance({data:{id}});setViewIndex(null);}}await refresh();}catch(e){setError(e instanceof Error?ui(e.message):ui('Réponse non enregistrée.'));}finally{setBusy(false);}}
 async function next(){if(index!==s.current_index){setViewIndex(null);return;}if(recorded===undefined)return;setBusy(true);setError('');try{if(index===s.total-1){await finish({data:{id}});await qc.invalidateQueries({queryKey:['learning']});await navigate({to:'/app/resultats/$sessionId',params:{sessionId:id}});}else{await advance({data:{id}});setViewIndex(null);}await refresh();}catch(e){setError(e instanceof Error?ui(e.message):ui('Enregistrement impossible.'));}finally{setBusy(false);}}
 const theme=officialTopic(q.exam_theme??q.theme);
 const bookmark=<BookmarkButton kind="question" itemId={q.id}/>;
 return <div className="fidelity-practice">
  <div className="fidelity-exit"><Button asChild variant="link"><Link to="/app/entrainement"><ExternalLink/>{ui('Enregistrer et quitter')}</Link></Button></div>
  <header className="fidelity-page-heading"><h1>{ui("Session d'entraînement")}</h1><p>{ui('Question {0} sur {1}',index+1,s.total)}</p></header>
  <div className="fidelity-practice-grid"><section className="fidelity-question-card">
   <div className="fidelity-question-top"><span className="fidelity-theme-icon"><Landmark/></span><span className="status-pill" lang="fr">{theme}</span>{q.classification_reviewed_at&&(q.question_type==='knowledge'||q.question_type==='scenario')&&<span className="status-pill">{ui(q.question_type==='knowledge'?'Connaissances':'Mises en situation')}</span>}</div>
   <h2 lang="fr" dir="ltr">{q.question}</h2><p className="fidelity-instruction">{ui('Choisissez une seule réponse.')}</p>
   <fieldset className="fidelity-options" disabled={busy||recorded!==undefined||Boolean(s.completed_at)}><legend className="sr-only">{ui('Votre réponse')}</legend>{q.options.map((option,i)=><label key={q.option_ids?.[i]??i} className={selected===i?'selected':''}><input type="radio" name="practice-answer" checked={selected===i} onChange={()=>{setDrafts(v=>({...v,[index]:i}));try{sessionStorage.setItem(`exaciv-practice-draft-${id}-${index}`,String(i));}catch{}}/><span lang="fr" dir="ltr">{option}</span></label>)}</fieldset>
   {s.test_rules?.allow_aids!==false?<QuestionAids fidelity questionId={q.id} question={q.question} options={q.options} optionIds={q.option_ids} explanation={showCorrection?q.explanation:undefined} helpEnabled={profile.translation_help!==false} helpLocale={profile.help_locale??'fr'} extraControls={bookmark}/>:<div className="fidelity-no-aids">{bookmark}</div>}
   {showCorrection&&<AnswerCorrection question={q} answer={recorded}/>}
   {index!==s.current_index&&<p className="fidelity-frontier-note">{ui('Votre progression est conservée. Reprenez la question actuelle pour valider.')}</p>}
   {error&&<p role="alert" className="text-critical">{error}</p>}
   <footer className="fidelity-question-footer"><Button variant="outline" disabled={busy||index===s.total-1} onClick={()=>setViewIndex(nextPracticeView(index,s.total))}><ArrowRight/>{ui('Passer')}</Button><span className="fidelity-save-status"><CloudCheck/>{ui(recorded!==undefined?'Choix sauvegardé':selected!==null?'Choix conservé sur cet appareil':'Aucun choix enregistré')}</span><QuestionReport questionId={q.id}/>{s.completed_at?<Button asChild variant="interactive"><Link to="/app/resultats/$sessionId" params={{sessionId:id}}>{ui('Voir mes résultats')}<ArrowRight/></Link></Button>:recorded!==undefined||index!==s.current_index?<Button variant="interactive" disabled={busy} onClick={next}>{ui(index!==s.current_index?'Reprendre la session':index===s.total-1?'Voir mes résultats':'Question suivante')}<ArrowRight/></Button>:<Button variant="interactive" disabled={busy||!canValidatePractice(s,index,selected)} onClick={validate}>{ui(busy?'Enregistrement…':'Valider ma réponse')}<ArrowRight/></Button>}</footer>
  </section><aside className="fidelity-session-card"><h2><ChartNoAxesColumn/>{ui('Votre session')}</h2><p>{ui('Question {0} sur {1}',index+1,s.total)}</p>{elapsed!==null&&<span className="practice-chrono"><Clock/>{String(Math.floor(elapsed/60)).padStart(2,'0')}:{String(elapsed%60).padStart(2,'0')}</span>}<div className="fidelity-session-dots">{s.questions.map((question,i)=>{const state=practiceQuestionState(s,i,drafts[i]??null);return <Button key={question.id} variant="ghost" disabled={busy} aria-label={ui('Question {0}',i+1)} aria-current={i===index?'step':undefined} className={`${state} ${i===index?'current':''}`} onClick={()=>setViewIndex(i)}>{i+1}</Button>;})}</div><div className="fidelity-session-legend">{[['current','Question actuelle'],['todo','À faire'],['saved','Réponse enregistrée'],['validated','Validée']].map(([state,label])=><span key={state}><i className={state}/>{ui(label??'')}</span>)}</div></aside></div>
 </div>;
}
