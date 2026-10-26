import {OFFICIAL_TOPICS,officialTopic} from '@/config/official-programme';
import {completeExamAvailable,pathwayCoverage} from '@/lib/catalogue-coverage';
import {hasRecordedAnswers} from '@/lib/sessions';
import {can,PATHWAYS} from './schema';

export function assertOverviewAccess(roles:string[]){
  if(!roles.some(r=>['admin','editor','reviewer','operations'].includes(r)))throw new Error('Accès réservé à l’administration.');
}
type Question={theme:string;exam_theme:string|null;pathways:string[];question_type:string;classification_reviewed_at:string|null};
type Lesson={topic:string};
export function catalogueOverview(questions:Question[],lessons:Lesson[]){
  const themes=OFFICIAL_TOPICS.map(t=>{
    const rows=questions.filter(q=>officialTopic(q.exam_theme??q.theme)===t.title);
    const publishedLessons=lessons.filter(l=>officialTopic(l.topic)===t.title).length;
    const unclassified=rows.filter(q=>q.question_type==='unclassified').length;
    return {topic:t.title,lessons:publishedLessons,questions:rows.length,unclassified,status:publishedLessons===0||rows.length<8?'À compléter':unclassified>0?'Audit requis':'Complet'};
  });
  return {themes,unclassified:themes.reduce((n,t)=>n+t.unclassified,0),firstIncomplete:themes.find(t=>t.status==='À compléter')?.topic??null,simulations:PATHWAYS.map(pathway=>({pathway,available:completeExamAvailable(pathwayCoverage(questions,pathway))}))};
}
export const overviewPeriod=(days:number)=>{if(![7,30,90].includes(days))throw new Error('Période invalide.');return days;};
export function activeLearners(sessions:{user_id:string}[],completions:{user_id:string}[]){return new Set([...sessions,...completions].map(r=>r.user_id)).size;}
export function completedSimulations(sessions:(Parameters<typeof hasRecordedAnswers>[0]&{total:number})[]){const count=sessions.filter(s=>s.total===40&&hasRecordedAnswers(s)).length;return count||null;}
export function confirmedRevenue(paymentsEnabled:boolean){return paymentsEnabled?'—':'Non connecté';}
export function overviewActionAllowed(roles:string[],permission:string){return can(roles,permission);}