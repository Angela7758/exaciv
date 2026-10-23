import {describe,it,expect} from 'vitest';
import {agendaSchema,dateKey,weekDates,dailyActivity} from '@/lib/agenda';
describe('learning agenda rules',()=>{
 it('groups activity in the user timezone across midnight',()=>{expect(dateKey(new Date('2026-10-23T23:30:00Z'),'Europe/Paris')).toBe('2026-10-24');expect(dateKey(new Date('2026-10-23T23:30:00Z'),'America/New_York')).toBe('2026-10-23');});
 it('moves exactly one Monday-based week',()=>{expect(weekDates('2026-10-23')).toEqual(['2026-10-19','2026-10-20','2026-10-21','2026-10-22','2026-10-23','2026-10-24','2026-10-25']);});
 it('never creates activity for an empty account',()=>{expect(dailyActivity({completions:[],sessions:[],attempts:[]},'2026-10-23','Europe/Paris')).toEqual({lessons:0,questions:0,exams:0,minutes:0,activities:0});});
 it('counts only recorded questions and finished exams',()=>{expect(dailyActivity({completions:[],sessions:[{id:'a',kind:'exam',started_at:'2026-10-23T10:00:00Z',completed_at:'2026-10-23T10:10:00Z',answers:{0:2,1:1}}],attempts:[]},'2026-10-23','Europe/Paris')).toEqual({lessons:0,questions:2,exams:1,minutes:10,activities:1});});
 it('rejects impossible task dates',()=>{expect(agendaSchema.safeParse({title:'Réviser',kind:'revision',lesson_id:null,test_id:null,scheduled_date:'2026-02-31',scheduled_time:null,timezone:'Europe/Paris',duration_minutes:15,completed:false}).success).toBe(false);});
});