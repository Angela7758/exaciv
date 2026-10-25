import {Link} from '@tanstack/react-router';
import {Check,X,Minus,Clock,Target,RotateCcw,List,Info,TriangleAlert,ChartNoAxesColumn,Landmark,Users,BookOpen,FileText,Globe,CircleHelp,ChevronRight} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {SafeImage} from '@/components/site/SafeImage';
import {StartSessionButton} from './SessionStart';
import {useUiT} from '@/lib/i18n/internal';
import {plural} from '@/lib/learner-labels';
import {officialTrack} from '@/config/official-programme';
import {examResultPresentation} from '@/lib/exam-result-presentation';
import type {LearningSession} from '@/lib/sessions';
import civi from '@/assets/civi.png';

export function ExamSessionResults({session:s,available}:{session:LearningSession;available:boolean}){
 const ui=useUiT();const r=examResultPresentation(s);const icons=[Landmark,Users,BookOpen,FileText,Globe];
 return <div className="fidelity-exam-result">
  <header className="fidelity-page-heading"><h1>{ui(r.expired?'Examen blanc : temps écoulé':'Examen blanc : terminé')}</h1><p>{ui(officialTrack(s.parcours).label)} · {ui('Simulation indépendante')}</p></header>
  <section className="exam-result-top" aria-label={ui('Score de cette tentative')}>
   <div className="exam-result-score"><h2>{ui('Score de cette tentative')}</h2><strong>{r.correct} / {r.total}</strong>{r.evaluated?<p className={r.achieved?'exam-status-success':'exam-status-warning'}>{ui(r.achieved?'Réussite':'Seuil non atteint')}</p>:<><p>{ui('Aucune réponse enregistrée.')}<br/>{ui("Votre niveau n'a pas pu être évalué.")}</p><div className="exam-result-warning"><TriangleAlert/><div><b>{ui('Aucune réponse enregistrée.')}</b><small>{ui("Vérifiez votre connexion et l'enregistrement des réponses.")}</small></div></div></>}</div>
   <div className="exam-result-counts">
    {[{Icon:Check,tone:'right',value:r.correct,label:plural(r.correct,'bonne réponse','bonnes réponses')},{Icon:X,tone:'wrong',value:r.wrong,label:plural(r.wrong,'réponse incorrecte','réponses incorrectes')},{Icon:Minus,tone:'neutral',value:r.unanswered,label:'sans réponse'},{Icon:Clock,tone:'duration',value:`${r.duration} ${ui('min')}`,label:r.expired?'temps écoulé':'durée'}].map(({Icon,tone,value,label})=><div key={tone}><span className={`exam-count-icon ${tone}`}><Icon/></span><p><b>{value}</b><small>{ui(label)}</small></p></div>)}
    <p className="exam-result-threshold"><Target/>{ui('Seuil de la simulation : 32/40 requis')}</p>
   </div>
   <div className="exam-result-actions"><StartSessionButton kind="exam" orange disabled={!available}><RotateCcw/>{ui('Recommencer une simulation')}</StartSessionButton>{!available&&<p className="exam-restart-reason">{ui('Simulation complète indisponible : la couverture des cinq thèmes et la répartition vérifiée de 28 connaissances et 12 mises en situation sont requises.')}</p>}<Button asChild variant="outline"><Link to="/app/examen-blanc/resultats/$id" params={{id:s.id}} search={{review:true}}><List/>{ui('Voir les questions')}</Link></Button><div className="exam-result-civi"><SafeImage src={civi} alt={ui('CIVI vous encourage')}/><p>{ui("Vous pouvez refaire une simulation pour vous entraîner et vous sentir plus à l'aise. Chaque tentative est une étape vers votre réussite !")}</p></div></div>
  </section>
  <section className="exam-result-themes"><h2><ChartNoAxesColumn/>{ui('Bilan par thème')}</h2><table><thead><tr><th scope="col">{ui('Thème')}</th><th scope="col">{ui('Résultat')}</th></tr></thead><tbody>{r.themes.map((t,i)=>{const Icon=icons[i]??Globe;return <tr key={t.title}><th scope="row"><span className="exam-theme-label"><span className="exam-theme-icon"><Icon/></span>{ui(t.title)}</span></th><td><span className={`exam-theme-outcome ${!t.answered?'neutral':t.correct/t.total>=.8?'right':'warning'}`}><i aria-hidden="true"/>{t.answered?`${t.correct} / ${t.total}`:ui('Non évalué · 0 réponse')}</span></td></tr>;})}</tbody></table><div className="exam-result-info"><Info/><p>{!r.evaluated?ui('Aucune réponse : aucun thème faible ne peut être identifié.'):r.weakest.length?ui('Thèmes à renforcer : {0}',r.weakest.map(t=>ui(t)).join(' · ')):ui('Aucun thème faible parmi les thèmes évalués.')}</p></div></section>
  <section className="exam-result-help"><CircleHelp/><div><h2>{ui('Vous pensez avoir répondu ?')}</h2><p>{ui("Si vous pensez qu'il y a un problème d'enregistrement de vos réponses, signalez-le pour que nous puissions vérifier.")}</p></div><Button asChild variant="link"><Link to="/contact">{ui("Signaler un problème d'enregistrement")}<ChevronRight/></Link></Button></section>
 </div>;
}