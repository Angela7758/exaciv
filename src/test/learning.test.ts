import {describe,it,expect} from 'vitest';
import {percentage,earnedXp,canValidate,progressState,streakDays} from '@/config/learning';
describe('learning rules',()=>{
 it('rounds 3 of 7 lessons to 43 percent',()=>expect(percentage(3,7)).toBe(43));
 it('shows 2 of 5 stages as 40 percent',()=>expect(percentage(2,5)).toBe(40));
 it('awards 40 XP once for a completed task',()=>expect(earnedXp([{lesson_id:'one',xp:40},{lesson_id:'one',xp:40}])).toBe(40));
 it('blocks submission without an answer',()=>expect(canValidate(null,false)).toBe(false));
 it('unlocks only the next stage',()=>expect([0,1,2,3,4].map(i=>progressState(i,2))).toEqual(['done','done','current','locked','locked']));
 it('new users have zero progression',()=>expect(percentage(0,7)).toBe(0));
 it('new users have no streak',()=>expect(streakDays([],new Date('2026-10-22T12:00:00Z'))).toBe(0));
});
