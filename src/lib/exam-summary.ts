import {hasRecordedAnswers,type LearningSession} from './sessions';
export function latestCompleteExam<T extends Pick<LearningSession,'kind'|'total'|'completed_at'|'questions'|'answers'>>(sessions:readonly T[]):T|undefined {
 return sessions.filter(s=>s.kind==='exam'&&s.total===40&&s.completed_at!==null&&hasRecordedAnswers(s)).sort((a,b)=>(b.completed_at??'').localeCompare(a.completed_at??''))[0];
}