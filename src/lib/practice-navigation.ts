import {recordedAnswer,type LearningSession} from './sessions';
export function practiceQuestionState(s:LearningSession,index:number,draft:number|null):'validated'|'saved'|'todo'{
 if(recordedAnswer(s,index)!==undefined)return 'validated';
 const q=s.questions[index];return q&&draft!==null&&Number.isInteger(draft)&&draft>=0&&draft<q.options.length?'saved':'todo';
}
export function canValidatePractice(s:LearningSession,index:number,answer:number|null){return !s.completed_at&&index===s.current_index&&recordedAnswer(s,index)===undefined&&answer!==null&&Number.isInteger(answer)&&answer>=0&&answer<(s.questions[index]?.options.length??0);}
export function nextPracticeView(index:number,total:number){return Math.min(index+1,Math.max(0,total-1));}