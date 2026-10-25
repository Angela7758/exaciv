import {OFFICIAL_TOPICS,officialTopic} from '@/config/official-programme';
import {recordedAnswer,sessionSummary,durationMinutes,type LearningSession} from './sessions';

/** Presentation only: frozen session answers remain authoritative. */
export function examResultPresentation(s:LearningSession){
 const summary=sessionSummary(s);
 const expired=Boolean(s.deadline&&s.completed_at&&Date.parse(s.completed_at)>=Date.parse(s.deadline));
 const themes=OFFICIAL_TOPICS.map(({title})=>{
  const indexes=s.questions.flatMap((q,i)=>officialTopic(q.exam_theme??q.theme)===title?[i]:[]);
  const answered=indexes.filter(i=>recordedAnswer(s,i)!==undefined).length;
  return {title,total:indexes.length,answered,correct:summary.themes[title]?.correct??0};
 });
 const evaluated=themes.filter(t=>t.answered>0&&t.total>0);
 const lowest=evaluated.length?Math.min(...evaluated.map(t=>t.correct/t.total)):1;
 return {...summary,expired,evaluated:summary.answered>0,duration:durationMinutes(s.started_at,s.completed_at??s.started_at),themes,weakest:lowest<1?evaluated.filter(t=>t.correct/t.total===lowest).map(t=>t.title):[]};
}