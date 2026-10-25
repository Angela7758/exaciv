import {hasRecordedAnswers,type LearningSession} from './sessions';
export function plural(n:number,singular:string,multiple:string){return n>=0&&n<=1?singular:multiple;}
export function resultNavigation(s:Pick<LearningSession,'kind'|'total'>){return s.kind==='exam'&&s.total===40?'/app/examen-blanc':'/app/entrainement';}
export function sessionKindLabel(s:Pick<LearningSession,'kind'|'total'>){
 if(s.kind==='exam')return s.total===40?'Examen blanc':'Test court';
 if(s.kind==='review')return 'Révision';
 if(s.kind==='diagnostic')return 'Diagnostic';
 return 'Entraînement';
}
export function sessionLabel(s:Pick<LearningSession,'kind'|'total'|'correct'|'questions'|'answers'>,translate:(source:string)=>string=(source)=>source){
 const name=translate(sessionKindLabel(s));
 return `${name} · ${hasRecordedAnswers(s)?`${s.correct??0}/${s.total}`:translate('Non évalué')}`;
}
export function readingProgress(sectionIndex:number,total:number){return total>0?Math.round(Math.min(total,Math.max(1,sectionIndex+1))/total*100):0;}