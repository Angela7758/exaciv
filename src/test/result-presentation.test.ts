import {describe,it,expect} from 'vitest';
import {continuationSettings,resultDuration,shortResultTitle} from '@/lib/result-presentation';
import {learnerSession} from '@/lib/session-visibility';
import {sessionSchema,sessionSummary} from '@/lib/sessions';
const s=sessionSchema.parse({id:'test',kind:'practice',parcours:'naturalisation',lesson_id:null,questions:Array.from({length:5},(_,i)=>({id:String(i),theme:'Institutions',question:'Question',options:['Oui','Non','Autre','Jamais'],answer:0,correct_option_id:'a',explanation:'Le Parlement vote les lois.',source:'Constitution',source_url:'https://www.legifrance.gouv.fr'})),answers:{'0':0,'1':1,'2':0,'3':1},current_index:4,total:5,correct:null,started_at:'2026-10-25T19:00:00Z',deadline:null,completed_at:null,test_rules:{theme:'Institutions',question_type:'all',correction:'immediate',chrono:true}});
describe('Page 2 result data rules',()=>{
 it('distinguishes two correct, two wrong and one unanswered in five questions',()=>expect(sessionSummary(s)).toMatchObject({correct:2,wrong:2,unanswered:1,total:5}));
 it('keeps an empty session non evaluated',()=>expect(sessionSummary({...s,answers:{}})).toMatchObject({answered:0,correct:0,wrong:0,unanswered:5}));
 it('uses at least one minute and rounds up from persisted timestamps',()=>{expect(resultDuration({...s,completed_at:s.started_at})).toBe(1);expect(resultDuration({...s,completed_at:'2026-10-25T19:01:01Z'})).toBe(2);});
 it('continues with min(10,available) preserving theme and settings',()=>expect(continuationSettings(s,[{topic:'Système institutionnel et politique',total:9,knowledge:0,scenario:0,unclassified:9}])).toEqual({theme:'Système institutionnel et politique',questionType:'all',available:9,count:9,correction:'immediate',chrono:true}));
 it('caps continuation to ten and hides it at zero',()=>{expect(continuationSettings({...s,test_rules:null},[{topic:'Système institutionnel et politique',total:16,knowledge:0,scenario:0,unclassified:16}]).count).toBe(10);expect(continuationSettings(s,[]).count).toBe(0);});
 it('preserves original question order',()=>expect(learnerSession(s).questions.map(q=>q.id)).toEqual(['0','1','2','3','4']));
 it('redacts the correct answer, option identity and explanation before validation',()=>{const q=learnerSession(s).questions[4];expect(q?.answer).toBe(-1);expect(q?.correct_option_id).toBeUndefined();expect(q?.explanation).toBe('');expect(s.questions[4]?.answer).toBe(0);});
 it('reveals immediate correction only for recorded answers',()=>expect(learnerSession(s).questions[0]?.answer).toBe(0));
 it('withholds all corrections until completion for exams and end feedback',()=>{expect(learnerSession({...s,kind:'exam'}).questions.every(q=>q.answer===-1)).toBe(true);expect(learnerSession({...s,test_rules:{correction:'fin'}}).questions.every(q=>q.explanation==='')).toBe(true);});
 it('reveals completed corrections including blanks',()=>expect(learnerSession({...s,completed_at:'2026-10-25T19:02:00Z'}).questions[4]?.answer).toBe(0));
 it('uses kind-specific result names',()=>{expect(shortResultTitle('practice')).toBe('Résultat de votre entraînement');expect(shortResultTitle('review')).toBe('Résultat de votre révision');expect(shortResultTitle('exam')).toBe('Résultat de votre test court');});
});
