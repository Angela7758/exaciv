import {describe,expect,it} from 'vitest';
import {LESSON_VIDEOS,LESSON_VIDEO_INVENTORY} from '@/config/lesson-videos';
describe('Verified teaching videos only',()=>{
 it('does not expose any unverified editorial animation as a lesson video',()=>{
  expect(LESSON_VIDEO_INVENTORY.map(v=>v.lessonId)).toEqual(['devise','laicite','parlement','president','vote','symboles','egalite']);
  expect(Object.keys(LESSON_VIDEOS)).toEqual([]);
  expect(LESSON_VIDEO_INVENTORY.every(v=>!v.contentVerified&&!v.rightsVerified)).toBe(true);
 });
});