import {officialTopic} from '@/config/official-programme';
import {durationMinutes,type LearningSession} from './sessions';
export function shortResultTitle(kind:string){return kind==='exam'?'Résultat de votre test court':kind==='review'?'Résultat de votre révision':'Résultat de votre entraînement';}
export function resultDuration(s:Pick<LearningSession,'started_at'|'completed_at'>){return Math.max(1,durationMinutes(s.started_at,s.completed_at??s.started_at));}
export function continuationSettings(s:LearningSession,coverage:readonly {topic:string;total:number;knowledge:number;scenario:number;unclassified:number}[]){
 const themes=[...new Set(s.questions.map(q=>officialTopic(q.exam_theme??q.theme)))];
 const theme=s.test_rules?.theme?officialTopic(s.test_rules.theme):themes.length===1?themes[0]:undefined;
 const questionType=s.test_rules?.question_type??'all';
 const available=coverage.filter(t=>!theme||t.topic===theme).reduce((n,t)=>n+(questionType==='all'?t.total:t[questionType]),0);
 return {theme,questionType,available,count:Math.min(10,available),correction:s.test_rules?.correction??(s.test_rules?.instant_feedback===false?'fin':'immediate'),chrono:s.test_rules?.chrono??Boolean(s.deadline)} as const;
}