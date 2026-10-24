import type {LearningSession} from './sessions';
export const PRACTICE_THEMES=[
 {title:'Principes et valeurs de la République française',themes:['Valeurs de la République','Principes et valeurs'],tone:'blue',art:'valeurs'},
 {title:'Système institutionnel et politique',themes:['Institutions','Institutions françaises'],tone:'orange',art:'institutions'},
 {title:'Droits et devoirs',themes:['Droits et devoirs'],tone:'green',art:'droits'},
 {title:'Histoire, géographie et culture',themes:['Histoire','Histoire et symboles'],tone:'blue',art:'histoire'},
 {title:'Vivre dans la société française',themes:['Vie en société','Société française'],tone:'green',art:'societe'},
] as const;
export const PRACTICE_COUNTS=[5,10,20] as const;
export function practiceSuccessToday(sessions:LearningSession[],parcours:string,now=new Date()){
 const day=now.toLocaleDateString('en-CA',{timeZone:'Europe/Paris'});
 return sessions.filter(s=>s.parcours===parcours&&s.kind==='practice'&&s.completed_at&&new Date(s.completed_at).toLocaleDateString('en-CA',{timeZone:'Europe/Paris'})===day).reduce((n,s)=>n+(s.correct??0),0);
}
export function unfinishedSession(sessions:LearningSession[],parcours:string,kind:'practice'|'exam') {return sessions.find(s=>s.parcours===parcours&&s.kind===kind&&!s.completed_at&&!s.test_id);}
