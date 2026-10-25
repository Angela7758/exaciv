import {ExamSessionResults} from './ExamSessionResults';
import {officialTopic,OFFICIAL_TOPICS} from '@/config/official-programme';
import {plural,sessionKindLabel} from '@/lib/learner-labels';
import {completeExamAvailable} from '@/lib/catalogue-coverage';
import {SafeImage} from '@/components/site/SafeImage';
import {useContentT} from '@/lib/i18n/content';
import {useUiT} from '@/lib/i18n/internal';
import {useSuspenseQuery} from '@tanstack/react-query';
import {Link} from '@tanstack/react-router';
import {ChartNoAxesColumn,CheckCircle2,Clock,Info,BookOpen,ArrowRight,RotateCcw,Lightbulb,FileText,XCircle,Landmark,Users,Globe} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {sessionOptions,sessionsOptions} from '@/lib/session.queries';
import {catalogueOptions,learningOptions} from '@/lib/learning.queries';
import {hasRecordedAnswers,recordedAnswer,sessionSummary,durationMinutes} from '@/lib/sessions';
import {LearningCard,ProgressBar} from './primitives';
import {SourceLink} from './SourceLink';
import {QuestionAids} from './QuestionAids';
import {StartSessionButton} from './SessionStart';
import civi from '@/assets/civi.png';
import {ShortSessionResults} from './ShortSessionResults';
function ResultReviewLink({id,wrong}:{id:string;wrong:number}){const ui=useUiT();const ct=useContentT();return wrong>0?<Link to="/app/erreurs" search={{session:id}}><BookOpen/>{ui("Réviser mes erreurs")}<ArrowRight/></Link>:<Link to="/app/resultats/$sessionId" params={{sessionId:id}} search={{review:true}}><BookOpen/>{ui("Voir mes réponses")}<ArrowRight/></Link>;}
export function SessionResults({id}:{id:string}){const ui=useUiT();const {data:s}=useSuspenseQuery(sessionOptions(id));const {data:catalogue}=useSuspenseQuery(catalogueOptions);if(!s.completed_at)return <LearningCard><h1>{ui("Cette session est encore en cours")}</h1><Button asChild><Link to="/app/entrainement/$sessionId/feedback" params={{sessionId:id}}>{ui("Reprendre")} <ArrowRight/></Link></Button></LearningCard>;if(!(s.kind==='exam'&&s.total===40))return <ShortSessionResults session={s}/>;return <ExamSessionResults session={s} available={completeExamAvailable(catalogue.coverage[s.parcours]??[])}/>;}
export function AnswerReview({id,errorsOnly=false}:{id:string;errorsOnly?:boolean}){const ui=useUiT();const {data:d}=useSuspenseQuery(learningOptions);const {data:s}=useSuspenseQuery(sessionOptions(id));const {data:catalogue}=useSuspenseQuery(catalogueOptions);const examAvailable=completeExamAvailable(catalogue.coverage[s.parcours]??[]);if(!s.completed_at)return <LearningCard>{ui("Cette session est encore en cours")}</LearningCard>;return <div className="answer-review"><h2>{errorsOnly?ui("Mes erreurs"):ui("Mes réponses")}</h2>{s.questions.map((q,i)=>{const selected=recordedAnswer(s,i);const correct=selected===q.answer;if(errorsOnly&&(correct||!hasRecordedAnswers(s)))return null;return <LearningCard key={q.id}><span className="status-pill">{ui(officialTopic(q.exam_theme??q.theme))}</span><h3 lang="fr" dir="ltr">{correct?<CheckCircle2 className="text-success"/>:selected===undefined?<Info className="text-muted-foreground"/>:<XCircle className="text-critical"/>}{i+1}. {q.question}</h3><p>{ui("Votre réponse :")} <b lang="fr" dir="ltr">{selected===undefined?ui("Sans réponse"):q.options[selected]??''}</b></p>{!correct&&<p>{ui("Bonne réponse :")} <b lang="fr" dir="ltr">{q.options[q.answer]}</b></p>}<p lang="fr" dir="ltr">{q.explanation}</p><QuestionAids questionId={q.id} question={q.question} options={q.options} optionIds={q.option_ids} explanation={s.completed_at?q.explanation:undefined} helpEnabled={d.profile.translation_help!==false} helpLocale={d.profile.help_locale??'fr'}/><SourceLink url={q.source_url} label={q.source?`${ui('Source :')} ${q.source}`:undefined}/>{q.lesson_id&&<Button asChild variant="outline"><Link to="/app/lecons/$slug" params={{slug:q.lesson_id}}>{ui("Revoir la leçon")}</Link></Button>}</LearningCard>;})}</div>;}
export function SessionErrors({id}:{id?:string|undefined}){const ui=useUiT();const ct=useContentT();const {data:all}=useSuspenseQuery(sessionsOptions);const {data:d}=useSuspenseQuery(learningOptions);const sessions=all.filter(s=>s.parcours===d.profile.parcours);const selected=id?sessions.find(s=>s.id===id):sessions.find(s=>s.completed_at&&sessionSummary(s).wrong>0);return selected?<AnswerReview id={selected.id} errorsOnly/>:<LearningCard><h1 className="app-page-title">{ui("Mes erreurs")}</h1><p>{ui("Aucune erreur enregistrée pour cette sélection.")}</p><Button asChild className="mt-5"><Link to="/app/entrainement">{ui("M’entraîner")}</Link></Button></LearningCard>;}
