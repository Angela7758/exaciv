import {useSuspenseQuery} from '@tanstack/react-query';
import {Link} from '@tanstack/react-router';
import {ArrowLeft,ArrowRight,ChartNoAxesColumn,Clock,FileText,Info,XCircle,CheckCircle2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {SafeImage} from '@/components/site/SafeImage';
import {catalogueOptions,learningOptions} from '@/lib/learning.queries';
import {officialTopic} from '@/config/official-programme';
import {plural} from '@/lib/learner-labels';
import {continuationSettings,resultDuration,shortResultTitle} from '@/lib/result-presentation';
import {hasRecordedAnswers,recordedAnswer,sessionSummary,type LearningSession} from '@/lib/sessions';
import {useUiT} from '@/lib/i18n/internal';
import {AnswerCorrection} from './AnswerCorrection';
import {QuestionAids} from './QuestionAids';
import {StartSessionButton} from './SessionStart';
import civi from '@/assets/civi-lecon.png';

export function ShortSessionResults({session:s}:{session:LearningSession}){
 const ui=useUiT();const {data:c}=useSuspenseQuery(catalogueOptions);const {data:d}=useSuspenseQuery(learningOptions);
 const next=continuationSettings(s,c.coverage[s.parcours]??[]);const evaluated=hasRecordedAnswers(s);const r=sessionSummary(s);
 const themes=[...new Set(s.questions.map(q=>officialTopic(q.exam_theme??q.theme)))];
 return <div className="fidelity-short-result">
  <section className="fidelity-result-header">
   <span className="fidelity-result-document"><FileText/></span>
   <div className="fidelity-result-heading"><div><h1>{ui(shortResultTitle(s.kind))}</h1><span className="status-pill">{themes.join(' · ')} · {s.total} {ui(plural(s.total,'question','questions'))}</span></div>{s.kind==='exam'&&<p>{ui('Ce résultat ne correspond pas à un examen blanc complet.')}</p>}{!evaluated&&<p className="fidelity-not-evaluated"><Info/>{ui('Non évalué')} · {ui("Aucune réponse enregistrée · Votre niveau n'a pas pu être évalué")}</p>}</div>
   <SafeImage className="fidelity-result-mascot" src={civi} alt={ui('CIVI vous encourage')}/>
   {evaluated&&<div className="fidelity-result-stats"><div><span className={r.wrong?'stat-icon wrong':'stat-icon right'}>{r.wrong?<XCircle/>:<CheckCircle2/>}</span><p><b>{r.correct} / {r.total}</b><small>{ui(plural(r.correct,'bonne réponse','bonnes réponses'))}</small></p></div><div><span className="stat-icon"><ChartNoAxesColumn/></span><p><b>{ui(plural(r.wrong,'{0} réponse incorrecte','{0} réponses incorrectes'),r.wrong)}</b><small>{ui(plural(s.total,'sur {0} question','sur {0} questions'),s.total)}</small>{r.unanswered>0&&<small>{r.unanswered} {ui('sans réponse')}</small>}</p></div><div><span className="stat-icon"><Clock/></span><p><small>{ui('Durée')}</small><b>{resultDuration(s)} {ui('min')}</b></p></div></div>}
  </section>
  {evaluated?<section className="fidelity-result-corrections">{s.questions.map((q,i)=><article className="fidelity-result-question" key={`${i}-${q.id}`}><h3 lang="fr" dir="ltr">{s.questions.length>1?`${i+1}. `:''}{q.question}</h3><AnswerCorrection question={q} answer={recordedAnswer(s,i)} lessonTitle={c.lessons.find(l=>l.id===q.lesson_id)?.title}/><QuestionAids result headerTitle={<><FileText/>{ui('Correction de la question')}</>} questionId={q.id} question={q.question} options={q.options} optionIds={q.option_ids} explanation={q.explanation} helpEnabled={d.profile.translation_help!==false} helpLocale={d.profile.help_locale??'fr'}/></article>)}</section>:<section className="fidelity-result-empty"><p>{ui('Résultat d’entraînement ExaCiv, non officiel.')}</p><Button asChild variant="outline"><Link to="/contact">{ui("Signaler un problème d'enregistrement")}</Link></Button></section>}
  <footer className="fidelity-result-footer"><Button asChild variant="outline"><Link to="/app/entrainement"><ArrowLeft/>{ui("Retour à l'historique")}</Link></Button>{next.count>0&&<StartSessionButton orange count={10} {...(next.theme?{theme:next.theme}:{})} questionType={next.questionType} correction={next.correction} chrono={next.chrono}>{ui(plural(next.count,'Continuer avec {0} question','Continuer avec {0} questions'),next.count)}<ArrowRight/></StartSessionButton>}</footer>
 </div>;
}