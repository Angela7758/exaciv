import type {LearningSession} from './sessions';
import {LEGACY_TOPIC_MAP,OFFICIAL_TOPICS} from '@/config/official-programme';
export const PRACTICE_THEMES=OFFICIAL_TOPICS.map(topic=>({...topic,themes:Object.keys(LEGACY_TOPIC_MAP).filter(label=>LEGACY_TOPIC_MAP[label]===topic.title)}));
export const PRACTICE_COUNTS=[5,10,20] as const;
export function practiceSuccessToday(sessions:LearningSession[],parcours:string,now=new Date()){
 const day=now.toLocaleDateString('en-CA',{timeZone:'Europe/Paris'});
 return sessions.filter(s=>s.parcours===parcours&&s.kind==='practice'&&s.completed_at&&new Date(s.completed_at).toLocaleDateString('en-CA',{timeZone:'Europe/Paris'})===day).reduce((n,s)=>n+(s.correct??0),0);
}
export function unfinishedSession(sessions:LearningSession[],parcours:string,kind:'practice'|'exam') {return sessions.find(s=>s.parcours===parcours&&s.kind===kind&&!s.completed_at&&!s.test_id);}
